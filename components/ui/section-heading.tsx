type SectionHeadingProps = Readonly<{
  eyebrow?: string;
  title: string;
  description?: string;
  level?: "h2" | "h3";
  className?: string;
}>;

export function SectionHeading({
  eyebrow,
  title,
  description,
  level = "h2",
  className = "",
}: SectionHeadingProps) {
  const headingClassName = level === "h2" ? "text-heading-2" : "text-heading-3";
  const heading =
    level === "h2" ? (
      <h2 className={`${headingClassName} text-foreground`}>{title}</h2>
    ) : (
      <h3 className={`${headingClassName} text-foreground`}>{title}</h3>
    );

  return (
    <div className={`max-w-3xl ${className}`}>
      {eyebrow ? <p className="text-label mb-4 text-primary">{eyebrow}</p> : null}
      {heading}
      {description ? (
        <p className="text-body-lg mt-5 max-w-2xl text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}
