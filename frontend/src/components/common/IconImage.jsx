import icons from "../../assets/icons/iconMap";

export default function IconImage({
  name,
  alt = "",
  className = "",
  decorative = true,
  size,
}) {
  const src = icons[name];

  if (!src) {
    console.warn(`IconImage: el icono "${name}" no existe en src/assets/icons/index.js`);
    return null;
  }

  const inlineStyle =
    size !== undefined
      ? { width: `${size}px`, height: `${size}px` }
      : undefined;

  return (
    <img
      src={src}
      alt={decorative ? "" : alt}
      aria-hidden={decorative ? "true" : undefined}
      className={className}
      style={inlineStyle}
    />
  );
}