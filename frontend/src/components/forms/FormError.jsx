function buildClassName(parts) {
  return parts.filter(Boolean).join(" ");
}

export default function FormError({
  id,
  message,
  show = false,
  className = "",
}) {
  return (
    <small
      id={id}
      className={buildClassName(["gm-form-error", className])}
      role={show ? "alert" : undefined}
      aria-live="polite"
    >
      {show ? message : "\u00A0"}
    </small>
  );
}