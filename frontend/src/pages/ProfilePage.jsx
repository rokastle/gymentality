import useAuth from "../hooks/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <section className="gm-placeholder-page">
      PROFILE: {user?.firstName} {user?.lastName}
    </section>
  );
}