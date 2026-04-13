import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="section-wrap flex min-h-[70vh] items-center justify-center py-16">
      <div className="surface-card max-w-xl p-10 text-center">
        <p className="section-label">404</p>
        <h1 className="mt-4 text-4xl font-bold uppercase text-white">Page not found</h1>
        <p className="mt-4 text-gym-muted">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="cta-button mt-8">
          Back home
        </Link>
      </div>
    </section>
  );
}