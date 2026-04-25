import classImages from "../assets/images/classImages";

const keyMap = {
  "total body": "totalBody",
  fitball: "fitball",
  gap: "gap",
  dumbbells: "dumbbells",
  crossfit: "crossfit",
  "step functional": "stepFunctional",
  hybrid: "hybrid",
  boxing: "boxing",
  spinning: "spinning",
  elliptical: "elliptical",
  jumping: "jumping",
  "core express": "coreExpress",
  "hiit express": "hiitExpress",
  "motriz express": "motrizExpress",
  yoga: "yoga",
  pilates: "pilates",
  zen: "zen",
  zumba: "zumba",
  aerobics: "aerobics",
  dance: "dance",
  swimming: "swimming",
  aquafitness: "aquafitness",
  "pool functional": "poolFunctional",
  aquaboard: "aquaboard",
};

function normalizeClassNameToKey(className = "") {
  const normalized = className
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  return keyMap[normalized] || null;
}

export default function getClassImageByName(className) {
  const key = normalizeClassNameToKey(className);
  return (key && classImages[key]) || classImages.yoga;
}