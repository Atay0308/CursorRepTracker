import { describe, test, expect } from 'vitest';
import { validateWorkout, validateExercise, validateSet } from '../utils/validation.js';

describe('Validation Functions', () => {
  // ========================================
  // VALIDATE WORKOUT TESTS
  // ========================================

  describe('validateWorkout', () => {
    test('should return valid for complete workout', () => {
      // Arrange
      const validWorkout = {
        name: 'Push Day',
        date: '2024-01-15',
        startTime: '10:00',
        exercises: [
          { name: 'Bankdrücken', muscleGroup: 'Brust', sets: [{ weight: 80, reps: 10 }] }
        ]
      };

      // Act
      const result = validateWorkout(validWorkout);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test('should return invalid when name is missing', () => {
      // Arrange
      const invalidWorkout = {
        date: '2024-01-15',
        startTime: '10:00',
        exercises: []
      };

      // Act
      const result = validateWorkout(invalidWorkout);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Workout name is required');
    });

    test('should return invalid when name is empty string', () => {
      // Arrange
      const invalidWorkout = {
        name: '',
        date: '2024-01-15',
        startTime: '10:00',
        exercises: []
      };

      // Act
      const result = validateWorkout(invalidWorkout);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Workout name is required');
    });

    test('should return invalid when name is only whitespace', () => {
      // Arrange
      const invalidWorkout = {
        name: '   ',
        date: '2024-01-15',
        startTime: '10:00',
        exercises: []
      };

      // Act
      const result = validateWorkout(invalidWorkout);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Workout name is required');
    });

    test('should return invalid when date is missing', () => {
      // Arrange
      const invalidWorkout = {
        name: 'Push Day',
        startTime: '10:00',
        exercises: []
      };

      // Act
      const result = validateWorkout(invalidWorkout);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Workout date is required');
    });

    test('should return invalid when startTime is missing', () => {
      // Arrange
      const invalidWorkout = {
        name: 'Push Day',
        date: '2024-01-15',
        exercises: []
      };

      // Act
      const result = validateWorkout(invalidWorkout);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Start time is required');
    });

    test('should return invalid when exercises array is empty', () => {
      // Arrange
      const invalidWorkout = {
        name: 'Push Day',
        date: '2024-01-15',
        startTime: '10:00',
        exercises: []
      };

      // Act
      const result = validateWorkout(invalidWorkout);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('At least one exercise is required');
    });

    test('should return invalid when exercises property is missing', () => {
      // Arrange
      const invalidWorkout = {
        name: 'Push Day',
        date: '2024-01-15',
        startTime: '10:00'
      };

      // Act
      const result = validateWorkout(invalidWorkout);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('At least one exercise is required');
    });

    test('should return multiple errors for multiple validation failures', () => {
      // Arrange
      const invalidWorkout = {
        name: '',
        date: '',
        startTime: '',
        exercises: []
      };

      // Act
      const result = validateWorkout(invalidWorkout);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Workout name is required');
      expect(result.errors).toContain('Workout date is required');
      expect(result.errors).toContain('Start time is required');
      expect(result.errors).toContain('At least one exercise is required');
      expect(result.errors).toHaveLength(4);
    });

    test('should handle null and undefined values', () => {
      // Arrange
      const invalidWorkout = {
        name: null,
        date: undefined,
        startTime: null,
        exercises: null
      };

      // Act
      const result = validateWorkout(invalidWorkout);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Workout name is required');
      expect(result.errors).toContain('Workout date is required');
      expect(result.errors).toContain('Start time is required');
      expect(result.errors).toContain('At least one exercise is required');
    });
  });

  // ========================================
  // VALIDATE EXERCISE TESTS
  // ========================================

  describe('validateExercise', () => {
    test('should return valid for complete exercise', () => {
      // Arrange
      const validExercise = {
        name: 'Bankdrücken',
        muscleGroup: 'Brust',
        sets: [
          { weight: 80, reps: 10 },
          { weight: 85, reps: 8 }
        ]
      };

      // Act
      const result = validateExercise(validExercise);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test('should return invalid when name is missing', () => {
      // Arrange
      const invalidExercise = {
        muscleGroup: 'Brust',
        sets: [{ weight: 80, reps: 10 }]
      };

      // Act
      const result = validateExercise(invalidExercise);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Exercise name is required');
    });

    test('should return invalid when name is empty string', () => {
      // Arrange
      const invalidExercise = {
        name: '',
        muscleGroup: 'Brust',
        sets: [{ weight: 80, reps: 10 }]
      };

      // Act
      const result = validateExercise(invalidExercise);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Exercise name is required');
    });

    test('should return invalid when name is only whitespace', () => {
      // Arrange
      const invalidExercise = {
        name: '   ',
        muscleGroup: 'Brust',
        sets: [{ weight: 80, reps: 10 }]
      };

      // Act
      const result = validateExercise(invalidExercise);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Exercise name is required');
    });

    test('should return invalid when muscleGroup is missing', () => {
      // Arrange
      const invalidExercise = {
        name: 'Bankdrücken',
        sets: [{ weight: 80, reps: 10 }]
      };

      // Act
      const result = validateExercise(invalidExercise);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Muscle group is required');
    });

    test('should return invalid when muscleGroup is empty string', () => {
      // Arrange
      const invalidExercise = {
        name: 'Bankdrücken',
        muscleGroup: '',
        sets: [{ weight: 80, reps: 10 }]
      };

      // Act
      const result = validateExercise(invalidExercise);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Muscle group is required');
    });

    test('should return invalid when sets array is empty', () => {
      // Arrange
      const invalidExercise = {
        name: 'Bankdrücken',
        muscleGroup: 'Brust',
        sets: []
      };

      // Act
      const result = validateExercise(invalidExercise);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('At least one set is required');
    });

    test('should return invalid when sets property is missing', () => {
      // Arrange
      const invalidExercise = {
        name: 'Bankdrücken',
        muscleGroup: 'Brust'
      };

      // Act
      const result = validateExercise(invalidExercise);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('At least one set is required');
    });

    test('should return multiple errors for multiple validation failures', () => {
      // Arrange
      const invalidExercise = {
        name: '',
        muscleGroup: '',
        sets: []
      };

      // Act
      const result = validateExercise(invalidExercise);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Exercise name is required');
      expect(result.errors).toContain('Muscle group is required');
      expect(result.errors).toContain('At least one set is required');
      expect(result.errors).toHaveLength(3);
    });

    test('should handle null and undefined values', () => {
      // Arrange
      const invalidExercise = {
        name: null,
        muscleGroup: undefined,
        sets: null
      };

      // Act
      const result = validateExercise(invalidExercise);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Exercise name is required');
      expect(result.errors).toContain('Muscle group is required');
      expect(result.errors).toContain('At least one set is required');
    });
  });

  // ========================================
  // VALIDATE SET TESTS
  // ========================================

  describe('validateSet', () => {
    test('should return valid for complete set', () => {
      // Arrange
      const validSet = {
        weight: 80,
        reps: 10,
        breakTime: 120
      };

      // Act
      const result = validateSet(validSet);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test('should return valid for set with zero weight', () => {
      // Arrange
      const validSet = {
        weight: 0,
        reps: 10,
        breakTime: 120
      };

      // Act
      const result = validateSet(validSet);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test('should return invalid when weight is negative', () => {
      // Arrange
      const invalidSet = {
        weight: -10,
        reps: 10,
        breakTime: 120
      };

      // Act
      const result = validateSet(invalidSet);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Weight cannot be negative');
    });

    test('should return invalid when reps is zero', () => {
      // Arrange
      const invalidSet = {
        weight: 80,
        reps: 0,
        breakTime: 120
      };

      // Act
      const result = validateSet(invalidSet);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Reps must be greater than 0');
    });

    test('should return invalid when reps is negative', () => {
      // Arrange
      const invalidSet = {
        weight: 80,
        reps: -5,
        breakTime: 120
      };

      // Act
      const result = validateSet(invalidSet);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Reps must be greater than 0');
    });

    test('should return invalid when breakTime is negative', () => {
      // Arrange
      const invalidSet = {
        weight: 80,
        reps: 10,
        breakTime: -30
      };

      // Act
      const result = validateSet(invalidSet);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Break time cannot be negative');
    });

    test('should return valid for set with zero breakTime', () => {
      // Arrange
      const validSet = {
        weight: 80,
        reps: 10,
        breakTime: 0
      };

      // Act
      const result = validateSet(validSet);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test('should return multiple errors for multiple validation failures', () => {
      // Arrange
      const invalidSet = {
        weight: -10,
        reps: -5,
        breakTime: -30
      };

      // Act
      const result = validateSet(invalidSet);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Weight cannot be negative');
      expect(result.errors).toContain('Reps must be greater than 0');
      expect(result.errors).toContain('Break time cannot be negative');
      expect(result.errors).toHaveLength(3);
    });

    test('should handle missing properties gracefully', () => {
      // Arrange
      const incompleteSet = {};

      // Act
      const result = validateSet(incompleteSet);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test('should handle null and undefined values', () => {
      // Arrange
      const invalidSet = {
        weight: null,
        reps: undefined,
        breakTime: null
      };

      // Act
      const result = validateSet(invalidSet);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });

  // ========================================
  // EDGE CASES AND INTEGRATION TESTS
  // ========================================

  describe('Edge Cases', () => {
    test('should handle empty objects', () => {
      // Arrange
      const emptyWorkout = {};
      const emptyExercise = {};
      const emptySet = {};

      // Act
      const workoutResult = validateWorkout(emptyWorkout);
      const exerciseResult = validateExercise(emptyExercise);
      const setResult = validateSet(emptySet);

      // Assert
      expect(workoutResult.isValid).toBe(false);
      expect(exerciseResult.isValid).toBe(false);
      expect(setResult.isValid).toBe(true); // Set validation is more lenient
    });

    test('should handle null inputs', () => {
      // Act
      const workoutResult = validateWorkout(null);
      const exerciseResult = validateExercise(null);
      const setResult = validateSet(null);

      // Assert
      expect(workoutResult.isValid).toBe(false);
      expect(workoutResult.errors).toContain('Workout object is required');
      
      expect(exerciseResult.isValid).toBe(false);
      expect(exerciseResult.errors).toContain('Exercise object is required');
      
      expect(setResult.isValid).toBe(false);
      expect(setResult.errors).toContain('Set object is required');
    });

    test('should handle undefined inputs', () => {
      // Act
      const workoutResult = validateWorkout(undefined);
      const exerciseResult = validateExercise(undefined);
      const setResult = validateSet(undefined);

      // Assert
      expect(workoutResult.isValid).toBe(false);
      expect(workoutResult.errors).toContain('Workout object is required');
      
      expect(exerciseResult.isValid).toBe(false);
      expect(exerciseResult.errors).toContain('Exercise object is required');
      
      expect(setResult.isValid).toBe(false);
      expect(setResult.errors).toContain('Set object is required');
    });

    test('should validate complete workout structure', () => {
      // Arrange
      const completeWorkout = {
        name: 'Complete Workout',
        date: '2024-01-15',
        startTime: '10:00',
        exercises: [
          {
            name: 'Bankdrücken',
            muscleGroup: 'Brust',
            sets: [
              { weight: 80, reps: 10, breakTime: 120 },
              { weight: 85, reps: 8, breakTime: 120 }
            ]
          }
        ]
      };

      // Act
      const workoutResult = validateWorkout(completeWorkout);
      const exerciseResult = validateExercise(completeWorkout.exercises[0]);
      const setResult1 = validateSet(completeWorkout.exercises[0].sets[0]);
      const setResult2 = validateSet(completeWorkout.exercises[0].sets[1]);

      // Assert
      expect(workoutResult.isValid).toBe(true);
      expect(exerciseResult.isValid).toBe(true);
      expect(setResult1.isValid).toBe(true);
      expect(setResult2.isValid).toBe(true);
    });
  });
});
