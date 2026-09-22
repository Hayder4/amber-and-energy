import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const baseInput =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-amber-400/60 focus:outline-none disabled:opacity-50";

export function TextField({
  label,
  className,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted">{label}</span>
      <input {...props} className={`${baseInput} ${className ?? ""}`} />
    </label>
  );
}

export function TextAreaField({
  label,
  className,
  ...props
}: { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted">{label}</span>
      <textarea {...props} className={`${baseInput} ${className ?? ""}`} />
    </label>
  );
}

export function SelectField({
  label,
  className,
  children,
  ...props
}: { label: string } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted">{label}</span>
      <select {...props} className={`${baseInput} ${className ?? ""}`}>
        {children}
      </select>
    </label>
  );
}

export function CheckboxField({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-border px-4 py-2.5 text-sm text-foreground">
      <input type="checkbox" {...props} className="h-4 w-4 accent-amber-400" />
      {label}
    </label>
  );
}
