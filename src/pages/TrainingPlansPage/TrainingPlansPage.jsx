import React from 'react';
import BottomNavigation from '../../components/BottomNavigation/BottomNavigation.jsx';
import './TrainingPlansPage.css';

const STATIC_PLANS = [
  { id: 'p1', name: 'Oberkörper (Push)', description: 'Brust, Schultern, Trizeps' },
  { id: 'p2', name: 'Unterkörper (Beine)', description: 'Quadrizeps, hintere Kette, Core' },
  { id: 'p3', name: 'Ganzkörper (3 Tage)', description: 'Ganzkörper-Plan für Anfänger' },
];

const TrainingPlansPage = () => {
  return (
    <div className="training-plans-page">
      <header className="training-plans-header">
        <h1>Trainingspläne</h1>
        <p className="training-plans-subtitle">Statische Beispielpläne (Demo)</p>
      </header>

      <main className="training-plans-main">
        <ul className="training-plans-list" aria-label="Liste von Trainingsplänen">
          {STATIC_PLANS.map(plan => (
            <li key={plan.id} className="training-plan-card">
              <div className="training-plan-card-header">
                <h2 className="training-plan-title">{plan.name}</h2>
              </div>
              <div className="training-plan-body">
                <p className="training-plan-description">{plan.description}</p>
              </div>
              <div className="training-plan-actions">
                <button type="button" className="btn-secondary" disabled>
                  Öffnen (bald)
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>

      <BottomNavigation activeTab="training-plans" onNavigate={(path) => (window.location.href = path)} />
    </div>
  );
};

export default TrainingPlansPage;


