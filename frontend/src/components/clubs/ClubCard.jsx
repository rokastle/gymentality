function ClubCard({ club }) {
  return (
    <article className="gm-card h-full">
      <div className="mb-4 flex items-start justify-between gap-4">
        <h2 className="text-2xl font-bold uppercase">{club.name}</h2>
        <span className="rounded-full border border-[#E6A900]/30 bg-[#E6A900]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#E6A900]">
          Club
        </span>
      </div>

      <div className="space-y-2 text-sm text-[var(--text-secondary)]">
        <p><span className="text-white">Dirección:</span> {club.address}</p>
        <p><span className="text-white">Ciudad:</span> {club.city}</p>
        <p><span className="text-white">Teléfono:</span> {club.phone}</p>
        <p><span className="text-white">Email:</span> {club.email}</p>
      </div>

      <p className="mt-5 leading-7 text-[var(--text-secondary)]">
        {club.description}
      </p>
    </article>
  );
}

export default ClubCard;