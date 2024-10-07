import React, { useState, useEffect } from 'react';
import './EventCalendar.css';
import ViewEvent from '../ViewEvent/ViewEvent';

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [previewEvent, setPreviewEvent] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date(); // Store today's date

  // Get the current date info
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Calculate the maximum date (3 months from current month)
  const maxFutureDate = new Date(new Date().setMonth(currentMonth + 3));

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, [currentDate]);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleEventClick = (event) => {
    if (window.innerWidth <= 768) {
      setPreviewEvent(event);
    } else {
      setSelectedEvent(event);
    }
  };

  const handlePreviewConfirm = () => {
    setSelectedEvent(previewEvent);
    setPreviewEvent(null);
  };

  const closeViewEvent = () => {
    setSelectedEvent(null);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  // Check if "Prev" button should be disabled
  const isPrevDisabled =
    currentDate.getFullYear() === currentYear && currentDate.getMonth() === currentMonth;

  // Check if "Next" button should be disabled
  const isNextDisabled =
    currentDate.getFullYear() === maxFutureDate.getFullYear() &&
    currentDate.getMonth() === maxFutureDate.getMonth();

  return (
    <div className="event-calendar">
    <div className="calendar-header">
        {/* Prev Button with icon */}
        <button
        className="calendar-prev"
        onClick={() => !isPrevDisabled && setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
        disabled={isPrevDisabled}
        >
        <img
            src={isPrevDisabled ? `${process.env.PUBLIC_URL}/images/icons/previous-grey.png` : `${process.env.PUBLIC_URL}/images/icons/previous.png`}
            alt="Prev"
            className="icon-prev"
        />
        </button>

        <h2>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>

        {/* Next Button with icon */}
        <button
        className="calendar-next"
        onClick={() => !isNextDisabled && setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
        disabled={isNextDisabled}
        >
        <img
            src={isNextDisabled ? `${process.env.PUBLIC_URL}/images/icons/next-grey.png` : `${process.env.PUBLIC_URL}/images/icons/next.png`}
            alt="Next"
            className="icon-next"
        />
        </button>
    </div>

    <div className="day-labels">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label) => (
        <div key={label} className="day-label">{label}</div>
        ))}
    </div>

    <div className="calendar-grid">
        {Array(firstDay).fill(null).map((_, idx) => (
        <div key={`empty-${idx}`} className="calendar-cell empty"></div>
        ))}

        {Array(daysInMonth).fill(null).map((_, idx) => {
        const day = idx + 1;
        const eventForDay = events.find((event) => {
            const eventDate = new Date(event.date);
            return eventDate.getDate() === day &&
                eventDate.getMonth() === currentDate.getMonth() &&
                eventDate.getFullYear() === currentDate.getFullYear();
        });

        const isToday = today.getDate() === day &&
                        today.getMonth() === currentDate.getMonth() &&
                        today.getFullYear() === currentDate.getFullYear();

        const isPast = day < today.getDate() &&
                        currentDate.getMonth() === today.getMonth() &&
                        currentDate.getFullYear() === today.getFullYear();

        return (
            <div key={`day-${day}`} className="calendar-day-wrapper">
            {isToday && eventForDay && <div className="today-label">TODAY!</div>}
            <div
                className={`calendar-cell ${eventForDay ? 'has-event shimmer' : ''} 
                            ${isToday && !eventForDay ? 'ordinary-today' : ''} 
                            ${isToday && eventForDay ? 'today-event' : ''} 
                            ${isPast ? 'past-day' : ''}`}
                onClick={() => eventForDay && handleEventClick(eventForDay)}
            >
                <div className="calendar-date">{day}</div>
                {eventForDay && window.innerWidth > 768 && (
                <div className="calendar-event-title">{eventForDay.title}</div>
                )}
                {eventForDay && window.innerWidth <= 768 && (
                <div className="calendar-event-title-mobile">{eventForDay.title}</div>
                )}
            </div>
            </div>
        );
        })}
    </div>

    {previewEvent && window.innerWidth <= 768 && (
        <div className="event-preview">
        <h3>{previewEvent?.title || 'No Title Available'}</h3>
        <button className="confirm-button" onClick={handlePreviewConfirm}>Open Event</button>
        <button className="cancel-button" onClick={() => setPreviewEvent(null)}>Close</button>
        </div>
    )}

    {selectedEvent && (
        <ViewEvent event={selectedEvent} onClose={closeViewEvent} />
    )}
    </div>
  );
};

export default EventCalendar;
