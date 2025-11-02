/**
 * Statistics utility functions
 * 
 * Diese Datei enthält alle reinen Berechnungsfunktionen für Statistiken.
 * Keine API-Aufrufe, keine UI-Logik - nur Mathematik!
 */

/**
 * Berechnet einen Metrik-Wert aus den Sets einer Übung
 * 
 * Diese Funktion nimmt ein Array von Sets und berechnet je nach Metrik-Typ
 * einen bestimmten Wert. Z.B. das höchste Gewicht oder das Gesamtvolumen.
 * 
 * @param {Array} sets - Array von Sets: [{weight: "80", reps: "10"}, {weight: "85", reps: "8"}]
 * @param {string} metric - Welche Metrik berechnet werden soll ('maxWeight', 'totalVolume', etc.)
 * @returns {number} Berechneter Wert (z.B. 85 für maxWeight)
 */
export const calculateMetricValue = (sets, metric) => {
  // Sicherheitscheck: Keine Sets = Wert 0
  if (!sets || sets.length === 0) return 0;
  
  switch (metric) {
    case 'maxWeight':
      // Finde das höchste Gewicht aus allen Sets
      // Sets: [{weight: "80"}, {weight: "85"}] → Ergebnis: 85
      return Math.max(...sets.map(set => parseFloat(set.weight) || 0));
      
    case 'totalVolume':
      // Berechne Gesamtvolumen: Gewicht × Wiederholungen für jeden Satz
      // Sets: [{weight: "80", reps: "10"}, {weight: "85", reps: "8"}]
      // Berechnung: (80×10) + (85×8) = 800 + 680 = 1480
      return sets.reduce((total, set) => {
        const weight = parseFloat(set.weight) || 0;
        const reps = parseInt(set.reps) || 0;
        return total + (weight * reps);
      }, 0);
      
    case 'avgWeight':
      // Berechne Durchschnittsgewicht aller Sets
      // Sets: [{weight: "80"}, {weight: "85"}] → (80+85)/2 = 82.5
      const totalWeight = sets.reduce((total, set) => total + (parseFloat(set.weight) || 0), 0);
      return totalWeight / sets.length;
      
    case 'totalReps':
      // Summiere alle Wiederholungen aus allen Sets
      // Sets: [{reps: "10"}, {reps: "8"}] → 10+8 = 18
      return sets.reduce((total, set) => total + (parseInt(set.reps) || 0), 0);
      
    case 'avgReps':
      // Berechne Durchschnittswiederholungen pro Satz
      // Sets: [{reps: "10"}, {reps: "8"}] → (10+8)/2 = 9
      const totalReps = sets.reduce((total, set) => total + (parseInt(set.reps) || 0), 0);
      return totalReps / sets.length;
    case 'totalSets':
      return sets.length;
    case 'workoutFrequency':
      return 1; // Each workout counts as 1 occurrence
    default:
      return 0;
  }
};

/**
 * Filter workouts by time period
 * @param {Array} workouts - Array of workouts
 * @param {string} period - Time period
 * @returns {Array} Filtered workouts
 */
export const filterWorkoutsByPeriod = (workouts, period) => {
  const now = new Date();
  let cutoffDate;
  
  switch (period) {
    case '1M':
    case '3M':
      cutoffDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      break;
    case '6M':
      cutoffDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
      break;
    case '1Y':
      cutoffDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      break;
    case 'all':
    default:
      return workouts;
  }
  
  return workouts.filter(workout => new Date(workout.date) >= cutoffDate);
};

/**
 * Group statistics by time period
 * @param {Array} stats - Array of statistics
 * @param {string} grouping - Grouping type
 * @returns {Array} Grouped statistics
 */
export const groupStatsByPeriod = (stats, grouping) => {
  const grouped = {};
  
  stats.forEach(stat => {
    const date = new Date(stat.date);
    let groupKey;
    
    switch (grouping) {
      case 'day':
        groupKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
        break;
      case 'week':
        // Get start of week (Monday)
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay() + 1);
        groupKey = startOfWeek.toISOString().split('T')[0];
        break;
      case 'month':
        groupKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      default:
        groupKey = date.toISOString().split('T')[0];
    }
    
    if (!grouped[groupKey]) {
      grouped[groupKey] = {
        date: groupKey,
        values: [],
        metric: stat.metric
      };
    }
    
    grouped[groupKey].values.push(stat.value);
  });
  
  // Calculate final values for each group
  return Object.values(grouped).map(group => {
    let finalValue = 0;
    
    // Determine how to aggregate values based on metric
    switch (group.metric) {
      case 'maxWeight':
        finalValue = Math.max(...group.values);
        break;
      case 'totalVolume':
      case 'totalReps':
      case 'totalSets':
      case 'totalWorkouts':
      case 'totalExercises':
        finalValue = group.values.reduce((sum, val) => sum + val, 0);
        break;
      case 'avgWeight':
      case 'avgReps':
      case 'avgWorkoutDuration':
        finalValue = group.values.reduce((sum, val) => sum + val, 0) / group.values.length;
        break;
      case 'workoutFrequency':
        finalValue = group.values.length; // Count occurrences
        break;
      default:
        finalValue = Math.max(...group.values);
    }
    
    return {
      date: group.date,
      value: Math.round(finalValue * 100) / 100, // Round to 2 decimal places
      metric: group.metric
    };
  });
};
