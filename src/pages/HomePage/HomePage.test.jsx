import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, test, beforeEach, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// API und Utilities mocken
const mockWorkouts = [
    {
      id: 'w1',
      name: 'Push Day',
      date: '2024-01-15',
      exercises: [{ name: 'Bench Press', sets: [] }]
    },
    {
      id: 'w2',
      name: 'Pull Day',
      date: '2024-01-14',
      exercises: [{ name: 'Deadlift', sets: [] }]
    },
    {
      id: 'w3',
      name: 'Leg Day',
      date: '2024-01-13',
      exercises: [{ name: 'Squats', sets: [] }]
    }
  ];
  

vi.mock('../../services/api.js', () => ({
  workoutAPI: {
    getRecentWorkouts: vi.fn(),
    getAllWorkouts: vi.fn(),
  },
}));

vi.mock('../../utils/general.js', () => ({
  getCurrentWorkoutFromLocalStorage: vi.fn(() => null),
}));

// Child-Komponenten mocken
vi.mock('../../components/DateDisplay/DateDisplay.jsx', () => ({
  default: () => <div data-testid="date-display" />
}));

vi.mock('../../components/StartWorkout/StartWorkout.jsx', () => ({
  default: ({ localStorageWorkout }) => (
    <div data-testid="start-workout">
      <button>Neues Training starten</button>
      {localStorageWorkout && <button>Training fortsetzen</button>}
    </div>
  )
}));

vi.mock('../../components/BottomNavigation/BottomNavigation.jsx', () => ({
  default: () => <div data-testid="bottom-navigation" />
}));

vi.mock('../../components/BottomNavigation/BottomNavigation.jsx', () => ({
    default: ({ onNavigate }) => (
      <div data-testid="bottom-navigation">
        <button onClick={() => onNavigate('/statistics')}>Statistik</button>
        <button onClick={() => onNavigate('/past-workouts')}>Vergangene Einheiten</button>
        <button onClick={() => onNavigate('/plans')}>Trainingspläne</button>
        <button onClick={() => onNavigate('/start')}>Start</button>
      </div>
    )
  }));

  vi.mock('../../components/WorkoutCard/WorkoutCard.jsx', () => ({
    default: ({ workout }) => <div>{workout.name}</div>
  }));

import HomePage from './HomePage.jsx';
import { workoutAPI } from '../../services/api.js';
import { getCurrentWorkoutFromLocalStorage } from '../../utils/general.js';

vi.mock('../../utils/general.js', () => ({
    getCurrentWorkoutFromLocalStorage: vi.fn(),
  }));

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderHome = () =>
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

  //  Essentials
  test('renders essential components', async () => {
    workoutAPI.getRecentWorkouts.mockResolvedValue(mockWorkouts);

    renderHome();

    expect(await screen.findByTestId('date-display')).toBeInTheDocument();
    expect(screen.getByTestId('start-workout')).toBeInTheDocument();
    expect(screen.getByTestId('bottom-navigation')).toBeInTheDocument();
  });

  //  Start Workout Button
  test('renders start workout button', async () => {
    renderHome();
    expect(screen.getByText('Neues Training starten')).toBeInTheDocument();
  });

  test('shows "Fortsetzen"-Button if workout in localStorage', async () => {
    getCurrentWorkoutFromLocalStorage.mockReturnValue({
      id: 'draft-1',
      name: 'Draft Workout'
    });
  
    renderHome();
  
    expect(await screen.findByText('Training fortsetzen')).toBeInTheDocument();
  });
  

  // Loading State
  test('shows loading spinner and text while fetching workouts', async () => {
    // Never resolves → Loading bleibt sichtbar
    workoutAPI.getRecentWorkouts.mockImplementation(() => new Promise(() => {}));

    renderHome();

    expect(screen.getByText('⏳')).toBeInTheDocument();
    expect(screen.getByText('Lade letzte Workouts...')).toBeInTheDocument();
  });

  // ✅ Error State
  test('shows error message when API fails', async () => {
    workoutAPI.getRecentWorkouts.mockRejectedValue(new Error('API Fehler'));

    renderHome();

    expect(await screen.findByText('Fehler beim Laden der letzten Trainingseinheiten')).toBeInTheDocument();
  });

  // ✅ Recent Workouts
  test('renders last 3 workouts', async () => {
    workoutAPI.getRecentWorkouts.mockResolvedValue(mockWorkouts);

    renderHome();

    // Wir warten, bis die WorkoutCards gerendert werden
    const workoutCards = await screen.findAllByText(/Day/); // matcht 'Push Day', 'Pull Day', 'Leg Day'
    expect(workoutCards).toHaveLength(3);
    expect(screen.getByText('Push Day')).toBeInTheDocument();
    expect(screen.getByText('Pull Day')).toBeInTheDocument();
    expect(screen.getByText('Leg Day')).toBeInTheDocument();
  });



  test('bottom navigation buttons work', async () => {
    const { getByText } = renderHome();
  
    expect(getByText('Statistik')).toBeInTheDocument();
    expect(getByText('Vergangene Einheiten')).toBeInTheDocument();
    expect(getByText('Trainingspläne')).toBeInTheDocument();
    expect(getByText('Start')).toBeInTheDocument();
  });
});
