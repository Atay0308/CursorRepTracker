/**
 * DateDisplay Component
 * Displays current date and week view
 * 
 * Features:
 * - Shows current day and date
 * - Displays week view with today highlighted
 * - Responsive design
 * - SEO-friendly structure
 */

import React, { useState, useEffect } from 'react';
import './DateDisplay.css';

const DateDisplay = () => {
  // State for storing date cards for week view
  const [dateCards, setDateCards] = useState([]);

  /**
   * Generate date cards for week view
   * Creates 7 cards: 3 days before today, today, 3 days after
   */
  useEffect(() => {
    const generateDateCards = () => {
      const today = new Date();
      const cards = [];
      
      // Generate 7 days: 3 days before, today, 3 days after
      for (let i = -3; i <= 3; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        cards.push({
          date: date.toISOString().split('T')[0],
          dayName: date.toLocaleDateString('de-DE', { weekday: 'short' }),
          dayNumber: date.getDate(),
          isToday: i === 0
        });
      }
      
      setDateCards(cards);
    };

    generateDateCards();
  }, []);

  /**
   * Get current day name and formatted date
   * Uses German locale for proper formatting
   */
  const currentDate = new Date();
  const dayName = currentDate.toLocaleDateString('de-DE', { weekday: 'long' });
  const formattedDate = currentDate.toLocaleDateString('de-DE', { 
    day: 'numeric', 
    month: 'long' 
  });

  return (
    <header className="date-display" role="banner">
      {/* Current date section showing today's day and date */}
      <div className="date-current-section">
        <div className="date-current-day" aria-label={`Heute ist ${dayName}`}>
          {dayName}
        </div>
        <div className="date-current-date" aria-label={`Datum: ${formattedDate}`}>
          {formattedDate}
        </div>
      </div>
      
      {/* Week view showing 7 days with today highlighted */}
      <div className="date-week-view" role="img" aria-label="Aktuelle Woche">
        <div className="date-cards-container">
          {dateCards.map((card) => (
            <div
              key={card.date}
              className={`date-card ${card.isToday ? 'active' : ''}`}
              aria-label={`${card.dayName}, ${card.dayNumber}. ${card.isToday ? 'Heute' : ''}`}
            >
              {/* Day number */}
              <span className="date-day">{card.dayNumber}</span>
              {/* Weekday abbreviation */}
              <span className="date-weekday">{card.dayName}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default DateDisplay;
