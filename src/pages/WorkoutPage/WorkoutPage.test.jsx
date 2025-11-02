import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import WorkoutPage from './WorkoutPage.jsx';

// Mock React Router - simuliert useParams und useNavigate
const mockNavigate = vi.fn(); // Mock-Funktion für Navigation
const mockParams = { id: 'new' }; // Simuliert was useParams() zurückgibt

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => mockParams, // Überschreibe nur useParams
    useNavigate: () => mockNavigate, // Überschreibe nur useNavigate
  };
});

// Mock AddExerciseModal - realistischere Version für Tests
vi.mock('../../components/AddExerciseModal/AddExerciseModal', () => ({
  default: ({ isOpen, onAddExercise, onClose }) => {
    const [currentView, setCurrentView] = React.useState('muscleGrid');
    const [selectedMuscleGroup, setSelectedMuscleGroup] = React.useState('');
    
    const handleMuscleGroupSelect = (muscleGroup) => {
      setSelectedMuscleGroup(muscleGroup);
      setCurrentView('exerciseList');
    };
    
    const handleExerciseSelect = (exerciseData) => {
      onAddExercise(exerciseData);
      onClose();
    };
    
    return isOpen ? (
      <div data-testid="add-exercise-modal">
        {currentView === 'muscleGrid' ? (
          /* Muscle Grid View */
          <div data-testid="muscle-grid">
            <button onClick={() => handleMuscleGroupSelect('Chest')}>
              Brust (Chest)
            </button>
          </div>
        ) : (
          /* Exercise List View */
          <div data-testid="exercise-list">
            <button onClick={() => setCurrentView('muscleGrid')}>
              ← Zurück zu Muskelgruppen
            </button>
            <h3>Übungen für {selectedMuscleGroup}</h3>
            <button onClick={() => handleExerciseSelect({ name: 'Push-ups', muscleGroup: selectedMuscleGroup })}>
              Push-ups
            </button>
          </div>
        )}
        <button onClick={onClose}>Close</button>
      </div>
    ) : null;
  }
}));

// Mock ExerciseCard - vereinfachte Version für Tests
vi.mock('../../components/ExerciseCard/ExerciseCard', () => ({
  default: ({ exercise, onUpdateExercise, onRemoveExercise, onAddSet }) => (
    <div data-testid={`exercise-card-${exercise.id}`}>
      <span>{exercise.name}</span>
      <button onClick={() => onRemoveExercise(exercise.id)}>Remove</button>
      <button onClick={() => onAddSet(exercise.id)}>Add Set</button>
    </div>
  )
}));

// Mock utilities - alle Funktionen aus general.js
vi.mock('../../utils/general', () => ({
  generateId: vi.fn(() => 'test-id'), // Mock für ID-Generierung
  saveWorkoutToLocalStorage: vi.fn(), // Mock für LocalStorage-Speicherung
  loadWorkoutFromLocalStorage: vi.fn(() => null), // Mock für LocalStorage-Laden
  removeWorkoutFromLocalStorage: vi.fn(), // Mock für LocalStorage-Löschen
  hasWorkoutInLocalStorage: vi.fn(() => false), // Mock für LocalStorage-Prüfung
}));

// Mock date/time utilities
vi.mock('../../utils/dateTime', () => ({
  formatDate: vi.fn(() => '2024-01-01'), // Mock für Datumsformatierung
  getCurrentDate: vi.fn(() => '2024-01-01'), // Mock für aktuelles Datum
  getCurrentTime: vi.fn(() => '10:00'), // Mock für aktuelle Zeit
}));

// Mock validation utilities
vi.mock('../../utils/validation', () => ({
  validateWorkout: vi.fn(() => ({ isValid: true, errors: [] })), // Mock für Workout-Validierung
}));

// Mock exercise database
vi.mock('../../data/exerciseDatabase', () => ({
  EXERCISE_DATABASE: {} // Leere Datenbank für Tests
}));

// Mock fetch für API-Calls
global.fetch = vi.fn();

// Mock DOM methods die in Tests nicht verfügbar sind
const mockScrollIntoView = vi.fn();
const mockFocus = vi.fn();

// Mock document.querySelector um Element mit gemockten Methoden zurückzugeben
Object.defineProperty(document, 'querySelector', {
  value: vi.fn((selector) => {
    if (selector === '.add-exercise-btn') {
      return {
        scrollIntoView: mockScrollIntoView,
        focus: mockFocus
      };
    }
    return null;
  }),
  writable: true
});

// Helper function - rendert WorkoutPage mit Router
const renderWorkoutPage = () => {
  return render(
    <BrowserRouter>
      <WorkoutPage />
    </BrowserRouter>
  );
};

describe('WorkoutPage', () => {
  beforeEach(() => {
    // Vor jedem Test: alle Mocks zurücksetzen
    vi.clearAllMocks();
    mockParams.id = 'new'; // Setze Standard-Parameter
    
    // Reset DOM method mocks
    mockScrollIntoView.mockClear();
    mockFocus.mockClear();
  });

  // ========================================
  // RENDERING TESTS
  // ========================================
  
  test('should render workout page with all essential elements', () => {
    renderWorkoutPage();
    
    // Prüfe ob alle wichtigen UI-Elemente gerendert werden
    expect(screen.getByLabelText('Trainingsname')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Übung hinzufügen' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Training beenden und speichern' })).toBeInTheDocument();
  });

  // ========================================
  // MODAL INTEGRATION TESTS
  // ========================================
  
  test('should open add exercise modal when button is clicked', () => {
    renderWorkoutPage();
    
    // Klicke auf "Übung hinzufügen" Button
    const addButton = screen.getByRole('button', { name: '+ Übung hinzufügen' });
    fireEvent.click(addButton);
    
    // Prüfe ob Modal geöffnet wird
    expect(screen.getByTestId('add-exercise-modal')).toBeInTheDocument();
  });

  test('should close modal after exercise is added', async () => {
    renderWorkoutPage();
    
    // Öffne Modal
    const addButton = screen.getByRole('button', { name: '+ Übung hinzufügen' });
    fireEvent.click(addButton);
    
    // Prüfe ob Modal geöffnet ist und Muscle Grid View zeigt
    expect(screen.getByTestId('add-exercise-modal')).toBeInTheDocument();
    expect(screen.getByTestId('muscle-grid')).toBeInTheDocument();
    
    // Schritt 1: Wähle Muskelgruppe
    const chestButton1 = screen.getByText('Brust (Chest)');
    fireEvent.click(chestButton1);
    
    // Prüfe ob Exercise List View gezeigt wird
    expect(screen.getByTestId('exercise-list')).toBeInTheDocument();
    expect(screen.getByText('Übungen für Chest')).toBeInTheDocument();
    
    // Schritt 2: Wähle Übung
    const pushUpsButton1 = screen.getByText('Push-ups');
    fireEvent.click(pushUpsButton1);
    
    // Prüfe ob ExerciseCard gerendert wird (zeigt, dass Übung hinzugefügt wurde)
    await waitFor(() => {
      expect(screen.getByTestId('exercise-card-test-id')).toBeInTheDocument();
    });
    
    // Modal sollte geschlossen sein (da onClose aufgerufen wird)
    expect(screen.queryByTestId('add-exercise-modal')).not.toBeInTheDocument();
  });

  // ========================================
  // STATE MANAGEMENT TESTS
  // ========================================
  
  test('should update workout name when input changes', () => {
    renderWorkoutPage();
    
    // Ändere Workout-Name
    const nameInput = screen.getByLabelText('Trainingsname');
    fireEvent.change(nameInput, { target: { value: 'Test Workout' } });
    
    // Prüfe ob Wert geändert wurde
    expect(nameInput).toHaveValue('Test Workout');
  });

  // ========================================
  // STATE MANAGEMENT TESTS
  // ========================================
  
  test('should update workout state when name changes', () => {
    renderWorkoutPage();
    
    // Ändere Workout-Name
    const nameInput = screen.getByLabelText('Trainingsname');
    fireEvent.change(nameInput, { target: { value: 'Test Workout' } });
    
    // Prüfe ob Input-Wert geändert wurde (zeigt, dass State geändert wurde)
    expect(nameInput).toHaveValue('Test Workout');
    
    // LocalStorage wird automatisch aufgerufen, aber wir testen nur das State-Management
    // Der eigentliche LocalStorage-Test ist in general.test.js
  });

  test('should update workout state when exercise is added', async () => {
    renderWorkoutPage();
    
    // Öffne Modal und füge Übung hinzu
    const addButton = screen.getByRole('button', { name: '+ Übung hinzufügen' });
    fireEvent.click(addButton);
    
    // Schritt 1: Wähle Muskelgruppe
    const chestButton2 = screen.getByText('Brust (Chest)');
    fireEvent.click(chestButton2);
    
    // Schritt 2: Wähle Übung
    const pushUpsButton2 = screen.getByText('Push-ups');
    fireEvent.click(pushUpsButton2);
    
    // Prüfe ob ExerciseCard gerendert wird (zeigt, dass State geändert wurde)
    await waitFor(() => {
      expect(screen.getByTestId('exercise-card-test-id')).toBeInTheDocument();
    });
    
    // LocalStorage wird automatisch aufgerufen, aber wir testen nur das State-Management
    // Der eigentliche LocalStorage-Test ist in general.test.js
  });

  // ========================================
  // EXERCISE STATE MANAGEMENT TESTS
  // ========================================
  
  test('should add exercise to workout state', async () => {
    renderWorkoutPage();
    
    // Öffne Modal und füge Übung hinzu
    const addButton = screen.getByRole('button', { name: '+ Übung hinzufügen' });
    fireEvent.click(addButton);
    
    // Schritt 1: Wähle Muskelgruppe
    const chestButton3 = screen.getByText('Brust (Chest)');
    fireEvent.click(chestButton3);
    
    // Schritt 2: Wähle Übung
    const pushUpsButton3 = screen.getByText('Push-ups');
    fireEvent.click(pushUpsButton3);
    
    // Prüfe ob ExerciseCard gerendert wird (zeigt, dass State geändert wurde)
    await waitFor(() => {
      expect(screen.getByTestId('exercise-card-test-id')).toBeInTheDocument();
      expect(screen.getByText('Push-ups')).toBeInTheDocument();
    });
  });

  test('should remove exercise from workout state', async () => {
    renderWorkoutPage();
    
    // Füge zuerst eine Übung hinzu
    const addButton = screen.getByRole('button', { name: '+ Übung hinzufügen' });
    fireEvent.click(addButton);
    
    // Schritt 1: Wähle Muskelgruppe
    const chestButton4 = screen.getByText('Brust (Chest)');
    fireEvent.click(chestButton4);
    
    // Schritt 2: Wähle Übung
    const pushUpsButton4 = screen.getByText('Push-ups');
    fireEvent.click(pushUpsButton4);
    
    // Warte darauf, dass Übung hinzugefügt wird
    await waitFor(() => {
      expect(screen.getByTestId('exercise-card-test-id')).toBeInTheDocument();
    });
    
    // Entferne die Übung
    const removeButton = screen.getByText('Remove');
    fireEvent.click(removeButton);
    
    // Prüfe ob ExerciseCard entfernt wurde (zeigt, dass State geändert wurde)
    await waitFor(() => {
      expect(screen.queryByTestId('exercise-card-test-id')).not.toBeInTheDocument();
    });
  });

  // ========================================
  // EDGE CASES TESTS
  // ========================================
  
  test('should handle workout with existing exercises from localStorage', async () => {
    // Importiere Mock-Funktionen
    const { loadWorkoutFromLocalStorage } = await import('../../utils/general.js');
    
    // Mock existing workout
    const existingWorkout = {
      id: 'existing-workout',
      name: 'Existing Workout',
      exercises: [
        {
          id: 'existing-exercise',
          name: 'Squats',
          muscleGroup: 'Legs',
          sets: [{ id: 'existing-set', weight: '50', reps: '10' }]
        }
      ]
    };
    
    // Setze Mock-Rückgabewert
    loadWorkoutFromLocalStorage.mockReturnValue(existingWorkout);
    mockParams.id = 'existing-workout';
    
    renderWorkoutPage();
    
    // Prüfe ob bestehende Übung geladen wird
    expect(screen.getByDisplayValue('Existing Workout')).toBeInTheDocument();
    expect(screen.getByTestId('exercise-card-existing-exercise')).toBeInTheDocument();
  });
});