/**
 * API Service for workout tracking application
 * Handles all communication with JSON Server
 */

import axios from 'axios';

// Base URL for API calls
// - Im Vite-Dev-Server (Port 3000) nutzen wir den Proxy '/api'
// - Wenn die App nicht über Vite (3000) läuft, gehen wir direkt auf json-server (3001)
let API_BASE_URL = '/api';
if (typeof window !== 'undefined') {
  const port = window.location && window.location.port;
  if (port !== '3000') {
    API_BASE_URL = 'http://localhost:3001';
  }
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Workout API functions
 */
export const workoutAPI = {
  /**
   * Get all workouts
   * @returns {Promise<Array>} Array of workouts
   */
  getAllWorkouts: async () => {
    try {
      const response = await api.get('/workouts');
      return response.data;
    } catch (error) {
      console.error('Error fetching workouts:', error);
      throw new Error('Failed to fetch workouts');
    }
  },

  /**
   * Get workout by ID
   * @param {string} id - Workout ID
   * @returns {Promise<Object>} Workout object
   */
  getWorkoutById: async (id) => {
    try {
      const response = await api.get(`/workouts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching workout ${id}:`, error);
      throw new Error('Failed to fetch workout');
    }
  },

  /**
   * Create new workout
   * @param {Object} workout - Workout data
   * @returns {Promise<Object>} Created workout
   */
  createWorkout: async (workout) => {
    try {
      const response = await api.post('/workouts', workout);
      return response.data;
    } catch (error) {
      console.error('Error creating workout:', error);
      throw new Error('Failed to create workout');
    }
  },

  /**
   * Update existing workout
   * @param {string} id - Workout ID
   * @param {Object} workout - Updated workout data
   * @returns {Promise<Object>} Updated workout
   */
  updateWorkout: async (id, workout) => {
    try {
      const response = await api.put(`/workouts/${id}`, workout);
      return response.data;
    } catch (error) {
      console.error(`Error updating workout ${id}:`, error);
      throw new Error('Failed to update workout');
    }
  },

  /**
   * Delete workout
   * @param {string} id - Workout ID
   * @returns {Promise<void>}
   */
  deleteWorkout: async (id) => {
    try {
      await api.delete(`/workouts/${id}`);
    } catch (error) {
      console.error(`Error deleting workout ${id}:`, error);
      throw new Error('Failed to delete workout');
    }
  },

  /**
   * Get active workout (workout with isActive: true)
   * @returns {Promise<Object|null>} Active workout or null
   */
  getActiveWorkout: async () => {
    try {
      const response = await api.get('/workouts?isActive=true');
      return response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error('Error fetching active workout:', error);
      throw new Error('Failed to fetch active workout');
    }
  },

  /**
   * Get last N workouts
   * @param {number} limit - Number of workouts to return
   * @returns {Promise<Array>} Array of recent workouts
   */
  getRecentWorkouts: async (limit = 3) => {
    try {
      const response = await api.get(`/workouts?_sort=date&_order=desc&_limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent workouts:', error);
      throw new Error('Failed to fetch recent workouts');
    }
  }
};

/**
 * Training Plan API functions
 */
export default api;
