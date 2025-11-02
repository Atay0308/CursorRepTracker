/**
 * Statistics Configuration
 * 
 * Konfigurierbare Metriken für die Statistik-Seite.
 * Diese Datei kann später erweitert werden, um neue Metriken hinzuzufügen.
 */

/**
 * Metriken-Konfiguration für verschiedene Bereiche
 */
export const METRICS_CONFIG = {
  general: [
    {
      value: 'totalWorkouts',
      label: 'Gesamte Workouts',
      unit: 'workouts',
      description: 'Anzahl aller durchgeführten Workouts'
    },
    {
      value: 'totalExercises',
      label: 'Gesamte Übungen',
      unit: 'exercises',
      description: 'Anzahl aller ausgeführten Übungen'
    },
    {
      value: 'avgWorkoutDuration',
      label: 'Durchschnittliche Trainingsdauer',
      unit: 'min',
      description: 'Durchschnittliche Dauer pro Workout'
    },
    {
      value: 'totalVolume',
      label: 'Gesamtes Volumen',
      unit: 'kg',
      description: 'Gesamtes Trainingsvolumen (Gewicht × Wiederholungen)'
    },
    {
      value: 'avgWorkoutsPerWeek',
      label: 'Durchschnittliche Workouts pro Woche',
      unit: 'workouts',
      description: 'Durchschnittliche Anzahl Workouts pro Woche'
    }
  ],
  
  muscle: [
    {
      value: 'volume',
      label: 'Volumen pro Muskelgruppe',
      unit: 'kg',
      description: 'Gesamtes Volumen für diese Muskelgruppe'
    },
    {
      value: 'maxWeight',
      label: 'Maximales Gewicht',
      unit: 'kg',
      description: 'Höchstes verwendetes Gewicht für diese Muskelgruppe'
    },
    {
      value: 'totalSets',
      label: 'Gesamte Sätze',
      unit: 'sets',
      description: 'Anzahl aller Sätze für diese Muskelgruppe'
    },
    {
      value: 'avgReps',
      label: 'Durchschnittliche Wiederholungen',
      unit: 'reps',
      description: 'Durchschnittliche Wiederholungen pro Satz'
    },
    {
      value: 'frequency',
      label: 'Trainingshäufigkeit',
      unit: 'times',
      description: 'Wie oft diese Muskelgruppe trainiert wurde'
    }
  ],
  
  exercise: [
    {
      value: 'maxWeight',
      label: 'Maximalgewichts-Fortschritt',
      unit: 'kg',
      description: 'Fortschritt des maximalen Gewichts über Zeit'
    },
    {
      value: 'volume',
      label: 'Volumen-Fortschritt',
      unit: 'kg',
      description: 'Fortschritt des Trainingsvolumens über Zeit'
    },
    {
      value: 'totalSets',
      label: 'Satz-Fortschritt',
      unit: 'sets',
      description: 'Fortschritt der Satzanzahl über Zeit'
    },
    {
      value: 'avgReps',
      label: 'Wiederholungs-Fortschritt',
      unit: 'reps',
      description: 'Fortschritt der durchschnittlichen Wiederholungen'
    },
    {
      value: 'frequency',
      label: 'Trainingshäufigkeit',
      unit: 'times',
      description: 'Wie oft diese Übung ausgeführt wurde'
    },
    {
      value: 'avgWeight',
      label: 'Durchschnittsgewicht-Fortschritt',
      unit: 'kg',
      description: 'Fortschritt des durchschnittlichen Gewichts'
    }
  ]
};

/**
 * Verfügbare Zeiträume
 */
export const PERIODS_CONFIG = [
  { value: '1M', label: '1 MONAT', days: 30 },
  { value: '6M', label: '6 MONATE', days: 180 },
  { value: '1Y', label: '1 JAHR', days: 365 }
];

/**
 * Verfügbare Gruppierungen
 */
export const GROUPINGS_CONFIG = [
  { value: 'day', label: 'Tag', description: 'Tägliche Gruppierung' },
  { value: 'week', label: 'Woche', description: 'Wöchentliche Gruppierung' },
  { value: 'month', label: 'Monat', description: 'Monatliche Gruppierung' }
];

/**
 * Verfügbare Bereiche
 */
export const AREAS_CONFIG = [
  { value: 'general', label: 'ALLGEMEIN', description: 'Allgemeine Statistiken' },
  { value: 'muscle', label: 'MUSKELN', description: 'Muskelgruppen-spezifische Statistiken' },
  { value: 'exercise', label: 'ÜBUNGEN', description: 'Übungs-spezifische Statistiken' }
];

/**
 * Hilfsfunktionen für Metriken
 */

/**
 * Holt Metriken für einen bestimmten Bereich
 * @param {string} area - Bereich (general, muscle, exercise)
 * @returns {Array} Array von Metriken
 */
export const getMetricsForArea = (area) => {
  return METRICS_CONFIG[area] || [];
};

/**
 * Holt eine spezifische Metrik
 * @param {string} area - Bereich
 * @param {string} metricValue - Metrik-Wert
 * @returns {Object|null} Metrik-Objekt oder null
 */
export const getMetric = (area, metricValue) => {
  const metrics = getMetricsForArea(area);
  return metrics.find(metric => metric.value === metricValue) || null;
};

/**
 * Validiert ob eine Metrik für einen Bereich existiert
 * @param {string} area - Bereich
 * @param {string} metricValue - Metrik-Wert
 * @returns {boolean} True wenn Metrik existiert
 */
export const isValidMetric = (area, metricValue) => {
  return getMetric(area, metricValue) !== null;
};
