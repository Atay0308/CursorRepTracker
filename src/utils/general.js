/**
 * General utility functions
 */

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * LocalStorage utility functions for workout persistence
 */

/**
 * Save workout to localStorage (only one draft workout at a time)
 * @param {Object} workout - Workout object to save
 */
export const saveWorkoutToLocalStorage = (workout) => {
  try {
    // First, clear any existing draft workouts
    clearAllDraftWorkouts();
    
    // Save the new draft workout
    const key = 'workout_draft_current';
    localStorage.setItem(key, JSON.stringify(workout));
  } catch (error) {
    console.error('Error saving workout to localStorage:', error);
  }
};

/**
 * Load workout from localStorage
 * @param {string} workoutId - ID of the workout to load (ignored for draft workouts)
 * @returns {Object|null} Workout object or null if not found
 */
export const loadWorkoutFromLocalStorage = (workoutId) => {
  try {
    const key = 'workout_draft_current';
    const saved = localStorage.getItem(key);
    if (saved) {
      const workout = JSON.parse(saved);
      return workout;
    }
    return null;
  } catch (error) {
    console.error('Error loading workout from localStorage:', error);
    return null;
  }
};

/**
 * Remove workout from localStorage
 * @param {string} workoutId - ID of the workout to remove (ignored for draft workouts)
 */
export const removeWorkoutFromLocalStorage = (workoutId) => {
  try {
    const key = 'workout_draft_current';
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing workout from localStorage:', error);
  }
};

/**
 * Check if workout exists in localStorage
 * @param {string} workoutId - ID of the workout to check (ignored for draft workouts)
 * @returns {boolean} True if workout exists in localStorage
 */
export const hasWorkoutInLocalStorage = (workoutId) => {
  try {
    const key = 'workout_draft_current';
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error('Error checking workout in localStorage:', error);
    return false;
  }
};

/**
 * Get the current workout from localStorage (only one workout is stored at a time)
 * @returns {Object|null} Current workout or null if none found
 */
export const getCurrentWorkoutFromLocalStorage = () => {
  try {
    const key = 'workout_draft_current';
    const workoutData = localStorage.getItem(key);
    if (workoutData) {
      try {
        const workout = JSON.parse(workoutData);
        console.log('Current workout loaded from localStorage:', key);
        return workout;
      } catch (parseError) {
        console.error('Error parsing workout from localStorage:', parseError);
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting current workout from localStorage:', error);
    return null;
  }
};

/**
 * Clear all draft workouts from localStorage
 * This ensures only one draft workout exists at a time
 */
export const clearAllDraftWorkouts = () => {
  try {
    // Remove all keys that start with 'workout_draft_'
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('workout_draft_')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing draft workouts from localStorage:', error);
  }
};