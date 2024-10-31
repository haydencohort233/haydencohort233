import React, { useState, useEffect } from 'react';
import './AddTicket.css';
import Cookies from 'js-cookie';
import axios from 'axios';

const AddTicket = ({ isOpen, onClose }) => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [ticketType, setTicketType] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [availableTickets, setAvailableTickets] = useState(0);
  const [error, setError] = useState('');

  // Fetch all events with tickets enabled when the modal opens
  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:5000/api/events/tickets-enabled')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if (Array.isArray(data)) {
            setEvents(data.sort((a, b) => new Date(a.date) - new Date(b.date)));
          } else {
            throw new Error('Unexpected response format');
          }
        })
        .catch(() => {
          setError('Failed to load events with tickets. Please try again.');
        });
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure an event is selected
    if (!selectedEventId) {
        setError('Please select an event before adding a ticket.');
        return;
    }

    const adminUsername = Cookies.get('adminUsername');

    // Create the new ticket object
    const newTicket = {
        eventId: selectedEventId,
        ticketType,
        ticketDescription, // Include ticketDescription here
        price: parseFloat(price),
        availableTickets: parseInt(availableTickets, 10),
    };

    // Debugging: Log newTicket to verify eventId value
    console.log("Adding ticket with data: ", newTicket);

    // Submit the new ticket to your backend
    try {
        const response = await fetch(`http://localhost:5000/api/tickets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Admin-Username': adminUsername,
            },
            body: JSON.stringify(newTicket),
        });

        console.log('Received response from adding new ticket:', response);
        if (response.ok) {
            console.log('New ticket added successfully:', newTicket);
            // Reset form fields and close the modal
            setTicketType('');
            setTicketDescription(''); // Reset ticket description
            setPrice(0);
            setAvailableTickets(0);
            setSelectedEventId(null);
            setError('');
            onClose();

            // Log vendor action after adding a ticket
            if (adminUsername) {
                try {
                    await axios.post('http://localhost:5000/api/logs/log-vendor-action', {
                        username: adminUsername,
                        action: `added new ticket type "${ticketType}" with description "${ticketDescription}" with price "${price}" and available tickets "${availableTickets}" for event ID: ${selectedEventId}`,
                        logType: 'vendor',
                    });
                } catch (error) {
                    console.error(`Error logging vendor action: ${error.message}`);
                }
            }
        } else {
            const errorData = await response.json();
            console.error('Error adding new ticket:', errorData);
            setError('Failed to add the new ticket. Please try again.');
        }
    } catch (error) {
        console.error('Error adding new ticket:', error);
        setError('An error occurred while adding the ticket. Please try again.');
    }
};

  const handleClose = () => {
    setSelectedEventId(null);
    setTicketType('');
    setPrice(0);
    setAvailableTickets(0);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="add-ticket-modal-overlay">
      <div className="add-ticket-modal-content">
        <h2 className="add-ticket-title">
          Add Ticket
          <span className="add-ticket-close-modal" onClick={handleClose}>×</span>
        </h2>
        {error && <p className="add-ticket-error-message">{error}</p>}

        {!selectedEventId ? (
          <div className="add-ticket-event-list">
            <h3>Select an Event</h3>
            <ul>
              {events.map(event => (
                <li key={event.id} onClick={() => setSelectedEventId(event.id)}>
                  {event.title}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="add-ticket-details">
            <h3>Adding Ticket for Event: {events.find(event => event.id === selectedEventId)?.title}</h3>
            <form onSubmit={handleSubmit} className="add-ticket-form">
              <label className="add-ticket-label">
                Ticket Type:
                <input 
                  type="text" 
                  value={ticketType} 
                  onChange={(e) => setTicketType(e.target.value)} 
                  required 
                />
              </label>

              <label className="add-ticket-label">
                Ticket Description:
                <input 
                  type="text" 
                  value={ticketDescription} 
                  onChange={(e) => setTicketDescription(e.target.value)} 
                  required 
                />
              </label>

              <label className="add-ticket-label">
                Price:
                <input 
                  type="number" 
                  min="0" 
                  step="1"
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  required 
                />
              </label>

              <label className="add-ticket-label">
                Available Tickets:
                <input 
                  type="number" 
                  min="0"
                  value={availableTickets} 
                  onChange={(e) => setAvailableTickets(e.target.value)} 
                  required 
                />
              </label>

              <button type="submit" className="add-ticket-save-button">Add Ticket</button>
            </form>
            <button type="button" className="add-ticket-back-button" onClick={() => setSelectedEventId(null)}>← Back to Events</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddTicket;
