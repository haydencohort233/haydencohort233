import React, { useState, useEffect } from 'react';
import './EditTickets.css';

const EditTickets = ({ isOpen, onClose }) => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [tickets, setTickets] = useState([]);
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

  useEffect(() => {
    if (selectedEventId) {
      const cleanedEventId = selectedEventId.toString().trim();
      console.log('Fetching tickets for Event ID:', cleanedEventId); // Add this line
      fetch(`http://localhost:5000/api/tickets/events/${cleanedEventId}/tickets`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to load tickets for the selected event with ID: ${cleanedEventId}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('Tickets fetched:', data);
          setTickets(data);
        })
        .catch(error => {
          console.error('Error fetching tickets:', error);
          setError('Failed to load tickets for the selected event. Please try again.');
        });
    }
  }, [selectedEventId]);
  

  // Handle input changes for ticket details
  const handleTicketInputChange = (ticketId, field, value) => {
    setTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === ticketId ? { ...ticket, [field]: value } : ticket
      )
    );
  };

  // Handle the ticket update submission
  const handleTicketUpdate = async (ticketId) => {
    const ticketToUpdate = tickets.find(ticket => ticket.id === ticketId);

    try {
      const response = await fetch(`http://localhost:5000/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketToUpdate),
      });

      if (response.ok) {
        setError(''); // Clear any existing errors
      } else {
        throw new Error('Failed to update the ticket. Please try again.');
      }
    } catch {
      setError('An error occurred while updating the ticket. Please try again.');
    }
  };

  // Reset the component state when closing
  const handleClose = () => {
    setSelectedEventId(null);
    setTickets([]);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="edit-ticket-modal-overlay">
      <div className="edit-ticket-modal-content">
        <h2 className="edit-ticket-title">
          Edit Tickets
          <span className="edit-ticket-close-modal" onClick={handleClose}>×</span>
        </h2>
        {error && <p className="edit-ticket-error-message">{error}</p>}

        {!selectedEventId ? (
          <div className="edit-ticket-list">
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
          <div className="edit-ticket-details">
            <h3>Tickets for Event: {events.find(event => event.id === selectedEventId)?.title}</h3>
            {tickets.length > 0 ? (
              tickets.map(ticket => (
                <form key={ticket.id} className="edit-ticket-form" onSubmit={(e) => {
                  e.preventDefault();
                  handleTicketUpdate(ticket.id);
                }}>
                  <label className="edit-ticket-label">
                    Ticket Type:
                    <input
                      type="text"
                      value={ticket.ticket_type}
                      onChange={(e) => handleTicketInputChange(ticket.id, 'ticket_type', e.target.value)}
                      required
                    />
                  </label>
                  <label className="edit-ticket-label">
                    Price:
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={ticket.price}
                      onChange={(e) => handleTicketInputChange(ticket.id, 'price', e.target.value)}
                      required
                    />
                  </label>
                  <label className="edit-ticket-label">
                    Available Tickets:
                    <input
                      type="number"
                      min="0"
                      value={ticket.available_tickets}
                      onChange={(e) => handleTicketInputChange(ticket.id, 'available_tickets', e.target.value)}
                      required
                    />
                  </label>
                  <button type="submit" className="edit-ticket-save-button">Update Ticket</button>
                </form>
              ))
            ) : (
              <p>No tickets found for this event.</p>
            )}
            <button type="button" className="edit-ticket-back-button" onClick={() => setSelectedEventId(null)}>← Back to Events</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditTickets;
