/**
 * WorkoutPage Component
 * 
 * Main workout editing interface that allows users to create and edit workouts.
 * Features exercise management, set tracking, timer functionality, and workout saving.
 * 
 * @component
 * @param {Object} props - Component props (none currently)
 * 
 * @example
 * <WorkoutPage />
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDate, getCurrentDate, getCurrentTime } from '../../utils/dateTime.js';
import { 
  generateId, 
  saveWorkoutToLocalStorage, 
  loadWorkoutFromLocalStorage, 
  removeWorkoutFromLocalStorage,
  hasWorkoutInLocalStorage 
} from '../../utils/general.js';
import { workoutAPI } from '../../services/api';
import { validateWorkout } from '../../utils/validation';
import { EXERCISE_DATABASE } from '../../data/exerciseDatabase.js';
import { muscleGroups } from '../../data/muscleGroupDatabase.js';
import AddExerciseModal from '../../components/AddExerciseModal/AddExerciseModal.jsx';
import ExerciseCard from '../../components/ExerciseCard/ExerciseCard.jsx';
import './WorkoutPage.css';


const WorkoutPage = () => {
  // React Router hooks
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewWorkout = !id || id === 'new';

  // Modal state
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false);

  // Workout state
  const [workout, setWorkout] = useState({
    id: null, // Will be set when loaded from API or when creating new workout
    name: '',
    date: getCurrentDate(),
    startTime: getCurrentTime(),
    endTime: '',
    exercises: [],
    notes: '',
    isActive: true
  });

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  /**
   * Initialize workout data on component mount
   * Loads existing workout if editing, otherwise starts with empty workout
   */
  useEffect(() => {
    if (!isNewWorkout) {
      // First try to load from localStorage (only if it's a draft)
      const savedWorkout = loadWorkoutFromLocalStorage();
      if (savedWorkout) {
        setWorkout(savedWorkout);
      } else {
        // If not in localStorage, load from API (this is a saved workout, not a draft)
        loadWorkout(id);
      }
    }
  }, [id, isNewWorkout]);


  /**
   * Load workout data from API
   * @param {string} workoutId - ID of the workout to load
   */
  const loadWorkout = async (workoutId) => {
    try {
      setIsLoading(true);
      const workoutData = await workoutAPI.getWorkoutById(workoutId);
      setWorkout(workoutData);
      // Note: We don't save loaded workouts to localStorage as they are already saved
      // Only new/draft workouts should be in localStorage
    } catch (err) {
      setError('Failed to load workout');
      console.error('Error loading workout:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Auto-save workout to localStorage
   * Saves the current workout state to localStorage for persistence
   */
  const autoSaveWorkout = () => {
    if (workout) {
      // Generate temporary ID for localStorage if none exists
      const workoutToSave = workout.id ? workout : { ...workout, id: generateId() };
      saveWorkoutToLocalStorage(workoutToSave);
      setHasUnsavedChanges(true);
      
      // Update the workout state with the generated ID if it was null
      if (!workout.id) {
        setWorkout(prev => ({ ...prev, id: workoutToSave.id }));
      }
    }
  };

  /**
   * Focus on the add exercise button
   * Scrolls to and focuses the button for better UX
   */
  const focusAddExerciseButton = () => {
    setTimeout(() => {
      const addButton = document.querySelector('.add-exercise-btn');
      if (addButton) {
        addButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
        addButton.focus();
      }
    }, 100);
  };

  /**
   * Handle workout field changes
   * @param {string} field - Field name to update
   * @param {string|number} value - New value
   */
  const handleWorkoutChange = (field, value) => {
    setWorkout(prev => {
      const updatedWorkout = {
        ...prev,
        [field]: value
      };
      // Auto-save to localStorage
      setTimeout(() => autoSaveWorkout(), 0);
      return updatedWorkout;
    });
  };

  /**
   * Handle adding a new exercise from the modal
   * @param {Object} exerciseData - Exercise data from database
   */
  const handleAddExercise = (exerciseData) => {
    const newExercise = {
      id: generateId(),
      name: exerciseData.name,
      muscleGroup: exerciseData.muscleGroup,
      sets: [{
        id: generateId(),
        setNumber: 1,
        weight: '',
        reps: '',
        breakTime: ''
      }],
      notes: ''
    };
    
    setWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, newExercise]
    }));
    focusAddExerciseButton();
  };

  /**
   * Handle updating exercise data
   * @param {string} exerciseId - ID of the exercise to update
   * @param {string} field - Field name to update
   * @param {string|number} value - New value
   */
  const updateExercise = (exerciseId, field, value) => {
    setWorkout(prev => {
      const updatedWorkout = {
        ...prev,
        exercises: prev.exercises.map(exercise =>
          exercise.id === exerciseId
            ? { ...exercise, [field]: value }
            : exercise
        )
      };
      // Auto-save to localStorage
      setTimeout(() => autoSaveWorkout(), 0);
      return updatedWorkout;
    });
  };

  /**
   * Handle removing an exercise
   * @param {string} exerciseId - ID of the exercise to remove
   */
  const removeExercise = (exerciseId) => {
    setWorkout(prev => {
      const updatedWorkout = {
        ...prev,
        exercises: prev.exercises.filter(exercise => exercise.id !== exerciseId)
      };
      // Auto-save to localStorage
      setTimeout(() => autoSaveWorkout(), 0);
      return updatedWorkout;
    });
  };


  /**
   * Handle adding a new set to an exercise
   * @param {string} exerciseId - ID of the exercise to add set to
   */
  const addSet = (exerciseId) => {
    setWorkout(prev => {
      const updatedWorkout = {
        ...prev,
        exercises: prev.exercises.map(exercise => {
          if (exercise.id === exerciseId) {
            const newSet = {
              id: generateId(),
              setNumber: exercise.sets.length + 1,
              weight: '',
              reps: '',
              breakTime: '',
              notes: ''
            };
            return {
              ...exercise,
              sets: [...exercise.sets, newSet]
            };
          }
          return exercise;
        })
      };
      // Auto-save to localStorage
      setTimeout(() => autoSaveWorkout(), 0);
      return updatedWorkout;
    });

    // Focus on the add exercise button
    focusAddExerciseButton();
  };

  /**
   * Handle updating set data
   * @param {string} exerciseId - ID of the exercise containing the set
   * @param {string} setId - ID of the set to update
   * @param {string} field - Field name to update
   * @param {string|number} value - New value
   */
  const updateSet = (exerciseId, setId, field, value) => {
    setWorkout(prev => {
      const updatedWorkout = {
        ...prev,
        exercises: prev.exercises.map(exercise => {
          if (exercise.id === exerciseId) {
            return {
              ...exercise,
              sets: exercise.sets.map(set =>
                set.id === setId
                  ? { ...set, [field]: value }
                  : set
              )
            };
          }
          return exercise;
        })
      };
      // Auto-save to localStorage
      setTimeout(() => autoSaveWorkout(), 0);
      return updatedWorkout;
    });
  };

  /**
   * Handle removing a set from an exercise
   * @param {string} exerciseId - ID of the exercise containing the set
   * @param {string} setId - ID of the set to remove
   */
  const removeSet = (exerciseId, setId) => {
    setWorkout(prev => {
      const updatedWorkout = {
        ...prev,
        exercises: prev.exercises.map(exercise => {
          if (exercise.id === exerciseId) {
            const updatedSets = exercise.sets.filter(set => set.id !== setId);
            // Renumber sets after removal
            const renumberedSets = updatedSets.map((set, index) => ({
              ...set,
              setNumber: index + 1
            }));
            return {
              ...exercise,
              sets: renumberedSets
            };
          }
          return exercise;
        })
      };
      // Auto-save to localStorage
      setTimeout(() => autoSaveWorkout(), 0);
      return updatedWorkout;
    });
  };


  /**
   * Handle saving the workout
   * Validates workout data and saves to API
   */
  const handleSaveWorkout = async () => {
    try {
      // Set end time to current time if not already set
      const workoutToSave = {
        ...workout,
        endTime: workout.endTime || getCurrentTime()
      };

      // Validate workout data
      const validationResult = validateWorkout(workoutToSave);
      if (!validationResult.isValid) {
        setError(validationResult.errors.join(', '));
        return;
      }

      setIsLoading(true);
      setError(null);

      // Determine if this is a new workout or existing one
      let savedWorkout;
      
      // For existing workouts (loaded from API), try update first
      // If update fails (404), fallback to create
      if (!isNewWorkout && workoutToSave.id) {
        try {
          // Try to update existing workout
          savedWorkout = await workoutAPI.updateWorkout(workoutToSave.id, workoutToSave);
        } catch (error) {
          // If update fails (404), treat as new workout
                  // Fallback: Wenn Update fehlschlägt, erstelle neues Workout
          savedWorkout = await workoutAPI.createWorkout(workoutToSave);
          // Update the workout state with the new ID from API
          setWorkout(prev => ({ ...prev, id: savedWorkout.id }));
        }
      } else {
        // This is a new workout - create it
        savedWorkout = await workoutAPI.createWorkout(workoutToSave);
        // Update the workout state with the new ID from API
        setWorkout(prev => ({ ...prev, id: savedWorkout.id }));
      }

      // Update the workout state with the saved data (including endTime)
      setWorkout(prev => ({ ...prev, endTime: savedWorkout.endTime }));

      // Clear localStorage after successful save
      removeWorkoutFromLocalStorage(); // No ID needed for draft workouts
      setHasUnsavedChanges(false);
      
      setError('');      
      // Navigate back to home page after successful save
      navigate('/');
    } catch (err) {
      console.error('Error saving workout:', err);
      
      // More specific error messages
      if (err.message.includes('404')) {
        setError('Workout nicht gefunden. Möglicherweise wurde es bereits gelöscht.');
      } else if (err.message.includes('network') || err.message.includes('fetch')) {
        setError('Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.');
      } else if (err.message.includes('validation')) {
        setError('Ungültige Workout-Daten. Bitte überprüfen Sie Ihre Eingaben.');
      } else {
        setError(`Fehler beim Speichern: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle navigation back to home page
   */
  const handleGoBack = () => {
    navigate('/');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="workout-page loading">
        <div className="workout-loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="workout-page">
      {/* Workout Header */}
      <header className="workout-page-header">
        <div className="workout-header-left">
          <button 
            className="workout-back-btn"
            onClick={handleGoBack}
            aria-label="Zurück zur Startseite"
          >
            ←
          </button>
          <button 
            className="workout-end-btn"
            onClick={handleSaveWorkout}
            disabled={isLoading}
            aria-label="Training beenden und speichern"
          >
            {isLoading ? 'Speichern...' : 'Beenden'}
          </button>
        </div>
        
        <div className="workout-page-date">
          {formatDate(workout.date)}
        </div>
        
        <div className="workout-page-actions">
          <button className="workout-timer-btn" aria-label="Timer">
            ⏱️
          </button>
          <button className="workout-menu-btn" aria-label="Menü">
            ⋮
          </button>
        </div>
      </header>

      {/* Workout Details */}
      <section className="workout-details">
        <div className="input-group">
          <label htmlFor="workout-name">
            Trainingsname
            {hasUnsavedChanges && (
              <span className="unsaved-indicator" title="Ungespeicherte Änderungen">
                *
              </span>
            )}
          </label>
          <input
            id="workout-name"
            type="text"
            className="input"
            value={workout.name}
            onChange={(e) => handleWorkoutChange('name', e.target.value)}
            placeholder="z.B. Oberkörper Training"
          />
        </div>

        <div className="input-row">
          <div className="input-group">
            <label htmlFor="start-time">Startzeit</label>
            <input
              id="start-time"
              type="time"
              className="input"
              value={workout.startTime}
              onChange={(e) => handleWorkoutChange('startTime', e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="end-time">Endzeit</label>
            <input
              id="end-time"
              type="time"
              className="input"
              value={workout.endTime}
              onChange={(e) => handleWorkoutChange('endTime', e.target.value)}
            />
          </div>
        </div>

      </section>

      {/* Exercises Section - ExerciseCard for every exercise*/}
      <section className="exercises-section">
        {workout.exercises.map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onUpdateExercise={updateExercise}
            onRemoveExercise={removeExercise}
            onAddSet={addSet}
            onUpdateSet={updateSet}
            onRemoveSet={removeSet}
          />
        ))}

        {/* Add Exercise Button - Always visible */}
        <button 
          className="add-exercise-btn" 
          onClick={() => setIsAddExerciseModalOpen(true)}
        >
          + Übung hinzufügen
        </button>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </section>

      {/* Add Exercise Modal */}
      <AddExerciseModal
        isOpen={isAddExerciseModalOpen}
        onClose={() => setIsAddExerciseModalOpen(false)}
        onAddExercise={handleAddExercise}
        availableMuscleGroups={muscleGroups}
        availableExercises={EXERCISE_DATABASE}
      />
    </div>
  );
};

export default WorkoutPage;