/**
 * Date and time utility functions
 */

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Format time for display
 * @param {string} timeString - Time string (HH:mm)
 * @returns {string} Formatted time
 */
export const formatTime = (timeString) => {
  return timeString;
};

/**
 * Calculate workout duration
 * @param {string} startTime - Start time (HH:mm)
 * @param {string} endTime - End time (HH:mm)
 * @returns {string} Duration in minutes
 */
export const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return '0 Min';
  
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  const diffMs = end - start;
  const diffMins = Math.round(diffMs / 60000);
  
  return `${diffMins} Min`;
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

/**
 * Parse break time from MM:SS format to seconds
 * @param {string} timeString - Time string in MM:SS format
 * @returns {number} Break time in seconds
 */
export const parseBreakTime = (timeString) => {
  const [minutes, seconds] = timeString.split(':').map(Number);
  return (minutes * 60) + seconds;
};

/**
 * Get current time in HH:MM format
 * @returns {string} Current time
 */
export const getCurrentTime = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

/**
 * Get current date in YYYY-MM-DD format
 * @returns {string} Current date
 */
export const getCurrentDate = () => {
  const now = new Date();
  // Use local date instead of UTC to avoid timezone issues
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

