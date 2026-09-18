import type { Testimonial } from "@data/testimonials";

export default function TestimonialPullQuote({
  testimonial,
}: {
  testimonial: Testimonial;
}) {
  return (
    <figure className="border-accent border-l-4 pl-6">
      <blockquote className="text-display-2 max-w-2xl text-2xl leading-snug">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <figcaption className="text-muted mt-4 text-sm">
        {testimonial.name}, {testimonial.role} at {testimonial.company}
      </figcaption>
    </figure>
  );
}
