// Du brauchst noch:
import { vi, describe, test, expect, beforeEach } from 'vitest';
import { 
    saveWorkoutToLocalStorage, 
    loadWorkoutFromLocalStorage,
    removeWorkoutFromLocalStorage,
    hasWorkoutInLocalStorage,
    getCurrentWorkoutFromLocalStorage,
    generateId,
  } from './general.js';


test('should generate unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    
    expect(id1).toBeTruthy();
    expect(id2).toBeTruthy();
    expect(id1).not.toBe(id2);
});

// Mock localStorage direkt hier definieren (falls Setup nicht funktioniert)
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0,
};
global.localStorage = localStorageMock;

// beforeEach für saubere Tests
beforeEach(() => {
  vi.clearAllMocks();
  localStorage.getItem.mockReturnValue(null);
  localStorage.key.mockReturnValue(null);
  localStorage.length = 0;
});


// in localStorage speichern
test('should save workout to localStorage', () => {
    const workout = { id: '123', name: 'Test Workout', exercises: [] };
    
    saveWorkoutToLocalStorage(workout);
    
    // localStorage ist jetzt der Mock!
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'workout_draft_current',
      JSON.stringify(workout)
    );
  });

// aus localStorage laden
test('Test ob ein Workout aus localStorage geladen wird', () => {
    // 1. ARRANGE - Testdaten vorbereiten
    const workout = { id: '123', name: 'Test Workout', exercises: [] };
    localStorage.getItem.mockReturnValue(JSON.stringify(workout));
        
    // 2. ACT - Funktion ausführen;
    const loadedWorkout = loadWorkoutFromLocalStorage(workout.id);
        
    // 3. ASSERT - Ergebnis prüfen
    expect(localStorage.getItem).toHaveBeenCalledWith('workout_draft_current');
    expect(loadedWorkout).toEqual(workout);
});
    

// aus localStorage löschen
test('should remove workout from localStorage', () => {
    removeWorkoutFromLocalStorage("123");
    expect(localStorage.removeItem).toHaveBeenCalledWith('workout_draft_current');
});


// prüfen ob workout existiert
test('should check if workout exists in localStorage', () => {
    // ARRANGE
    const workout = { id: '123', name: 'Test Workout', exercises: [] };
    
    // ACT & ASSERT - Workout existiert nicht
    expect(hasWorkoutInLocalStorage('123')).toBe(false);
    
    // ACT & ASSERT - Workout existiert
    localStorage.getItem.mockReturnValue(JSON.stringify(workout));
    expect(hasWorkoutInLocalStorage('123')).toBe(true);
});

// aktuelles workout aus localStorage laden
test('should get current workout from localStorage', () => {
    // ARRANGE
    const workout = { id: '123', name: 'Test Workout', exercises: [] };
    localStorage.getItem.mockReturnValue(JSON.stringify(workout));
    
    // ACT
    const currentWorkout = getCurrentWorkoutFromLocalStorage();
    
    // ASSERT
    expect(localStorage.getItem).toHaveBeenCalledWith('workout_draft_current');
    expect(currentWorkout).toEqual(workout);
});

// kein workout vorhanden
test('should return null when no workout exists in localStorage', () => {
    // ARRANGE
    localStorage.length = 0;
    
    // ACT
    const currentWorkout = getCurrentWorkoutFromLocalStorage();
    
    // ASSERT
    expect(currentWorkout).toBeNull();
});

// edge case: ungültiges JSON
test('should handle invalid JSON in localStorage', () => {
    // ARRANGE
    localStorage.length = 1;
    localStorage.key.mockReturnValueOnce('workout_draft_123');
    localStorage.getItem.mockReturnValue('invalid json');
    
    // ACT
    const currentWorkout = getCurrentWorkoutFromLocalStorage();
    
    // ASSERT
    expect(currentWorkout).toBeNull();
});

test('should handle empty workout data', () => {
    const emptyWorkout = { id: '', name: '', exercises: [] };
    saveWorkoutToLocalStorage(emptyWorkout);
    expect(localStorage.setItem).toHaveBeenCalled();
});
  
test('should handle null workout', () => {
    expect(() => saveWorkoutToLocalStorage(null)).not.toThrow();
});

test('should handle localStorage errors', () => {
  // ARRANGE
    const workout = { id: '123', name: 'Test Workout', exercises: [] };

  // ACT & ASSERT
    localStorage.setItem.mockImplementation(() => {
      throw new Error('Storage full');
    });
    
    expect(() => saveWorkoutToLocalStorage(workout)).not.toThrow();
});

