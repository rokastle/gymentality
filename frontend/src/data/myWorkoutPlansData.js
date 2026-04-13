import basicStrengthIcon from "../assets/icons/focus_freeWeightArea_180x180.png";
import calendarIcon from "../assets/icons/icon_calendar_180x180.png";
import energyIcon from "../assets/icons/icon_energy_180x180.png";
import personalTrainingIcon from "../assets/icons/focus_perTraining_180x180.png";
import mealIcon from "../assets/icons/icon_meal_180x180.png";
import breakfastImage from "../assets/images/img_Breakfast.png";
import midMorningSnackImage from "../assets/images/img_Mid_morning_snack.png";
import lunchImage from "../assets/images/img_lunch.png";
import dinnerImage from "../assets/images/img_dinner.png";

import alternateRaiseVideo from "../assets/videos/workout/alternate_raise.mp4";
import rearLateralRaiseVideo from "../assets/videos/workout/rear_lateral_raise.mp4";
import frontPlankVideo from "../assets/videos/workout/front_plank.mp4";
import airTwistingCrunchVideo from "../assets/videos/workout/air_twisting_crunch.mp4";
import lyingLegRiseVideo from "../assets/videos/workout/lying_leg_rise.mp4";
import walkMachineVideo from "../assets/videos/workout/walk_machine.mp4";
import walkEllipticalVideo from "../assets/videos/workout/walk_elliptical.mp4";
import walkingTreadmillVideo from "../assets/videos/workout/walking_treadmill.mp4";
import walkBikeVideo from "../assets/videos/workout/walk_bike.mp4";

import burpeeVideo from "../assets/videos/workout/burpee.mp4";
import jumpRopeVideo from "../assets/videos/workout/jump_rope.mp4";
import jumpingJackVideo from "../assets/videos/workout/jumping_jack.mp4";
import mountainClimberVideo from "../assets/videos/workout/mountain_climber.mp4";
import rowingMachineVideo from "../assets/videos/workout/rowing_machine.mp4";
import runningOnTheStopVideo from "../assets/videos/workout/running_on_the_stop.mp4";
import runningTreadmillVideo from "../assets/videos/workout/running_treadmill.mp4";
import spinningBikeVideo from "../assets/videos/workout/spinning_bike.mp4";
import stepmillVideo from "../assets/videos/workout/stepmill.mp4";

import barbellSquatVideo from "../assets/videos/workout/barbell_squat.mp4";
import barbellBenchPressVideo from "../assets/videos/workout/barbell_bench_press.mp4";
import barbellLungeVideo from "../assets/videos/workout/barbell_lunge.mp4";
import overheadPressVideo from "../assets/videos/workout/overhead_press.mp4";
import bentOverRowVideo from "../assets/videos/workout/bent_over_row.mp4";
import benchOverRowVideo from "../assets/videos/workout/bench_over_row.mp4";
import weightedPullUpVideo from "../assets/videos/workout/weighted_pull_up.mp4";
import lSitPullUpVideo from "../assets/videos/workout/l_sit_pull_up.mp4";
import kettlebellSwingVideo from "../assets/videos/workout/Kettlebell_swing.mp4";

import dumbbellPressVideo from "../assets/videos/workout/dumbbell_press.mp4";
import dumbbellFlyVideo from "../assets/videos/workout/dumbbell_fly.mp4";
import cableSeatedRowVideo from "../assets/videos/workout/cable_seated_row.mp4";
import inclineRowVideo from "../assets/videos/workout/incline_row.mp4";
import bentOverReverseRowVideo from "../assets/videos/workout/bent_over_reverse_row.mp4";
import barbellCurlVideo from "../assets/videos/workout/barbell_curl.mp4";
import dumbbellCurlVideo from "../assets/videos/workout/dumbbell_curl.mp4";
import tricepsDipVideo from "../assets/videos/workout/triceps_dip.mp4";
import inclineRearLateralRaiseVideo from "../assets/videos/workout/incline_rear_lateral_raise.mp4";

import barbellUprightRowVideo from "../assets/videos/workout/barbell_upright_row.mp4";
import chinUpVideo from "../assets/videos/workout/chin_up.mp4";
import wheelRolloutVideo from "../assets/videos/workout/wheel_rollout.mp4";
import kettlebellSquatVideo from "../assets/videos/workout/Kettlebell_squat.mp4";
import dumbbellPulloverVideo from "../assets/videos/workout/dumbbell_pullover.mp4";
import kettlebellSeesawPressVideo from "../assets/videos/workout/Kettlebell_seesaw_press.mp4";
import renegadeRowVideo from "../assets/videos/workout/renegade_row.mp4";
import wideGridRearPullUpVideo from "../assets/videos/workout/wide_grid_rear_pull_up.mp4";
import palmRotationalRowVideo from "../assets/videos/workout/palm_rotational_row.mp4";

export const basicPlanData = {
  title: "BASIC PLAN",
  description:
    "This training plan is an orientative guide that requires supervision from our coaches. Please consult us for the correct execution technique.",
  routineTitle: "TONING ROUTINE",
  routineMeta: "9 recommended exercises - 40 min estimated",
  metrics: [
    {
      id: "level",
      icon: basicStrengthIcon,
      text: "BEGINNER-INTERMEDIATE",
    },
    {
      id: "frequency",
      icon: calendarIcon,
      text: "3-4 DAYS/WEEK",
    },
    {
      id: "rest",
      icon: energyIcon,
      text: "60 SEC REST",
    },
  ],
  tabs: [
    {
      id: "toning",
      label: "TONING",
      sectionTitle: "TONING EXERCISES",
      routineTitle: "TONING ROUTINE",
      routineMeta: "9 recommended exercises - 40 min estimated",
      exercises: [
        {
          id: "alternate_raise",
          title: "ALTERNATE RAISE",
          meta: "3 Sets · 12 - 15 reps",
          video: alternateRaiseVideo,
        },
        {
          id: "rear_lateral_raise",
          title: "REAR LATERAL RAISE",
          meta: "3 Sets · 12 - 15 reps",
          video: rearLateralRaiseVideo,
        },
        {
          id: "front_plank",
          title: "FRONT PLANK",
          meta: "3 Sets · 30 - 45 sec",
          video: frontPlankVideo,
        },
        {
          id: "air_twisting_crunch",
          title: "AIR TWISTING CRUNCH",
          meta: "3 Sets · 20 sec",
          video: airTwistingCrunchVideo,
        },
        {
          id: "lying_leg_rise",
          title: "LYING LEG RISE",
          meta: "3 Sets · 12 - 15 reps",
          video: lyingLegRiseVideo,
        },
        {
          id: "walk_machine",
          title: "WALK MACHINE",
          meta: "20 - 30 min",
          video: walkMachineVideo,
        },
        {
          id: "walk_elliptical",
          title: "WALK ELLIPTICAL",
          meta: "20 - 25 min",
          video: walkEllipticalVideo,
        },
        {
          id: "walking_treadmill",
          title: "WALKING TREADMILL",
          meta: "20 - 30 min",
          video: walkingTreadmillVideo,
        },
        {
          id: "walk_bike",
          title: "WALK BIKE",
          meta: "20 - 30 min",
          video: walkBikeVideo,
        },
      ],
    },
    {
      id: "definition",
      label: "DEFINITION",
      sectionTitle: "DEFINITION EXERCISES",
      routineTitle: "DEFINITION ROUTINE",
      routineMeta: "9 recommended exercises - 40 min estimated",
      exercises: [
        {
          id: "burpee",
          title: "BURPEE",
          meta: "3 Sets · 10 - 15 reps",
          video: burpeeVideo,
        },
        {
          id: "jump_rope",
          title: "JUMP ROPE",
          meta: "3 Sets · 1 min",
          video: jumpRopeVideo,
        },
        {
          id: "jumping_jack",
          title: "JUMPING JACK",
          meta: "3 Sets · 30 - 45 sec",
          video: jumpingJackVideo,
        },
        {
          id: "mountain_climber",
          title: "MOUNTAIN CLIMBER",
          meta: "3 Sets · 30 - 40 sec",
          video: mountainClimberVideo,
        },
        {
          id: "rowing_machine",
          title: "ROWING MACHINE",
          meta: "10 - 15 min",
          video: rowingMachineVideo,
        },
        {
          id: "running_on_the_stop",
          title: "RUNNING ON THE STOP",
          meta: "3 Sets · 40 sec",
          video: runningOnTheStopVideo,
        },
        {
          id: "running_treadmill",
          title: "RUNNING TREADMILL",
          meta: "15 - 20 min",
          video: runningTreadmillVideo,
        },
        {
          id: "spinning_bike",
          title: "SPINNING BIKE",
          meta: "15 - 20 min",
          video: spinningBikeVideo,
        },
        {
          id: "stepmill",
          title: "STEPMILL",
          meta: "10 - 15 min",
          video: stepmillVideo,
        },
      ],
    },
    {
      id: "strength",
      label: "STRENGTH",
      sectionTitle: "STRENGTH EXERCISES",
      routineTitle: "STRENGTH ROUTINE",
      routineMeta: "9 recommended exercises - 50 min estimated",
      exercises: [
        {
          id: "barbell_squat",
          title: "BARBELL SQUAT",
          meta: "4 Sets · 4 - 6 reps",
          video: barbellSquatVideo,
        },
        {
          id: "barbell_bench_press",
          title: "BARBELL BENCH PRESS",
          meta: "4 Sets · 4 - 6 reps",
          video: barbellBenchPressVideo,
        },
        {
          id: "barbell_lunge",
          title: "BARBELL LUNGE",
          meta: "4 Sets · 6 - 8 reps per leg",
          video: barbellLungeVideo,
        },
        {
          id: "overhead_press",
          title: "OVERHEAD PRESS",
          meta: "4 Sets · 4 - 6 reps",
          video: overheadPressVideo,
        },
        {
          id: "bent_over_row",
          title: "BENT OVER ROW",
          meta: "4 Sets · 5 - 6 reps",
          video: bentOverRowVideo,
        },
        {
          id: "bench_over_row",
          title: "BENCH OVER ROW",
          meta: "4 Sets · 5 - 6 reps",
          video: benchOverRowVideo,
        },
        {
          id: "weighted_pull_up",
          title: "WEIGHTED PULL UP",
          meta: "4 Sets · 4 - 6 reps",
          video: weightedPullUpVideo,
        },
        {
          id: "l_sit_pull_up",
          title: "L-SIT PULL UP",
          meta: "4 Sets · 4 - 6 reps",
          video: lSitPullUpVideo,
        },
        {
          id: "kettlebell_swing",
          title: "KETTLEBELL SWING",
          meta: "4 Sets · 12 - 15 reps",
          video: kettlebellSwingVideo,
        },
      ],
    },
    {
      id: "hypertrophy",
      label: "HYPERTROPHY",
      sectionTitle: "HYPERTROPHY EXERCISES",
      routineTitle: "HYPERTROPHY ROUTINE",
      routineMeta: "9 recommended exercises - 55 min estimated",
      exercises: [
        {
          id: "dumbbell_press",
          title: "DUMBBELL PRESS",
          meta: "4 Sets · 8 - 12 reps",
          video: dumbbellPressVideo,
        },
        {
          id: "dumbbell_fly",
          title: "DUMBBELL FLY",
          meta: "3 Sets · 10 - 12 reps",
          video: dumbbellFlyVideo,
        },
        {
          id: "cable_seated_row",
          title: "CABLE SEATED ROW",
          meta: "4 Sets · 8 - 12 reps",
          video: cableSeatedRowVideo,
        },
        {
          id: "incline_row",
          title: "INCLINE ROW",
          meta: "4 Sets · 8 - 12 reps",
          video: inclineRowVideo,
        },
        {
          id: "bent_over_reverse_row",
          title: "BENT OVER REVERSE ROW",
          meta: "3 Sets · 10 - 12 reps",
          video: bentOverReverseRowVideo,
        },
        {
          id: "barbell_curl",
          title: "BARBELL CURL",
          meta: "3 Sets · 8 - 12 reps",
          video: barbellCurlVideo,
        },
        {
          id: "dumbbell_curl",
          title: "DUMBBELL CURL",
          meta: "3 Sets · 10 - 12 reps",
          video: dumbbellCurlVideo,
        },
        {
          id: "triceps_dip",
          title: "TRICEPS DIP",
          meta: "3 Sets · 8 - 12 reps",
          video: tricepsDipVideo,
        },
        {
          id: "incline_rear_lateral_raise",
          title: "INCLINE REAR LATERAL RAISE",
          meta: "3 Sets · 12 - 15 reps",
          video: inclineRearLateralRaiseVideo,
        },
      ],
    },
  ],
};

const personalWeeklyDays = [
  {
    id: "monday",
    label: "MONDAY",
    dayNumber: 13,
    title: "Chest + Shoulders + Triceps + Core Day",
    sections: [
      {
        title: "CHEST",
        exercises: [
          { id: "barbell_bench_press", title: "BARBELL BENCH PRESS", meta: "4 Sets · 8 - 10 reps", video: barbellBenchPressVideo },
          { id: "dumbbell_press", title: "DUMBBELL PRESS", meta: "3 Sets · 10 - 12 reps", video: dumbbellPressVideo },
          { id: "dumbbell_fly", title: "DUMBBELL FLY", meta: "3 Sets · 10 - 12 reps", video: dumbbellFlyVideo },
        ],
      },
      {
        title: "SHOULDERS",
        exercises: [
          { id: "overhead_press", title: "OVERHEAD PRESS", meta: "4 Sets · 8 - 10 reps", video: overheadPressVideo },
          { id: "rear_lateral_raise", title: "REAR LATERAL RAISE", meta: "3 Sets · 12 - 15 reps", video: rearLateralRaiseVideo },
          { id: "incline_rear_lateral_raise", title: "INCLINE REAR LATERAL RAISE", meta: "3 Sets · 12 - 15 reps", video: inclineRearLateralRaiseVideo },
          { id: "barbell_upright_row", title: "BARBELL UPRIGHT ROW", meta: "3 Sets · 10 - 12 reps", video: barbellUprightRowVideo },
        ],
      },
      {
        title: "TRICEPS",
        exercises: [
          { id: "triceps_dip", title: "TRICEPS DIP", meta: "3 Sets · 10 - 15 reps", video: tricepsDipVideo },
        ],
      },
      {
        title: "CORE",
        exercises: [
          { id: "front_plank", title: "FRONT PLANK", meta: "3 Sets · 30 - 45 sec", video: frontPlankVideo },
        ],
      },
    ],
  },
  {
    id: "tuesday",
    label: "TUESDAY",
    dayNumber: 14,
    title: "Back + Biceps + Core Day",
    sections: [
      {
        title: "BACK",
        exercises: [
          { id: "bent_over_row", title: "BENT OVER ROW", meta: "4 Sets · 8 - 10 reps", video: bentOverRowVideo },
          { id: "bench_over_row", title: "BENCH OVER ROW", meta: "3 Sets · 10 - 12 reps", video: benchOverRowVideo },
          { id: "cable_seated_row", title: "CABLE SEATED ROW", meta: "3 Sets · 10 - 12 reps", video: cableSeatedRowVideo },
          { id: "chin_up", title: "CHIN UP", meta: "3 Sets · 6 - 10 reps", video: chinUpVideo },
          { id: "weighted_pull_up", title: "WEIGHTED PULL UP", meta: "3 Sets · 6 - 8 reps", video: weightedPullUpVideo },
          { id: "palm_rotational_row", title: "PALM ROTATIONAL ROW", meta: "3 Sets · 10 - 12 reps", video: palmRotationalRowVideo },
        ],
      },
      {
        title: "BICEPS",
        exercises: [
          { id: "barbell_curl", title: "BARBELL CURL", meta: "3 Sets · 10 - 12 reps", video: barbellCurlVideo },
          { id: "dumbbell_curl", title: "DUMBBELL CURL", meta: "3 Sets · 10 - 12 reps", video: dumbbellCurlVideo },
        ],
      },
      {
        title: "CORE",
        exercises: [
          { id: "wheel_rollout", title: "WHEEL ROLLOUT", meta: "3 Sets · 10 - 15 reps", video: wheelRolloutVideo },
        ],
      },
    ],
  },
  {
    id: "wednesday",
    label: "WEDNESDAY",
    dayNumber: 15,
    title: "Legs + Cardio + Core Day",
    sections: [
      {
        title: "LEGS",
        exercises: [
          { id: "barbell_squat", title: "BARBELL SQUAT", meta: "4 Sets · 8 - 10 reps", video: barbellSquatVideo },
          { id: "barbell_lunge", title: "BARBELL LUNGE", meta: "3 Sets · 10 - 12 reps per leg", video: barbellLungeVideo },
          { id: "kettlebell_squat", title: "KETTLEBELL SQUAT", meta: "3 Sets · 10 - 12 reps", video: kettlebellSquatVideo },
          { id: "kettlebell_swing", title: "KETTLEBELL SWING", meta: "3 Sets · 15 - 20 reps", video: kettlebellSwingVideo },
        ],
      },
      {
        title: "CARDIO",
        exercises: [
          { id: "jump_rope", title: "JUMP ROPE", meta: "3 Sets · 1 min", video: jumpRopeVideo },
          { id: "stepmill", title: "STEPMILL", meta: "10 - 15 min", video: stepmillVideo },
          { id: "running_treadmill", title: "RUNNING TREADMILL", meta: "10 - 15 min", video: runningTreadmillVideo },
        ],
      },
      {
        title: "CORE & FINISHERS",
        exercises: [
          { id: "mountain_climber", title: "MOUNTAIN CLIMBER", meta: "3 Sets · 30 - 40 sec", video: mountainClimberVideo },
          { id: "lying_leg_rise", title: "LYING LEG RISE", meta: "3 Sets · 12 - 15 reps", video: lyingLegRiseVideo },
        ],
      },
    ],
  },
  {
    id: "thursday",
    label: "THURSDAY",
    dayNumber: 16,
    title: "Active Rest",
    sections: [
      {
        title: "LIGHT CARDIO / RECOVERY",
        exercises: [
          { id: "walk_machine", title: "WALK MACHINE", meta: "20 - 30 min", video: walkMachineVideo },
          { id: "walk_elliptical", title: "WALK ELLIPTICAL", meta: "20 min", video: walkEllipticalVideo },
          { id: "walking_treadmill", title: "WALKING TREADMILL", meta: "15 - 20 min light", video: walkingTreadmillVideo },
        ],
      },
    ],
  },
  {
    id: "friday",
    label: "FRIDAY",
    dayNumber: 17,
    title: "Back + Chest + Shoulders + Triceps + Core Day",
    sections: [
      {
        title: "BACK",
        exercises: [
          { id: "incline_row", title: "INCLINE ROW", meta: "3 Sets · 10 - 12 reps", video: inclineRowVideo },
          { id: "bent_over_reverse_row", title: "BENT OVER REVERSE ROW", meta: "3 Sets · 10 - 12 reps", video: bentOverReverseRowVideo },
          { id: "l_sit_pull_up", title: "L-SIT PULL UP", meta: "3 Sets · 6 - 8 reps", video: lSitPullUpVideo },
        ],
      },
      {
        title: "CHEST",
        exercises: [
          { id: "barbell_bench_press", title: "BARBELL BENCH PRESS", meta: "3 Sets · 8 - 10 reps", video: barbellBenchPressVideo },
          { id: "dumbbell_pullover", title: "DUMBBELL PULLOVER", meta: "3 Sets · 10 - 12 reps", video: dumbbellPulloverVideo },
        ],
      },
      {
        title: "SHOULDERS",
        exercises: [
          { id: "kettlebell_seesaw_press", title: "KETTLEBELL SEESAW PRESS", meta: "3 Sets · 10 - 12 reps", video: kettlebellSeesawPressVideo },
          { id: "alternate_raise", title: "ALTERNATE RAISE", meta: "3 Sets · 10 - 12 reps", video: alternateRaiseVideo },
        ],
      },
      {
        title: "TRICEPS",
        exercises: [
          { id: "triceps_dip", title: "TRICEPS DIP", meta: "3 Sets · 10 - 15 reps", video: tricepsDipVideo },
        ],
      },
      {
        title: "CORE",
        exercises: [
          { id: "air_twisting_crunch", title: "AIR TWISTING CRUNCH", meta: "3 Sets · 15 - 20 reps", video: airTwistingCrunchVideo },
        ],
      },
    ],
  },
  {
    id: "saturday",
    label: "SATURDAY",
    dayNumber: 18,
    title: "Functional + Back + Cardio + Core Day",
    sections: [
      {
        title: "FUNCTIONAL",
        exercises: [
          { id: "burpee", title: "BURPEE", meta: "3 Sets · 10 - 15 reps", video: burpeeVideo },
          { id: "jumping_jack", title: "JUMPING JACK", meta: "3 Sets · 30 - 40 sec", video: jumpingJackVideo },
          { id: "running_on_the_stop", title: "RUNNING ON THE STOP", meta: "3 Sets · 40 sec", video: runningOnTheStopVideo },
          { id: "renegade_row", title: "RENEGADE ROW", meta: "3 Sets · 10 - 12 reps", video: renegadeRowVideo },
        ],
      },
      {
        title: "BACK",
        exercises: [
          { id: "wide_grid_rear_pull_up", title: "WIDE GRID REAR PULL UP", meta: "3 Sets · 6 - 10 reps", video: wideGridRearPullUpVideo },
        ],
      },
      {
        title: "CARDIO",
        exercises: [
          { id: "rowing_machine", title: "ROWING MACHINE", meta: "10 min", video: rowingMachineVideo },
          { id: "spinning_bike", title: "SPINNING BIKE", meta: "12 - 15 min", video: spinningBikeVideo },
        ],
      },
      {
        title: "CORE",
        exercises: [
          { id: "wheel_rollout", title: "WHEEL ROLLOUT", meta: "3 Sets · 10 - 12 reps", video: wheelRolloutVideo },
          { id: "front_plank", title: "FRONT PLANK", meta: "3 Sets · 45 - 60 sec", video: frontPlankVideo },
        ],
      },
    ],
  },
  {
    id: "sunday",
    label: "SUNDAY",
    dayNumber: 19,
    title: "Rest",
    sections: [
      {
        title: "OPTIONAL",
        exercises: [
          { id: "walk_bike", title: "WALK BIKE", meta: "20 - 30 min light", video: walkBikeVideo },
        ],
      },
    ],
  },
];

export const personalPlanData = {
  title: "PERSONAL PLAN",
  description:
    "Individualized workout routine with one-on-one coaching sessions. Real-time form correction, progress tracking, and constant adjustments to your program.",
  metrics: [
    { id: "warmup", label: "WARM-UP", value: "10 min" },
    { id: "workout", label: "WORKOUT", value: "45 min" },
    { id: "support", label: "COACH SUPPORT", icon: personalTrainingIcon },
  ],
  weeks: [
    { id: "week1", label: "WEEK 1", range: "Apr 1 - 5" },
    { id: "week2", label: "WEEK 2", range: "Apr 6 - 12" },
    { id: "week3", label: "WEEK 3", range: "Apr 13 - 19" },
    { id: "week4", label: "WEEK 4", range: "Apr 20 - 26" },
    { id: "week5", label: "WEEK 5", range: "Apr 27 - 30" },
  ],
  days: personalWeeklyDays,
};

export const integralPlanData = {
  ...personalPlanData,
  title: "INTEGRAL PLAN",
  description:
    "Complete monthly training and nutrition support. Your workout plan is combined with a structured daily meal plan to improve body composition, recovery, and energy levels.",
  metrics: [
    { id: "warmup", label: "WARM-UP", value: "10 min" },
    { id: "workout", label: "WORKOUT", value: "45 min" },
    { id: "support", label: "COACH SUPPORT", icon: personalTrainingIcon },
    { id: "nutrition", label: "DAILY NUTRITION", icon: mealIcon },
  ],
  nutrition: {
    title: "DAILY NUTRITION PLAN",
    meals: [
      {
        id: "breakfast",
        title: "BREAKFAST",
        image: breakfastImage,
        description: "Greek yogurt, oats, banana and nuts.",
      },
      {
        id: "mid-morning-snack",
        title: "MID-MORNING SNACK",
        image: midMorningSnackImage,
        description: "Wholegrain toast with turkey and fruit.",
      },
      {
        id: "lunch",
        title: "LUNCH",
        image: lunchImage,
        description: "Chicken breast, rice and sautéed vegetables.",
      },
      {
        id: "dinner",
        title: "DINNER",
        image: dinnerImage,
        description: "Salmon, baked potato and fresh salad.",
      },
    ],
    macros: [
      { id: "protein", label: "PROTEINS", grams: 165, colorVar: "var(--gm-macro-protein)" },
      { id: "carbs", label: "CARBS", grams: 220, colorVar: "var(--gm-macro-carbs)" },
      { id: "fats", label: "FATS", grams: 70, colorVar: "var(--gm-macro-fats)" },
    ],
  },
};