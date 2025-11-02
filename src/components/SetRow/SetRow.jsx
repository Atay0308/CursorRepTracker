/**
 * SetRow Component
 * 
 * Displays a single set with weight, reps, break time, and timer functionality.
 * Allows editing set data and provides timer controls for break periods.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.set - Set data object
 * @param {string} props.set.id - Unique set identifier
 * @param {number} props.set.setNumber - Set number (1, 2, 3, etc.)
 * @param {number} props.set.weight - Weight used in this set
 * @param {number} props.set.reps - Number of repetitions
 * @param {number} props.set.breakTime - Break time in seconds
 * @param {string} props.set.notes - Additional notes for this set
 * @param {Function} props.onUpdateSet - Callback when set data changes
 * @param {Function} props.onRemoveSet - Callback when set should be removed
 * 
 * @example
 * <SetRow
 *   set={setData}
 *   onUpdateSet={(field, value) => handleUpdateSet(exerciseId, setId, field, value)}
 *   onRemoveSet={() => handleRemoveSet(exerciseId, setId)}
 * />
 */

import React, { useState, useEffect } from 'react';
import './SetRow.css';

const SetRow = ({ set, onUpdateSet, onRemoveSet }) => {
  // Timer state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0); // Count up from 0

  /**
   * Format seconds into MM:SS format
   * @param {number} seconds - Time in seconds
   * @returns {string} Formatted time string
   */
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  /**
   * Handle timer tick
   * Decrements time and stops when reaching 0
   */
  useEffect(() => {
    let interval = null;
    
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimeElapsed(time => time + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  /**
   * Handle timer start/stop toggle
   */
  const handleTimerToggle = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  /**
   * Handle timer reset
   * Resets timer to 0:00
   */
  const handleTimerReset = () => {
    setIsTimerRunning(false);
    setTimeElapsed(0);
  };

  /**
   * Handle input change for set data
   * @param {string} field - Field name to update
   * @param {string|number} value - New value
   */
  const handleInputChange = (field, value) => {
    const numericValue = ['weight', 'reps', 'breakTime'].includes(field) 
      ? (value === '' ? '' : (isNaN(parseFloat(value)) ? '' : parseFloat(value))) 
      : value;
    
    onUpdateSet(field, numericValue);
    
    // Update timer if break time changed
    if (field === 'breakTime') {
      setTimeElapsed(numericValue === '' ? 0 : numericValue);
    }
  };

  return (
    <div className="set-row">
      {/* Set Number */}
      <div className="set-row-number">
        {set.setNumber}
      </div>

      {/* Set Inputs */}
      <div className="set-row-inputs">
        {/* Weight Input */}
        <div className="set-row-input-group">
          <label className="set-row-label" htmlFor={`weight-${set.id}`}>
            Gewicht (kg)
          </label>
          <input
            id={`weight-${set.id}`}
            type="number"
            className="set-row-input"
            value={set.weight || ''}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            placeholder="0"
            min="0"
            step="0.5"
            aria-label={`Gewicht für Satz ${set.setNumber}`}
          />
        </div>

        {/* Reps Input */}
        <div className="set-row-input-group">
          <label className="set-row-label" htmlFor={`reps-${set.id}`}>
            Wiederholungen
          </label>
          <input
            id={`reps-${set.id}`}
            type="number"
            className="set-row-input"
            value={set.reps || ''}
            onChange={(e) => handleInputChange('reps', e.target.value)}
            placeholder="0"
            min="0"
            aria-label={`Wiederholungen für Satz ${set.setNumber}`}
          />
        </div>

        {/* Notes Input */}
        <div className="set-row-input-group notes">
          <label className="set-row-label" htmlFor={`notes-${set.id}`}>
            Notizen
          </label>
          <input
            id={`notes-${set.id}`}
            type="text"
            className="set-row-input"
            value={set.notes || ''}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Pause, Technik, etc."
            aria-label={`Notizen für Satz ${set.setNumber}`}
          />
        </div>

      </div>

      {/* Timer Section */}
      <div className="set-row-timer">
        <button
          className="set-row-timer-display-btn"
          onClick={handleTimerToggle}
          aria-label={isTimerRunning ? 'Timer pausieren' : 'Timer starten'}
        >
          {formatTime(timeElapsed)}
        </button>
        <button
          className="set-row-timer-reset-btn"
          onClick={handleTimerReset}
          aria-label="Timer zurücksetzen"
        >
          🔄
        </button>
      </div>

      {/* Remove Set Button */}
      <button
        className="set-row-remove-btn"
        onClick={onRemoveSet}
        aria-label={`Satz ${set.setNumber} entfernen`}
      >
        ×
      </button>
    </div>
  );
};

export default SetRow;
