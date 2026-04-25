import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import * as bookingService from "../services/bookingService";

/**
 * Hook para gestionar las reservas del usuario
 * @returns {Object} - { bookings, loading, error, refetch, createBooking, cancelBooking }
 */
export function useBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const fetchBookings = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await bookingService.getMyUpcomingBookings();
      setBookings(data);
    } catch (err) {
      setError(err.message || "Error fetching bookings");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const createBooking = async (clubClassId, classDate) => {
    const data = await bookingService.createBooking({ clubClassId, classDate });
    await fetchBookings(); // Refrescar después de crear
    return data;
  };

  const cancelBooking = async (clubClassId, classDate) => {
    const data = await bookingService.cancelBooking({ clubClassId, classDate });
    await fetchBookings(); // Refrescar después de cancelar
    return data;
  };

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
    createBooking,
    cancelBooking,
  };
}

/**
 * Hook para obtener el horario de clases para una fecha específica
 * @param {string|Date} date - Fecha para obtener el horario
 * @returns {Object} - { schedule, loading, error }
 */
export function useClassSchedule(date) {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!date) {
      setLoading(false);
      return;
    }

    const fetchSchedule = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await bookingService.getClassSchedule(date);
        setSchedule(data);
      } catch (err) {
        setError(err.message || "Error fetching schedule");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [date]);

  return { schedule, loading, error };
}

/**
 * Hook para solicitar notificación de disponibilidad de clase
 * @returns {Object} - { requestNotification, loading }
 */
export function useClassNotifications() {
  const [loading, setLoading] = useState(false);

  const requestNotification = async (clubClassId, classDate) => {
    setLoading(true);
    try {
      const data = await bookingService.requestClassAvailabilityNotification(
        clubClassId,
        classDate
      );
      return data;
    } finally {
      setLoading(false);
    }
  };

  return { requestNotification, loading };
}