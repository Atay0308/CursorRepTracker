/**
 * Validation utility functions
 */

/**
 * Validate workout data
 * @param {Object} workout - Workout object
 * @returns {Object} Validation result with isValid and errors
 */
export const validateWorkout = (workout) => {
  const errors = [];
  
  // Handle null/undefined input
  if (!workout) {
    return {
      isValid: false,
      errors: ['Workout object is required']
    };
  }
  
  if (!workout.name || workout.name.trim() === '') {
    errors.push('Workout name is required');
  }
  
  if (!workout.date) {
    errors.push('Workout date is required');
  }
  
  if (!workout.startTime) {
    errors.push('Start time is required');
  }
  
  if (!workout.exercises || workout.exercises.length === 0) {
    errors.push('At least one exercise is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

/**
 * Validate exercise data
 * @param {Object} exercise - Exercise object
 * @returns {Object} Validation result with isValid and errors
 */
export const validateExercise = (exercise) => {
  const errors = [];
  
  // Handle null/undefined input
  if (!exercise) {
    return {
      isValid: false,
      errors: ['Exercise object is required']
    };
  }
  
  if (!exercise.name || exercise.name.trim() === '') {
    errors.push('Exercise name is required');
  }
  
  if (!exercise.muscleGroup) {
    errors.push('Muscle group is required');
  }
  
  if (!exercise.sets || exercise.sets.length === 0) {
    errors.push('At least one set is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

/**
 * Validate set data
 * @param {Object} set - Set object
 * @returns {Object} Validation result with isValid and errors
 */
export const validateSet = (set) => {
  const errors = [];
  
  // Handle null/undefined input
  if (!set) {
    return {
      isValid: false,
      errors: ['Set object is required']
    };
  }
  
  if (set.weight < 0) {
    errors.push('Weight cannot be negative');
  }
  
  if (set.reps <= 0) {
    errors.push('Reps must be greater than 0');
  }
  
  if (set.breakTime < 0) {
    errors.push('Break time cannot be negative');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};
