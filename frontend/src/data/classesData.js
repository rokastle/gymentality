import {
  clubs,
  timeSlots,
  weekDays,
} from "./clubsData";

export const classesData = clubs.flatMap((club) =>
  club.classPreview.map((gymClass) => ({
    id: gymClass.id,
    classKey: gymClass.classKey,
    title: gymClass.title,
    category: gymClass.category,
    image: gymClass.image,
    description: gymClass.description,
    clubId: club.id,
    clubName: club.name,
    clubShortName: club.shortName,
    city: club.city,
    address: club.address,
  }))
);

export const classSessionsData = clubs.flatMap((club) =>
  club.classSessions.map((session) => ({
    ...session,
  }))
);

export const classCategories = [
  "Strength",
  "Functional",
  "Cardio",
  "Express",
  "Body and Mind",
  "Dance",
  "Aqua",
];

export const availableCities = [...new Set(classesData.map((item) => item.city))];

export const availableClubs = clubs.map((club) => ({
  id: club.id,
  name: club.name,
  shortName: club.shortName,
  city: club.city,
  address: club.address,
}));

export const scheduleDays = weekDays;
export const scheduleTimeSlots = timeSlots;

export function getClassSessionsByClubId(clubId) {
  return classSessionsData.filter(
    (session) => String(session.clubId) === String(clubId)
  );
}

export function buildWeeklyScheduleForClub(clubId) {
  const clubSessions = getClassSessionsByClubId(clubId);

  return scheduleDays.map((day) => ({
    day,
    slots: scheduleTimeSlots.map((time) => {
      const session = clubSessions.find(
        (item) => item.day === day && item.time === time
      );

      return {
        time,
        session: session ?? null,
      };
    }),
  }));
}