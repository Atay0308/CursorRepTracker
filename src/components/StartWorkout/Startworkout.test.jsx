import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import StartWorkout from './StartWorkout.jsx';

test('should render start workout button when no localStorage workout', () => {
    render(
      <StartWorkout 
        onStartWorkout={() => {}} 
        onContinueWorkout={() => {}}
        localStorageWorkout={null}
        isLoading={false}
      />
    );
    const startWorkout = screen.getByRole('button', { name: 'Neues Training starten' });
    expect(startWorkout).toBeInTheDocument();
});

test('should render continue workout button when localStorage workout exists', () => {
    const workout = { id: '123', name: 'Test Workout' };
    render(
      <StartWorkout 
        onStartWorkout={() => {}} 
        onContinueWorkout={() => {}}
        localStorageWorkout={workout}
        isLoading={false}
      />
    );
    const continueWorkout = screen.getByRole('button', { name: 'Training fortsetzen' });
    expect(continueWorkout).toBeInTheDocument();
});

// ----------------------------- event handler -----------------------------
test("should call onStartWorkout when start workout button is clicked (no localStorage workout)", () => {
    const onStartWorkoutMock = vi.fn();
    render(
      <StartWorkout 
        onStartWorkout={onStartWorkoutMock}
        onContinueWorkout={() => {}}
        localStorageWorkout={null}
        isLoading={false}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Neues Training starten' }));
    expect(onStartWorkoutMock).toHaveBeenCalled();
});

test("should call onContinueWorkout when continue workout button is clicked (localStorage workout exists)", () => {
    const onContinueWorkoutMock = vi.fn();
    const workout = { id: '123', name: 'Test Workout' };
    render(
      <StartWorkout 
        onStartWorkout={() => {}}
        onContinueWorkout={onContinueWorkoutMock}
        localStorageWorkout={workout}
        isLoading={false}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Training fortsetzen' }));
    expect(onContinueWorkoutMock).toHaveBeenCalled();
});
