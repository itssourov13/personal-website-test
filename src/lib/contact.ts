import "server-only";

import { createHash } from "node:crypto";

import { Resend } from "resend";

import { siteConfig } from "@/lib/site.config";

// Use Upstash Redis when configured so limits are shared across serverless
// instances. Local memory is a best-effort development/fail-open fallback only.
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const WINDOW_SECONDS = Math.ceil(WINDOW_MS / 1000);
const MAX_ATTEMPTS = 5;
let nextCleanupAt = 0;

function checkInMemoryRateLimit(key: string): boolean {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || record.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    if (attempts.size > 1000 || now >= nextCleanupAt) {
      for (const [attemptKey, attempt] of attempts) {
        if (attempt.resetAt <= now) attempts.delete(attemptKey);
      }
      nextCleanupAt = now + 60_000;
    }
    return true;
  }

  if (record.count >= MAX_ATTEMPTS) return false;
  record.count += 1;
  return true;
}

export async function checkRateLimit(key: string): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.replace(/\/+$/, "");
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return checkInMemoryRateLimit(key);

  // Hash the client identifier so raw IP addresses are not stored in Redis keys.
  const hashedKey = createHash("sha256").update(key).digest("hex");
  try {
    // Upstash's pipeline executes both commands in order in one round trip.
    // Refreshing expiry on attempts makes the lock expire after a quiet window.
    const response = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", `contact:rate-limit:${hashedKey}`],
        ["EXPIRE", `contact:rate-limit:${hashedKey}`, WINDOW_SECONDS],
      ]),
      cache: "no-store",
    });
    if (!response.ok)
      throw new Error(`Upstash returned HTTP ${response.status}`);

    const results: unknown = await response.json();
    if (!Array.isArray(results) || typeof results[0]?.result !== "number") {
      throw new Error("Upstash returned an unexpected rate-limit response");
    }
    return results[0].result <= MAX_ATTEMPTS;
  } catch (error) {
    // Keep the contact path available during a Redis outage but make the
    // degraded, non-distributed protection visible in server logs.
    console.warn(
      "[contact] Upstash rate limit unavailable; using in-memory fallback",
      error,
    );
    return checkInMemoryRateLimit(key);
  }
}

export async function sendContactEmail(input: {
  name: string;
  email: string;
  budget?: string;
  message: string;
}): Promise<{ delivered: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || siteConfig.email;

  if (!apiKey) {
    // No credentials configured yet (local dev / not wired up in P0–P4).
    // Log instead of throwing so the form UX can still be exercised.
    console.warn("[contact] RESEND_API_KEY not set — email not sent");
    return { delivered: false };
  }

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: `${siteConfig.name} site <notifications@${siteConfig.domain}>`,
    to,
    reply_to: input.email,
    subject: `New project inquiry from ${input.name}`,
    text: [
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      input.budget ? `Budget: ${input.budget}` : null,
      "",
      input.message,
    ]
      .filter(Boolean)
      .join("\n"),
  });
  if (error) throw new Error("Resend rejected the contact email");

  return { delivered: true };
}
