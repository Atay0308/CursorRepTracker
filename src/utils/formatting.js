/**
 * Formatting utility functions
 */

/**
 * Format weight for display
 * @param {number} weight - Weight value
 * @returns {string} Formatted weight
 */
export const formatWeight = (weight) => {
  return `${weight} kg`;
};

/**
 * Format reps for display
 * @param {number} reps - Reps value
 * @returns {string} Formatted reps
 */
export const formatReps = (reps) => {
  return `${reps} Wdh.`;
};

/**
 * Format break time for display
 * @param {number} breakTime - Break time in seconds
 * @returns {string} Formatted break time (MM:SS)
 */
export const formatBreakTime = (breakTime) => {
  const minutes = Math.floor(breakTime / 60);
  const seconds = breakTime % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
