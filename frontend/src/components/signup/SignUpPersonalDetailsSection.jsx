import { FormField, FormRadioGroup, PasswordField } from "../forms";

export default function SignUpPersonalDetailsSection({
  form,
  onChange,
  onBlur,
  errors,
  touched,
  submitAttempted,
  fieldRefs,
  getFieldProps,
  showPassword,
  showConfirmPassword,
  onTogglePassword,
  onToggleConfirmPassword,
}) {
  const setFieldRef = (fieldName) => (element) => {
    if (fieldRefs?.current) {
      fieldRefs.current[fieldName] = element;
    }
  };

  return (
    <section className="signup-details-page__section">
      <h2 className="signup-details-page__section-title">Personal details</h2>

      <div className="signup-details-page__grid signup-details-page__grid--two">
        <FormField
          ref={setFieldRef("firstName")}
          label="First name*"
          name="firstName"
          value={form.firstName}
          onChange={onChange}
          onBlur={onBlur}
          required
          autoComplete="given-name"
          {...getFieldProps("firstName")}
        />

        <FormField
          ref={setFieldRef("lastName")}
          label="Last name*"
          name="lastName"
          value={form.lastName}
          onChange={onChange}
          onBlur={onBlur}
          required
          autoComplete="family-name"
          {...getFieldProps("lastName")}
        />
      </div>

      <div className="signup-details-page__grid signup-details-page__grid--two signup-details-page__gender-row">
        <FormRadioGroup
          ref={setFieldRef("gender")}
          label="Gender*"
          name="gender"
          value={form.gender}
          onChange={onChange}
          onBlur={onBlur}
          options={[
            { value: "female", label: "Female" },
            { value: "male", label: "Male" },
          ]}
          error={errors.gender}
          touched={touched.gender}
          submitAttempted={submitAttempted}
          className="signup-details-page__field"
        />

        <FormField
          ref={setFieldRef("dateOfBirth")}
          label="Date of birth*"
          type="date"
          name="dateOfBirth"
          value={form.dateOfBirth}
          onChange={onChange}
          onBlur={onBlur}
          required
          {...getFieldProps("dateOfBirth")}
        />
      </div>

      <div className="signup-details-page__grid signup-details-page__grid--two">
        <FormField
          ref={setFieldRef("email")}
          label="Email*"
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          onBlur={onBlur}
          required
          autoComplete="email"
          placeholder="usuario@mail.com"
          {...getFieldProps("email")}
        />

        <FormField
          ref={setFieldRef("phone")}
          label="Phone number*"
          type="tel"
          name="phone"
          value={form.phone}
          onChange={onChange}
          onBlur={onBlur}
          required
          autoComplete="tel"
          inputMode="tel"
          placeholder="+34 600-123-456"
          {...getFieldProps("phone")}
        />
      </div>

      <div className="signup-details-page__grid signup-details-page__grid--two">
        <PasswordField
          ref={setFieldRef("password")}
          label="Password*"
          name="password"
          value={form.password}
          onChange={onChange}
          onBlur={onBlur}
          required
          autoComplete="new-password"
          showPassword={showPassword}
          onTogglePassword={onTogglePassword}
          showLabelText="Mostrar contraseña"
          hideLabelText="Ocultar contraseña"
          {...getFieldProps("password")}
        />

        <PasswordField
          ref={setFieldRef("confirmPassword")}
          label="Confirm Password*"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={onChange}
          onBlur={onBlur}
          required
          autoComplete="new-password"
          showPassword={showConfirmPassword}
          onTogglePassword={onToggleConfirmPassword}
          showLabelText="Mostrar confirmación de contraseña"
          hideLabelText="Ocultar confirmación de contraseña"
          {...getFieldProps("confirmPassword")}
        />
      </div>
    </section>
  );
}