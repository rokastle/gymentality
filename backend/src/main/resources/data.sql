-- Limpiar datos previos para evitar errores al reiniciar
DELETE FROM bookings;
DELETE FROM facilities;
DELETE FROM gym_classes;
DELETE FROM users;
DELETE FROM memberships;
DELETE FROM clubs;

-- CLUBS
INSERT INTO clubs (id, name, address, city, phone, email, description) VALUES
(1, 'Gymentality Teatinos', 'Avenida de Teatinos 45', 'Málaga', '951000101', 'teatinos@gymentality.com', 'Club de referencia en la zona universitaria de Teatinos, con áreas de fuerza, cardio, entrenamiento funcional y clases dirigidas.'),
(2, 'Gymentality Centro Histórico', 'Calle Carretería 82', 'Málaga', '951000102', 'centro@gymentality.com', 'Club ubicado en el centro histórico de Málaga, ideal para entrenamiento urbano, clases express y actividades body and mind.'),
(3, 'Gymentality Vialia & Larios', 'Calle Cuarteles 30', 'Málaga', '951000103', 'vialia@gymentality.com', 'Club estratégico entre Vialia y el entorno de Larios, con zona acuática, cardio, cycling y clases grupales de alto ritmo.');

-- MEMBERSHIPS
INSERT INTO memberships (id, name, description, price, duration_in_days, category) VALUES
(1, 'Monthly Plan', '39.99 €/month. No commitment. Total flexibility. Free daily-use locker. Book up to 24 hours in advance. Online workouts. Discounts with partner brands. Automatic monthly renewal.', 39.99, 30, 'ACCESS'),
(2, 'Quarterly Plan', '104.97 € every 3 months. Equivalent to 34.99 €/month, save 12%. Free daily-use locker. Book up to 24 hours in advance. Online workouts. Discounts with partner brands. Automatic renewal.', 104.97, 90, 'ACCESS'),
(3, 'Annual Plan', '359.88 € per year. Equivalent to 29.99 €/month, save 25%. Free daily-use locker. Book up to 24 hours in advance. Online workouts. Discounts with partner brands. Automatic renewal.', 359.88, 365, 'ACCESS'),
(4, 'Workout Basic Plan', 'Free. Perfect for experienced or self-motivated members. Access to all training areas during opening hours. Use of cardio, strength and functional equipment. Freedom to follow your own routine at your own pace.', 0.00, 30, 'COACHING'),
(5, 'Personal Plan', '30 €/month. Work one-on-one with a certified personal trainer. Personalized training program tailored to your goals. One-on-one coaching sessions. Technique correction and injury-prevention guidance. Weekly progress check-ins and program adjustments.', 30.00, 30, 'COACHING'),
(6, 'Integral Plan', '50 €/month. Full professional support. Customized nutrition advice based on your goals. Meal guidance and healthy habit strategies. Ongoing trainer and nutrition follow-ups. Adjustments based on progress and lifestyle.', 50.00, 30, 'COACHING');

-- USERS
-- Sin usuarios seed por ahora.
-- Los usuarios se crearán desde el flujo real de registro en la web.
-- USERS
-- Usuario seed para no tener que registrarlo cada vez
-- USERS
-- Usuario seed para desarrollo
INSERT INTO users (
  id,
  email,
  first_name,
  last_name,
  password,
  phone,
  role,
  gender,
  date_of_birth,
  address,
  postal_code,
  city,
  country,
  region,
  iban,
  club_id,
  membership_plan_id,
  workout_plan_id
) VALUES (
  7,
  'robertocastillojimenez@gmail.com',
  'Roberto',
  'Castillo Jiménez',
  '$2a$10$hCK4i0bR6j6U0NBN.qvt0O4lHy38sR5F7fylwbf2/d0AgAtsy9tJS',
  '+34 645-263-577',
  'USER',
  'male',
  '1984-12-31',
  'Miguel Bueno Lara 10, 3 C 2',
  '29013',
  'Málaga',
  'España',
  'Andalucía',
  'ES3000811749274977643919',
  1,
  3,
  6
);

-- FACILITIES
-- Club 1: tiene todas las instalaciones, incluida piscina
INSERT INTO facilities (id, name, description, club_id) VALUES
(1, 'Cardio Area', 'Zona de cardio con cintas, remos y bicicletas.', 1),
(2, 'Free Weights', 'Espacio con mancuernas, barras y discos.', 1),
(3, 'Strength Machines', 'Máquinas guiadas para entrenamiento de fuerza.', 1),
(4, 'Training Area', 'Zona funcional para circuitos y trabajo libre.', 1),
(5, 'Cycling Area', 'Espacio específico para sesiones de bike indoor.', 1),
(6, 'Group Classes', 'Sala para clases colectivas y sesiones dirigidas.', 1),
(7, 'Showers and Changing Rooms', 'Vestuario con duchas y zona de cambio.', 1),
(8, 'Lockers', 'Taquillas de uso diario para clientes.', 1),
(9, 'Parking', 'Aparcamiento disponible para socios.', 1),
(10, 'Swimming Pool', 'Piscina para nado, aquafitness y actividades acuáticas.', 1),

-- Club 2: no tiene piscina
(11, 'Cardio Area', 'Zona de cardio enfocada a entrenamiento urbano y express.', 2),
(12, 'Free Weights', 'Espacio libre para fuerza y trabajo técnico.', 2),
(13, 'Strength Machines', 'Máquinas de fuerza para rutinas guiadas.', 2),
(14, 'Training Area', 'Zona funcional para circuitos y trabajo libre.', 2),
(15, 'Cycling Area', 'Espacio específico para sesiones de bike indoor.', 2),
(16, 'Group Classes', 'Sala de actividades dirigidas y body and mind.', 2),
(17, 'Showers and Changing Rooms', 'Vestuario con duchas y zona de cambio.', 2),
(18, 'Lockers', 'Taquillas de uso diario para clientes.', 2),
(19, 'Parking', 'Aparcamiento disponible para socios.', 2),

-- Club 3: tiene piscina
(20, 'Cardio Area', 'Zona de cardio con equipamiento moderno.', 3),
(21, 'Free Weights', 'Espacio de fuerza con peso libre.', 3),
(22, 'Strength Machines', 'Máquinas guiadas para entrenamiento de fuerza.', 3),
(23, 'Training Area', 'Zona funcional para HIIT y entrenamiento híbrido.', 3),
(24, 'Cycling Area', 'Sala para bike y sesiones cardiovasculares.', 3),
(25, 'Group Classes', 'Sala de clases grupales y sesiones dirigidas.', 3),
(26, 'Showers and Changing Rooms', 'Vestuario con duchas y zona de cambio.', 3),
(27, 'Lockers', 'Taquillas de uso diario para clientes.', 3),
(28, 'Parking', 'Aparcamiento disponible para socios.', 3),
(29, 'Swimming Pool', 'Piscina para nado, aquafitness y actividades acuáticas.', 3);

-- GYM CLASSES
INSERT INTO gym_classes (id, name, description, schedule, capacity, category, club_id) VALUES

-- =========================================
-- CLUB 1: GYMENTALITY TEATINOS
-- =========================================
(1, 'Pool Functional', 'Functional training adapted to the aquatic environment.', 'Lunes 09:00', 14, 'AQUA', 1),
(2, 'Crossfit', 'Functional high-intensity class with varied movements.', 'Lunes 10:00', 16, 'FUNCTIONAL', 1),
(3, 'GAP', 'Strength class focused on glutes, abs and legs.', 'Lunes 11:00', 20, 'STRENGTH', 1),
(4, 'Jumping', 'Cardio class based on dynamic trampoline work and coordination.', 'Lunes 12:00', 18, 'CARDIO', 1),
(5, 'Swimming', 'Aqua class focused on swimming technique and endurance.', 'Lunes 17:00', 12, 'AQUA', 1),
(6, 'Total Body', 'Strength class focused on full-body training.', 'Lunes 18:00', 20, 'STRENGTH', 1),
(7, 'Boxing', 'Cardio-based boxing class with technique and conditioning.', 'Lunes 19:00', 18, 'CARDIO', 1),
(8, 'Hybrid', 'Functional hybrid training mixing strength and cardio.', 'Lunes 20:00', 16, 'FUNCTIONAL', 1),
(9, 'Zumba', 'Dance class with high energy and simple choreographies.', 'Lunes 21:00', 22, 'DANCE', 1),

(10, 'Aquaboard', 'Balance and core session on floating boards.', 'Martes 09:00', 10, 'AQUA', 1),
(11, 'Pilates', 'Body and mind class to improve posture and core strength.', 'Martes 10:00', 18, 'BODY_AND_MIND', 1),
(12, 'Dumbbells', 'Strength session based on dumbbell routines.', 'Martes 11:00', 16, 'STRENGTH', 1),
(13, 'Elliptical', 'Cardio endurance session using elliptical patterns.', 'Martes 12:00', 16, 'CARDIO', 1),
(14, 'Aquafitness', 'Aqua fitness class for cardio and toning in water.', 'Martes 17:00', 16, 'AQUA', 1),
(15, 'Fitball', 'Strength class using fitball for stability and control.', 'Martes 18:00', 18, 'STRENGTH', 1),
(16, 'Spinning', 'Indoor cycling session with music and intervals.', 'Martes 19:00', 20, 'CARDIO', 1),
(17, 'Yoga', 'Body and mind class focused on flexibility, breathing and balance.', 'Martes 20:00', 20, 'BODY_AND_MIND', 1),
(18, 'Zen', 'Relaxation and body awareness class for recovery and mental wellbeing.', 'Martes 21:00', 18, 'BODY_AND_MIND', 1),

(19, 'Swimming', 'Aqua class focused on swimming technique and endurance.', 'Miércoles 09:00', 12, 'AQUA', 1),
(20, 'Total Body', 'Strength class focused on full-body training.', 'Miércoles 10:00', 20, 'STRENGTH', 1),
(21, 'Core Express', 'Express core-focused class to strengthen the midsection.', 'Miércoles 11:00', 15, 'EXPRESS', 1),
(22, 'Dance', 'Dance class for coordination, rhythm and conditioning.', 'Miércoles 12:00', 20, 'DANCE', 1),
(23, 'Pool Functional', 'Functional training adapted to the aquatic environment.', 'Miércoles 17:00', 14, 'AQUA', 1),
(24, 'Motriz Express', 'Short intense express session focused on mobility and control.', 'Miércoles 18:00', 14, 'EXPRESS', 1),
(25, 'Jumping', 'Cardio class based on dynamic trampoline work and coordination.', 'Miércoles 19:00', 18, 'CARDIO', 1),
(26, 'HIIT Express', 'Express high-intensity workout for busy members.', 'Miércoles 20:00', 15, 'EXPRESS', 1),
(27, 'Aerobics', 'Dance-cardio session with classic guided routines.', 'Miércoles 21:00', 20, 'DANCE', 1),

(28, 'Boxing', 'Cardio-based boxing class with technique and conditioning.', 'Jueves 09:00', 18, 'CARDIO', 1),
(29, 'Spinning', 'Indoor cycling session with music and intervals.', 'Jueves 10:00', 20, 'CARDIO', 1),
(30, 'Hybrid', 'Functional hybrid training mixing strength and cardio.', 'Jueves 11:00', 16, 'FUNCTIONAL', 1),
(31, 'Zumba', 'Dance class with high energy and simple choreographies.', 'Jueves 12:00', 22, 'DANCE', 1),
(32, 'Aquaboard', 'Balance and core session on floating boards.', 'Jueves 17:00', 10, 'AQUA', 1),
(33, 'Dumbbells', 'Strength session based on dumbbell routines.', 'Jueves 18:00', 16, 'STRENGTH', 1),
(34, 'Elliptical', 'Cardio endurance session using elliptical patterns.', 'Jueves 19:00', 16, 'CARDIO', 1),
(35, 'GAP', 'Strength class focused on glutes, abs and legs.', 'Jueves 20:00', 20, 'STRENGTH', 1),
(36, 'Step Functional', 'Functional session combining step and conditioning.', 'Jueves 21:00', 18, 'FUNCTIONAL', 1),

(37, 'Aquafitness', 'Aqua fitness class for cardio and toning in water.', 'Viernes 09:00', 16, 'AQUA', 1),
(38, 'HIIT Express', 'Express high-intensity workout for busy members.', 'Viernes 10:00', 15, 'EXPRESS', 1),
(39, 'Fitball', 'Strength class using fitball for stability and control.', 'Viernes 11:00', 18, 'STRENGTH', 1),
(40, 'Yoga', 'Body and mind class focused on flexibility, breathing and balance.', 'Viernes 12:00', 20, 'BODY_AND_MIND', 1),
(41, 'Aerobics', 'Dance-cardio session with classic guided routines.', 'Viernes 17:00', 20, 'DANCE', 1),
(42, 'Crossfit', 'Functional high-intensity class with varied movements.', 'Viernes 18:00', 16, 'FUNCTIONAL', 1),
(43, 'Core Express', 'Express core-focused class to strengthen the midsection.', 'Viernes 19:00', 15, 'EXPRESS', 1),
(44, 'Dance', 'Dance class for coordination, rhythm and conditioning.', 'Viernes 20:00', 20, 'DANCE', 1),
(45, 'Pilates', 'Body and mind class to improve posture and core strength.', 'Viernes 21:00', 18, 'BODY_AND_MIND', 1),

(46, 'Step Functional', 'Functional session combining step and conditioning.', 'Sábado 09:00', 18, 'FUNCTIONAL', 1),
(47, 'Motriz Express', 'Short intense express session focused on mobility and control.', 'Sábado 10:00', 14, 'EXPRESS', 1),
(48, 'Zen', 'Relaxation and body awareness class for recovery and mental wellbeing.', 'Sábado 11:00', 18, 'BODY_AND_MIND', 1),

-- =========================================
-- CLUB 2: GYMENTALITY CENTRO HISTÓRICO
-- Sin clases AQUA
-- =========================================
(49, 'Crossfit', 'Functional high-intensity class with varied movements.', 'Lunes 10:00', 16, 'FUNCTIONAL', 2),
(50, 'GAP', 'Strength class focused on glutes, abs and legs.', 'Lunes 11:00', 20, 'STRENGTH', 2),
(51, 'Jumping', 'Cardio class based on dynamic trampoline work and coordination.', 'Lunes 12:00', 18, 'CARDIO', 2),
(52, 'Total Body', 'Strength class focused on full-body training.', 'Lunes 18:00', 20, 'STRENGTH', 2),
(53, 'Boxing', 'Cardio-based boxing class with technique and conditioning.', 'Lunes 19:00', 18, 'CARDIO', 2),
(54, 'Hybrid', 'Functional hybrid training mixing strength and cardio.', 'Lunes 20:00', 16, 'FUNCTIONAL', 2),
(55, 'Zumba', 'Dance class with high energy and simple choreographies.', 'Lunes 21:00', 22, 'DANCE', 2),

(56, 'Pilates', 'Body and mind class to improve posture and core strength.', 'Martes 10:00', 18, 'BODY_AND_MIND', 2),
(57, 'Dumbbells', 'Strength session based on dumbbell routines.', 'Martes 11:00', 16, 'STRENGTH', 2),
(58, 'Elliptical', 'Cardio endurance session using elliptical patterns.', 'Martes 12:00', 16, 'CARDIO', 2),
(59, 'Fitball', 'Strength class using fitball for stability and control.', 'Martes 18:00', 18, 'STRENGTH', 2),
(60, 'Spinning', 'Indoor cycling session with music and intervals.', 'Martes 19:00', 20, 'CARDIO', 2),
(61, 'Yoga', 'Body and mind class focused on flexibility, breathing and balance.', 'Martes 20:00', 20, 'BODY_AND_MIND', 2),
(62, 'Zen', 'Relaxation and body awareness class for recovery and mental wellbeing.', 'Martes 21:00', 18, 'BODY_AND_MIND', 2),

(63, 'Total Body', 'Strength class focused on full-body training.', 'Miércoles 10:00', 20, 'STRENGTH', 2),
(64, 'Core Express', 'Express core-focused class to strengthen the midsection.', 'Miércoles 11:00', 15, 'EXPRESS', 2),
(65, 'Dance', 'Dance class for coordination, rhythm and conditioning.', 'Miércoles 12:00', 20, 'DANCE', 2),
(66, 'Motriz Express', 'Short intense express session focused on mobility and control.', 'Miércoles 18:00', 14, 'EXPRESS', 2),
(67, 'Jumping', 'Cardio class based on dynamic trampoline work and coordination.', 'Miércoles 19:00', 18, 'CARDIO', 2),
(68, 'HIIT Express', 'Express high-intensity workout for busy members.', 'Miércoles 20:00', 15, 'EXPRESS', 2),
(69, 'Aerobics', 'Dance-cardio session with classic guided routines.', 'Miércoles 21:00', 20, 'DANCE', 2),

(70, 'Boxing', 'Cardio-based boxing class with technique and conditioning.', 'Jueves 09:00', 18, 'CARDIO', 2),
(71, 'Spinning', 'Indoor cycling session with music and intervals.', 'Jueves 10:00', 20, 'CARDIO', 2),
(72, 'Hybrid', 'Functional hybrid training mixing strength and cardio.', 'Jueves 11:00', 16, 'FUNCTIONAL', 2),
(73, 'Zumba', 'Dance class with high energy and simple choreographies.', 'Jueves 12:00', 22, 'DANCE', 2),
(74, 'Dumbbells', 'Strength session based on dumbbell routines.', 'Jueves 18:00', 16, 'STRENGTH', 2),
(75, 'Elliptical', 'Cardio endurance session using elliptical patterns.', 'Jueves 19:00', 16, 'CARDIO', 2),
(76, 'GAP', 'Strength class focused on glutes, abs and legs.', 'Jueves 20:00', 20, 'STRENGTH', 2),
(77, 'Step Functional', 'Functional session combining step and conditioning.', 'Jueves 21:00', 18, 'FUNCTIONAL', 2),

(78, 'HIIT Express', 'Express high-intensity workout for busy members.', 'Viernes 10:00', 15, 'EXPRESS', 2),
(79, 'Fitball', 'Strength class using fitball for stability and control.', 'Viernes 11:00', 18, 'STRENGTH', 2),
(80, 'Yoga', 'Body and mind class focused on flexibility, breathing and balance.', 'Viernes 12:00', 20, 'BODY_AND_MIND', 2),
(81, 'Aerobics', 'Dance-cardio session with classic guided routines.', 'Viernes 17:00', 20, 'DANCE', 2),
(82, 'Crossfit', 'Functional high-intensity class with varied movements.', 'Viernes 18:00', 16, 'FUNCTIONAL', 2),
(83, 'Core Express', 'Express core-focused class to strengthen the midsection.', 'Viernes 19:00', 15, 'EXPRESS', 2),
(84, 'Dance', 'Dance class for coordination, rhythm and conditioning.', 'Viernes 20:00', 20, 'DANCE', 2),
(85, 'Pilates', 'Body and mind class to improve posture and core strength.', 'Viernes 21:00', 18, 'BODY_AND_MIND', 2),

(86, 'Step Functional', 'Functional session combining step and conditioning.', 'Sábado 09:00', 18, 'FUNCTIONAL', 2),
(87, 'Motriz Express', 'Short intense express session focused on mobility and control.', 'Sábado 10:00', 14, 'EXPRESS', 2),
(88, 'Zen', 'Relaxation and body awareness class for recovery and mental wellbeing.', 'Sábado 11:00', 18, 'BODY_AND_MIND', 2),

-- =========================================
-- CLUB 3: GYMENTALITY VIALIA & LARIOS
-- Sin Jumping, Zen ni Dance
-- =========================================
(89, 'Pool Functional', 'Functional training adapted to the aquatic environment.', 'Lunes 09:00', 14, 'AQUA', 3),
(90, 'Crossfit', 'Functional high-intensity class with varied movements.', 'Lunes 10:00', 16, 'FUNCTIONAL', 3),
(91, 'GAP', 'Strength class focused on glutes, abs and legs.', 'Lunes 11:00', 20, 'STRENGTH', 3),
(92, 'Swimming', 'Aqua class focused on swimming technique and endurance.', 'Lunes 17:00', 12, 'AQUA', 3),
(93, 'Total Body', 'Strength class focused on full-body training.', 'Lunes 18:00', 20, 'STRENGTH', 3),
(94, 'Boxing', 'Cardio-based boxing class with technique and conditioning.', 'Lunes 19:00', 18, 'CARDIO', 3),
(95, 'Hybrid', 'Functional hybrid training mixing strength and cardio.', 'Lunes 20:00', 16, 'FUNCTIONAL', 3),
(96, 'Zumba', 'Dance class with high energy and simple choreographies.', 'Lunes 21:00', 22, 'DANCE', 3),

(97, 'Aquaboard', 'Balance and core session on floating boards.', 'Martes 09:00', 10, 'AQUA', 3),
(98, 'Pilates', 'Body and mind class to improve posture and core strength.', 'Martes 10:00', 18, 'BODY_AND_MIND', 3),
(99, 'Dumbbells', 'Strength session based on dumbbell routines.', 'Martes 11:00', 16, 'STRENGTH', 3),
(100, 'Elliptical', 'Cardio endurance session using elliptical patterns.', 'Martes 12:00', 16, 'CARDIO', 3),
(101, 'Aquafitness', 'Aqua fitness class for cardio and toning in water.', 'Martes 17:00', 16, 'AQUA', 3),
(102, 'Fitball', 'Strength class using fitball for stability and control.', 'Martes 18:00', 18, 'STRENGTH', 3),
(103, 'Spinning', 'Indoor cycling session with music and intervals.', 'Martes 19:00', 20, 'CARDIO', 3),
(104, 'Yoga', 'Body and mind class focused on flexibility, breathing and balance.', 'Martes 20:00', 20, 'BODY_AND_MIND', 3),

(105, 'Swimming', 'Aqua class focused on swimming technique and endurance.', 'Miércoles 09:00', 12, 'AQUA', 3),
(106, 'Total Body', 'Strength class focused on full-body training.', 'Miércoles 10:00', 20, 'STRENGTH', 3),
(107, 'Core Express', 'Express core-focused class to strengthen the midsection.', 'Miércoles 11:00', 15, 'EXPRESS', 3),
(108, 'Pool Functional', 'Functional training adapted to the aquatic environment.', 'Miércoles 17:00', 14, 'AQUA', 3),
(109, 'Motriz Express', 'Short intense express session focused on mobility and control.', 'Miércoles 18:00', 14, 'EXPRESS', 3),
(110, 'HIIT Express', 'Express high-intensity workout for busy members.', 'Miércoles 20:00', 15, 'EXPRESS', 3),
(111, 'Aerobics', 'Dance-cardio session with classic guided routines.', 'Miércoles 21:00', 20, 'DANCE', 3),

(112, 'Boxing', 'Cardio-based boxing class with technique and conditioning.', 'Jueves 09:00', 18, 'CARDIO', 3),
(113, 'Spinning', 'Indoor cycling session with music and intervals.', 'Jueves 10:00', 20, 'CARDIO', 3),
(114, 'Hybrid', 'Functional hybrid training mixing strength and cardio.', 'Jueves 11:00', 16, 'FUNCTIONAL', 3),
(115, 'Zumba', 'Dance class with high energy and simple choreographies.', 'Jueves 12:00', 22, 'DANCE', 3),
(116, 'Aquaboard', 'Balance and core session on floating boards.', 'Jueves 17:00', 10, 'AQUA', 3),
(117, 'Dumbbells', 'Strength session based on dumbbell routines.', 'Jueves 18:00', 16, 'STRENGTH', 3),
(118, 'Elliptical', 'Cardio endurance session using elliptical patterns.', 'Jueves 19:00', 16, 'CARDIO', 3),
(119, 'GAP', 'Strength class focused on glutes, abs and legs.', 'Jueves 20:00', 20, 'STRENGTH', 3),
(120, 'Step Functional', 'Functional session combining step and conditioning.', 'Jueves 21:00', 18, 'FUNCTIONAL', 3),

(121, 'Aquafitness', 'Aqua fitness class for cardio and toning in water.', 'Viernes 09:00', 16, 'AQUA', 3),
(122, 'HIIT Express', 'Express high-intensity workout for busy members.', 'Viernes 10:00', 15, 'EXPRESS', 3),
(123, 'Fitball', 'Strength class using fitball for stability and control.', 'Viernes 11:00', 18, 'STRENGTH', 3),
(124, 'Yoga', 'Body and mind class focused on flexibility, breathing and balance.', 'Viernes 12:00', 20, 'BODY_AND_MIND', 3),
(125, 'Aerobics', 'Dance-cardio session with classic guided routines.', 'Viernes 17:00', 20, 'DANCE', 3),
(126, 'Crossfit', 'Functional high-intensity class with varied movements.', 'Viernes 18:00', 16, 'FUNCTIONAL', 3),
(127, 'Core Express', 'Express core-focused class to strengthen the midsection.', 'Viernes 19:00', 15, 'EXPRESS', 3),
(128, 'Pilates', 'Body and mind class to improve posture and core strength.', 'Viernes 21:00', 18, 'BODY_AND_MIND', 3),

(129, 'Step Functional', 'Functional session combining step and conditioning.', 'Sábado 09:00', 18, 'FUNCTIONAL', 3),
(130, 'Motriz Express', 'Short intense express session focused on mobility and control.', 'Sábado 10:00', 14, 'EXPRESS', 3);

-- BOOKINGS
-- Sin reservas seed por ahora.
-- Se crearán desde la funcionalidad real de reservas.