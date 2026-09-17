import type { ReactNode } from "react";

export default function EmptyState({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="border-border rounded-md border border-dashed py-16 text-center">
      <p className="text-lg font-medium">{title}</p>
      <p className="text-muted mx-auto mt-2 max-w-md">{description}</p>
      {children ? <div className="mt-6 flex justify-center">{children}</div> : null}
    </div>
  );
}
