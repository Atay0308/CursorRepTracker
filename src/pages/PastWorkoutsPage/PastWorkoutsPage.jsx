/**
 * PastWorkoutsPage Component
 * 
 * Displays a list of past workouts with:
 * - Workout history with dates
 * - Exercise summaries
 * - Duration information
 * - Navigation to individual workouts
 * 
 * @component
 * @example
 * <PastWorkoutsPage />
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutAPI } from '../../services/api.js';
import { formatDate } from '../../utils/dateTime.js';
import BottomNavigation from '../../components/BottomNavigation/BottomNavigation.jsx';
import WorkoutCard from '../../components/WorkoutCard/WorkoutCard.jsx';
import './PastWorkoutsPage.css';

const PastWorkoutsPage = () => {
  const navigate = useNavigate();
  
  // State for workouts data
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Load past workouts from API
   */
  const loadWorkouts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get all workouts sorted by date (newest first)
      const allWorkouts = await workoutAPI.getAllWorkouts();
      
      // Sort by date descending (newest first)
      const sortedWorkouts = allWorkouts.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      
      setWorkouts(sortedWorkouts);
    } catch (error) {
      console.error('Error loading workouts:', error);
      setError('Fehler beim Laden der vergangenen Workouts');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Navigate to specific workout
   * @param {string} workoutId - ID of the workout to view
   */
  const handleViewWorkout = (workoutId) => {
    navigate(`/workout/${workoutId}`);
  };

  /**
   * Navigate to create new workout
   */
  const handleNewWorkout = () => {
    navigate('/workout/new');
  };

  // Load workouts on component mount
  useEffect(() => {
    loadWorkouts();
  }, []);

  return (
    <div className="past-workouts-page">
      {/* Page Header */}
      <header className="past-workouts-header">
        <h1 className="past-workouts-title">Vergangene Einheiten</h1>
        {!isLoading && !error && workouts.length > 0 && (
          <button 
            className="past-workouts-header-button"
            onClick={handleNewWorkout}
          >
            + Neues Workout
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="past-workouts-main">
        {/* Loading State */}
        {isLoading && (
          <div className="past-workouts-loading">
            <div className="past-workouts-loading-spinner">⏳</div>
            <p>Lade vergangene Workouts...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="past-workouts-error">
            <div className="past-workouts-error-icon">⚠️</div>
            <h3>Fehler beim Laden</h3>
            <p>{error}</p>
            <button 
              className="past-workouts-error-retry"
              onClick={loadWorkouts}
            >
              Erneut versuchen
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && workouts.length === 0 && (
          <div className="past-workouts-empty">
            <div className="past-workouts-empty-icon">💪</div>
            <h3>Noch keine Workouts vorhanden</h3>
            <p>Starte dein erstes Training!</p>
            <button 
              className="past-workouts-empty-button"
              onClick={handleNewWorkout}
            >
              Neues Workout starten
            </button>
          </div>
        )}

        {/* Workouts List */}
        {!isLoading && !error && workouts.length > 0 && (
          <div className="past-workouts-list">
            <div className="past-workouts-grid">
              {workouts.map((workout) => (
                <div key={workout.id} className="past-workout-card-wrapper">
                  <div className="past-workout-card-date">
                    {formatDate(workout.date)}
                  </div>
                  <WorkoutCard
                    workout={workout}
                    onClick={(workout) => handleViewWorkout(workout.id)}
                    className="past-workout-card"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Bottom navigation bar */}
      <BottomNavigation 
        activeTab="past-workouts" 
        onNavigate={navigate} 
      />
    </div>
  );
};

export default PastWorkoutsPage;
