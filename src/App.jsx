/**
 * Main App Component
 * Sets up routing and global layout
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage.jsx';
import WorkoutPage from './pages/WorkoutPage/WorkoutPage.jsx';
import StatisticsPage from './pages/StatisticsPage/StatisticsPage.jsx';
import PastWorkoutsPage from './pages/PastWorkoutsPage/PastWorkoutsPage.jsx';
import TrainingPlansPage from './pages/TrainingPlansPage/TrainingPlansPage.jsx';
import './styles/globals.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/workout/:id" element={<WorkoutPage />} />
          <Route path="/workout/new" element={<WorkoutPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/past-workouts" element={<PastWorkoutsPage />} />
          <Route path="/training-plans" element={<TrainingPlansPage />} />
          {/* Additional routes will be added later */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
