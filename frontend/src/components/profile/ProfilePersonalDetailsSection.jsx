import { FormField } from "../forms";

export default function ProfilePersonalDetailsSection({
  form,
  onChange,
  onBlur,
  getFieldProps,
}) {
  return (
    <section className="my-profile-page__section">
      <h2 className="my-profile-page__section-title">PERSONAL DETAIL</h2>

      <div className="my-profile-page__section-divider" />

      <div className="my-profile-page__grid my-profile-page__grid--one">
        <FormField
          label="First name*"
          name="firstName"
          value={form.firstName}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete="given-name"
          {...getFieldProps("firstName")}
        />

        <FormField
          label="Last name*"
          name="lastName"
          value={form.lastName}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete="family-name"
          {...getFieldProps("lastName")}
        />
      </div>

      <div className="my-profile-page__grid my-profile-page__grid--two">
        <FormField
          label="Date of birth*"
          type="date"
          name="dateOfBirth"
          value={form.dateOfBirth}
          onChange={onChange}
          onBlur={onBlur}
          {...getFieldProps("dateOfBirth")}
        />

        <FormField
          label="Phone number*"
          type="tel"
          name="phone"
          value={form.phone}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="+34 600-123-456"
          autoComplete="tel"
          inputMode="tel"
          {...getFieldProps("phone")}
        />
      </div>
    </section>
  );
}