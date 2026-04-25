import { useCallback, useEffect, useMemo, useState } from "react";
import * as clubService from "../services/clubService";
import { clubs as staticClubs } from "../data/clubsData";

function buildShortName(clubName = "") {
  return clubName
    .replace(/^Gymentality\s*/i, "")
    .trim();
}

function enrichClubFromApi(apiClub) {
  const staticClub = staticClubs.find(
    (club) => String(club.id) === String(apiClub.id)
  );

  return {
    ...staticClub,
    ...apiClub,
    shortName: staticClub?.shortName ?? buildShortName(apiClub.name),
    image: staticClub?.image,
    coordinates: staticClub?.coordinates,
    weekSchedule: staticClub?.weekSchedule,
    holidaySchedule: staticClub?.holidaySchedule,
  };
}

export function useClubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClubs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await clubService.getAllClubs();
      setClubs(data.map(enrichClubFromApi));
    } catch (err) {
      setError(err.message || "Error fetching clubs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  return { clubs, loading, error, refetch: fetchClubs };
}

export function useClubById(clubId) {
  const { clubs, loading, error, refetch } = useClubs();

  const club = useMemo(() => {
    return clubs.find((item) => String(item.id) === String(clubId)) ?? null;
  }, [clubs, clubId]);

  return { club, clubs, loading, error, refetch };
}