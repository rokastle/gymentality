import { Link } from "react-router-dom";
import IconImage from "../common/IconImage";

export default function MembershipSidebar({
  hasPaymentMethod,
  paymentExpiryLabel,
  paymentMethodLabel,
}) {
  return (
    <div className="my-membership-page__sidebar">
      <section className="my-membership-page__payment-card gm-surface-card">
        <h2 className="my-membership-page__block-title">PAYMENT METHOD</h2>

        <p className="my-membership-page__block-subtitle">
          Current subscription payment method:
        </p>

        <div className="my-membership-page__stored-payment">
          <div className="my-membership-page__stored-payment-icon">
            <IconImage
              name="creditCard"
              alt="Credit card"
              decorative={false}
              className="my-membership-page__stored-payment-icon-image"
            />
          </div>

          <div className="my-membership-page__stored-payment-info">
            <strong>{paymentMethodLabel}</strong>
            <span>
              {hasPaymentMethod ? paymentExpiryLabel : "Add a card in your profile"}
            </span>
          </div>
        </div>

        <Link
          to="/account/profile"
          className="gm-btn gm-btn--pill gm-btn--solid-yellow my-membership-page__sidebar-btn"
        >
          MANAGE PAYMENT METHOD
        </Link>
      </section>

      <section className="my-membership-page__help-card gm-surface-card">
        <h2 className="my-membership-page__block-title">NEED HELP?</h2>
        <p className="my-membership-page__help-text">
          Our team is here to help with any billing or membership questions.
        </p>

        <a
          href="mailto:support@gymentality.com"
          className="gm-btn gm-btn--pill gm-btn--outline-yellow my-membership-page__sidebar-btn"
        >
          CONTACT SUPPORT
        </a>
      </section>
    </div>
  );
}
