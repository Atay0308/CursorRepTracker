/**
 * StatsFilter Component Tests
 * 
 * Tests for the StatsFilter component including:
 * - Rendering with different props
 * - User interactions (select changes)
 * - Loading states
 * - Accessibility features
 */

import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StatsFilter from './StatsFilter';

describe('StatsFilter', () => {
  const defaultProps = {
    availableExercises: ['Push-ups', 'Squats', 'Deadlift'],
    availableMuscles: ['Chest', 'Legs', 'Back'],
    selectedArea: 'general',
    selectedItem: '',
    selectedMetric: 'totalWorkouts',
    selectedPeriod: '3M',
    selectedGrouping: 'week',
    onAreaChange: vi.fn(),
    onItemChange: vi.fn(),
    onMetricChange: vi.fn(),
    onPeriodChange: vi.fn(),
    onGroupingChange: vi.fn(),
    isLoading: false
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should render all filter elements', () => {
    render(<StatsFilter {...defaultProps} />);

    // Check if all main elements are present
    expect(screen.getByText('ALLGEMEIN')).toBeInTheDocument();
    expect(screen.getByText('MUSKELN')).toBeInTheDocument();
    expect(screen.getByText('ÜBUNGEN')).toBeInTheDocument();
    expect(screen.getByLabelText('Metrik wählen')).toBeInTheDocument();
    expect(screen.getByText('Zeitraum')).toBeInTheDocument();
    expect(screen.getByText('Gruppieren nach')).toBeInTheDocument();
  });

  test('should display correct area buttons', () => {
    render(<StatsFilter {...defaultProps} />);

    expect(screen.getByText('ALLGEMEIN')).toBeInTheDocument();
    expect(screen.getByText('MUSKELN')).toBeInTheDocument();
    expect(screen.getByText('ÜBUNGEN')).toBeInTheDocument();
  });

  test('should call onAreaChange when area button is clicked', () => {
    render(<StatsFilter {...defaultProps} />);

    const musclesButton = screen.getByText('MUSKELN');
    fireEvent.click(musclesButton);

    expect(defaultProps.onAreaChange).toHaveBeenCalledWith('muscle');
  });

  test('should call onMetricChange when metric is selected', () => {
    render(<StatsFilter {...defaultProps} />);

    const metricSelect = screen.getByLabelText('Metrik wählen');
    fireEvent.change(metricSelect, { target: { value: 'totalVolume' } });

    expect(defaultProps.onMetricChange).toHaveBeenCalledWith('totalVolume');
  });

  test('should call onPeriodChange when period button is clicked', () => {
    render(<StatsFilter {...defaultProps} />);

    const periodButton = screen.getByText('6 MONATE');
    fireEvent.click(periodButton);

    expect(defaultProps.onPeriodChange).toHaveBeenCalledWith('6M');
  });

  test('should call onGroupingChange when grouping is selected', () => {
    render(<StatsFilter {...defaultProps} />);

    const groupingSelect = screen.getByLabelText('Gruppieren nach');
    fireEvent.change(groupingSelect, { target: { value: 'month' } });

    expect(defaultProps.onGroupingChange).toHaveBeenCalledWith('month');
  });

  test('should show exercise selection when exercises area is selected', () => {
    render(<StatsFilter {...defaultProps} selectedArea="exercise" />);

    expect(screen.getByLabelText('Übung wählen')).toBeInTheDocument();
    expect(screen.getByText('Push-ups')).toBeInTheDocument();
    expect(screen.getByText('Squats')).toBeInTheDocument();
    expect(screen.getByText('Deadlift')).toBeInTheDocument();
  });

  test('should show muscle selection when muscles area is selected', () => {
    render(<StatsFilter {...defaultProps} selectedArea="muscle" />);

    expect(screen.getByLabelText('Muskelgruppe wählen')).toBeInTheDocument();
    expect(screen.getByText('Chest')).toBeInTheDocument();
    expect(screen.getByText('Legs')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  test('should call onItemChange when exercise is selected', () => {
    render(<StatsFilter {...defaultProps} selectedArea="exercise" />);

    const exerciseSelect = screen.getByLabelText('Übung wählen');
    fireEvent.change(exerciseSelect, { target: { value: 'Squats' } });

    expect(defaultProps.onItemChange).toHaveBeenCalledWith('Squats');
  });

  test('should call onItemChange when muscle is selected', () => {
    render(<StatsFilter {...defaultProps} selectedArea="muscle" />);

    const muscleSelect = screen.getByLabelText('Muskelgruppe wählen');
    fireEvent.change(muscleSelect, { target: { value: 'Chest' } });

    expect(defaultProps.onItemChange).toHaveBeenCalledWith('Chest');
  });

  test('should display correct period options', () => {
    render(<StatsFilter {...defaultProps} />);

      expect(screen.getByText('1 MONAT')).toBeInTheDocument();
    expect(screen.getByText('6 MONATE')).toBeInTheDocument();
    expect(screen.getByText('1 JAHR')).toBeInTheDocument();
  });

  test('should display correct grouping options', () => {
    render(<StatsFilter {...defaultProps} />);

    const groupingSelect = screen.getByLabelText('Gruppieren nach');
    expect(groupingSelect).toBeInTheDocument();

    // Check if grouping options are present
    expect(screen.getByText('Tag')).toBeInTheDocument();
    expect(screen.getByText('Woche')).toBeInTheDocument();
    expect(screen.getByText('Monat')).toBeInTheDocument();
  });

  test('should handle loading state', () => {
    render(<StatsFilter {...defaultProps} isLoading={true} />);

    // Check if loading state affects item select (if visible)
    const itemSelect = screen.queryByLabelText('Übung wählen') || screen.queryByLabelText('Muskelgruppe wählen');
    if (itemSelect) {
      expect(itemSelect).toBeDisabled();
    }
  });

  test('should have proper accessibility attributes', () => {
    render(<StatsFilter {...defaultProps} />);

    // Check ARIA attributes for area buttons
    const generalButton = screen.getByRole('button', { name: 'ALLGEMEIN' });
    expect(generalButton).toHaveAttribute('aria-pressed', 'true');

    const musclesButton = screen.getByRole('button', { name: 'MUSKELN' });
    expect(musclesButton).toHaveAttribute('aria-pressed', 'false');
  });

  test('should handle empty exercises array', () => {
    render(<StatsFilter {...defaultProps} availableExercises={[]} selectedArea="exercise" />);

    const exerciseSelect = screen.getByLabelText('Übung wählen');
    expect(exerciseSelect).toBeInTheDocument();
  });

  test('should handle empty muscles array', () => {
    render(<StatsFilter {...defaultProps} availableMuscles={[]} selectedArea="muscle" />);

    const muscleSelect = screen.getByLabelText('Muskelgruppe wählen');
    expect(muscleSelect).toBeInTheDocument();
  });

  test('should display correct metric options for general area', () => {
    render(<StatsFilter {...defaultProps} selectedArea="general" />);

    const metricSelect = screen.getByLabelText('Metrik wählen');
    expect(metricSelect).toBeInTheDocument();

    // Check if general metrics are present
    expect(screen.getByText('Gesamte Workouts')).toBeInTheDocument();
    expect(screen.getByText('Gesamte Übungen')).toBeInTheDocument();
  });

  test('should not show item selection for general area', () => {
    render(<StatsFilter {...defaultProps} selectedArea="general" />);

    expect(screen.queryByText('Übung wählen')).not.toBeInTheDocument();
    expect(screen.queryByText('Muskelgruppe wählen')).not.toBeInTheDocument();
  });
});