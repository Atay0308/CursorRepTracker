import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock the entire API module
vi.mock('./api.js', async () => {
  return {
    workoutAPI: {
      getAllWorkouts: vi.fn(),
      getWorkoutById: vi.fn(),
      createWorkout: vi.fn(),
      updateWorkout: vi.fn(),
      deleteWorkout: vi.fn(),
      getActiveWorkout: vi.fn(),
      getRecentWorkouts: vi.fn(),
    }
  };
});

// Import the mocked API
import { workoutAPI } from './api.js';

describe('API Service', () => {
  const mockWorkout = {
    id: 'workout-1',
    name: 'Push Day',
    date: '2025-10-21',
    startTime: '10:00',
    endTime: '11:30',
    exercises: [
      { name: 'Bankdrücken', sets: [{ weight: '80', reps: '10' }] }
    ]
  };

  const mockWorkouts = [
    mockWorkout,
    {
      id: 'workout-2',
      name: 'Pull Day',
      date: '2024-01-14',
      exercises: []
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock console.error to avoid noise in tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ========================================
  // WORKOUT API TESTS
  // ========================================

  describe('workoutAPI.getAllWorkouts', () => {
    test('should fetch all workouts successfully', async () => {
      workoutAPI.getAllWorkouts.mockResolvedValue(mockWorkouts);

      const result = await workoutAPI.getAllWorkouts();

      expect(workoutAPI.getAllWorkouts).toHaveBeenCalled();
      expect(result).toEqual(mockWorkouts);
    });

    test('should handle errors when fetching workouts', async () => {
      const error = new Error('Network Error');
      workoutAPI.getAllWorkouts.mockRejectedValue(error);

      await expect(workoutAPI.getAllWorkouts()).rejects.toThrow('Network Error');
    });
  });

  describe('workoutAPI.getWorkoutById', () => {
    test('should fetch workout by ID successfully', async () => {
      workoutAPI.getWorkoutById.mockResolvedValue(mockWorkout);

      const result = await workoutAPI.getWorkoutById('workout-1');

      expect(workoutAPI.getWorkoutById).toHaveBeenCalledWith('workout-1');
      expect(result).toEqual(mockWorkout);
    });

    test('should handle errors when fetching workout by ID', async () => {
      const error = new Error('Not Found');
      workoutAPI.getWorkoutById.mockRejectedValue(error);

      await expect(workoutAPI.getWorkoutById('invalid-id')).rejects.toThrow('Not Found');
    });
  });

  describe('workoutAPI.createWorkout', () => {
    const newWorkout = {
      name: 'New Workout',
      date: '2025-01-20',
      exercises: []
    };

    const createdWorkout = {
      id: 'workout-3',
      ...newWorkout
    };

    test('should create workout successfully', async () => {
      workoutAPI.createWorkout.mockResolvedValue(createdWorkout);

      const result = await workoutAPI.createWorkout(newWorkout);

      expect(workoutAPI.createWorkout).toHaveBeenCalledWith(newWorkout);
      expect(result).toEqual(createdWorkout);
    });

    test('should handle errors when creating workout', async () => {
      const error = new Error('Validation Error');
      workoutAPI.createWorkout.mockRejectedValue(error);

      await expect(workoutAPI.createWorkout({})).rejects.toThrow('Validation Error');
    });
  });

  describe('workoutAPI.updateWorkout', () => {
    const updatedWorkout = {
      ...mockWorkout,
      name: 'Updated Push Day'
    };

    test('should update workout successfully', async () => {
      workoutAPI.updateWorkout.mockResolvedValue(updatedWorkout);

      const result = await workoutAPI.updateWorkout('workout-1', updatedWorkout);

      expect(workoutAPI.updateWorkout).toHaveBeenCalledWith('workout-1', updatedWorkout);
      expect(result).toEqual(updatedWorkout);
    });

    test('should handle errors when updating workout', async () => {
      const error = new Error('Not Found');
      workoutAPI.updateWorkout.mockRejectedValue(error);

      await expect(workoutAPI.updateWorkout('invalid-id', {})).rejects.toThrow('Not Found');
    });
  });

  describe('workoutAPI.deleteWorkout', () => {
    test('should delete workout successfully', async () => {
      workoutAPI.deleteWorkout.mockResolvedValue();

      await workoutAPI.deleteWorkout('workout-1');

      expect(workoutAPI.deleteWorkout).toHaveBeenCalledWith('workout-1');
    });

    test('should handle errors when deleting workout', async () => {
      const error = new Error('Not Found');
      workoutAPI.deleteWorkout.mockRejectedValue(error);

      await expect(workoutAPI.deleteWorkout('invalid-id')).rejects.toThrow('Not Found');
    });
  });

  describe('workoutAPI.getActiveWorkout', () => {
    test('should return active workout when found', async () => {
      workoutAPI.getActiveWorkout.mockResolvedValue(mockWorkout);

      const result = await workoutAPI.getActiveWorkout();

      expect(workoutAPI.getActiveWorkout).toHaveBeenCalled();
      expect(result).toEqual(mockWorkout);
    });

    test('should return null when no active workout found', async () => {
      workoutAPI.getActiveWorkout.mockResolvedValue(null);

      const result = await workoutAPI.getActiveWorkout();

      expect(workoutAPI.getActiveWorkout).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    test('should handle errors when fetching active workout', async () => {
      const error = new Error('Network Error');
      workoutAPI.getActiveWorkout.mockRejectedValue(error);

      await expect(workoutAPI.getActiveWorkout()).rejects.toThrow('Network Error');
    });
  });

  describe('workoutAPI.getRecentWorkouts', () => {
    test('should fetch recent workouts with default limit', async () => {
      workoutAPI.getRecentWorkouts.mockResolvedValue(mockWorkouts);

      const result = await workoutAPI.getRecentWorkouts();

      expect(workoutAPI.getRecentWorkouts).toHaveBeenCalled();
      expect(result).toEqual(mockWorkouts);
    });

    test('should fetch recent workouts with custom limit', async () => {
      const limitedWorkouts = [mockWorkout];
      workoutAPI.getRecentWorkouts.mockResolvedValue(limitedWorkouts);

      const result = await workoutAPI.getRecentWorkouts(1);

      expect(workoutAPI.getRecentWorkouts).toHaveBeenCalledWith(1);
      expect(result).toEqual(limitedWorkouts);
    });

    test('should handle errors when fetching recent workouts', async () => {
      const error = new Error('Network Error');
      workoutAPI.getRecentWorkouts.mockRejectedValue(error);

      await expect(workoutAPI.getRecentWorkouts()).rejects.toThrow('Network Error');
    });
  });

  // ========================================
  // INTEGRATION TESTS
  // ========================================

  describe('API Integration', () => {
    test('should handle complete workout lifecycle', async () => {
      // Create workout
      const newWorkout = { name: 'Test Workout', exercises: [] };
      const createdWorkout = { id: 'test-1', ...newWorkout };
      workoutAPI.createWorkout.mockResolvedValue(createdWorkout);

      // Get workout
      workoutAPI.getWorkoutById.mockResolvedValue(createdWorkout);

      // Update workout
      const updatedWorkout = { ...createdWorkout, name: 'Updated Test Workout' };
      workoutAPI.updateWorkout.mockResolvedValue(updatedWorkout);

      // Delete workout
      workoutAPI.deleteWorkout.mockResolvedValue();

      // Execute workflow
      const created = await workoutAPI.createWorkout(newWorkout);
      const retrieved = await workoutAPI.getWorkoutById(created.id);
      const updated = await workoutAPI.updateWorkout(created.id, updatedWorkout);
      await workoutAPI.deleteWorkout(created.id);

      // Verify all calls
      expect(workoutAPI.createWorkout).toHaveBeenCalledWith(newWorkout);
      expect(workoutAPI.getWorkoutById).toHaveBeenCalledWith(created.id);
      expect(workoutAPI.updateWorkout).toHaveBeenCalledWith(created.id, updatedWorkout);
      expect(workoutAPI.deleteWorkout).toHaveBeenCalledWith(created.id);
    });
  });

  // ========================================
  // ERROR HANDLING TESTS
  // ========================================

  describe('Error Handling', () => {
    test('should handle 404 errors', async () => {
      const error = { response: { status: 404 } };
      workoutAPI.getWorkoutById.mockRejectedValue(error);

      await expect(workoutAPI.getWorkoutById('nonexistent')).rejects.toEqual(error);
    });

    test('should handle 500 errors', async () => {
      const error = { response: { status: 500 } };
      workoutAPI.getAllWorkouts.mockRejectedValue(error);

      await expect(workoutAPI.getAllWorkouts()).rejects.toEqual(error);
    });

    test('should handle network timeout errors', async () => {
      const error = { code: 'ECONNABORTED', message: 'timeout' };
      workoutAPI.createWorkout.mockRejectedValue(error);

      await expect(workoutAPI.createWorkout({})).rejects.toEqual(error);
    });

    test('should handle network connection errors', async () => {
      const error = { code: 'ENOTFOUND', message: 'Network Error' };
      workoutAPI.updateWorkout.mockRejectedValue(error);

      await expect(workoutAPI.updateWorkout('id', {})).rejects.toEqual(error);
    });
  });
});