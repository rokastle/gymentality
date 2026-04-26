import { useMemo } from "react";
import { useClubById } from "./useClubs";
import { useMembershipPlans } from "./useMembership";
import { useWorkoutPlans } from "./useWorkoutPlans";
import {
  getMembershipPlanById,
  getWorkoutPlanById,
  mapMembershipPlanFromApi,
  mapWorkoutPlanFromApi,
} from "../data/signupPlansData";

export default function useSignUpDetailsSelection({
  clubId,
  membershipId,
  workoutId,
}) {
  const {
    club,
    loading: clubLoading,
    error: clubError,
  } = useClubById(clubId);

  const {
    plans: membershipApiPlans,
    loading: membershipsLoading,
    error: membershipsError,
  } = useMembershipPlans();

  const {
    plans: workoutApiPlans,
    loading: workoutPlansLoading,
    error: workoutPlansError,
  } = useWorkoutPlans();

  const membershipPlans = useMemo(
    () => membershipApiPlans.map(mapMembershipPlanFromApi),
    [membershipApiPlans]
  );

  const workoutPlans = useMemo(
    () => workoutApiPlans.map(mapWorkoutPlanFromApi),
    [workoutApiPlans]
  );

  const membershipPlan = getMembershipPlanById(membershipId, membershipPlans);
  const workoutPlan = getWorkoutPlanById(workoutId, workoutPlans);

  const loading = clubLoading || membershipsLoading || workoutPlansLoading;

  const hasError = Boolean(clubError || membershipsError || workoutPlansError);

  const isInvalidSelection = Boolean(
    !loading && (hasError || !club || !membershipPlan || !workoutPlan)
  );

  return {
    club,
    membershipPlan,
    workoutPlan,
    loading,
    isInvalidSelection,
  };
}