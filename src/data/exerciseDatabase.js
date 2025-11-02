/**
 * Exercise Database
 * 
 * Contains predefined exercises organized by muscle groups.
 * Used by the AddExerciseModal for exercise selection.
 * 
 * @fileoverview Exercise database with muscle groups and exercises
 */

/**
 * Available exercises organized by muscle groups
 * Each exercise contains only name and muscle group
 * Muscle group names match the German names used in the modal
 */
export const EXERCISE_DATABASE = [
  // Chest exercises
  { name: 'Bankdrücken', muscleGroup: 'Brust' },
  { name: 'Schrägbankdrücken', muscleGroup: 'Brust' },
  { name: 'Liegestütze', muscleGroup: 'Brust' },
  { name: 'Butterfly', muscleGroup: 'Brust' },
  { name: 'Dips', muscleGroup: 'Brust' },

  // Back exercises
  { name: 'Klimmzüge', muscleGroup: 'Rücken' },
  { name: 'Rudern', muscleGroup: 'Rücken' },
  { name: 'Lat Pulldown', muscleGroup: 'Rücken' },
  { name: 'Kreuzheben', muscleGroup: 'Rücken' },
  { name: 'Reverse Flys', muscleGroup: 'Rücken' },

  // Shoulder exercises
  { name: 'Schulterdrücken', muscleGroup: 'Schultern' },
  { name: 'Seitheben', muscleGroup: 'Schultern' },
  { name: 'Frontheben', muscleGroup: 'Schultern' },
  { name: 'Reverse Flys', muscleGroup: 'Schultern' },

  // Biceps exercises
  { name: 'Bizeps Curls', muscleGroup: 'Bizeps' },
  { name: 'Hammer Curls', muscleGroup: 'Bizeps' },
  { name: 'Konzentrationscurls', muscleGroup: 'Bizeps' },
  { name: '21er Curls', muscleGroup: 'Bizeps' },

  // Triceps exercises
  { name: 'Trizeps Dips', muscleGroup: 'Trizeps' },
  { name: 'Trizeps Pushdowns', muscleGroup: 'Trizeps' },
  { name: 'Overhead Extension', muscleGroup: 'Trizeps' },
  { name: 'Close Grip Bench Press', muscleGroup: 'Trizeps' },

  // Leg exercises
  { name: 'Kniebeuge', muscleGroup: 'Beine' },
  { name: 'Deadlift', muscleGroup: 'Beine' },
  { name: 'Beinstrecker', muscleGroup: 'Beine' },
  { name: 'Beinbeuger', muscleGroup: 'Beine' },
  { name: 'Ausfallschritte', muscleGroup: 'Beine' },
  { name: 'Beinpresse', muscleGroup: 'Beine' },
  { name: 'Wadenheben', muscleGroup: 'Beine' },

  // Core exercises
  { name: 'Situps', muscleGroup: 'Bauch' },
  { name: 'Plank', muscleGroup: 'Bauch' },
  { name: 'Russian Twists', muscleGroup: 'Bauch' },
  { name: 'Mountain Climbers', muscleGroup: 'Bauch' },
  { name: 'Crunches', muscleGroup: 'Bauch' },
  { name: 'Leg Raises', muscleGroup: 'Bauch' },
];

/**
 * Get exercises by muscle group
 * @param {string} muscleGroup - The muscle group to filter by
 * @returns {Array} Array of exercises for the specified muscle group
 */
export const getExercisesByMuscleGroup = (muscleGroup) => {
  return EXERCISE_DATABASE.filter(exercise => exercise.muscleGroup === muscleGroup);
};

/**
 * Get all unique muscle groups
 * @returns {Array} Array of unique muscle group names
 */
export const getMuscleGroups = () => {
  return [...new Set(EXERCISE_DATABASE.map(exercise => exercise.muscleGroup))];
};

/**
 * Find exercise by name and muscle group
 * @param {string} name - Exercise name
 * @param {string} muscleGroup - Muscle group
 * @returns {Object|null} Exercise object or null if not found
 */
export const findExercise = (name, muscleGroup) => {
  return EXERCISE_DATABASE.find(
    exercise => exercise.name === name && exercise.muscleGroup === muscleGroup
  );
};
