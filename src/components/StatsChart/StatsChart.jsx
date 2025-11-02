/**
 * StatsChart Component
 * 
 * Displays exercise statistics as a line chart using Recharts library.
 * Shows progress over time with customizable metrics and grouping.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Array} props.data - Chart data points
 * @param {string} props.metric - Selected metric type
 * @param {string} props.exerciseName - Name of the selected exercise
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message if any
 * @param {number} props.height - Chart height in pixels
 * 
 * @example
 * <StatsChart
 *   data={chartData}
 *   metric="maxWeight"
 *   exerciseName="Push-ups"
 *   isLoading={false}
 *   error={null}
 *   height={400}
 * />
 */

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import './StatsChart.css';

const StatsChart = ({
  data = [],           // Array von Datenpunkten: [{date: "2024-10-01", value: 80}, ...]
  metric = 'maxWeight', // Welche Metrik angezeigt wird: 'maxWeight', 'totalVolume', etc.
  exerciseName = '',   // Name der Übung für den Titel
  isLoading = false,   // Zeigt Loading-Spinner an wenn true
  error = null,        // Zeigt Fehler-Message an wenn vorhanden
  height = 400         // Höhe des Charts in Pixeln
}) => {
  // Wörterbuch mit allen verfügbaren Metriken und ihren Eigenschaften
  // Jede Metrik hat: label (deutscher Name), unit (Einheit), color (Farbe)
  const metricConfig = {
    // Exercise metrics
    maxWeight: {
      label: 'Maximales Gewicht',
      unit: 'kg',
      color: '#3b82f6'
    },
    totalVolume: {
      label: 'Gesamtvolumen',
      unit: 'kg',
      color: '#10b981'
    },
    avgWeight: {
      label: 'Durchschnittsgewicht',
      unit: 'kg',
      color: '#f59e0b'
    },
    totalReps: {
      label: 'Gesamte Wiederholungen',
      unit: 'reps',
      color: '#ef4444'
    },
    avgReps: {
      label: 'Durchschnittliche Wiederholungen',
      unit: 'reps',
      color: '#8b5cf6'
    },
    totalSets: {
      label: 'Gesamte Sätze',
      unit: 'sets',
      color: '#06b6d4'
    },
    workoutFrequency: {
      label: 'Trainingshäufigkeit',
      unit: 'workouts',
      color: '#84cc16'
    },
    // General metrics
    totalWorkouts: {
      label: 'Gesamte Workouts',
      unit: 'workouts',
      color: '#3b82f6'
    },
    totalExercises: {
      label: 'Gesamte Übungen',
      unit: 'exercises',
      color: '#10b981'
    },
    avgWorkoutDuration: {
      label: 'Durchschnittliche Trainingsdauer',
      unit: 'min',
      color: '#f59e0b'
    },
    avgWorkoutsPerWeek: {
      label: 'Durchschnittliche Workouts pro Woche',
      unit: 'workouts',
      color: '#ef4444'
    }
  };

  // Hole die Konfiguration für die aktuelle Metrik aus dem Wörterbuch
  // Falls die Metrik nicht existiert, verwende maxWeight als Fallback
  const currentMetric = metricConfig[metric] || metricConfig.maxWeight;

  /**
   * Formatiert den Tooltip (Popup beim Hover über Datenpunkte)
   * 
   * @param {Array} payload - Array mit Daten des Datenpunkts von Recharts
   *                         z.B. [{value: 80, dataKey: 'value', color: '#3b82f6'}]
   * @param {string} label - Datum des Datenpunkts als String z.B. "2024-10-18"
   * @returns {JSX.Element|null} Formatierten Tooltip oder null wenn keine Daten
   */
  const formatTooltip = (payload, label) => {
    // Prüfe ob überhaupt Daten vorhanden sind
    if (!payload || payload.length === 0) return null;

    // Nimm die erste (und einzige) Datenreihe
    const data = payload[0];
    if (!data || data.value === undefined) return null;

    // Formatiere das Datum schön auf Deutsch
    // "2024-10-18" wird zu "18. Okt. 2024"
    const formattedDate = new Date(label).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    // Erstelle den Tooltip mit formatiertem Datum und Wert
    return (
      <div className="stats-chart-tooltip">
        <div className="stats-chart-tooltip-date">{formattedDate}</div>
        <div className="stats-chart-tooltip-value">
          {/* Kleiner farbiger Punkt */}
          <span 
            className="stats-chart-tooltip-color" 
            style={{ backgroundColor: currentMetric.color }}
          />
          {/* Text: "Maximales Gewicht: 80 kg" */}
          {currentMetric.label}: {data.value} {currentMetric.unit}
        </div>
      </div>
    );
  };

  /**
   * Formatiert die Y-Achsen-Werte (Zahlen auf der linken Seite)
   * Macht große Zahlen lesbarer: 1500 wird zu "1.5k"
   * 
   * @param {number} value - Der Zahlenwert der angezeigt werden soll
   * @returns {string} Formatierter Wert als String
   */
  const formatYAxisTick = (value) => {
    // Wenn der Wert größer als 1000 ist, zeige ihn als "k" an
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`; // 1500 → "1.5k"
    }
    // Sonst zeige die normale Zahl
    return value.toString();
  };

  /**
   * Formatiert die X-Achsen-Werte (Daten auf der unteren Seite)
   * Macht Datumsstrings lesbarer: "2024-10-18" wird zu "18. Okt"
   * 
   * @param {string} value - Datum als String z.B. "2024-10-18"
   * @returns {string} Formatierter Datum als String z.B. "18. Okt"
   */
  const formatXAxisTick = (value) => {
    const date = new Date(value);
    return date.toLocaleDateString('de-DE', {
      month: 'short',  // "Okt" statt "Oktober"
      day: 'numeric'   // "18" statt "18."
    });
  };

  // === LOADING STATE ===
  // Zeigt einen Spinner an, während Daten geladen werden
  if (isLoading) {
    return (
      <div className="stats-chart-container" style={{ height: `${height}px` }}>
        <div className="stats-chart-loading">
          <div className="stats-chart-loading-spinner">⏳</div>
          <p>Lade Statistik-Daten...</p>
        </div>
      </div>
    );
  }

  // === ERROR STATE ===
  // Zeigt eine Fehlermeldung an, wenn beim Laden etwas schief ging
  if (error) {
    return (
      <div className="stats-chart-container" style={{ height: `${height}px` }}>
        <div className="stats-chart-error">
          <div className="stats-chart-error-icon">⚠️</div>
          <h3>Fehler beim Laden der Daten</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // === EMPTY DATA STATE ===
  // Zeigt eine Nachricht an, wenn keine Daten vorhanden sind
  // z.B. wenn eine Übung gewählt wurde, die noch nie trainiert wurde
  if (!data || data.length === 0) {
    return (
      <div className="stats-chart-container" style={{ height: `${height}px` }}>
        <div className="stats-chart-empty">
          <div className="stats-chart-empty-icon">📊</div>
          <h3>Keine Daten verfügbar</h3>
          <p>
            {exerciseName 
              ? `Für "${exerciseName}" sind noch keine Daten vorhanden.`
              : 'Wählen Sie eine Übung aus, um Statistiken zu sehen.'
            }
          </p>
        </div>
      </div>
    );
  }

  // === MAIN CHART RENDERING ===
  // Hier wird das eigentliche Chart mit Recharts gezeichnet
  return (
    <div className="stats-chart-container" style={{ height: `${height}px` }}>
      {/* Chart Header mit Titel und Datenpunkt-Anzahl */}
      <div className="stats-chart-header">
        <h3 className="stats-chart-title">
          {exerciseName} - {currentMetric.label}
        </h3>
        <div className="stats-chart-subtitle">
          {data.length} Datenpunkt{data.length !== 1 ? 'e' : ''} verfügbar
        </div>
      </div>

      {/* Chart Container - ResponsiveContainer macht das Chart responsive */}
      <div className="stats-chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          {/* LineChart ist das Hauptelement von Recharts für Liniendiagramme */}
          <LineChart
            data={data}  // Die Datenpunkte: [{date: "2024-10-01", value: 80}, ...]
            margin={{
              top: 20,    // Abstand oben
              right: 30,  // Abstand rechts
              left: 20,   // Abstand links
              bottom: 20 // Abstand unten
            }}
          >
            {/* Gitternetz im Hintergrund */}
            <CartesianGrid 
              strokeDasharray="3 3"  // Gestrichelte Linien: 3px Strich, 3px Pause
              stroke="var(--border-color)"
              opacity={0.3}
            />
            {/* X-Achse (unten): Zeigt die Daten */}
            <XAxis
              dataKey="date"              // Welches Feld aus data[] für X-Achse verwendet wird
              tickFormatter={formatXAxisTick}  // Formatiert die Datums-Labels
              stroke="var(--text-secondary)"
              fontSize={12}
              tickLine={{ stroke: 'var(--border-color)' }}
            />
            {/* Y-Achse (links): Zeigt die Werte */}
            <YAxis
              tickFormatter={formatYAxisTick}  // Formatiert die Zahlen-Labels
              stroke="var(--text-secondary)"
              fontSize={12}
              tickLine={{ stroke: 'var(--border-color)' }}
            />
            {/* Tooltip: Popup beim Hover über Datenpunkte */}
            <Tooltip
              content={formatTooltip}  // Unsere eigene Tooltip-Funktion
              cursor={{ stroke: currentMetric.color, strokeWidth: 1 }}  // Vertikale Linie beim Hover
            />
            {/* Legend: Legende für die Datenreihe */}
            <Legend />
            {/* Line: Die eigentliche Linie im Chart */}
            <Line
              type="monotone"                    // Glatte Linie zwischen Punkten
              dataKey="value"                    // Welches Feld aus data[] für Y-Werte verwendet wird
              stroke={currentMetric.color}       // Farbe der Linie
              strokeWidth={3}                    // Dicke der Linie
              dot={{ fill: currentMetric.color, strokeWidth: 2, r: 4 }}  // Normale Punkte
              activeDot={{ r: 6, stroke: currentMetric.color, strokeWidth: 2 }}  // Punkt beim Hover
              name={currentMetric.label}         // Name in der Legende
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Info: Zusätzliche Informationen unter dem Chart */}
      <div className="stats-chart-info">
        <div className="stats-chart-info-item">
          <span className="stats-chart-info-label">Einheit:</span>
          <span className="stats-chart-info-value">{currentMetric.unit}</span>
        </div>
        <div className="stats-chart-info-item">
          <span className="stats-chart-info-label">Datenbereich:</span>
          <span className="stats-chart-info-value">
            {data.length > 0 && (
              <>
                {/* Zeigt den Zeitraum der Daten: "01. Okt. 2024 - 18. Okt. 2024" */}
                {new Date(data[0].date).toLocaleDateString('de-DE')} - {' '}
                {new Date(data[data.length - 1].date).toLocaleDateString('de-DE')}
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsChart;

