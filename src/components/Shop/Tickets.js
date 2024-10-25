import React, { useState, useEffect } from 'react';
import BuyTicket from './BuyTicket';
import './Tickets.css';

const Tickets = ({ eventId, eventName, eventDate }) => {
    const [ticketTypes, setTicketTypes] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedTicketType, setSelectedTicketType] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    // Fetch ticket types for the event
    useEffect(() => {
        console.log('Fetching ticket types for eventId:', eventId); 
    
        const fetchTicketTypes = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/tickets/events/${eventId}/tickets`);
                const result = await response.json();
        
                if (response.ok && result.tickets) {
                    setTicketTypes(result.tickets);
                } else {
                    setErrorMessage(result.message || 'Failed to fetch ticket types.');
                }
            } catch (error) {
                setErrorMessage('Error fetching ticket types.');
                console.error('Error fetching ticket types:', error);
            }
        };        
    
        if (eventId) {
            fetchTicketTypes();
        }
    }, [eventId]);    

    const handleTicketClick = (ticketType) => {
        setSelectedTicketType(ticketType);
        setShowDetails(true);
    };

    const closeDetails = () => {
        setShowDetails(false);
        setSelectedTicketType(null);
    };

    const isPresaleAvailable = (ticketType) => {
        const currentDate = new Date();
        const eventDateObj = new Date(eventDate);
        return ticketType.ticketType.toLowerCase().includes('presale') && currentDate < eventDateObj;
    };

    return (
        <div className="ticket-purchase">
            <h2>{eventName} - {new Date(eventDate).toLocaleDateString()}</h2> {/* Debugging display */}
            {errorMessage ? (
                <p className="error-message">{errorMessage}</p>
            ) : (
            // Inside your map function, make sure to add a unique key for each item.
// Ensure that you're passing a unique identifier like `ticketType.id` or `index` as a key

<div className="ticket-list">
  {ticketTypes.length > 0 ? (
    ticketTypes.map((ticketType, index) => (
      (isPresaleAvailable(ticketType) || !ticketType.ticketType.toLowerCase().includes('presale')) && (
        <div key={ticketType.id || index} className="ticket-bubble" onClick={() => handleTicketClick(ticketType)}>
          <p className="ticket-name">{ticketType.ticketType}</p>
          <p className="ticket-price">${ticketType.price}</p>
        </div>
      )
    ))
  ) : (
    <p>No ticket types available for this event.</p>
  )}
</div>

            )}

            {showDetails && selectedTicketType && (
                <div className={`ticket-details-slide ${showDetails ? 'slide-in' : 'slide-out'}`}>
                    <div className="event-details">
                        <h3>{selectedTicketType.ticketType} - ${selectedTicketType.price}</h3>
                        <p>Available Tickets: {selectedTicketType.availableTickets}</p>
                        <button className="proceed-button" onClick={() => setShowDetails(false)}>Proceed to Buy</button>
                        <button className="close-details" onClick={closeDetails}>Close</button>
                    </div>
                </div>
            )}

            {showDetails && selectedTicketType && (
                <BuyTicket
                    eventId={eventId}
                    eventName={eventName}
                    ticketType={selectedTicketType}
                    selectedQuantity={1}
                    onClose={closeDetails}
                />
            )}
        </div>
    );
};

export default Tickets;
