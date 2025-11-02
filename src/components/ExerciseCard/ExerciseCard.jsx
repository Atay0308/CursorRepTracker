/**
 * ExerciseCard Component
 * 
 * Displays an exercise with its sets, weight, reps, and break time.
 * Allows editing exercise name, adding/removing sets, and managing exercise data.
 * Features a context menu for advanced exercise management.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.exercise - Exercise data object
 * @param {string} props.exercise.id - Unique exercise identifier
 * @param {string} props.exercise.name - Exercise name
 * @param {string} props.exercise.muscleGroup - Muscle group this exercise targets
 * @param {Array} props.exercise.sets - Array of sets for this exercise
 * @param {Function} props.onUpdateExercise - Callback when exercise data changes
 * @param {Function} props.onRemoveExercise - Callback when exercise should be removed
 * @param {Function} props.onAddSet - Callback when a new set should be added
 * @param {Function} props.onUpdateSet - Callback when set data changes
 * @param {Function} props.onRemoveSet - Callback when a set should be removed
 * @param {Function} props.onDuplicateExercise - Callback when exercise should be duplicated
 * @param {Function} props.onMoveExerciseUp - Callback when exercise should be moved up
 * @param {Function} props.onMoveExerciseDown - Callback when exercise should be moved down
 * 
 * @example
 * <ExerciseCard
 *   exercise={exerciseData}
 *   onUpdateExercise={handleUpdateExercise}
 *   onRemoveExercise={handleRemoveExercise}
 *   onAddSet={handleAddSet}
 *   onUpdateSet={handleUpdateSet}
 *   onRemoveSet={handleRemoveSet}
 *   onDuplicateExercise={handleDuplicateExercise}
 *   onMoveExerciseUp={handleMoveUp}
 *   onMoveExerciseDown={handleMoveDown}
 * />
 */

import React from 'react';
import SetRow from '../SetRow/SetRow';
import './ExerciseCard.css';

const ExerciseCard = ({ 
  exercise, 
  onUpdateExercise, 
  onRemoveExercise, 
  onAddSet, 
  onUpdateSet, 
  onRemoveSet,
}) => {

  /**
   * Handle exercise name change
   * @param {string} newName - New exercise name
   */
  const handleNameChange = (newName) => {
    onUpdateExercise(exercise.id, 'name', newName);
  };


  /**
   * Handle adding a new set to this exercise
   */
  const handleAddSet = () => {
    onAddSet(exercise.id);
  };

  /**
   * Handle removing this exercise
   */
  const handleRemoveExercise = () => {
    onRemoveExercise(exercise.id);
  };


  return (
    <div className="exercise-card" data-exercise-id={exercise.id}>
      {/* Exercise Header */}
      <div className="exercise-card-header">
        {/* Exercise name input */}
        <input
          id={`exercise-name-${exercise.id}`}
          type="text"
          className="exercise-card-name-input"
          value={exercise.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Übungsname eingeben"
          aria-label="Übungsname"
        />
        
        {/* Exercise remove button */}
        <button 
          className="exercise-card-remove-btn"
          onClick={handleRemoveExercise}
          aria-label="Übung entfernen"
        >
          ×
        </button>
      </div>

      {/* Sets Container */}
      <div className="exercise-card-sets-container">
        {exercise.sets.map((set) => (
          <SetRow
            key={set.id}
            set={set}
            onUpdateSet={(field, value) => onUpdateSet(exercise.id, set.id, field, value)}
            onRemoveSet={() => onRemoveSet(exercise.id, set.id)}
          />
        ))}
        
        {/* Add Set Button */}
        <button 
          className="exercise-card-add-set-btn"
          onClick={handleAddSet}
          aria-label="Satz hinzufügen"
        >
          + Satz hinzufügen
        </button>
      </div>

    </div>
  );
};

export default ExerciseCard;
