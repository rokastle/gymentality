import useAuth from "../hooks/useAuth";

export default function MyMembershipPage() {
  const { user } = useAuth();

  return (
    <section className="gm-placeholder-page">
      MY MEMBERSHIP: {user?.membershipPlanName || "NO MEMBERSHIP"}
    </section>
  );
}