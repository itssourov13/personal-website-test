import Section from "@/components/ui/Section";
import Skeleton from "@/components/ui/Skeleton";

export default function WritingLoading() {
  return (
    <Section className="pt-32 md:pt-40">
      <Skeleton className="mb-4 h-4 w-24" />
      <Skeleton className="mb-8 h-12 w-96 max-w-full" />
      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-16" />
        ))}
      </div>
    </Section>
  );
}
