/**
 * BottomNavigation Component
 * 
 * Reusable bottom navigation component for all pages.
 * Provides consistent navigation across the application.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.activeTab - Currently active tab ('home', 'past-workouts', 'training-plans', 'statistics')
 * @param {Function} props.onNavigate - Navigation callback function
 * 
 * @example
 * <BottomNavigation 
 *   activeTab="home" 
 *   onNavigate={(path) => navigate(path)} 
 * />
 */

import React from 'react';
import './BottomNavigation.css';

const BottomNavigation = ({ activeTab = 'home', onNavigate }) => {
  /**
   * Handle navigation to a specific route
   * @param {string} path - Route path to navigate to
   */
  const handleNavigation = (path) => {
    if (onNavigate) {
      onNavigate(path);
    }
  };

  /**
   * Check if a tab is currently active
   * @param {string} tab - Tab identifier
   * @returns {boolean} True if tab is active
   */
  const isActive = (tab) => activeTab === tab;

  return (
    <nav className="bottom-navigation" role="navigation" aria-label="Hauptnavigation">
      {/* Home tab */}
      <div 
        className={`nav-item ${isActive('home') ? 'active' : ''}`}
        onClick={() => handleNavigation('/')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleNavigation('/');
          }
        }}
        aria-label="Zur Startseite"
      >
        <div className="nav-icon">🏠</div>
        <div className="nav-label">Start</div>
      </div>

      {/* Past workouts tab */}
      <div 
        className={`nav-item ${isActive('past-workouts') ? 'active' : ''}`}
        onClick={() => handleNavigation('/past-workouts')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleNavigation('/past-workouts');
          }
        }}
        aria-label="Zu vergangenen Workouts"
      >
        <div className="nav-icon">📅</div>
        <div className="nav-label">Verganene Einheiten</div>
      </div>

      {/* Training plans tab */}
      <div 
        className={`nav-item ${isActive('training-plans') ? 'active' : ''}`}
        onClick={() => handleNavigation('/training-plans')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleNavigation('/training-plans');
          }
        }}
        aria-label="Zu Trainingsplänen"
      >
        <div className="nav-icon">💪</div>
        <div className="nav-label">Trainingspläne</div>
      </div>

      {/* Statistics tab */}
      <div 
        className={`nav-item ${isActive('statistics') ? 'active' : ''}`}
        onClick={() => handleNavigation('/statistics')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleNavigation('/statistics');
          }
        }}
        aria-label="Zur Statistik"
      >
        <div className="nav-icon">📊</div>
        <div className="nav-label">Statistik</div>
      </div>
    </nav>
  );
};

export default BottomNavigation;

