/**
 * Statistics API Service
 * 
 * Dieser Service macht NUR API-Aufrufe und gibt rohe Daten zurück.
 * Alle Berechnungen und Datenverarbeitung passiert in statisticsService.js
 * 
 * Warum getrennt?
 * - statsAPI: Nur HTTP-Requests, keine Logik
 * - statisticsService: Nur Berechnungen, keine HTTP-Requests
 * - Saubere Trennung der Verantwortlichkeiten
 */

import axios from 'axios';

// === API KONFIGURATION ===
// Basis-URL für alle API-Aufrufe (json-server läuft auf Port 3000)
const API_BASE_URL = '/api';

// Axios-Instanz mit Standard-Konfiguration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,  // 10 Sekunden Timeout für alle Requests
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Statistics API functions - ONLY API calls
 */
export const statsAPI = {
  /**
   * Holt alle Workouts aus der API
   * 
   * Diese Funktion wird von statisticsService.js verwendet, um alle rohen Workout-Daten zu bekommen.
   * Die Daten werden dann in statisticsService.js verarbeitet und gefiltert.
   * 
   * @returns {Promise<Array>} Array aller Workouts aus der Datenbank
   * @throws {Error} Wenn der API-Aufruf fehlschlägt
   */
  getAllWorkouts: async () => {
    try {
      const response = await api.get('/workouts');
      return response.data;  // Gibt rohe Workout-Daten zurück
    } catch (error) {
      console.error('Error fetching workouts:', error);
      throw new Error('Failed to fetch workouts');
    }
  },

  /**
   * Holt ein spezifisches Workout anhand der ID
   * 
   * @param {string} id - Die ID des Workouts
   * @returns {Promise<Object>} Das Workout-Objekt
   * @throws {Error} Wenn der API-Aufruf fehlschlägt
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
   * Holt alle verfügbaren Übungsnamen aus allen Workouts
   * 
   * Diese Funktion durchsucht alle Workouts und sammelt alle einzigartigen Übungsnamen.
   * Wird für das Dropdown in StatsFilter verwendet.
   * 
   * @returns {Promise<Array>} Alphabetisch sortiertes Array aller Übungsnamen
   * @throws {Error} Wenn der API-Aufruf fehlschlägt
   */
  getAvailableExercises: async () => {
    try {
      // Hole alle Workouts
      const workouts = await statsAPI.getAllWorkouts();
      
      // Sammle alle einzigartigen Übungsnamen
      const exercises = new Set();
      workouts.forEach(workout => {
        workout.exercises.forEach(exercise => {
          exercises.add(exercise.name);  // z.B. "Bankdrücken", "Kniebeugen"
        });
      });
      
      // Konvertiere Set zu Array und sortiere alphabetisch
      return Array.from(exercises).sort();
    } catch (error) {
      console.error('Error fetching available exercises:', error);
      throw new Error('Failed to fetch available exercises');
    }
  },

  /**
   * Holt alle verfügbaren Muskelgruppen aus allen Workouts
   * 
   * Diese Funktion durchsucht alle Workouts und sammelt alle einzigartigen Muskelgruppen.
   * Wird für das Dropdown in StatsFilter verwendet.
   * 
   * @returns {Promise<Array>} Alphabetisch sortiertes Array aller Muskelgruppen
   * @throws {Error} Wenn der API-Aufruf fehlschlägt
   */
  getAvailableMuscles: async () => {
    try {
      const workouts = await statsAPI.getAllWorkouts();
      const muscles = new Set();
      
      workouts.forEach(workout => {
        workout.exercises.forEach(exercise => {
          muscles.add(exercise.muscleGroup);
        });
      });
      
      return Array.from(muscles).sort();
    } catch (error) {
      console.error('Error fetching available muscles:', error);
      throw new Error('Failed to fetch available muscles');
    }
  }
};