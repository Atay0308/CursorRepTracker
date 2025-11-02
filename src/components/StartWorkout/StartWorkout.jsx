/**
 * StartWorkout Component
 * Displays title and start workout button
 * 
 * Features:
 * - Accessible button with proper ARIA labels
 * - Responsive design
 * - SEO-friendly structure
 * - Loading states support
 * - Callback for workout start action
 */

import React from 'react';
import './StartWorkout.css';

const StartWorkout = ({ 
  onStartWorkout, 
  onContinueWorkout, 
  localStorageWorkout, 
  isLoading = false 
}) => {
  
  /**
   * Handle button click event
   * Triggers continue workout if localStorage workout exists, otherwise starts new workout
   */
  const handleClick = () => {
    if (isLoading) return;
    
    if (localStorageWorkout && onContinueWorkout) {
      onContinueWorkout();
    } else if (onStartWorkout) {
      onStartWorkout();
    }
  };



  return (
    <section className="start-workout" role="main" aria-labelledby="start-workout-title">
      {/* Main heading for the start workout section */}
      <h1 id="start-workout-title" className="start-workout-title">
        {localStorageWorkout ? 'Training fortsetzen' : 'Neues Training starten'}
      </h1>
      
      {/* Show workout info if continuing */}
      {localStorageWorkout && (
        <div className="start-workout-info">
          <p className="start-workout-workout-name">
            {localStorageWorkout.name || 'Unbenanntes Training'}
          </p>
          <p className="start-workout-workout-date">
            {new Date(localStorageWorkout.date).toLocaleDateString('de-DE')}
          </p>
          {localStorageWorkout.exercises && localStorageWorkout.exercises.length > 0 && (
            <p className="start-workout-exercise-count">
              {localStorageWorkout.exercises.length} Übung{localStorageWorkout.exercises.length !== 1 ? 'en' : ''}
            </p>
          )}
        </div>
      )}
      
      {/* Primary action button for starting/continuing workout */}
      <button
        className={`start-workout-btn ${isLoading ? 'loading' : ''} ${localStorageWorkout ? 'continue' : 'start'}`}
        onClick={handleClick}
        disabled={isLoading}
        aria-label={localStorageWorkout ? 'Training fortsetzen' : 'Neues Training starten'}
        aria-describedby="start-workout-description"
        tabIndex={0}
      >
        {/* Icon or loading indicator */}
        <span className="start-workout-plus-icon" aria-hidden="true">
          {isLoading ? '⏳' : localStorageWorkout ? '▶️' : '+'}
        </span>
        {/* Screen reader description for accessibility */}
        <span id="start-workout-description" className="start-workout-sr-only">
          {localStorageWorkout 
            ? 'Klicken Sie hier, um das Training fortzusetzen' 
            : 'Klicken Sie hier, um ein neues Training zu beginnen'
          }
        </span>
      </button>
    </section>
  );
};

export default StartWorkout;
