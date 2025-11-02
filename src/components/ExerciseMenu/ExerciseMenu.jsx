/**
 * ExerciseMenu Component
 * 
 * A dropdown menu for exercise actions including edit, duplicate, and delete.
 * Provides a clean interface for exercise management without direct deletion.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the menu is open
 * @param {Function} props.onClose - Callback to close the menu
 * @param {Function} props.onEdit - Callback when edit is selected
 * @param {Function} props.onDuplicate - Callback when duplicate is selected
 * @param {Function} props.onDelete - Callback when delete is selected
 * @param {Function} props.onMoveUp - Callback when move up is selected
 * @param {Function} props.onMoveDown - Callback when move down is selected
 * 
 * @example
 * <ExerciseMenu
 *   isOpen={isMenuOpen}
 *   onClose={() => setIsMenuOpen(false)}
 *   onEdit={handleEditExercise}
 *   onDuplicate={handleDuplicateExercise}
 *   onDelete={handleDeleteExercise}
 *   onMoveUp={handleMoveUp}
 *   onMoveDown={handleMoveDown}
 * />
 */

import React, { useEffect, useRef } from 'react';
import './ExerciseMenu.css';

const ExerciseMenu = ({ 
  isOpen, 
  onClose, 
  onEdit, 
  onDuplicate, 
  onDelete, 
  onMoveUp, 
  onMoveDown 
}) => {
  const menuRef = useRef(null);

  /**
   * Handle clicking outside the menu to close it
   * @param {Event} event - Click event
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  /**
   * Handle menu item click
   * Executes the callback and closes the menu
   * @param {Function} callback - Function to execute
   */
  const handleMenuItemClick = (callback) => {
    callback();
    onClose();
  };

  // Don't render if menu is not open
  if (!isOpen) return null;

  return (
    <div className="exercise-menu-overlay" onClick={onClose}>
      <div className="exercise-menu" ref={menuRef} onClick={(e) => e.stopPropagation()}>
        {/* Menu Items */}
        <div className="exercise-menu-items">
          {/* Edit Exercise */}
          <button
            className="exercise-menu-item"
            onClick={() => handleMenuItemClick(onEdit)}
            aria-label="Übung bearbeiten"
          >
            <span className="exercise-menu-icon">✏️</span>
            <span className="exercise-menu-text">Bearbeiten</span>
          </button>

          {/* Duplicate Exercise */}
          <button
            className="exercise-menu-item"
            onClick={() => handleMenuItemClick(onDuplicate)}
            aria-label="Übung duplizieren"
          >
            <span className="exercise-menu-icon">📋</span>
            <span className="exercise-menu-text">Duplizieren</span>
          </button>

          {/* Move Up */}
          <button
            className="exercise-menu-item"
            onClick={() => handleMenuItemClick(onMoveUp)}
            aria-label="Übung nach oben verschieben"
          >
            <span className="exercise-menu-icon">⬆️</span>
            <span className="exercise-menu-text">Nach oben</span>
          </button>

          {/* Move Down */}
          <button
            className="exercise-menu-item"
            onClick={() => handleMenuItemClick(onMoveDown)}
            aria-label="Übung nach unten verschieben"
          >
            <span className="exercise-menu-icon">⬇️</span>
            <span className="exercise-menu-text">Nach unten</span>
          </button>

          {/* Divider */}
          <div className="exercise-menu-divider"></div>

          {/* Delete Exercise */}
          <button
            className="exercise-menu-item exercise-menu-item-danger"
            onClick={() => handleMenuItemClick(onDelete)}
            aria-label="Übung löschen"
          >
            <span className="exercise-menu-icon">🗑️</span>
            <span className="exercise-menu-text">Löschen</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseMenu;
