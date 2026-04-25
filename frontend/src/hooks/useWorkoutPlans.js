import { useEffect, useState } from "react";
import * as workoutPlanService from "../services/workoutPlanService";

export function useWorkoutPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await workoutPlanService.getAllWorkoutPlans();
        setPlans(data);
      } catch (err) {
        setError(err.message || "Error fetching workout plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return { plans, loading, error };
}