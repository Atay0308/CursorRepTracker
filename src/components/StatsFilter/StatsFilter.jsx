/**
 * StatsFilter Component
 * 
 * Provides filtering options for statistics with hierarchical selection:
 * 1. Area selection (General, Muscle, Exercise)
 * 2. Metric selection based on area
 * 3. Time period and grouping selection
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.availableExercises - List of available exercises
 * @param {Array} props.availableMuscles - List of available muscle groups
 * @param {string} props.selectedArea - Currently selected area (general, muscle, exercise)
 * @param {string} props.selectedMetric - Currently selected metric
 * @param {string} props.selectedItem - Selected exercise or muscle group
 * @param {string} props.selectedPeriod - Currently selected time period
 * @param {string} props.selectedGrouping - Currently selected grouping
 * @param {Function} props.onAreaChange - Callback for area selection
 * @param {Function} props.onMetricChange - Callback for metric selection
 * @param {Function} props.onItemChange - Callback for item selection
 * @param {Function} props.onPeriodChange - Callback for period selection
 * @param {Function} props.onGroupingChange - Callback for grouping selection
 * @param {boolean} props.isLoading - Loading state
 * 
 * @example
 * <StatsFilter
 *   availableExercises={['Push-ups', 'Squats']}
 *   availableMuscles={['Chest', 'Legs']}
 *   selectedArea="exercise"
 *   selectedMetric="maxWeight"
 *   selectedItem="Push-ups"
 *   selectedPeriod="3M"
 *   selectedGrouping="week"
 *   onAreaChange={handleAreaChange}
 *   onMetricChange={handleMetricChange}
 *   onItemChange={handleItemChange}
 *   onPeriodChange={handlePeriodChange}
 *   onGroupingChange={handleGroupingChange}
 *   isLoading={false}
 * />
 */

import React from 'react';
import { 
  AREAS_CONFIG, 
  getMetricsForArea, 
  PERIODS_CONFIG, 
  GROUPINGS_CONFIG 
} from '../../config/statistics.js';
import './StatsFilter.css';

/**
 * StatsFilter - Komponente für die hierarchische Filterung der Statistiken
 * 
 * Diese Komponente ermöglicht es dem Benutzer, Statistiken zu filtern:
 * 1. Bereich wählen (Übungen, Muskelgruppen, Allgemein)
 * 2. Item wählen (spezifische Übung oder Muskelgruppe)
 * 3. Metrik wählen (was gemessen werden soll)
 * 4. Zeitraum wählen (1W, 1M, 3M, 6M, 1J)
 * 5. Gruppierung wählen (Tag, Woche, Monat)
 * 
 * @param {Array} availableExercises - Verfügbare Übungen aus der Datenbank
 * @param {Array} availableMuscles - Verfügbare Muskelgruppen aus der Datenbank
 * @param {string} selectedArea - Aktuell gewählter Bereich ('exercises', 'muscles', 'general')
 * @param {string} selectedMetric - Aktuell gewählte Metrik (z.B. 'maxWeight', 'totalVolume')
 * @param {string} selectedItem - Aktuell gewähltes Item (Übung oder Muskelgruppe)
 * @param {string} selectedPeriod - Aktuell gewählter Zeitraum ('1W', '1M', '3M', etc.)
 * @param {string} selectedGrouping - Aktuell gewählte Gruppierung ('day', 'week', 'month')
 * @param {Function} onAreaChange - Callback wenn Bereich geändert wird
 * @param {Function} onMetricChange - Callback wenn Metrik geändert wird
 * @param {Function} onItemChange - Callback wenn Item geändert wird
 * @param {Function} onPeriodChange - Callback wenn Zeitraum geändert wird
 * @param {Function} onGroupingChange - Callback wenn Gruppierung geändert wird
 * @param {boolean} isLoading - Zeigt Loading-Spinner an
 */
const StatsFilter = ({
  availableExercises = [],
  availableMuscles = [],
  selectedArea = 'general',
  selectedMetric = '',
  selectedItem = '',
  selectedPeriod = '3M',
  selectedGrouping = 'week',
  onAreaChange,
  onMetricChange,
  onItemChange,
  onPeriodChange,
  onGroupingChange,
  isLoading = false
}) => {
  // === KONFIGURATION AUS statistics.js LADEN ===
  // Diese Konstanten definieren alle verfügbaren Optionen für die Filter
  const areas = AREAS_CONFIG;        // Bereiche: Übungen, Muskelgruppen, Allgemein
  const periods = PERIODS_CONFIG;   // Zeiträume: 1W, 1M, 3M, 6M, 1J
  const groupings = GROUPINGS_CONFIG;

  // === DYNAMISCHE METRIKEN BASIEREND AUF BEREICH ===
  // Je nach gewähltem Bereich werden unterschiedliche Metriken angezeigt
  // z.B. bei "exercises" gibt es "maxWeight", bei "general" gibt es "totalWorkouts"
  const currentMetrics = getMetricsForArea(selectedArea);

  // === EVENT HANDLER FÜR DROPDOWN-ÄNDERUNGEN ===
  // Diese Funktionen werden aufgerufen, wenn der Benutzer ein Dropdown ändert
  
  /**
   * Wird aufgerufen wenn der Bereich geändert wird (Übungen → Muskelgruppen)
   * @param {Event} e - Change event vom Select-Element
   */
  const handleAreaChange = (e) => {
    if (onAreaChange) {
      onAreaChange(e.target.value);  // z.B. "exercises" oder "muscles"
    }
  };

  /**
   * Wird aufgerufen wenn die Metrik geändert wird (Max Gewicht → Gesamtvolumen)
   * @param {Event} e - Change event vom Select-Element
   */
  const handleMetricChange = (e) => {
    if (onMetricChange) {
      onMetricChange(e.target.value);  // z.B. "maxWeight" oder "totalVolume"
    }
  };

  /**
   * Wird aufgerufen wenn das Item geändert wird (Bankdrücken → Kniebeugen)
   * @param {Event} e - Change event vom Select-Element
   */
  const handleItemChange = (e) => {
    if (onItemChange) {
      onItemChange(e.target.value);
    }
  };

  /**
   * Wird aufgerufen wenn der Zeitraum geändert wird (1 Monat → 3 Monate)
   * @param {Event} e - Change event vom Select-Element
   */
  const handlePeriodChange = (e) => {
    if (onPeriodChange) {
      onPeriodChange(e.target.value);  // z.B. "1M" oder "3M"
    }
  };

  /**
   * Wird aufgerufen wenn die Gruppierung geändert wird (Wöchentlich → Täglich)
   * @param {Event} e - Change event vom Select-Element
   */
  const handleGroupingChange = (e) => {
    if (onGroupingChange) {
      onGroupingChange(e.target.value);
    }
  };

  return (
    <div className="stats-filter">
      {/* Area Selection - ganz oben wie im Screenshot */}
      <div className="stats-filter-areas">
        {areas.map((area) => (
          <button
            key={area.value}
            className={`stats-filter-area-btn ${selectedArea === area.value ? 'active' : ''}`}
            onClick={() => onAreaChange && onAreaChange(area.value)}
            aria-pressed={selectedArea === area.value}
          >
            {area.label}
          </button>
        ))}
      </div>

      {/* Filter Panel - links und rechts aufgeteilt */}
      <div className="stats-filter-panel">
        {/* Linke Seite - Item und Metric Selection */}
        <div className="stats-filter-left">
          {/* Item Selection (Exercise or Muscle) - Only show if not general */}
          {selectedArea !== 'general' && (
            <div className="stats-filter-group">
              <label htmlFor="item-select" className="stats-filter-label">
                {selectedArea === 'exercise' ? 'Übung wählen' : 'Muskelgruppe wählen'}
              </label>
              <select
                id="item-select"
                className="stats-filter-select"
                value={selectedItem}
                onChange={handleItemChange}
                disabled={isLoading}
              >
                <option value="">
                  {isLoading 
                    ? 'Lädt...' 
                    : selectedArea === 'exercise' ? 'Übung wählen' : 'Muskelgruppe wählen'
                  }
                </option>
                {(selectedArea === 'exercise' ? availableExercises : availableMuscles).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Metric Selection */}
          <div className="stats-filter-group">
            <label htmlFor="metric-select" className="stats-filter-label">
              Metrik wählen
            </label>
            <select
              id="metric-select"
              className="stats-filter-select"
              value={selectedMetric}
              onChange={handleMetricChange}
              disabled={currentMetrics.length === 0}
            >
              <option value="">
                {currentMetrics.length === 0 ? 'Keine Metriken verfügbar' : 'Metrik wählen'}
              </option>
              {currentMetrics.map((metric) => (
                <option key={metric.value} value={metric.value}>
                  {metric.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Rechte Seite - Time Period und Grouping */}
        <div className="stats-filter-right">
          {/* Time Period Selection - als Buttons wie im Screenshot */}
          <div className="stats-filter-group">
            <label className="stats-filter-label">Zeitraum</label>
            <div className="stats-filter-period-buttons">
              {periods.map((period) => (
                <button
                  key={period.value}
                  className={`stats-filter-period-btn ${selectedPeriod === period.value ? 'active' : ''}`}
                  onClick={() => onPeriodChange && onPeriodChange(period.value)}
                  aria-pressed={selectedPeriod === period.value}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grouping Selection */}
          <div className="stats-filter-group">
            <label htmlFor="grouping-select" className="stats-filter-label">
              Gruppieren nach
            </label>
            <select
              id="grouping-select"
              className="stats-filter-select"
              value={selectedGrouping}
              onChange={handleGroupingChange}
            >
              {groupings.map((grouping) => (
                <option key={grouping.value} value={grouping.value}>
                  {grouping.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsFilter;
