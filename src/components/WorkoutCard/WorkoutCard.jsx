/**
 * WorkoutCard Component
 * 
 * Reusable workout card component for displaying workout information.
 * Used in HomePage (horizontal scroll) and PastWorkoutsPage (vertical list).
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.workout - Workout object containing workout data
 * @param {Function} props.onClick - Click handler function
 * @param {string} props.className - Additional CSS classes for styling
 * 
 * @example
 * <WorkoutCard 
 *   workout={workoutData} 
 *   onClick={() => navigate(`/workout/${workout.id}`)}
 *   className="home-workout-card"
 * />
 */

import React from 'react';
import { formatDate, calculateDuration } from '../../utils/dateTime.js';
import './WorkoutCard.css';

const WorkoutCard = ({ workout, onClick, className = '' }) => {
  /**
   * Handle card click
   * @param {Event} e - Click event
   */
  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick(workout);
    }
  };

  /**
   * Handle keyboard navigation
   * @param {Event} e - Keyboard event
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onClick) {
        onClick(workout);
      }
    }
  };

  return (
    <div 
      className={`workout-card ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`Workout ${workout.name} vom ${formatDate(workout.date)}`}
    >
      {/* Workout Header */}
      <div className="workout-card-header">
        <div className="workout-card-title">
          {workout.name || 'Unbenanntes Workout'}
        </div>
        <div className="workout-card-duration">
          {workout.startTime && workout.endTime 
            ? calculateDuration(workout.startTime, workout.endTime)
            : 'Dauer unbekannt'
          }
        </div>
      </div>

      {/* Divider */}
      <div className="workout-card-divider"></div>

      {/* Workout Notes (only show if exists) */}
      {workout.notes && (
        <div className="workout-card-notes">
          {workout.notes}
        </div>
      )}

      {/* Exercise Summary */}
      <div className="workout-card-exercises">
        <div className="workout-card-exercises-list">
          {workout.exercises.slice(0, 6).map((exercise, index) => (
            <div key={index} className="workout-card-exercise-item">
              {exercise.sets.length}x {exercise.name}
            </div>
          ))}
          {workout.exercises.length > 6 && (
            <div className="workout-card-exercise-more">
              +{workout.exercises.length - 6} weitere...
            </div>
          )}
        </div>
      </div>

      {/* View Button */}
      <div className="workout-card-action">
        <span className="workout-card-action-text">
          Ansehen →
        </span>
      </div>
    </div>
  );
};

export default WorkoutCard;
