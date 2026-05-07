import { integralPlanData } from "../../data/myWorkoutPlansData";
import CoachedWorkoutPlanView from "./CoachedWorkoutPlanView";

export default function IntegralWorkoutPlanView() {
  return <CoachedWorkoutPlanView planData={integralPlanData} includesNutrition />;
}
