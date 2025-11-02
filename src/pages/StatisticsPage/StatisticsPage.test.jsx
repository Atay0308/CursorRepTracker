/**
 * StatisticsPage Component Tests
 * 
 * Tests for the StatisticsPage component including:
 * - Component rendering
 * - Basic functionality
 * - Error handling
 */

import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StatisticsPage from './StatisticsPage.jsx';

// Mock the statsAPI and statisticsService
vi.mock('../../services/statsAPI', () => ({
  statsAPI: {
    getAllWorkouts: vi.fn(),
    getAvailableExercises: vi.fn(),
    getAvailableMuscles: vi.fn()
  }
}));

vi.mock('../../services/statisticsService', () => ({
  statisticsService: {
    getExerciseStats: vi.fn(),
    getMuscleStats: vi.fn(),
    getGeneralStats: vi.fn()
  }
}));

describe('StatisticsPage', () => {
  const mockWorkouts = [
    {
      id: '1',
      name: 'Test Workout',
      date: '2024-01-01',
      exercises: [
        {
          id: 'ex1',
          name: 'Push-ups',
          muscleGroup: 'Chest',
          sets: [{ weight: '80', reps: '10' }]
        }
      ]
    }
  ];

  const mockExercises = ['Push-ups', 'Squats', 'Deadlift'];
  const mockChartData = [
    { date: '2024-01-01', value: 80 },
    { date: '2024-01-02', value: 85 }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock successful API responses
    const { statsAPI } = require('../../services/statsAPI.js');
    const { statisticsService } = require('../../services/statisticsService.js');
    
    // Set up mock implementations
    statsAPI.getAllWorkouts = vi.fn().mockResolvedValue(mockWorkouts);
    statsAPI.getAvailableExercises = vi.fn().mockResolvedValue(mockExercises);
    statsAPI.getAvailableMuscles = vi.fn().mockResolvedValue(['Chest', 'Legs', 'Back']);
    
    statisticsService.getExerciseStats = vi.fn().mockReturnValue(mockChartData);
    statisticsService.getMuscleStats = vi.fn().mockReturnValue(mockChartData);
    statisticsService.getGeneralStats = vi.fn().mockReturnValue(mockChartData);
  });

  const renderStatisticsPage = () => {
    return render(
      <BrowserRouter>
        <StatisticsPage />
      </BrowserRouter>
    );
  };

  test('should render page title and subtitle', async () => {
    renderStatisticsPage();
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Statistik' })).toBeInTheDocument();
      expect(screen.getByText('Verfolgen Sie Ihre Fortschritte und analysieren Sie Ihre Trainingsdaten')).toBeInTheDocument();
    });
  });

  test('should render filter components', async () => {
    renderStatisticsPage();
    
    await waitFor(() => {
      expect(screen.getByText('GENERAL')).toBeInTheDocument();
      expect(screen.getByText('MUSCLES')).toBeInTheDocument();
      expect(screen.getByText('EXERCISES')).toBeInTheDocument();
      expect(screen.getByLabelText('Choose Metric')).toBeInTheDocument();
      expect(screen.getByText('Time Period')).toBeInTheDocument();
      expect(screen.getByText('Group By')).toBeInTheDocument();
    });
  });

  test('should render bottom navigation', async () => {
    renderStatisticsPage();
    
    await waitFor(() => {
      expect(screen.getByText('Start')).toBeInTheDocument();
      expect(screen.getByText('Verganene Einheiten')).toBeInTheDocument();
      expect(screen.getByText('Trainingspläne')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Zur Statistik' })).toBeInTheDocument();
    });
  });

  test('should handle API errors gracefully', async () => {
    const { statsAPI } = require('../../services/statsAPI.js');
    statsAPI.getAllWorkouts = vi.fn().mockRejectedValue(new Error('API Error'));
    
    renderStatisticsPage();
    
    await waitFor(() => {
      // Should still render the page even with API errors
      expect(screen.getByRole('heading', { name: 'Statistik' })).toBeInTheDocument();
    });
  });

  test('should display empty state when no data available', async () => {
    const { statisticsService } = require('../../services/statisticsService.js');
    statisticsService.getGeneralStats = vi.fn().mockReturnValue([]);
    
    renderStatisticsPage();
    
    await waitFor(() => {
      expect(screen.getByText('Keine Daten verfügbar')).toBeInTheDocument();
    });
  });
});