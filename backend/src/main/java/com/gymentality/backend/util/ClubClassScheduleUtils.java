package com.gymentality.backend.util;

import com.gymentality.backend.entity.ClubClass;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public final class ClubClassScheduleUtils {

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("H:mm");

    private ClubClassScheduleUtils() {
    }

    public static String extractDayName(String schedule) {
        int lastSpaceIndex = schedule.lastIndexOf(' ');
        if (lastSpaceIndex < 0) {
            throw new IllegalArgumentException("Formato de horario inválido: " + schedule);
        }
        return schedule.substring(0, lastSpaceIndex).trim();
    }

    public static LocalTime extractStartTime(String schedule) {
        int lastSpaceIndex = schedule.lastIndexOf(' ');
        if (lastSpaceIndex < 0 || lastSpaceIndex == schedule.length() - 1) {
            throw new IllegalArgumentException("Formato de horario inválido: " + schedule);
        }

        String timePart = schedule.substring(lastSpaceIndex + 1).trim();
        return LocalTime.parse(timePart, TIME_FORMATTER);
    }

    public static LocalDateTime getClassStartDateTime(ClubClass clubClass, LocalDate classDate) {
        return LocalDateTime.of(classDate, extractStartTime(clubClass.getSchedule()));
    }

    public static LocalDateTime getBookingOpensAt(ClubClass clubClass, LocalDate classDate) {
        return getClassStartDateTime(clubClass, classDate).minusHours(48);
    }

    public static boolean matchesDate(ClubClass clubClass, LocalDate classDate) {
        return extractDayName(clubClass.getSchedule()).equalsIgnoreCase(getSpanishDayName(classDate.getDayOfWeek()));
    }

    public static String getSpanishDayName(DayOfWeek dayOfWeek) {
        return switch (dayOfWeek) {
            case MONDAY -> "Lunes";
            case TUESDAY -> "Martes";
            case WEDNESDAY -> "Miércoles";
            case THURSDAY -> "Jueves";
            case FRIDAY -> "Viernes";
            case SATURDAY -> "Sábado";
            case SUNDAY -> "Domingo";
        };
    }
}