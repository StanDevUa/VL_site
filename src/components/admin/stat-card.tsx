import Link from "next/link";

export function StatCard({
  label,
  value,
  caption,
  href,
  compact = false,
}: {
  label: string;
  value: React.ReactNode;
  caption?: string;
  href?: string;
  compact?: boolean;
}) {
  const labelClass = "text-sm transition-colors " + (href ? "text-navy-soft group-hover:text-magenta" : "text-navy-soft");

  const header = compact ? (
    <div className="flex items-center justify-between gap-3">
      <p className={labelClass}>{label}</p>
      <p className="font-heading font-extrabold text-2xl text-navy">{value}</p>
    </div>
  ) : (
    <>
      <p className={labelClass + " mb-1"}>{label}</p>
      <p className="font-heading font-extrabold text-3xl text-navy">{value}</p>
    </>
  );

  const content = (
    <div
      className={
        "bg-white rounded-card border p-5 h-full transition-colors " +
        (href ? "border-navy/10 group-hover:border-magenta/40" : "border-navy/10")
      }
    >
      {header}
      {caption && <p className="text-xs text-navy-soft mt-1">{caption}</p>}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="group block rounded-card transition-shadow hover:shadow-card-hover">
        {content}
      </Link>
    );
  }

  return content;
}

export function PeriodFilterBar({
  hrefFor,
  options,
  active,
}: {
  hrefFor: (value: string) => string;
  options: { value: string; label: string }[];
  active: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Link
          key={option.value}
          href={hrefFor(option.value)}
          className={
            "rounded-field px-3 py-1.5 text-xs font-bold transition-colors " +
            (active === option.value
              ? "bg-indigo text-white"
              : "bg-white border border-navy/15 text-navy-soft hover:text-navy")
          }
        >
          {option.label}
        </Link>
      ))}
    </div>
  );
}
