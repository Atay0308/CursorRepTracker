# Workout Tracker

Eine React-basierte Anwendung zum Verfolgen von Workouts und Fitness-Fortschritten.

## Features

- 🏋️ **Workout-Erstellung und -Verfolgung** - Vollständige CRUD-Operationen für Workouts
- 🎯 **Dynamische Übungsauswahl** - Muskelgruppen-Grid mit Übungsdatenbank
- ⏱️ **Count-Up Timer** - Timer für Pausenzeiten (startet bei 00:00)
- 💾 **Intelligentes Auto-Save** - Robuste localStorage-Integration mit Fallback-Logik
- 🔄 **Continue Workout** - Fortsetzen von ungespeicherten Workouts
- 🛡️ **Robuste Speicher-Logik** - Automatischer Fallback von Update zu Create bei 404-Fehlern
- 📱 **Responsive Design** - Mobile-first mit dynamischen Kartenbreiten
- 🎨 **Dark Theme** - Moderne UI mit CSS Custom Properties
- 🧪 **Umfassende Tests** - Unit Tests mit Vitest und React Testing Library
- 📊 **Dynamische Workout-Anzeige** - Letzte 3 Workouts werden automatisch geladen
- 📈 **Erweiterte Statistiken** - Hierarchische Filter mit Metriken für Übungen, Muskelgruppen und allgemeine Statistiken
- 🎛️ **Intelligente Filter** - Area-basierte Metrik-Auswahl mit dynamischen Dropdowns
- 📊 **Interaktive Charts** - Recharts-basierte Visualisierung mit Tooltips und Responsive Design

## Technologie-Stack

- **Frontend**: React 18 mit JSX
- **Styling**: CSS3 mit CSS Variables
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Icons**: Lucide React
- **API**: Axios
- **Backend**: JSON Server
- **Build Tool**: Vite
- **Testing**: Vitest + Testing Library

## Installation

1. Dependencies installieren:
```bash
npm install
```

2. JSON Server starten (in einem separaten Terminal):
```bash
npm run server
```

3. Development Server starten:
```bash
npm run dev
```

4. App öffnen: http://localhost:3000

## Verfügbare Scripts

- `npm run dev` - Startet den Development Server
- `npm run build` - Erstellt Production Build
- `npm run preview` - Zeigt Production Build
- `npm run server` - Startet JSON Server
- `npm test` - Führt Tests aus
- `npm run test:ui` - Startet Test UI
- `npm run test:coverage` - Führt Tests mit Coverage aus
- `npm run lint` - Führt ESLint aus
- `npm run lint:fix` - Behebt ESLint-Probleme automatisch

## Projektstruktur

```
src/
├── components/          # React Komponenten
│   ├── AddExerciseModal/ # Modal für Übungsauswahl (Muskelgruppen-Grid)
│   ├── BottomNavigation/ # Wiederverwendbare Navigation
│   ├── DateDisplay/      # Datumsanzeige-Komponente
│   ├── ExerciseCard/     # Übungskarte mit Sets und Timer
│   ├── SetRow/           # Einzelner Satz mit Count-Up Timer
│   ├── StartWorkout/     # Start-Button mit Continue-Funktionalität
│   ├── StatsChart/       # Recharts-basierte Diagramme
│   ├── StatsFilter/      # Hierarchische Filter-Komponente
│   └── WorkoutCard/      # Wiederverwendbare Workout-Karten
├── config/              # Konfigurationsdateien
│   └── statistics.js    # Metriken-Konfiguration für Statistiken
├── pages/               # Hauptseiten
│   ├── HomePage/        # Dashboard mit dynamischen Workouts
│   ├── PastWorkoutsPage/ # Vergangene Workouts-Übersicht
│   ├── StatisticsPage/   # Erweiterte Statistiken mit Charts
│   └── WorkoutPage/      # Workout-Editor mit Auto-Save
├── data/                # Statische Daten
│   └── exerciseDatabase.js # Übungsdatenbank mit Muskelgruppen
├── services/            # API Services
│   ├── api.js          # Workout API mit getRecentWorkouts()
│   └── statsAPI.js     # Statistiken API mit hierarchischen Metriken
├── styles/             # CSS Styles
│   └── globals.css     # CSS Custom Properties & Design System
├── test/               # Test Setup
│   └── setup.js        # Vitest Konfiguration
├── types/              # Datenmodelle und Konstanten
└── utils/              # Utility Funktionen
    ├── general.js      # localStorage-Funktionen & ID-Generierung
    ├── dateTime.js     # Datum/Zeit Utilities
    ├── validation.js   # Input-Validierung
    └── statistics.js   # Statistik-Berechnungen mit Gruppierung
```

## API Endpoints

### Workouts
- `GET /api/workouts` - Alle Workouts abrufen
- `GET /api/workouts/:id` - Workout nach ID abrufen
- `POST /api/workouts` - Neues Workout erstellen
- `PUT /api/workouts/:id` - Workout aktualisieren
- `DELETE /api/workouts/:id` - Workout löschen
- `GET /api/workouts?_sort=date&_order=desc&_limit=3` - Letzte 3 Workouts (getRecentWorkouts)

### Statistiken
- `GET /api/workouts` - Alle Workouts für Statistiken (statsAPI)
- `getExerciseStats(exercise, metric, period, grouping)` - Übungs-spezifische Statistiken
- `getMuscleStats(muscleGroup, metric, period, grouping)` - Muskelgruppen-spezifische Statistiken
- `getGeneralStats(metric, period, grouping)` - Allgemeine Statistiken
- `getAvailableExercises()` - Verfügbare Übungen für Filter
- `getAvailableMuscles()` - Verfügbare Muskelgruppen für Filter

### Training Plans
- `GET /api/trainingPlans` - Alle Trainingspläne abrufen
- `GET /api/trainingPlans/:id` - Trainingsplan nach ID abrufen
- `POST /api/trainingPlans` - Neuen Trainingsplan erstellen
- `PUT /api/trainingPlans/:id` - Trainingsplan aktualisieren
- `DELETE /api/trainingPlans/:id` - Trainingsplan löschen

## Datenstruktur

### Workout
```javascript
{
  id: string,
  name: string,
  date: string,        // ISO date
  startTime: string,  // HH:mm
  endTime: string,    // HH:mm
  exercises: Exercise[],
  notes: string,
  isActive: boolean
}
```

### Exercise
```javascript
{
  id: string,
  name: string,
  muscleGroup: string,
  sets: WorkoutSet[],
  notes: string
}
```

### WorkoutSet
```javascript
{
  id: string,
  setNumber: number,
  weight: number,
  reps: number,
  breakTime: number,  // in seconds
  notes: string
}
```

## Entwicklung

### Architektur-Prinzipien
- **Modulares Design** - Wiederverwendbare Komponenten mit klarer Trennung
- **Component-Driven Development** - Jede Komponente hat eigene Verantwortlichkeit
- **Immutable State Updates** - Sichere State-Management-Patterns
- **Robuste API-Integration** - Intelligente Create/Update-Logik mit Fallback
- **Intelligentes ID-Management** - Workouts erhalten IDs erst von der API

### Neue Features (2024)

#### 🎯 **Dynamische Übungsauswahl**
- Muskelgruppen-Grid mit visueller Auswahl
- Übungsdatenbank mit vordefinierten Übungen
- 2-Schritt-Modal: Muskelgruppe → Übung

#### 💾 **Intelligente localStorage Integration**
- Auto-Save von Workout-Entwürfen mit temporären IDs
- Continue Workout-Funktionalität
- Datenverlust-Schutz bei Navigation
- Robuste Fallback-Logik bei API-Fehlern

#### ⏱️ **Verbesserter Timer**
- Count-Up Timer (startet bei 00:00)
- Toggle und Reset-Funktionalität
- Bessere UX mit Fokus-Management

#### 📱 **Responsive Design**
- CSS `clamp()` für dynamische Kartenbreiten
- Mobile-first Approach
- Breakpoint-spezifische Anpassungen

### Styling
- **CSS Custom Properties** - Konsistente Design-Tokens
- **Mobile-first responsive Design** - Progressive Enhancement
- **Dark Theme** - Moderne UI mit hohem Kontrast
- **CSS Grid & Flexbox** - Moderne Layout-Techniken
- **Dynamic Sizing** - `clamp()` für responsive Elemente

### Performance
- **Code Splitting** mit Vite
- **Lazy Loading** für Routen
- **Optimierte Bundle-Größe**
- **Effiziente Re-Renders** mit React.memo
- **localStorage Caching** für bessere Performance

## Testing

### Test-Framework
- **Vitest** - Schneller Test-Runner (Vite-basiert)
- **React Testing Library** - Komponenten-Tests mit User-Centric Approach
- **Jest-DOM** - Zusätzliche Matcher für DOM-Tests

### Test-Coverage
- ✅ **Utility Functions** (`src/utils/general.test.js`) - localStorage-Funktionen
- ✅ **React Components** (`src/components/*/Component.test.jsx`) - Unit Tests
- ✅ **Integration Tests** (`src/pages/WorkoutPage.test.jsx`) - Komponenten-Integration
- ✅ **API Mocking** - Vollständige Mock-Strategien

### Test-Commands
```bash
npm test                    # Alle Tests ausführen
npm run test:ui            # Test UI öffnen
npm run test:coverage      # Coverage-Report generieren
npm test src/utils/        # Spezifische Tests
```

### Test-Patterns
- **Mocking**: `vi.mock()` für externe Dependencies
- **Async Testing**: `waitFor()` für State-Updates
- **User Interactions**: `fireEvent` für User-Events
- **Component Testing**: `render()` mit BrowserRouter

## Deployment

Für Production Build:
```bash
npm run build
```

Die gebauten Dateien befinden sich im `dist/` Ordner.
