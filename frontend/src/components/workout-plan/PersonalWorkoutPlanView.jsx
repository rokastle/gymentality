import { personalPlanData } from "../../data/myWorkoutPlansData";
import CoachedWorkoutPlanView from "./CoachedWorkoutPlanView";

export default function PersonalWorkoutPlanView() {
  return <CoachedWorkoutPlanView planData={personalPlanData} />;
}
