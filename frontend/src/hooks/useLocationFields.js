import { useCallback, useEffect, useMemo } from "react";
import {
  cityOptionsByRegion,
  regionOptionsByCountry,
} from "../utils/accountValidation";

export default function useLocationFields({ country, region, city, setForm }) {
  const cityCatalog = useMemo(() => {
    return Object.entries(cityOptionsByRegion).flatMap(
      ([regionName, cities]) =>
        cities.map((cityName) => ({
          city: cityName,
          region: regionName,
          country: "España",
        }))
    );
  }, []);

  const regionOptions = useMemo(() => {
    return regionOptionsByCountry[country] ?? [];
  }, [country]);

  const cityOptions = useMemo(() => {
    return cityCatalog.filter((item) => {
      const matchesCountry = !country || item.country === country;
      const matchesRegion = !region || item.region === region;

      return matchesCountry && matchesRegion;
    });
  }, [country, region, cityCatalog]);

  useEffect(() => {
    if (region && !regionOptions.includes(region)) {
      setForm((current) => ({
        ...current,
        region: "",
        city: "",
      }));
    }
  }, [region, regionOptions, setForm]);

  useEffect(() => {
    if (city && !cityOptions.some((item) => item.city === city)) {
      setForm((current) => ({
        ...current,
        city: "",
      }));
    }
  }, [city, cityOptions, setForm]);

  const applyLocationChange = useCallback(({ name, value, nextForm }) => {
    if (name === "country") {
      nextForm.region = "";
      nextForm.city = "";
    }

    if (name === "region") {
      nextForm.city = "";
    }

    if (name === "city") {
      const selectedCity = cityCatalog.find((item) => item.city === value);

      if (selectedCity) {
        nextForm.city = selectedCity.city;
        nextForm.region = selectedCity.region;
        nextForm.country = selectedCity.country;
      }
    }

    return nextForm;
  }, [cityCatalog]);

  return {
    regionOptions,
    cityOptions,
    applyLocationChange,
  };
}
