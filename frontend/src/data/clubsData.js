import classImages from "../assets/images/classImages";
import {
  clubImages,
  facilityAreaImages,
} from "../assets/images/facilitiesImages";

export const facilityCatalog = {
  cardio: {
    id: "cardio",
    name: "CARDIO AREA",
    iconName: "cardioArea",
    focusIconName: "cardioAreaFocus",
    image: facilityAreaImages.cardio,
    description:
      "Our cardio area is equipped with a wide range of machines designed to improve endurance, burn calories, and boost heart health.",
  },
  freeWeights: {
    id: "freeWeights",
    name: "FREE WEIGHTS",
    iconName: "freeWeightArea",
    focusIconName: "freeWeightAreaFocus",
    image: facilityAreaImages.freeWeights,
    description:
      "A complete free weights zone with dumbbells, benches, barbells and plates for progressive strength work.",
  },
  strengthEquipment: {
    id: "strengthEquipment",
    name: "STRENGTH MACHINES",
    iconName: "strengthEquipmentArea",
    focusIconName: "strengthEquipmentAreaFocus",
    image: facilityAreaImages.strengthEquipment,
    description:
      "Guided strength machines designed for safe and effective training and full-body routines.",
  },
  functional: {
    id: "functional",
    name: "FUNCTIONAL AREA",
    iconName: "functionalArea",
    focusIconName: "functionalAreaFocus",
    image: facilityAreaImages.functional,
    description:
      "A dynamic space for mobility, HIIT circuits, core work and functional sessions using versatile equipment.",
  },
  cycling: {
    id: "cycling",
    name: "CYCLING AREA",
    iconName: "cyclingArea",
    focusIconName: "cyclingAreaFocus",
    image: facilityAreaImages.cycling,
    description:
      "Indoor cycling space prepared for rhythm-based cardio sessions, interval work and high-energy classes.",
  },
  guidedClasses: {
    id: "guidedClasses",
    name: "GUIDED CLASSES",
    iconName: "guidedClassesArea",
    focusIconName: "guidedClassesAreaFocus",
    image: facilityAreaImages.guidedClasses,
    description:
      "Dedicated studios for group sessions including strength, express workouts, body and mind disciplines and dance.",
  },
  showers: {
    id: "showers",
    name: "SHOWERS & CHANGING ROOMS",
    iconName: "shower",
    focusIconName: "showerFocus",
    image: facilityAreaImages.showers,
    description:
      "Comfortable changing rooms and showers so you can train and continue your day with convenience.",
  },
  lockers: {
    id: "lockers",
    name: "LOCKERS",
    iconName: "locker",
    focusIconName: "lockerFocus",
    image: facilityAreaImages.lockers,
    description:
      "Daily-use lockers available for members to store personal belongings safely while training.",
  },
  parking: {
    id: "parking",
    name: "PARKING",
    iconName: "parking",
    focusIconName: "parkingFocus",
    image: facilityAreaImages.parking,
    description:
      "Parking availability near the club for easier access before and after your workout sessions.",
  },
  swimmingPool: {
    id: "swimmingPool",
    name: "SWIMMING POOL",
    iconName: "swimmingPoolArea",
    focusIconName: "swimmingPoolAreaFocus",
    image: facilityAreaImages.swimmingPool,
    description:
      "Aquatic area for swimming, aquafitness and pool-based training sessions focused on endurance and toning.",
  },
};

export const classCatalog = {
  totalBody: {
    key: "totalBody",
    title: "Total Body",
    category: "Strength",
    image: classImages.totalBody,
    description: "Strength class focused on full-body training.",
  },
  fitball: {
    key: "fitball",
    title: "Fitball",
    category: "Strength",
    image: classImages.fitball,
    description: "Strength class using fitball for stability and control.",
  },
  gap: {
    key: "gap",
    title: "GAP",
    category: "Strength",
    image: classImages.gap,
    description: "Strength class focused on glutes, abs and legs.",
  },
  dumbbells: {
    key: "dumbbells",
    title: "Dumbbells",
    category: "Strength",
    image: classImages.dumbbells,
    description: "Strength session based on dumbbell routines.",
  },
  crossfit: {
    key: "crossfit",
    title: "Crossfit",
    category: "Functional",
    image: classImages.crossfit,
    description: "Functional high-intensity class with varied movements.",
  },
  stepFunctional: {
    key: "stepFunctional",
    title: "Step Functional",
    category: "Functional",
    image: classImages.stepFunctional,
    description: "Functional session combining step and conditioning.",
  },
  hybrid: {
    key: "hybrid",
    title: "Hybrid",
    category: "Functional",
    image: classImages.hybrid,
    description: "Functional hybrid training mixing strength and cardio.",
  },
  boxing: {
    key: "boxing",
    title: "Boxing",
    category: "Cardio",
    image: classImages.boxing,
    description: "Cardio-based boxing class with technique and conditioning.",
  },
  jumping: {
    key: "jumping",
    title: "Jumping",
    category: "Cardio",
    image: classImages.jumping,
    description: "Cardio class based on dynamic trampoline work and coordination.",
  },
  spinning: {
    key: "spinning",
    title: "Spinning",
    category: "Cardio",
    image: classImages.spinning,
    description: "Indoor cycling session with music and intervals.",
  },
  elliptical: {
    key: "elliptical",
    title: "Elliptical",
    category: "Cardio",
    image: classImages.elliptical,
    description: "Cardio endurance session using elliptical patterns.",
  },
  coreExpress: {
    key: "coreExpress",
    title: "Core Express",
    category: "Express",
    image: classImages.coreExpress,
    description: "Express core-focused class to strengthen the midsection.",
  },
  hiitExpress: {
    key: "hiitExpress",
    title: "HIIT Express",
    category: "Express",
    image: classImages.hiitExpress,
    description: "Express high-intensity workout for busy members.",
  },
  motrizExpress: {
    key: "motrizExpress",
    title: "Motriz Express",
    category: "Express",
    image: classImages.motrizExpress,
    description: "Short intense express session focused on mobility and control.",
  },
  yoga: {
    key: "yoga",
    title: "Yoga",
    category: "Body and Mind",
    image: classImages.yoga,
    description: "Body and mind class focused on flexibility, breathing and balance.",
  },
  pilates: {
    key: "pilates",
    title: "Pilates",
    category: "Body and Mind",
    image: classImages.pilates,
    description: "Body and mind class to improve posture and core strength.",
  },
  zen: {
    key: "zen",
    title: "Zen",
    category: "Body and Mind",
    image: classImages.zen,
    description: "Relaxation and body awareness class for recovery and mental wellbeing.",
  },
  zumba: {
    key: "zumba",
    title: "Zumba",
    category: "Dance",
    image: classImages.zumba,
    description: "Dance class with high energy and simple choreographies.",
  },
  aerobics: {
    key: "aerobics",
    title: "Aerobics",
    category: "Dance",
    image: classImages.aerobics,
    description: "Dance-cardio session with classic guided routines.",
  },
  dance: {
    key: "dance",
    title: "Dance",
    category: "Dance",
    image: classImages.dance,
    description: "Dance class for coordination, rhythm and conditioning.",
  },
  swimming: {
    key: "swimming",
    title: "Swimming",
    category: "Aqua",
    image: classImages.swimming,
    description: "Aqua class focused on swimming technique and endurance.",
  },
  aquafitness: {
    key: "aquafitness",
    title: "Aquafitness",
    category: "Aqua",
    image: classImages.aquafitness,
    description: "Aqua fitness class for cardio and toning in water.",
  },
  poolFunctional: {
    key: "poolFunctional",
    title: "Pool Functional",
    category: "Aqua",
    image: classImages.poolFunctional,
    description: "Functional training adapted to the aquatic environment.",
  },
  aquaboard: {
    key: "aquaboard",
    title: "Aquaboard",
    category: "Aqua",
    image: classImages.aquaboard,
    description: "Balance and core session on floating boards.",
  },
};

export const weeklyScheduleTemplate = [
  { day: "Lunes", time: "09:00", classKey: "poolFunctional" },
  { day: "Lunes", time: "10:00", classKey: "crossfit" },
  { day: "Lunes", time: "11:00", classKey: "gap" },
  { day: "Lunes", time: "12:00", classKey: "jumping" },
  { day: "Lunes", time: "17:00", classKey: "swimming" },
  { day: "Lunes", time: "18:00", classKey: "totalBody" },
  { day: "Lunes", time: "19:00", classKey: "boxing" },
  { day: "Lunes", time: "20:00", classKey: "hybrid" },
  { day: "Lunes", time: "21:00", classKey: "zumba" },

  { day: "Martes", time: "09:00", classKey: "aquaboard" },
  { day: "Martes", time: "10:00", classKey: "pilates" },
  { day: "Martes", time: "11:00", classKey: "dumbbells" },
  { day: "Martes", time: "12:00", classKey: "elliptical" },
  { day: "Martes", time: "17:00", classKey: "aquafitness" },
  { day: "Martes", time: "18:00", classKey: "fitball" },
  { day: "Martes", time: "19:00", classKey: "spinning" },
  { day: "Martes", time: "20:00", classKey: "yoga" },
  { day: "Martes", time: "21:00", classKey: "zen" },

  { day: "Miércoles", time: "09:00", classKey: "swimming" },
  { day: "Miércoles", time: "10:00", classKey: "totalBody" },
  { day: "Miércoles", time: "11:00", classKey: "coreExpress" },
  { day: "Miércoles", time: "12:00", classKey: "dance" },
  { day: "Miércoles", time: "17:00", classKey: "poolFunctional" },
  { day: "Miércoles", time: "18:00", classKey: "motrizExpress" },
  { day: "Miércoles", time: "19:00", classKey: "jumping" },
  { day: "Miércoles", time: "20:00", classKey: "hiitExpress" },
  { day: "Miércoles", time: "21:00", classKey: "aerobics" },

  { day: "Jueves", time: "09:00", classKey: "boxing" },
  { day: "Jueves", time: "10:00", classKey: "spinning" },
  { day: "Jueves", time: "11:00", classKey: "hybrid" },
  { day: "Jueves", time: "12:00", classKey: "zumba" },
  { day: "Jueves", time: "17:00", classKey: "aquaboard" },
  { day: "Jueves", time: "18:00", classKey: "dumbbells" },
  { day: "Jueves", time: "19:00", classKey: "elliptical" },
  { day: "Jueves", time: "20:00", classKey: "gap" },
  { day: "Jueves", time: "21:00", classKey: "stepFunctional" },

  { day: "Viernes", time: "09:00", classKey: "aquafitness" },
  { day: "Viernes", time: "10:00", classKey: "hiitExpress" },
  { day: "Viernes", time: "11:00", classKey: "fitball" },
  { day: "Viernes", time: "12:00", classKey: "yoga" },
  { day: "Viernes", time: "17:00", classKey: "aerobics" },
  { day: "Viernes", time: "18:00", classKey: "crossfit" },
  { day: "Viernes", time: "19:00", classKey: "coreExpress" },
  { day: "Viernes", time: "20:00", classKey: "dance" },
  { day: "Viernes", time: "21:00", classKey: "pilates" },

  { day: "Sábado", time: "09:00", classKey: "stepFunctional" },
  { day: "Sábado", time: "10:00", classKey: "motrizExpress" },
  { day: "Sábado", time: "11:00", classKey: "zen" },
];

export const weekDays = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

const baseClubConfigs = [
  {
    id: 1,
    startSessionId: 1,
    slug: "teatinos",
    brand: "GYMENTALITY",
    shortName: "Teatinos",
    name: "Gymentality Teatinos",
    address: "Avenida de Teatinos 45",
    city: "Málaga",
    phone: "951 000 101",
    email: "teatinos@gymentality.com",
    weekSchedule: "Mon-Fri: 6:00 - 23:00",
    holidaySchedule: "S-S-Holidays: 8:00 - 21:00",
    description:
      "Club de referencia en la zona universitaria de Teatinos, con áreas de fuerza, cardio, entrenamiento funcional y clases dirigidas.",
    coordinates: { lat: 36.7199, lng: -4.4777 },
    image: clubImages.teatinos,
    facilityIds: [
      "cardio",
      "freeWeights",
      "strengthEquipment",
      "functional",
      "cycling",
      "guidedClasses",
      "showers",
      "lockers",
      "parking",
      "swimmingPool",
    ],
    excludedClassKeys: [],
  },
  {
    id: 2,
    startSessionId: 49,
    slug: "centro-historico",
    brand: "GYMENTALITY",
    shortName: "Centro Histórico",
    name: "Gymentality Centro Histórico",
    address: "Calle Carretería 82",
    city: "Málaga",
    phone: "951 000 102",
    email: "centro@gymentality.com",
    weekSchedule: "Mon-Fri: 6:00 - 23:00",
    holidaySchedule: "S-S-Holidays: 8:00 - 21:00",
    description:
      "Club ubicado en el centro histórico de Málaga, ideal para entrenamiento urbano, clases express y actividades body and mind.",
    coordinates: { lat: 36.7230, lng: -4.4218 },
    image: clubImages.centroHistorico,
    facilityIds: [
      "cardio",
      "freeWeights",
      "strengthEquipment",
      "functional",
      "cycling",
      "guidedClasses",
      "showers",
      "lockers",
      "parking",
    ],
    excludedClassKeys: ["swimming", "aquafitness", "poolFunctional", "aquaboard"],
  },
  {
    id: 3,
    startSessionId: 89,
    slug: "vialia-larios",
    brand: "GYMENTALITY",
    shortName: "Vialia & Larios",
    name: "Gymentality Vialia & Larios",
    address: "Calle Cuarteles 30",
    city: "Málaga",
    phone: "951 000 103",
    email: "vialia@gymentality.com",
    weekSchedule: "Mon-Fri: 6:00 - 23:00",
    holidaySchedule: "S-S-Holidays: 8:00 - 21:00",
    description:
      "Club estratégico entre Vialia y el entorno de Larios, con zona acuática, cardio, cycling y clases grupales de alto ritmo.",
    coordinates: { lat: 36.7153, lng: -4.4274 },
    image: clubImages.vialiaLarios,
    facilityIds: [
      "cardio",
      "freeWeights",
      "strengthEquipment",
      "functional",
      "cycling",
      "guidedClasses",
      "showers",
      "lockers",
      "parking",
      "swimmingPool",
    ],
    excludedClassKeys: ["jumping", "zen", "dance"],
  },
];

function buildClassSessionsForClub(clubConfig) {
  let currentId = clubConfig.startSessionId;

  return weeklyScheduleTemplate
    .filter((slot) => !clubConfig.excludedClassKeys.includes(slot.classKey))
    .map((slot) => {
      const classInfo = classCatalog[slot.classKey];

      return {
        id: currentId++,
        classKey: slot.classKey,
        title: classInfo.title,
        category: classInfo.category,
        image: classInfo.image,
        description: classInfo.description,
        day: slot.day,
        time: slot.time,
        schedule: `${slot.day} ${slot.time}`,
        clubId: clubConfig.id,
        clubName: clubConfig.name,
        clubShortName: clubConfig.shortName,
        city: clubConfig.city,
        address: clubConfig.address,
      };
    });
}

function buildClassPreview(classSessions) {
  const seen = new Set();

  return classSessions.filter((session) => {
    if (seen.has(session.classKey)) {
      return false;
    }

    seen.add(session.classKey);
    return true;
  });
}

export const clubs = baseClubConfigs.map((clubConfig) => {
  const classSessions = buildClassSessionsForClub(clubConfig);
  const classPreview = buildClassPreview(classSessions);

  return {
    ...clubConfig,
    facilities: clubConfig.facilityIds.map((facilityId) => facilityCatalog[facilityId]),
    classSessions,
    classPreview,
  };
});

export const cities = [...new Set(clubs.map((club) => club.city))];
export const malagaMapCenter = { lat: 36.7213, lng: -4.4214 };
export const malagaMapZoom = 12;