import { countryOptions } from "../../utils/accountValidation";
import FormField from "./FormField";
import FormSelect from "./FormSelect";

export default function AddressFields({
  title = "Address",
  baseClassName,
  form,
  onChange,
  onBlur,
  getFieldProps,
  regionOptions,
  cityOptions,
  inputRefs,
  required = false,
  showDivider = false,
}) {
  const setInputRef = (fieldName) => (element) => {
    if (inputRefs) {
      inputRefs[fieldName] = element;
    }
  };

  return (
    <section className={`${baseClassName}__section`}>
      <h2 className={`${baseClassName}__section-title`}>{title}</h2>

      {showDivider && <div className={`${baseClassName}__section-divider`} />}

      <div className={`${baseClassName}__grid ${baseClassName}__grid--one`}>
        <FormField
          ref={setInputRef("address")}
          label="Address*"
          name="address"
          value={form.address}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          autoComplete="street-address"
          {...getFieldProps("address")}
        />
      </div>

      <div className={`${baseClassName}__grid ${baseClassName}__grid--two`}>
        <FormField
          ref={setInputRef("postalCode")}
          label="Postal code*"
          type="text"
          name="postalCode"
          value={form.postalCode}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          inputMode="numeric"
          maxLength={5}
          pattern="\d{5}"
          placeholder="29001"
          {...getFieldProps("postalCode")}
        />

        <FormSelect
          ref={setInputRef("city")}
          label="City*"
          name="city"
          value={form.city}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          placeholder="Select a city"
          options={cityOptions}
          getOptionKey={(item) => `${item.city}-${item.region}`}
          getOptionValue={(item) => item.city}
          getOptionLabel={(item) => `${item.city} (${item.region})`}
          {...getFieldProps("city")}
        />
      </div>

      <div className={`${baseClassName}__grid ${baseClassName}__grid--two`}>
        <FormSelect
          ref={setInputRef("country")}
          label="Country*"
          name="country"
          value={form.country}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          placeholder="Select a country"
          options={countryOptions}
          {...getFieldProps("country")}
        />

        <FormSelect
          ref={setInputRef("region")}
          label="State / Province / Region*"
          name="region"
          value={form.region}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          placeholder="Select a region"
          options={regionOptions}
          {...getFieldProps("region")}
        />
      </div>
    </section>
  );
}