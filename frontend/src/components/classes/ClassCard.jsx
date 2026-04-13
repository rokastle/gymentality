export default function ClassCard({ title, category, image }) {
  return (
    <article className="class-card">
      <div className="class-card__media">
        <img
          src={image}
          alt={title || "Class image"}
          className="class-card__image"
          loading="lazy"
        />
      </div>

      <div className="class-card__body">
        <h3 className="class-card__title">{title}</h3>
        <p className="class-card__category">{category}</p>
      </div>
    </article>
  );
}