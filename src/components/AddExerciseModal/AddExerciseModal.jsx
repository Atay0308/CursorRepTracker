/**
 * AddExerciseModal Component
 * 
 * A modal dialog for adding new exercises to a workout.
 * Features a muscle group grid with images, then exercise selection.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback to close the modal
 * @param {Function} props.onAddExercise - Callback when exercise is added
 * @param {Array} props.availableExercises - List of available exercises by muscle group
 * 
 * @example
 * <AddExerciseModal
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   onAddExercise={handleAddExercise}
 *   availableExercises={exerciseDatabase}
 * />
 */

import React, { useState } from 'react';
import './AddExerciseModal.css';

const AddExerciseModal = ({ isOpen, onClose, onAddExercise, availableMuscleGroups = [], availableExercises = [] }) => {
  // State for current view and selections
  const [currentView, setCurrentView] = useState('muscleGrid'); // 'muscleGrid' or 'exerciseList'
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');



  /**
   * Handle muscle group selection
   * Switches to exercise list view
   * @param {Object} muscleGroup - Selected muscle group object
   */
  const handleMuscleGroupSelect = (muscleGroup) => {
    setSelectedMuscleGroup(muscleGroup.name);
    setCurrentView('exerciseList');
  };

  /**
   * Handle exercise selection and immediate addition
   * Adds the exercise directly to the workout without confirmation
   * @param {string} exercise - Selected exercise name
   */
  const handleExerciseSelect = (exercise) => {
    // Find the exercise details from available exercises
    const exerciseData = availableExercises.find(
      ex => ex.muscleGroup === selectedMuscleGroup && ex.name === exercise
    );

    if (exerciseData) {
      onAddExercise(exerciseData);
      // Reset selections and close modal
      setSelectedMuscleGroup('');
      setSelectedExercise('');
      setCurrentView('muscleGrid');
      onClose();
    }
  };

  /**
   * Handle going back to muscle grid
   */
  const handleGoBack = () => {
    setCurrentView('muscleGrid');
    setSelectedMuscleGroup('');
    setSelectedExercise('');
  };

  /**
   * Handle modal close
   * Resets all selections when closing
   */
  const handleClose = () => {
    setCurrentView('muscleGrid');
    setSelectedMuscleGroup('');
    setSelectedExercise('');
    onClose();
  };

  // Get exercises for selected muscle group
  const exercisesForMuscleGroup = availableExercises.filter(
    exercise => exercise.muscleGroup === selectedMuscleGroup
  );

  // Don't render if modal is not open
  if (!isOpen) return null;

  return (
    <div className="add-exercise-modal-overlay" onClick={handleClose}>
      <div className="add-exercise-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="add-exercise-modal-header">
          <h2 className="add-exercise-modal-title">
            {currentView === 'muscleGrid' ? 'Muskelgruppe wählen' : 'Übung wählen'}
          </h2>
          <button 
            className="add-exercise-modal-close-btn"
            onClick={handleClose}
            aria-label="Modal schließen"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="add-exercise-modal-content">
          {currentView === 'muscleGrid' ? (
            /* Muscle Grid View */
            <div className="muscle-grid">
              {availableMuscleGroups.map((muscle) => (
                <button
                  key={muscle.id}
                  className="muscle-grid-item"
                  onClick={() => handleMuscleGroupSelect(muscle)}
                  style={{ '--muscle-color': muscle.color }}
                  data-testid="muscle-button"
                >
                  <div className="muscle-grid-image">
                    {muscle.image}
                  </div>
                  <div className="muscle-grid-name">
                    {muscle.name}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* Exercise List View */
            <div className="exercise-list-view">
              {/* Back Button */}
              <button 
                className="exercise-list-back-btn"
                onClick={handleGoBack}
              >
                ← Zurück zu Muskelgruppen
              </button>

              {/* Selected Muscle Group */}
              <div className="exercise-list-header">
                <h3 className="exercise-list-title">
                  Übungen für {selectedMuscleGroup}
                </h3>
              </div>

              {/* Exercise List */}
              <div className="exercise-list">
                {exercisesForMuscleGroup.map((exercise) => (
                  <button
                    key={exercise.name}
                    className={`exercise-list-item ${selectedExercise === exercise.name ? 'selected' : ''}`}
                    onClick={() => handleExerciseSelect(exercise.name)}
                  >
                    <div className="exercise-list-item-name">
                      {exercise.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer removed - exercises are added directly on click */}
      </div>
    </div>
  );
};

export default AddExerciseModal;
