import { cloneElement } from "react";
import type { AriaAttributes, ReactElement } from "react";

type FieldControlProps = Readonly<{
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: AriaAttributes["aria-invalid"];
}>;

type FieldProps = Readonly<{
  children: ReactElement<FieldControlProps>;
  htmlFor: string;
  label: string;
  description?: string;
  error?: string;
  className?: string;
}>;

export function Field({
  children,
  htmlFor,
  label,
  description,
  error,
  className = "",
}: FieldProps) {
  const descriptionId = description ? `${htmlFor}-description` : undefined;
  const errorId = error ? `${htmlFor}-error` : undefined;
  const describedBy = [
    children.props["aria-describedby"],
    descriptionId,
    errorId,
  ]
    .filter(Boolean)
    .join(" ");
  const control = cloneElement(children, {
    id: children.props.id ?? htmlFor,
    "aria-describedby": describedBy || undefined,
    "aria-invalid": error ? true : children.props["aria-invalid"],
  });

  return (
    <div className={`grid gap-2 ${className}`}>
      <label className="text-sm font-semibold text-foreground" htmlFor={htmlFor}>
        {label}
      </label>
      {control}
      {description ? (
        <p className="text-small text-muted-foreground" id={descriptionId}>
          {description}
        </p>
      ) : null}
      {error ? (
        <p className="text-small font-medium text-destructive" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
