/**
 * Home Page Component
 * Displays current date
 * start workout button
 * and last 3 workouts
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/dateTime.js';
import { getCurrentWorkoutFromLocalStorage } from '../../utils/general.js';
import DateDisplay from '../../components/DateDisplay/DateDisplay.jsx';
import StartWorkout from '../../components/StartWorkout/StartWorkout.jsx';
import BottomNavigation from '../../components/BottomNavigation/BottomNavigation.jsx';
import WorkoutCard from '../../components/WorkoutCard/WorkoutCard.jsx';
import './HomePage.css';
import { workoutAPI } from '../../services/api.js';

const HomePage = () => {
  
  const navigate = useNavigate();


  const [localStorageWorkout, setLocalStorageWorkout] = useState(null);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [isLoadingWorkouts, setIsLoadingWorkouts] = useState(true);
  const [workoutsError, setWorkoutsError] = useState(null);

  /**
   * Check for workouts in localStorage on component mount
   */
  useEffect(() => {
    const currentWorkout = getCurrentWorkoutFromLocalStorage();
    setLocalStorageWorkout(currentWorkout);
  }, []);

  // load last 3 workouts
  useEffect(() => {
    const fetchRecentWorkouts = async () => {
      try {
        setIsLoadingWorkouts(true);
        setWorkoutsError(null);
        const workouts = await workoutAPI.getRecentWorkouts(3);
        // Defensive: Stelle sicher, dass wir immer ein Array speichern
        if (Array.isArray(workouts)) {
          setRecentWorkouts(workouts);
        } else if (workouts && Array.isArray(workouts.data)) {
          setRecentWorkouts(workouts.data);
        } else {
          // Fallback: Lade alle Workouts, sortiere nach Datum und nimm die Top 3
          const all = await workoutAPI.getAllWorkouts();
          const sorted = Array.isArray(all)
            ? [...all].sort((a, b) => new Date(b.date) - new Date(a.date))
            : [];
          setRecentWorkouts(sorted.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching recent workouts:", error);
        setWorkoutsError("Fehler beim Laden der letzten Trainingseinheiten");
      } finally {
        setIsLoadingWorkouts(false);
      }
    };
    fetchRecentWorkouts();
  }, []);

  /**
   * Handler for starting a new workout
   * Navigates to the workout creation page
   */
  const handleStartWorkout = () => {
    navigate('/workout/new');
  };

  /**
   * Handler for continuing an existing workout from localStorage
   * Navigates to the existing workout page
   */
  const handleContinueWorkout = () => {
    if (localStorageWorkout) {
      navigate(`/workout/${localStorageWorkout.id}`);
    }
  };
  

  

  return (
    <div className="home-page">
      {/* Date display component showing current date and week view */}
      <DateDisplay />

      {/* Main content area */}
      <main className="home-main">
        {/* Start workout button component */}
        <StartWorkout 
          onStartWorkout={handleStartWorkout}
          onContinueWorkout={handleContinueWorkout}
          localStorageWorkout={localStorageWorkout}
        />

        {/* Recent workouts section displaying last 3 training sessions */}
        <section className="home-recent-workouts-section">
          <h2 className="home-recent-workouts-title">Letzten 3 Trainingseinheiten</h2>
          
          {/* Loading State */}
          {isLoadingWorkouts ? (
              <div className="home-loading">
                <div className="loading-spinner">⏳</div>
                <p>Lade letzte Workouts...</p>
              </div>
            ) : workoutsError ? (
              /* Error State */
              <div className="home-error">
                <div className="error-icon">⚠️</div>
                <p>{workoutsError}</p>
                <button onClick={() => window.location.reload()}>
                  Erneut versuchen
                </button>
              </div>
            ) : (!Array.isArray(recentWorkouts) || recentWorkouts.length === 0) ? (
              /* Empty State */
              <div className="home-empty">
                <div className="empty-icon">💪</div>
                <p>Noch keine Workouts vorhanden</p>
                <p>Starte dein erstes Training!</p>
              </div>
            ) : (
              /* Success State - Recent Workouts */
              <div className="home-workout-cards">
                {(Array.isArray(recentWorkouts) ? recentWorkouts : []).map((workout) => (
                  <div key={workout.id} className="home-workout-card-wrapper">
                    <div className="home-workout-card-date">
                      {formatDate(workout.date)}
                    </div>
                    <WorkoutCard
                      workout={workout}
                      onClick={(workout) => navigate(`/workout/${workout.id}`)}
                      className="home-workout-card"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
      </main>

      {/* Bottom navigation bar */}
      <BottomNavigation 
        activeTab="home" 
        onNavigate={navigate} 
      />
    </div>
  );
};

export default HomePage;
