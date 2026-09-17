import Section from "@/components/ui/Section";
import Skeleton from "@/components/ui/Skeleton";

export default function WorkLoading() {
  return (
    <Section className="pt-32 md:pt-40">
      <Skeleton className="mb-4 h-4 w-24" />
      <Skeleton className="mb-8 h-12 w-96 max-w-full" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-64" />
        ))}
      </div>
    </Section>
  );
}
