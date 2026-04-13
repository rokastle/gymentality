function FacilityCard({ facility }) {
  return (
    <article className="gm-card h-full">
      <h2 className="text-2xl font-bold uppercase">{facility.name}</h2>
      <p className="mt-4 leading-7 text-[var(--text-secondary)]">
        {facility.description}
      </p>
    </article>
  );
}

export default FacilityCard;