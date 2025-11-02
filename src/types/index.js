/**
 * Data models for the workout tracking application
 */

/**
 * Available muscle groups for exercise categorization
 */
export const MuscleGroup = {
  OBERKOERPER: 'Oberkörper',
  UNTERKOERPER: 'Unterkörper',
  GANZKOERPER: 'Ganzkörper',
  PUSH: 'Push',
  PULL: 'Pull',
  BEINE: 'Beine',
  BAUCH: 'Bauch',
  BRUST: 'Brust',
  RUECKEN: 'Rücken',
  SCHULTERN: 'Schultern',
  BIZEPS: 'Bizeps',
  TRIZEPS: 'Trizeps',
  NACKEN: 'Nacken'
};

/**
 * Available exercises for each muscle group
 */
export const EXERCISES_BY_MUSCLE_GROUP = {
  [MuscleGroup.BAUCH]: [
    'Situps',
    'Crunches',
    'Plank',
    'Russian Twists',
    'Mountain Climbers',
    'Leg Raises'
  ],
  [MuscleGroup.BEINE]: [
    'Kniebeuge',
    'Ausfallschritte',
    'Beinpresse',
    'Beinbeugemaschine',
    'Beinstrecker',
    'Abduktionsmaschine',
    'Adduktionsmaschine',
    'Deadlift'
  ],
  [MuscleGroup.BIZEPS]: [
    'Bizeps Curls',
    'Hammer Curls',
    'Concentration Curls',
    'Preacher Curls'
  ],
  [MuscleGroup.BRUST]: [
    'Bankdrücken',
    'Schrägbankdrücken',
    'Dips',
    'Butterfly',
    'Push-ups'
  ],
  [MuscleGroup.NACKEN]: [
    'Nackenübungen',
    'Shrugs',
    'Face Pulls'
  ],
  [MuscleGroup.RUECKEN]: [
    'Lat Pulldown',
    'Rudern',
    'Klimmzüge',
    'Hyperextensions',
    'Deadlift'
  ],
  [MuscleGroup.SCHULTERN]: [
    'Schulterdrücken',
    'Seitheben',
    'Frontheben',
    'Reverse Flys'
  ],
  [MuscleGroup.TRIZEPS]: [
    'Trizeps Dips',
    'Trizeps Extensions',
    'Close Grip Bench Press',
    'Overhead Extensions'
  ],
  [MuscleGroup.OBERKOERPER]: [
    'Bankdrücken',
    'Schrägbankdrücken',
    'Bizeps Curls',
    'Trizeps Dips',
    'Schulterdrücken',
    'Lat Pulldown',
    'Rudern'
  ],
  [MuscleGroup.UNTERKOERPER]: [
    'Kniebeuge',
    'Ausfallschritte',
    'Beinpresse',
    'Beinbeugemaschine',
    'Beinstrecker',
    'Deadlift'
  ],
  [MuscleGroup.GANZKOERPER]: [
    'Burpees',
    'Thrusters',
    'Clean and Press',
    'Turkish Get-ups'
  ],
  [MuscleGroup.PUSH]: [
    'Bankdrücken',
    'Schulterdrücken',
    'Trizeps Dips',
    'Push-ups'
  ],
  [MuscleGroup.PULL]: [
    'Lat Pulldown',
    'Rudern',
    'Klimmzüge',
    'Bizeps Curls'
  ]
};

/**
 * Statistics data for visualization
 */
export const StatMetric = {
  MAX_WEIGHT: 'Maximalgewicht',
  TOTAL_VOLUME: 'Gesamtvolumen',
  AVG_WEIGHT: 'Durchschnittsgewicht',
  TOTAL_REPS: 'Gesamtwiederholungen'
};
