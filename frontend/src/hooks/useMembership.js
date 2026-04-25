import { useState, useEffect, useCallback } from "react";
import useAuth from "./useAuth";
import * as membershipService from "../services/membershipService";

/**
 * Hook para gestionar la membresía del usuario
 * @returns {Object} - { membership, loading, error, refetch }
 */
export function useMembership() {
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth();

  const fetchMembership = useCallback(async () => {
    if (!isAuthenticated || !user?.membershipPlanName) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Por ahora usamos los datos del usuario del contexto
      // Cuando haya un endpoint específico, usar membershipService.getUserMembership()
      setMembership({
        planName: user.membershipPlanName,
        status: "active", // Esto vendría del backend
      });
    } catch (err) {
      setError(err.message || "Error fetching membership");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.membershipPlanName]);

  useEffect(() => {
    fetchMembership();
  }, [fetchMembership]);

  return { membership, loading, error, refetch: fetchMembership };
}

/**
 * Hook para obtener todos los planes de membresía disponibles
 * @returns {Object} - { plans, loading, error }
 */
export function useMembershipPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await membershipService.getAllMemberships();
        setPlans(data);
      } catch (err) {
        setError(err.message || "Error fetching membership plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return { plans, loading, error };
}