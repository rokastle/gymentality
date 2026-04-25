function formatPrice(price) {
  if (price === null || price === undefined) {
    return "";
  }

  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return `${price} €`;
  }

  return `${numericPrice.toFixed(2)} €`;
}

function MembershipCard({ membership }) {
  return (
    <article className="gm-card h-full">
      <div className="mb-4 flex items-start justify-between gap-4">
        <h2 className="text-2xl font-bold uppercase">{membership.name}</h2>

        <span className="rounded-full border border-[#E6A900]/30 bg-[#E6A900]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#E6A900]">
          Membership
        </span>
      </div>

      <p className="text-4xl font-bold text-[#E6A900]">
        {formatPrice(membership.price)}
      </p>

      <p className="mt-2 text-sm uppercase tracking-[0.14em] text-[var(--text-secondary)]">
        {membership.durationInDays} días
      </p>

      <p className="mt-5 leading-7 text-[var(--text-secondary)]">
        {membership.description}
      </p>
    </article>
  );
}

export default MembershipCard;