/**
 * Statistics Service
 * 
 * Dieser Service macht ALLE Berechnungen und Datenverarbeitung für Statistiken.
 * Er nimmt rohe Workout-Daten von statsAPI.js und verarbeitet sie zu Chart-Daten.
 * 
 * Warum getrennt von statsAPI?
 * - statsAPI: Nur HTTP-Requests, keine Logik
 * - statisticsService: Nur Berechnungen, keine HTTP-Requests
 * - Saubere Trennung der Verantwortlichkeiten
 */

import { 
  calculateMetricValue,    // Berechnet Metrik-Werte (z.B. maxWeight aus Sets)
  filterWorkoutsByPeriod, // Filtert Workouts nach Zeitraum
  groupStatsByPeriod      // Gruppiert Daten nach Zeitraum (Tag/Woche/Monat)
} from '../utils/calculations.js';

/**
 * statisticsService - Hauptservice für alle Statistik-Berechnungen
 */
export const statisticsService = {
  /**
   * Berechnet Statistiken für eine spezifische Übung
   * 
   * Diese Funktion nimmt alle Workouts und filtert sie nach Zeitraum.
   * Dann durchsucht sie alle Workouts nach der gewählten Übung und berechnet
   * die gewählte Metrik (z.B. Maximales Gewicht).
   * 
   * @param {Array} workouts - Alle Workouts aus der Datenbank
   * @param {string} exerciseName - Name der Übung (z.B. "Bankdrücken")
   * @param {string} metric - Welche Metrik berechnet werden soll ('maxWeight', 'totalVolume', etc.)
   * @param {string} period - Zeitraum ('1M', '3M', '6M', '1Y', 'all')
   * @param {string} grouping - Gruppierung ('day', 'week', 'month')
   * @returns {Array} Array von Datenpunkten für das Chart: [{date: "2024-10-01", value: 80}, ...]
   */
  getExerciseStats: (workouts, exerciseName, metric = 'maxWeight', period = '1M', grouping = 'week') => {
    // === SCHRITT 1: WORKOUTS NACH ZEITRAUM FILTERN ===
    // Nur Workouts aus dem gewählten Zeitraum verwenden
    const filteredWorkouts = filterWorkoutsByPeriod(workouts, period);
    
    // === SCHRITT 2: ÜBUNGS-STATISTIKEN SAMMELN ===
    // Durchsuche alle gefilterten Workouts nach der gewählten Übung
    const stats = [];
    filteredWorkouts.forEach(workout => {
      workout.exercises.forEach(exercise => {
        // Nur die gewählte Übung berücksichtigen
        if (exercise.name === exerciseName) {
          // Berechne den Metrik-Wert aus den Sets der Übung
          // z.B. für maxWeight: höchstes Gewicht aus allen Sets
          const value = calculateMetricValue(exercise.sets, metric);
          
          // Sammle Datenpunkt für das Chart
          stats.push({
            date: workout.date,        // Datum des Workouts
            value: value,             // Berechneter Wert (z.B. 80kg)
            metric: metric,           // Welche Metrik (z.B. "maxWeight")
            workoutId: workout.id     // ID des Workouts (für Debugging)
          });
        }
      });
    });
    
    // === SCHRITT 3: DATEN NACH GRUPPIERUNG ORGANISIEREN ===
    // Gruppiere die Daten nach dem gewählten Zeitraum (Tag/Woche/Monat)
    const groupedStats = groupStatsByPeriod(stats, grouping);
    
    // === SCHRITT 4: DATEN CHRONOLOGISCH SORTIEREN ===
    // Sortiere die Datenpunkte nach Datum für das Chart
    return groupedStats.sort((a, b) => new Date(a.date) - new Date(b.date));
  },

  /**
   * Get muscle group statistics with grouping
   * @param {Array} workouts - Array of all workouts
   * @param {string} muscleGroup - Name of the muscle group
   * @param {string} metric - Statistic metric (volume, maxWeight, totalSets, avgReps, frequency)
   * @param {string} period - Time period (1M, 6M, 1Y, all)
   * @param {string} grouping - Grouping type (day, week, month)
   * @returns {Array} Array of grouped data points
   */
  getMuscleStats: (workouts, muscleGroup, metric = 'volume', period = '1M', grouping = 'week') => {
    // Filter workouts by period
    const filteredWorkouts = filterWorkoutsByPeriod(workouts, period);
    
    // Process workouts to extract muscle group statistics
    const stats = [];
    filteredWorkouts.forEach(workout => {
      const muscleExercises = workout.exercises.filter(exercise => 
        exercise.muscleGroup === muscleGroup
      );
      
      if (muscleExercises.length > 0) {
        let value = 0;
        
        switch (metric) {
          case 'volume':
            // Sum up volume from all exercises in this muscle group
            muscleExercises.forEach(exercise => {
              value += calculateMetricValue(exercise.sets, 'totalVolume');
            });
            break;
          case 'maxWeight':
            // Find max weight across all exercises in this muscle group
            muscleExercises.forEach(exercise => {
              const exerciseMaxWeight = calculateMetricValue(exercise.sets, 'maxWeight');
              value = Math.max(value, exerciseMaxWeight);
            });
            break;
          case 'totalSets':
            // Sum up sets from all exercises in this muscle group
            muscleExercises.forEach(exercise => {
              value += calculateMetricValue(exercise.sets, 'totalSets');
            });
            break;
          case 'avgReps':
            // Calculate average reps across all exercises in this muscle group
            let totalReps = 0;
            let totalSets = 0;
            muscleExercises.forEach(exercise => {
              totalReps += calculateMetricValue(exercise.sets, 'totalReps');
              totalSets += calculateMetricValue(exercise.sets, 'totalSets');
            });
            value = totalSets > 0 ? totalReps / totalSets : 0;
            break;
          case 'frequency':
            value = 1; // Each workout counts as 1 occurrence
            break;
        }
        
        stats.push({
          date: workout.date,
          value: value,
          metric: metric,
          workoutId: workout.id
        });
      }
    });
    
    // Group data by specified grouping
    const groupedStats = groupStatsByPeriod(stats, grouping);
    
    return groupedStats.sort((a, b) => new Date(a.date) - new Date(b.date));
  },

  /**
   * Get general workout statistics with grouping
   * @param {Array} workouts - Array of all workouts
   * @param {string} metric - Statistic metric (totalWorkouts, totalExercises, avgWorkoutDuration, totalVolume, avgWorkoutsPerWeek)
   * @param {string} period - Time period (1M, 6M, 1Y, all)
   * @param {string} grouping - Grouping type (day, week, month)
   * @returns {Array} Array of grouped data points
   */
  getGeneralStats: (workouts, metric = 'totalWorkouts', period = '1M', grouping = 'week') => {
    // Filter workouts by period
    const filteredWorkouts = filterWorkoutsByPeriod(workouts, period);
    
    // Process workouts to extract general statistics over time
    const stats = [];
    filteredWorkouts.forEach(workout => {
      let value = 0;
      
      switch (metric) {
        case 'totalWorkouts':
          value = 1; // Each workout counts as 1
          break;
        case 'totalExercises':
          value = workout.exercises.length;
          break;
        case 'avgWorkoutDuration':
          if (workout.startTime && workout.endTime) {
            const start = new Date(`${workout.date}T${workout.startTime}`);
            const end = new Date(`${workout.date}T${workout.endTime}`);
            const duration = (end - start) / (1000 * 60); // Convert to minutes
            value = duration > 0 ? duration : 0;
          }
          break;
        case 'totalVolume':
          let workoutVolume = 0;
          workout.exercises.forEach(exercise => {
            exercise.sets.forEach(set => {
              const weight = parseFloat(set.weight) || 0;
              const reps = parseInt(set.reps) || 0;
              workoutVolume += weight * reps;
            });
          });
          value = workoutVolume;
          break;
        case 'avgWorkoutsPerWeek':
          value = 1; // Each workout counts as 1 for frequency calculation
          break;
      }
      
      stats.push({
        date: workout.date,
        value: value,
        metric: metric,
        workoutId: workout.id
      });
    });
    
    // Group data by specified grouping
    const groupedStats = groupStatsByPeriod(stats, grouping);
    
    return groupedStats.sort((a, b) => new Date(a.date) - new Date(b.date));
  }
};
