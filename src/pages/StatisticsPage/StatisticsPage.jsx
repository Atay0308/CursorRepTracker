/**
 * StatisticsPage Component
 * 
 * Main statistics page that displays exercise progress and metrics.
 * Features:
 * - Exercise selection and filtering
 * - Interactive charts showing progress over time
 * - Responsive design for all devices
 * 
 * @component
 * @example
 * <StatisticsPage />
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { statsAPI } from '../../services/statsAPI.js';
import { statisticsService } from '../../services/statisticsService.js';
import StatsFilter from '../../components/StatsFilter/StatsFilter.jsx';
import StatsChart from '../../components/StatsChart/StatsChart.jsx';
import BottomNavigation from '../../components/BottomNavigation/BottomNavigation.jsx';
import './StatisticsPage.css';

const StatisticsPage = () => {
  const navigate = useNavigate();
  
  // Filter states - Hierarchical selection
  const [selectedArea, setSelectedArea] = useState('general');
  const [selectedMetric, setSelectedMetric] = useState('');
  const [selectedItem, setSelectedItem] = useState(''); // Exercise or muscle group
  const [selectedPeriod, setSelectedPeriod] = useState('1M');
  const [selectedGrouping, setSelectedGrouping] = useState('week');

  // Data states
  const [availableExercises, setAvailableExercises] = useState([]);
  const [availableMuscles, setAvailableMuscles] = useState([]);
  const [chartData, setChartData] = useState([]);

  // Loading and error states
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
  const [dataError, setDataError] = useState(null);
  const [chartError, setChartError] = useState(null);

  /**
   * Load available exercises and muscle groups from API
   */
  const loadAvailableData = useCallback(async () => {
    try {
      setIsLoadingData(true);
      setDataError(null);
      
      const [exercises, muscles] = await Promise.all([
        statsAPI.getAvailableExercises(),
        statsAPI.getAvailableMuscles()
      ]);
      
      setAvailableExercises(exercises);
      setAvailableMuscles(muscles);
    } catch (error) {
      console.error('Error loading available data:', error);
      setDataError('Fehler beim Laden der verfügbaren Daten');
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  /**
   * Load chart data based on current filters
   */
  const loadChartData = useCallback(async () => {
    if (!selectedArea || !selectedMetric) return;
    if (selectedArea !== 'general' && !selectedItem) return;

    try {
      setIsLoadingChart(true);
      setChartError(null);
      
      // Get all workouts from API
      const workouts = await statsAPI.getAllWorkouts();
      
      let data = [];
      
      if (selectedArea === 'exercise') {
        // Load exercise-specific data
        data = statisticsService.getExerciseStats(
          workouts,
          selectedItem,
          selectedMetric,
          selectedPeriod,
          selectedGrouping
        );
      } else if (selectedArea === 'muscle') {
        // Load muscle-specific data
        data = statisticsService.getMuscleStats(
          workouts,
          selectedItem,
          selectedMetric,
          selectedPeriod,
          selectedGrouping
        );
      } else if (selectedArea === 'general') {
        // Load general statistics data
        data = statisticsService.getGeneralStats(
          workouts,
          selectedMetric,
          selectedPeriod,
          selectedGrouping
        );
      }
      
      setChartData(data);
    } catch (error) {
      console.error('Error loading chart data:', error);
      setChartError('Fehler beim Laden der Chart-Daten');
    } finally {
      setIsLoadingChart(false);
    }
  }, [selectedArea, selectedMetric, selectedItem, selectedPeriod, selectedGrouping]);

  /**
   * Handle area selection change
   * @param {string} area - Selected area
   */
  const handleAreaChange = (area) => {
    setSelectedArea(area);
    setSelectedMetric(''); // Reset metric when area changes
    setSelectedItem(''); // Reset item when area changes
  };

  /**
   * Handle metric selection change
   * @param {string} metric - Selected metric
   */
  const handleMetricChange = (metric) => {
    setSelectedMetric(metric);
  };

  /**
   * Handle item selection change (exercise or muscle)
   * @param {string} item - Selected item
   */
  const handleItemChange = (item) => {
    setSelectedItem(item);
  };

  /**
   * Handle period selection change
   * @param {string} period - Selected period
   */
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  /**
   * Handle grouping selection change
   * @param {string} grouping - Selected grouping
   */
  const handleGroupingChange = (grouping) => {
    setSelectedGrouping(grouping);
  };

  // Load available data on component mount
  useEffect(() => {
    loadAvailableData();
  }, [loadAvailableData]);

  // Load chart data when filters change
  useEffect(() => {
    if (selectedArea && selectedMetric && (selectedArea === 'general' || selectedItem)) {
      loadChartData();
    }
  }, [selectedArea, selectedMetric, selectedItem, selectedPeriod, selectedGrouping, loadChartData]);

  return (
    <div className="statistics-page">
      {/* Page Header */}
      <header className="statistics-header">
        <h1 className="statistics-title">Statistik</h1>
        <p className="statistics-subtitle">
          Verfolgen Sie Ihre Fortschritte und analysieren Sie Ihre Trainingsdaten
        </p>
      </header>

      {/* Main Content */}
      <main className="statistics-main">
        {/* Filter Section */}
        <section className="statistics-section">
          <StatsFilter
            availableExercises={availableExercises}
            availableMuscles={availableMuscles}
            selectedArea={selectedArea}
            selectedMetric={selectedMetric}
            selectedItem={selectedItem}
            selectedPeriod={selectedPeriod}
            selectedGrouping={selectedGrouping}
            onAreaChange={handleAreaChange}
            onMetricChange={handleMetricChange}
            onItemChange={handleItemChange}
            onPeriodChange={handlePeriodChange}
            onGroupingChange={handleGroupingChange}
            isLoading={isLoadingData}
          />
        </section>

        {/* Chart Section */}
        <section className="statistics-section">
          <StatsChart
            data={chartData}
            metric={selectedMetric}
            exerciseName={selectedArea === 'exercise' ? selectedItem : selectedArea === 'muscle' ? selectedItem : 'Allgemein'}
            isLoading={isLoadingChart}
            error={chartError}
            height={400}
          />
        </section>
      </main>

      {/* Error Display for Data */}
      {dataError && !isLoadingData && (
        <div className="statistics-error">
          <div className="statistics-error-icon">⚠️</div>
          <h3>Fehler beim Laden der Daten</h3>
          <p>{dataError}</p>
          <button 
            className="statistics-error-retry"
            onClick={loadAvailableData}
          >
            Erneut versuchen
          </button>
        </div>
      )}

      {/* Bottom navigation bar */}
      <BottomNavigation 
        activeTab="statistics" 
        onNavigate={navigate} 
      />
    </div>
  );
};

export default StatisticsPage;