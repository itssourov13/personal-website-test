import Marquee from "@/components/motion/Marquee";
import Section from "@/components/ui/Section";

// Text wordmarks, not logo images — no real client logo assets exist yet
// (see decision-log.md). Swap for actual logo SVGs once clients approve
// usage; keep the "(name changed)" honesty from the case-study content in
// sync if any of these change.
const clients = [
  "Northwind",
  "Atlas Analytics",
  "Fernway",
  "Halcyon Labs",
  "Ridgeline",
];

export default function TrustedBy() {
  return (
    <Section className="py-10 md:py-14">
      <p className="text-overline text-faint mb-6 text-center">
        Trusted by teams at
      </p>
      <Marquee>
        {clients.map((client) => (
          <span
            key={client}
            className="text-faint font-display shrink-0 text-2xl font-medium"
          >
            {client}
          </span>
        ))}
      </Marquee>
    </Section>
  );
}
