-- ==================================================
-- Gymentality database schema
-- Modelo actual alineado con las entidades JPA
-- Demo mode: este esquema se recrea junto con data.sql
-- para que cada arranque vuelva al estado inicial.
-- ==================================================

CREATE DATABASE IF NOT EXISTS gymentality;
USE gymentality;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS class_notification_requests;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS facilities;
DROP TABLE IF EXISTS club_classes;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS workout_plans;
DROP TABLE IF EXISTS memberships;
DROP TABLE IF EXISTS clubs;

SET FOREIGN_KEY_CHECKS = 1;

-- ==================================================
-- CLUBS
-- Sedes físicas: Teatinos, Centro Histórico, Vialia...
-- ==================================================
CREATE TABLE clubs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    phone VARCHAR(255),
    email VARCHAR(255),
    description VARCHAR(1000)
);

-- ==================================================
-- MEMBERSHIPS
-- Planes de acceso al club.
-- Ejemplo: Monthly Plan, Quarterly Plan, Annual Plan.
-- ==================================================
CREATE TABLE memberships (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    price DECIMAL(10, 2) NOT NULL,
    duration_in_days INT NOT NULL
);

-- ==================================================
-- WORKOUT PLANS
-- Planes de entrenamiento/nutrición.
-- Ejemplo: Free, Personal Plan, Integral Plan.
-- ==================================================
CREATE TABLE workout_plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    price DECIMAL(10, 2) NOT NULL,
    duration_in_days INT NOT NULL
);

-- ==================================================
-- USERS
-- Usuarios registrados de la plataforma.
-- El usuario selecciona club, membership y workout plan
-- durante el flujo de registro.
-- ==================================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL,
    gender VARCHAR(16),
    date_of_birth DATE,
    address VARCHAR(255),
    postal_code VARCHAR(5),
    city VARCHAR(255),
    country VARCHAR(255),
    region VARCHAR(255),
    iban VARCHAR(34),
    payment_method VARCHAR(24),
    card_last4 VARCHAR(4),
    card_expiry_month VARCHAR(2),
    card_expiry_year VARCHAR(4),
    save_card_for_future BOOLEAN,
    club_id BIGINT,
    membership_plan_id BIGINT,
    workout_plan_id BIGINT,

    CONSTRAINT fk_users_club
        FOREIGN KEY (club_id)
        REFERENCES clubs(id),

    CONSTRAINT fk_users_membership_plan
        FOREIGN KEY (membership_plan_id)
        REFERENCES memberships(id),

    CONSTRAINT fk_users_workout_plan
        FOREIGN KEY (workout_plan_id)
        REFERENCES workout_plans(id)
);

-- ==================================================
-- FACILITIES
-- Instalaciones disponibles en cada club.
-- ==================================================
CREATE TABLE facilities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    club_id BIGINT NOT NULL,

    CONSTRAINT fk_facilities_club
        FOREIGN KEY (club_id)
        REFERENCES clubs(id)
        ON DELETE CASCADE
);

-- ==================================================
-- CLUB CLASSES
-- Clases recurrentes ofrecidas por cada club.
-- Ejemplo: Yoga en Teatinos los martes a las 20:00.
-- ==================================================
CREATE TABLE club_classes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    schedule VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    category VARCHAR(32) NOT NULL,
    club_id BIGINT NOT NULL,

    CONSTRAINT fk_club_classes_club
        FOREIGN KEY (club_id)
        REFERENCES clubs(id)
        ON DELETE CASCADE
);

-- ==================================================
-- BOOKINGS
-- Reservas de usuarios para una ClubClass en una fecha concreta.
-- ==================================================
CREATE TABLE bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    class_date DATE NOT NULL,
    booking_date DATETIME NOT NULL,
    status VARCHAR(32) NOT NULL,
    created_at DATETIME NOT NULL,
    cancelled_at DATETIME,
    user_id BIGINT NOT NULL,
    club_class_id BIGINT NOT NULL,

    CONSTRAINT uq_bookings_user_club_class_date
        UNIQUE (user_id, club_class_id, class_date),

    CONSTRAINT fk_bookings_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_bookings_club_class
        FOREIGN KEY (club_class_id)
        REFERENCES club_classes(id)
        ON DELETE CASCADE
);

-- ==================================================
-- CLASS NOTIFICATION REQUESTS
-- Solicitudes de aviso antes de apertura de reserva.
-- ==================================================
CREATE TABLE class_notification_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    class_date DATE NOT NULL,
    created_at DATETIME NOT NULL,
    active BOOLEAN NOT NULL,
    notified_at DATETIME,
    user_id BIGINT NOT NULL,
    club_class_id BIGINT NOT NULL,

    CONSTRAINT uq_class_notifications_user_club_class_date
        UNIQUE (user_id, club_class_id, class_date),

    CONSTRAINT fk_class_notifications_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_class_notifications_club_class
        FOREIGN KEY (club_class_id)
        REFERENCES club_classes(id)
        ON DELETE CASCADE
);

-- ==================================================
-- NOTIFICATIONS
-- Notificaciones persistidas para el area privada.
-- ==================================================
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(48) NOT NULL,
    title VARCHAR(255) NOT NULL,
    eyebrow VARCHAR(255) NOT NULL,
    message VARCHAR(1000) NOT NULL,
    created_at DATETIME NOT NULL,
    is_read BOOLEAN NOT NULL,
    read_at DATETIME,
    deleted_at DATETIME,
    user_id BIGINT NOT NULL,

    CONSTRAINT fk_notifications_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ==================================================
-- INDEXES
-- Índices útiles para consultas frecuentes.
-- ==================================================

CREATE INDEX idx_users_email
    ON users(email);

CREATE INDEX idx_users_club_id
    ON users(club_id);

CREATE INDEX idx_users_membership_plan_id
    ON users(membership_plan_id);

CREATE INDEX idx_users_workout_plan_id
    ON users(workout_plan_id);

CREATE INDEX idx_facilities_club_id
    ON facilities(club_id);

CREATE INDEX idx_club_classes_club_id
    ON club_classes(club_id);

CREATE INDEX idx_club_classes_category
    ON club_classes(category);

CREATE INDEX idx_bookings_user_id
    ON bookings(user_id);

CREATE INDEX idx_bookings_club_class_id
    ON bookings(club_class_id);

CREATE INDEX idx_bookings_class_date
    ON bookings(class_date);

CREATE INDEX idx_bookings_status
    ON bookings(status);

CREATE INDEX idx_class_notification_requests_user_id
    ON class_notification_requests(user_id);

CREATE INDEX idx_class_notification_requests_club_class_id
    ON class_notification_requests(club_class_id);

CREATE INDEX idx_class_notification_requests_class_date
    ON class_notification_requests(class_date);

CREATE INDEX idx_class_notification_requests_active
    ON class_notification_requests(active);

CREATE INDEX idx_notifications_user_id
    ON notifications(user_id);

CREATE INDEX idx_notifications_created_at
    ON notifications(created_at);

CREATE INDEX idx_notifications_is_read
    ON notifications(is_read);

CREATE INDEX idx_notifications_deleted_at
    ON notifications(deleted_at);
