import { describe, test, expect, vi, beforeEach } from 'vitest';
import { statisticsService } from './statisticsService.js';

// Mock the calculations module
vi.mock('../utils/calculations.js', () => ({
  calculateMetricValue: vi.fn(),
  filterWorkoutsByPeriod: vi.fn(),
  groupStatsByPeriod: vi.fn(),
}));

// Import mocked functions
import { 
  calculateMetricValue, 
  filterWorkoutsByPeriod, 
  groupStatsByPeriod 
} from '../utils/calculations.js';

describe('StatisticsService', () => {
  const mockWorkouts = [
    {
      id: 'workout-1',
      date: '2024-01-15',
      name: 'Push Day',
      exercises: [
        {
          name: 'Bankdrücken',
          muscleGroup: 'Brust',
          sets: [
            { weight: '80', reps: '10' },
            { weight: '85', reps: '8' }
          ]
        },
        {
          name: 'Schulterdrücken',
          muscleGroup: 'Schultern',
          sets: [
            { weight: '50', reps: '12' }
          ]
        }
      ]
    },
    {
      id: 'workout-2',
      date: '2024-01-20',
      name: 'Pull Day',
      exercises: [
        {
          name: 'Bankdrücken',
          muscleGroup: 'Brust',
          sets: [
            { weight: '90', reps: '6' }
          ]
        }
      ]
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations
    filterWorkoutsByPeriod.mockImplementation((workouts) => workouts);
    groupStatsByPeriod.mockImplementation((stats) => stats);
    calculateMetricValue.mockReturnValue(0);
  });

  // ========================================
  // GET EXERCISE STATS TESTS
  // ========================================

  describe('getExerciseStats', () => {
    test('should return exercise statistics for specific exercise', () => {
      // Arrange
      const exerciseName = 'Bankdrücken';
      const metric = 'maxWeight';
      const period = '1M';
      const grouping = 'week';
      
      calculateMetricValue
        .mockReturnValueOnce(85) // First workout: max weight 85
        .mockReturnValueOnce(90); // Second workout: max weight 90
      
      const expectedStats = [
        { date: '2024-01-15', value: 85, metric: 'maxWeight', workoutId: 'workout-1' },
        { date: '2024-01-20', value: 90, metric: 'maxWeight', workoutId: 'workout-2' }
      ];
      
      groupStatsByPeriod.mockReturnValue(expectedStats);

      // Act
      const result = statisticsService.getExerciseStats(
        mockWorkouts, 
        exerciseName, 
        metric, 
        period, 
        grouping
      );

      // Assert
      expect(filterWorkoutsByPeriod).toHaveBeenCalledWith(mockWorkouts, period);
      expect(calculateMetricValue).toHaveBeenCalledTimes(2);
      expect(calculateMetricValue).toHaveBeenCalledWith(
        [{ weight: '80', reps: '10' }, { weight: '85', reps: '8' }], 
        metric
      );
      expect(calculateMetricValue).toHaveBeenCalledWith(
        [{ weight: '90', reps: '6' }], 
        metric
      );
      expect(groupStatsByPeriod).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ date: '2024-01-15', value: 85 }),
          expect.objectContaining({ date: '2024-01-20', value: 90 })
        ]),
        grouping
      );
      expect(result).toEqual(expectedStats);
    });

    test('should filter workouts by period before processing', () => {
      // Arrange
      const filteredWorkouts = [mockWorkouts[0]];
      filterWorkoutsByPeriod.mockReturnValue(filteredWorkouts);
      groupStatsByPeriod.mockReturnValue([]);

      // Act
      statisticsService.getExerciseStats(mockWorkouts, 'Bankdrücken', 'maxWeight', '1M', 'week');

      // Assert
      expect(filterWorkoutsByPeriod).toHaveBeenCalledWith(mockWorkouts, '1M');
    });

    test('should only process exercises with matching name', () => {
      // Arrange
      calculateMetricValue.mockReturnValue(50);
      groupStatsByPeriod.mockReturnValue([]);

      // Act
      statisticsService.getExerciseStats(mockWorkouts, 'Schulterdrücken', 'maxWeight');

      // Assert
      expect(calculateMetricValue).toHaveBeenCalledTimes(1);
      expect(calculateMetricValue).toHaveBeenCalledWith(
        [{ weight: '50', reps: '12' }], 
        'maxWeight'
      );
    });

    test('should return empty array when no matching exercises found', () => {
      // Arrange
      groupStatsByPeriod.mockReturnValue([]);

      // Act
      const result = statisticsService.getExerciseStats(mockWorkouts, 'NonExistentExercise');

      // Assert
      expect(calculateMetricValue).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    test('should sort results by date', () => {
      // Arrange
      const unsortedStats = [
        { date: '2024-01-20', value: 90, metric: 'maxWeight' },
        { date: '2024-01-15', value: 85, metric: 'maxWeight' }
      ];
      groupStatsByPeriod.mockReturnValue(unsortedStats);
      calculateMetricValue.mockReturnValue(85);

      // Act
      const result = statisticsService.getExerciseStats(mockWorkouts, 'Bankdrücken');

      // Assert
      expect(result[0].date).toBe('2024-01-15');
      expect(result[1].date).toBe('2024-01-20');
    });
  });

  // ========================================
  // GET MUSCLE STATS TESTS
  // ========================================

  describe('getMuscleStats', () => {
    test('should calculate volume for muscle group', () => {
      // Arrange
      const muscleGroup = 'Brust';
      const metric = 'volume';
      
      calculateMetricValue
        .mockReturnValueOnce(1500) // First workout volume
        .mockReturnValueOnce(540); // Second workout volume
      
      const expectedStats = [
        { date: '2024-01-15', value: 1500, metric: 'volume', workoutId: 'workout-1' },
        { date: '2024-01-20', value: 540, metric: 'volume', workoutId: 'workout-2' }
      ];
      groupStatsByPeriod.mockReturnValue(expectedStats);

      // Act
      const result = statisticsService.getMuscleStats(mockWorkouts, muscleGroup, metric);

      // Assert
      expect(calculateMetricValue).toHaveBeenCalledWith(
        [{ weight: '80', reps: '10' }, { weight: '85', reps: '8' }], 
        'totalVolume'
      );
      expect(calculateMetricValue).toHaveBeenCalledWith(
        [{ weight: '90', reps: '6' }], 
        'totalVolume'
      );
      expect(result).toEqual(expectedStats);
    });

    test('should calculate max weight for muscle group', () => {
      // Arrange
      const muscleGroup = 'Brust';
      const metric = 'maxWeight';
      
      calculateMetricValue
        .mockReturnValueOnce(85) // First workout max weight
        .mockReturnValueOnce(90); // Second workout max weight
      
      groupStatsByPeriod.mockReturnValue([]);

      // Act
      statisticsService.getMuscleStats(mockWorkouts, muscleGroup, metric);

      // Assert
      expect(calculateMetricValue).toHaveBeenCalledWith(
        [{ weight: '80', reps: '10' }, { weight: '85', reps: '8' }], 
        'maxWeight'
      );
      expect(calculateMetricValue).toHaveBeenCalledWith(
        [{ weight: '90', reps: '6' }], 
        'maxWeight'
      );
    });

    test('should calculate total sets for muscle group', () => {
      // Arrange
      const muscleGroup = 'Brust';
      const metric = 'totalSets';
      
      calculateMetricValue
        .mockReturnValueOnce(2) // First workout: 2 sets
        .mockReturnValueOnce(1); // Second workout: 1 set
      
      groupStatsByPeriod.mockReturnValue([]);

      // Act
      statisticsService.getMuscleStats(mockWorkouts, muscleGroup, metric);

      // Assert
      expect(calculateMetricValue).toHaveBeenCalledWith(
        [{ weight: '80', reps: '10' }, { weight: '85', reps: '8' }], 
        'totalSets'
      );
      expect(calculateMetricValue).toHaveBeenCalledWith(
        [{ weight: '90', reps: '6' }], 
        'totalSets'
      );
    });

    test('should calculate average reps for muscle group', () => {
      // Arrange
      const muscleGroup = 'Brust';
      const metric = 'avgReps';
      
      calculateMetricValue
        .mockReturnValueOnce(18) // First workout: total reps
        .mockReturnValueOnce(2)  // First workout: total sets
        .mockReturnValueOnce(6)  // Second workout: total reps
        .mockReturnValueOnce(1); // Second workout: total sets
      
      groupStatsByPeriod.mockReturnValue([]);

      // Act
      statisticsService.getMuscleStats(mockWorkouts, muscleGroup, metric);

      // Assert
      expect(calculateMetricValue).toHaveBeenCalledWith(
        [{ weight: '80', reps: '10' }, { weight: '85', reps: '8' }], 
        'totalReps'
      );
      expect(calculateMetricValue).toHaveBeenCalledWith(
        [{ weight: '80', reps: '10' }, { weight: '85', reps: '8' }], 
        'totalSets'
      );
    });

    test('should calculate frequency for muscle group', () => {
      // Arrange
      const muscleGroup = 'Brust';
      const metric = 'frequency';
      
      groupStatsByPeriod.mockReturnValue([]);

      // Act
      statisticsService.getMuscleStats(mockWorkouts, muscleGroup, metric);

      // Assert
      expect(calculateMetricValue).not.toHaveBeenCalled();
    });

    test('should return empty array when no exercises match muscle group', () => {
      // Arrange
      const muscleGroup = 'Beine';
      groupStatsByPeriod.mockReturnValue([]);

      // Act
      const result = statisticsService.getMuscleStats(mockWorkouts, muscleGroup);

      // Assert
      expect(calculateMetricValue).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  // ========================================
  // GET GENERAL STATS TESTS
  // ========================================

  describe('getGeneralStats', () => {
    test('should calculate total workouts', () => {
      // Arrange
      const metric = 'totalWorkouts';
      const expectedStats = [
        { date: '2024-01-15', value: 1, metric: 'totalWorkouts', workoutId: 'workout-1' },
        { date: '2024-01-20', value: 1, metric: 'totalWorkouts', workoutId: 'workout-2' }
      ];
      groupStatsByPeriod.mockReturnValue(expectedStats);

      // Act
      const result = statisticsService.getGeneralStats(mockWorkouts, metric);

      // Assert
      expect(result).toEqual(expectedStats);
    });

    test('should calculate total exercises', () => {
      // Arrange
      const metric = 'totalExercises';
      const expectedStats = [
        { date: '2024-01-15', value: 2, metric: 'totalExercises', workoutId: 'workout-1' },
        { date: '2024-01-20', value: 1, metric: 'totalExercises', workoutId: 'workout-2' }
      ];
      groupStatsByPeriod.mockReturnValue(expectedStats);

      // Act
      const result = statisticsService.getGeneralStats(mockWorkouts, metric);

      // Assert
      expect(result).toEqual(expectedStats);
    });

    test('should calculate workout duration', () => {
      // Arrange
      const workoutsWithDuration = [
        {
          ...mockWorkouts[0],
          startTime: '10:00',
          endTime: '11:30'
        }
      ];
      const metric = 'avgWorkoutDuration';
      groupStatsByPeriod.mockReturnValue([]);

      // Act
      statisticsService.getGeneralStats(workoutsWithDuration, metric);

      // Assert
      // Duration should be calculated: 11:30 - 10:00 = 90 minutes
    });

    test('should calculate total volume', () => {
      // Arrange
      const metric = 'totalVolume';
      groupStatsByPeriod.mockReturnValue([]);

      // Act
      statisticsService.getGeneralStats(mockWorkouts, metric);

      // Assert
      // Volume calculation: (80×10) + (85×8) + (50×12) + (90×6) = 800 + 680 + 600 + 540 = 2620
    });

    test('should calculate average workouts per week', () => {
      // Arrange
      const metric = 'avgWorkoutsPerWeek';
      const expectedStats = [
        { date: '2024-01-15', value: 1, metric: 'avgWorkoutsPerWeek', workoutId: 'workout-1' },
        { date: '2024-01-20', value: 1, metric: 'avgWorkoutsPerWeek', workoutId: 'workout-2' }
      ];
      groupStatsByPeriod.mockReturnValue(expectedStats);

      // Act
      const result = statisticsService.getGeneralStats(mockWorkouts, metric);

      // Assert
      expect(result).toEqual(expectedStats);
    });

    test('should handle workouts without start/end time', () => {
      // Arrange
      const workoutsWithoutTime = [
        {
          ...mockWorkouts[0],
          startTime: null,
          endTime: null
        }
      ];
      const metric = 'avgWorkoutDuration';
      groupStatsByPeriod.mockReturnValue([]);

      // Act
      statisticsService.getGeneralStats(workoutsWithoutTime, metric);

      // Assert
      // Should handle missing times gracefully
    });
  });

  // ========================================
  // INTEGRATION TESTS
  // ========================================

  describe('Integration Tests', () => {
    test('should handle complete statistics workflow', () => {
      // Arrange
      const exerciseName = 'Bankdrücken';
      const muscleGroup = 'Brust';
      const metric = 'maxWeight';
      const period = '1M';
      const grouping = 'week';
      
      calculateMetricValue.mockReturnValue(85);
      filterWorkoutsByPeriod.mockReturnValue(mockWorkouts);
      groupStatsByPeriod.mockReturnValue([
        { date: '2024-01-15', value: 85, metric: 'maxWeight' }
      ]);

      // Act
      const exerciseStats = statisticsService.getExerciseStats(mockWorkouts, exerciseName, metric, period, grouping);
      const muscleStats = statisticsService.getMuscleStats(mockWorkouts, muscleGroup, metric, period, grouping);
      const generalStats = statisticsService.getGeneralStats(mockWorkouts, 'totalWorkouts', period, grouping);

      // Assert
      expect(exerciseStats).toBeDefined();
      expect(muscleStats).toBeDefined();
      expect(generalStats).toBeDefined();
      
      expect(filterWorkoutsByPeriod).toHaveBeenCalledTimes(3);
      expect(groupStatsByPeriod).toHaveBeenCalledTimes(3);
    });

    test('should handle empty workouts array', () => {
      // Arrange
      const emptyWorkouts = [];
      filterWorkoutsByPeriod.mockReturnValue(emptyWorkouts);
      groupStatsByPeriod.mockReturnValue([]);

      // Act
      const exerciseStats = statisticsService.getExerciseStats(emptyWorkouts, 'Bankdrücken');
      const muscleStats = statisticsService.getMuscleStats(emptyWorkouts, 'Brust');
      const generalStats = statisticsService.getGeneralStats(emptyWorkouts, 'totalWorkouts');

      // Assert
      expect(exerciseStats).toEqual([]);
      expect(muscleStats).toEqual([]);
      expect(generalStats).toEqual([]);
    });
  });
});

