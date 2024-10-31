import React, { useState, useEffect } from 'react';
import './EditTickets.css';
import Cookies from 'js-cookie';
import axios from 'axios';

const EditTickets = ({ isOpen, onClose }) => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [ticketData, setTicketData] = useState({
    ticketType: '',
    ticketDescription: '',
    price: 0,
    availableTickets: 0,
    ticketTypeId: null
  });
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const resetState = () => {
    console.log('Resetting state...');
    setSelectedEventId(null);
    setTickets([]);
    setTicketData({ ticketType: '', price: 0, availableTickets: 0, ticketTypeId: null });
    setSelectedTicketId(null);
    setError('');
    setIsLoading(false);
    setIsDeleting(false);
  };

  useEffect(() => {
    if (isOpen) {
      console.log('Modal is open, fetching events with tickets enabled...');
      setIsLoading(true);
      // Fetch all events with tickets enabled when the modal opens
      fetch('http://localhost:5000/api/events/tickets-enabled')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          console.log('Received response from /api/events/tickets-enabled:', response);
          return response.json();
        })
        .then(data => {
          console.log('Parsed JSON data:', data);
          if (Array.isArray(data)) {
            setEvents(data.sort((a, b) => new Date(a.date) - new Date(b.date)));
          } else {
            setError('Unexpected response format');
          }
        })
        .catch((err) => {
          console.error('Error fetching events with tickets:', err);
          setError('Failed to load events with tickets. Please try again.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      resetState();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedEventId) {
      console.log('Fetching tickets for selected event ID:', selectedEventId);
      setIsLoading(true);
      // Fetch tickets for the selected event
      const cleanedEventId = selectedEventId.toString().trim();
      fetch(`http://localhost:5000/api/tickets/events/${cleanedEventId}/tickets`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          console.log('Received response from /api/tickets/events:', response);
          return response.json();
        })
        .then(data => {
          console.log('Parsed JSON data for tickets:', data);
          if (data.tickets && data.tickets.length > 0) {
            setTickets(data.tickets.filter(ticket => ticket.ticketTypeId !== undefined));
          } else {
            setError('No tickets available for the selected event.');
          }
        })
        .catch(error => {
          console.error('Error fetching tickets:', error);
          setError('Failed to load tickets for the selected event. Please try again.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [selectedEventId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        console.log('Escape key pressed, closing modal...');
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleTicketInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ticket field ${name} to ${value}`);
    setTicketData({ ...ticketData, [name]: value });
  };

  const handleTicketSelect = (ticket) => {
    console.log('Ticket selected:', ticket);
    setTicketData({
      ticketType: ticket.ticketType,
      ticketDescription: ticket.ticketDescription,
      price: ticket.price,
      availableTickets: ticket.availableTickets,
      ticketTypeId: ticket.ticketTypeId,
    });
    setSelectedTicketId(ticket.ticketTypeId);
  };

  const handleTicketUpdate = async (e) => {
    e.preventDefault();
    if (!ticketData) return;
    
    if (!window.confirm("Are you sure you want to update this ticket?")) {
      return;
    }
    
    const adminUsername = Cookies.get('adminUsername');
    
    try {
      console.log('Updating ticket:', ticketData);
      const response = await fetch(`http://localhost:5000/api/tickets/${ticketData.ticketTypeId}`, {
        method: 'PUT',
        headers: {
          'X-Admin-Username': adminUsername,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });
    
      console.log('Received response from updating ticket:', response);
      if (response.ok) {
        alert('Ticket updated successfully!');
        setError('');
    
    // Log vendor action after updating a ticket
    if (adminUsername) {
      try {
        await axios.post('http://localhost:5000/api/logs/log-vendor-action', {
          username: adminUsername,
          action: `updated ticket type "${ticketData.ticketType}" with description "${ticketData.ticketDescription}" (ID: ${ticketData.ticketTypeId})`,
        });
      } catch (error) {
        console.error(`Error logging vendor action: ${error.message}`);
      }
    }

      } else {
        const errorData = await response.json();
        console.error('Error updating ticket:', errorData);
        setError('Failed to update the ticket. Please try again.');
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
      setError('An error occurred while updating the ticket. Please try again.');
    }
  };  
  
  const handleTicketDelete = async () => {
    if (!ticketData) return;
  
    if (!window.confirm("Are you sure you want to delete this ticket? This action cannot be undone.")) {
      return;
    }
  
    setIsDeleting(true);
    const adminUsername = Cookies.get('adminUsername');
  
    try {
      console.log('Deleting ticket:', ticketData.ticketTypeId);
      const response = await fetch(`http://localhost:5000/api/tickets/${ticketData.ticketTypeId}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Username': adminUsername,
        },
      });
  
      console.log('Received response from deleting ticket:', response);
      if (response.ok) {
        alert('Ticket deleted successfully!');
        setTickets(tickets.filter(ticket => ticket.ticketTypeId !== ticketData.ticketTypeId));
        setTicketData({ ticketType: '', ticketDescription: '', price: 0, availableTickets: 0, ticketTypeId: null });
        setError('');
  
        // Log vendor action
        if (adminUsername) {
          await axios.post('http://localhost:5000/api/logs/log-vendor-action', {
            username: adminUsername,
            action: `has deleted ${ticketData.ticketType} (Description: ${ticketData.ticketDescription}) (ID: ${ticketData.ticketTypeId})`,
            logType: 'vendor',
          });
        }
      } else {
        setError('Failed to delete the ticket. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
      setError('An error occurred while deleting the ticket. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };  

  if (!isOpen) return null;

  return (
    <div className="edit-ticket-modal-overlay">
      <div className="edit-ticket-modal-content">
        <h2 className="edit-ticket-title">
          Edit Tickets
          <span className="edit-ticket-close-modal" onClick={onClose}>×</span>
        </h2>
        {isLoading && <img src="/public/images/icons/loading.gif" alt="Loading..." className="loading-icon" />}
        {error && <p className="edit-ticket-error-message">{error}</p>}
        {!selectedEventId ? (
          <div className="edit-ticket-list">
            <h3>Select an Event</h3>
            <ul>
              {events.map(event => (
                <li key={`event-${event.id}`} onClick={() => {
                  console.log('Event selected:', event.id);
                  setSelectedEventId(event.id);
                }}>
                  {event.title}
                </li>
              ))}
            </ul>
          </div>
        ) : selectedTicketId === null ? (
          <div className="edit-ticket-list">
            <h3>Select a Ticket for Event: {events.find(event => event.id === selectedEventId)?.title}</h3>
            <ul>
              {tickets.map(ticket => (
                <li key={`ticket-${ticket.ticketTypeId}`} onClick={() => handleTicketSelect(ticket)}>
                  {ticket.ticketType} - ${ticket.price}
                </li>
              ))}
            </ul>
            <button type="button" className="edit-ticket-back-button" onClick={() => {
              console.log('Back to events list');
              setSelectedEventId(null);
            }}>← Back to Events</button>
          </div>
        ) : (
          <div className="edit-ticket-details">
            <h3>Editing Ticket for Event: {events.find(event => event.id === selectedEventId)?.title}</h3>
            <form className="edit-ticket-form" onSubmit={handleTicketUpdate}>
              <label className="edit-ticket-label">Ticket Type:</label>
              <input type="text" className="edit-ticket-type-input" name="ticketType"
                value={ticketData.ticketType}
                onChange={handleTicketInputChange}
                required
              />
              <label className="edit-ticket-label">Ticket Description:</label>
              <input type="text" className="edit-ticket-type-description" name="ticketDescription"
                value={ticketData.ticketDescription}
                onChange={handleTicketInputChange}
                required
              />
              <label className="edit-ticket-label">Price:</label>
              <input type="number" className="edit-ticket-price-input" name="price"
                min="0"
                step="1"
                value={ticketData.price}
                onChange={handleTicketInputChange}
                required
              />
              <label className="edit-ticket-label">Available Tickets:</label>
              <input type="number" className="edit-ticket-available-input" name="availableTickets"
                min="0"
                value={ticketData.availableTickets}
                onChange={handleTicketInputChange}
                required
              />
              <button type="submit" className="edit-ticket-save-button">Update Ticket</button>
            </form>
            <div className="edit-ticket-buttons-container">
              <button type="button" className="edit-ticket-back-button" onClick={() => {
                console.log('Back to tickets list');
                setTicketData({ ticketType: '', price: 0, availableTickets: 0, ticketTypeId: null });
                setSelectedTicketId(null);
              }}>← Back to Tickets</button>
              <button type="button" className="edit-ticket-delete-button" onClick={handleTicketDelete} disabled={isDeleting}>
                {isDeleting ? <img src="%PUBLIC_URL%/images/icons/loading.gif" alt="Deleting..." className="loading-icon" /> : 
                <><img src={`${process.env.PUBLIC_URL}/images/icons/error.png`} alt="Error" className="icon" />Delete Ticket</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditTickets;
