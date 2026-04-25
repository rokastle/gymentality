import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Hook para gestionar el perfil del usuario
 * @returns {Object} - { user, loading, error, updateProfile, logout }
 */
export function useUserProfile() {
  const { user, isAuthenticated, logout, isInitializing } = useAuth();
  const [loading, setLoading] = useState(isInitializing);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(isInitializing);
  }, [isInitializing]);

  const updateProfile = async (profileData) => {
    setError(null);
    try {
      // Por ahora no hay endpoint para actualizar perfil
      // Cuando exista, usar axiosClient.put('/users/me', profileData)
      throw new Error("Profile update not implemented yet");
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    user,
    loading: loading || !isAuthenticated,
    error,
    isAuthenticated,
    updateProfile,
    logout,
  };
}

/**
 * Hook para obtener datos públicos de un usuario
 * @param {number} userId - ID del usuario
 * @returns {Object} - { profile, loading, error }
 */
export function useUserProfileById(userId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        // Por ahora no hay endpoint público de usuarios
        // Cuando exista, usar axiosClient.get(`/users/${userId}/public`)
        setProfile(null);
      } catch (err) {
        setError(err.message || "Error fetching user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return { profile, loading, error };
}