import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ExerciseCard from './ExerciseCard';

// Mock SetRow component
vi.mock('../SetRow/SetRow', () => ({
    default: vi.fn(({ set, onUpdateSet, onRemoveSet }) => (
        <div data-testid={`set-row-${set.id}`}>
           <span>Set {set.id}</span>
           <button onClick={() => onUpdateSet('weight', 100)}>Update Weight</button>
           <button onClick={() => onRemoveSet()}>Remove Set</button>
        </div>
    ))
}));


describe('ExerciseCard', () => {
    // Mock functions
    const mockOnUpdateExercise = vi.fn();
    const mockOnRemoveExercise = vi.fn();
    const mockOnAddSet = vi.fn();
    const mockOnUpdateSet = vi.fn();
    const mockOnRemoveSet = vi.fn();

    // Sample exercise data
    const sampleExercise = {
        id: 'exercise-1',
        name: 'Push-ups',
        muscleGroup: 'Chest',
        sets: [
        { id: 'set-1', weight: '10', reps: '15', breakTime: '60' },
        { id: 'set-2', weight: '12', reps: '12', breakTime: '90' }
        ],
        notes: 'Keep core tight'
    };

    beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should render exercise name input', () => {
    render(
      <ExerciseCard
        exercise={sampleExercise}
        onUpdateExercise={mockOnUpdateExercise}
        onRemoveExercise={mockOnRemoveExercise}
        onAddSet={mockOnAddSet}
        onUpdateSet={mockOnUpdateSet}
        onRemoveSet={mockOnRemoveSet}
      />
    );

    const nameInput = screen.getByDisplayValue('Push-ups');
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveAttribute('placeholder', 'Übungsname eingeben');
  });

  test('should render all sets', () => {
    render(
      <ExerciseCard
        exercise={sampleExercise}
        onUpdateExercise={mockOnUpdateExercise}
        onRemoveExercise={mockOnRemoveExercise}
        onAddSet={mockOnAddSet}
        onUpdateSet={mockOnUpdateSet}
        onRemoveSet={mockOnRemoveSet}
      />
    );

    expect(screen.getByTestId('set-row-set-1')).toBeInTheDocument();
    expect(screen.getByTestId('set-row-set-2')).toBeInTheDocument();
  });

  test('should render exercise name input', () => {
    render(
      <ExerciseCard
        exercise={sampleExercise}
        onUpdateExercise={mockOnUpdateExercise}
        onRemoveExercise={mockOnRemoveExercise}
        onAddSet={mockOnAddSet}
        onUpdateSet={mockOnUpdateSet}
        onRemoveSet={mockOnRemoveSet}
      />
    );

    const nameInput = screen.getByDisplayValue('Push-ups');
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveAttribute('placeholder', 'Übungsname eingeben');
  });

  test('should call onUpdateExercise when name changes', () => {
    render(
      <ExerciseCard
        exercise={sampleExercise}
        onUpdateExercise={mockOnUpdateExercise}
        onRemoveExercise={mockOnRemoveExercise}
        onAddSet={mockOnAddSet}
        onUpdateSet={mockOnUpdateSet}
        onRemoveSet={mockOnRemoveSet}
      />
    );

    const nameInput = screen.getByDisplayValue('Push-ups');
    fireEvent.change(nameInput, { target: { value: 'Modified Push-ups' } });

    expect(mockOnUpdateExercise).toHaveBeenCalledWith('exercise-1', 'name', 'Modified Push-ups');
  });

  test('should call onUpdateExercise when name changes', () => {
    render(
      <ExerciseCard
        exercise={sampleExercise}
        onUpdateExercise={mockOnUpdateExercise}
        onRemoveExercise={mockOnRemoveExercise}
        onAddSet={mockOnAddSet}
        onUpdateSet={mockOnUpdateSet}
        onRemoveSet={mockOnRemoveSet}
      />
    );

    const nameInput = screen.getByDisplayValue('Push-ups');
    fireEvent.change(nameInput, { target: { value: 'New Exercise Name' } });

    expect(mockOnUpdateExercise).toHaveBeenCalledWith('exercise-1', 'name', 'New Exercise Name');
  });

  test('should call onRemoveExercise when remove button is clicked', () => {
    render(
      <ExerciseCard
        exercise={sampleExercise}
        onUpdateExercise={mockOnUpdateExercise}
        onRemoveExercise={mockOnRemoveExercise}
        onAddSet={mockOnAddSet}
        onUpdateSet={mockOnUpdateSet}
        onRemoveSet={mockOnRemoveSet}
      />
    );

    const removeButton = screen.getByRole('button', { name: 'Übung entfernen' });
    fireEvent.click(removeButton);

    expect(mockOnRemoveExercise).toHaveBeenCalledWith('exercise-1');
  });

  test('should call onAddSet when add set button is clicked', () => {
    render(
      <ExerciseCard
        exercise={sampleExercise}
        onUpdateExercise={mockOnUpdateExercise}
        onRemoveExercise={mockOnRemoveExercise}
        onAddSet={mockOnAddSet}
        onUpdateSet={mockOnUpdateSet}
        onRemoveSet={mockOnRemoveSet}
      />
    );

    const addSetButton = screen.getByRole('button', { name: 'Satz hinzufügen' });
    fireEvent.click(addSetButton);

    expect(mockOnAddSet).toHaveBeenCalledWith('exercise-1');
  });

  test('should render add set button', () => {
    render(
      <ExerciseCard
        exercise={sampleExercise}
        onUpdateExercise={mockOnUpdateExercise}
        onRemoveExercise={mockOnRemoveExercise}
        onAddSet={mockOnAddSet}
        onUpdateSet={mockOnUpdateSet}
        onRemoveSet={mockOnRemoveSet}
      />
    );

    const addSetButton = screen.getByRole('button', { name: 'Satz hinzufügen' });
    expect(addSetButton).toBeInTheDocument();
    expect(addSetButton).toHaveTextContent('+ Satz hinzufügen');
  });

  test('should handle exercise with no sets', () => {
    const exerciseWithNoSets = {
      ...sampleExercise,
      sets: []
    };

    render(
      <ExerciseCard
        exercise={exerciseWithNoSets}
        onUpdateExercise={mockOnUpdateExercise}
        onRemoveExercise={mockOnRemoveExercise}
        onAddSet={mockOnAddSet}
        onUpdateSet={mockOnUpdateSet}
        onRemoveSet={mockOnRemoveSet}
      />
    );

    expect(screen.getByRole('button', { name: 'Satz hinzufügen' })).toBeInTheDocument();
    expect(screen.queryByTestId('set-row-set-1')).not.toBeInTheDocument();
  });


});