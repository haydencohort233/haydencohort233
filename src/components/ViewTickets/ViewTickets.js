import './ViewTickets.css';
import Header from '../Header/Header';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ViewTickets = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { eventId, eventName, eventDate, eventTime, eventDescription, eventPhoto } = location.state || {};
    const [ticketTypes, setTicketTypes] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [quantities, setQuantities] = useState({});
    const [selectedTicketType, setSelectedTicketType] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const maxTickets = 10;  // Maximum tickets user can select

    useEffect(() => {
        const fetchTicketTypes = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/tickets/events/${eventId}/tickets`);
                const result = await response.json();

                console.log('API response:', result); // Debugging: log the entire API response

                if (response.ok && Array.isArray(result) && result.length > 0) {
                    setTicketTypes(result);  // The result should contain an array of tickets
                    const initialQuantities = result.reduce((acc, ticket) => {
                        acc[ticket.id] = 0; // Initialize each ticket type's quantity to 0
                        return acc;
                    }, {});
                    setQuantities(initialQuantities);
                } else {
                    setErrorMessage(result.message || 'No ticket types available for this event.');
                }
            } catch (error) {
                setErrorMessage('Error fetching ticket types.');
                console.error('Error fetching ticket types:', error); // Log any errors
            }
        };

        if (eventId) {
            fetchTicketTypes();
        }
    }, [eventId]);

    const handleQuantityChange = (ticketId, action, availableTickets) => {
        setQuantities((prevQuantities) => {
            const newQuantity = action === 'increment' 
                ? Math.min(prevQuantities[ticketId] + 1, availableTickets, maxTickets)
                : Math.max(prevQuantities[ticketId] - 1, 0);
            return {
                ...prevQuantities,
                [ticketId]: newQuantity
            };
        });
    };

    const handleBuyTickets = () => {
        const selectedTickets = Object.entries(quantities).filter(([_, quantity]) => quantity > 0);
        if (selectedTickets.length === 0) {
            setErrorMessage('Please select at least one ticket.');
            return;
        }
        setShowDetails(true);
    };

    const proceedToPayment = () => {
        const selectedTickets = Object.entries(quantities)
            .filter(([_, quantity]) => quantity > 0)
            .map(([ticketId, quantity]) => {
                const selectedTicket = ticketTypes.find(ticket => ticket.id === parseInt(ticketId, 10));
                return {
                    ticketType: selectedTicket.ticket_type,
                    quantity: quantity,
                    price: selectedTicket.price,
                    total: selectedTicket.price * quantity
                };
            });

        // Redirect to /buy-ticket and pass the selected ticket data
        navigate('/buy-ticket', {
            state: {
                eventId,
                eventName,
                selectedTickets,
            }
        });
    };

    return (
        <>
        <Header />
        <div className="view-tickets-container">
            <div className="event-header">
                <h2>{eventName}</h2>
                <p>{new Date(eventDate).toLocaleDateString()} at {eventTime}</p>
                
                {/* Event Photo Loading with Fallback */}
                <img
                    src={`http://localhost:5000${eventPhoto}`}
                    alt={eventName}
                    onError={(e) => e.target.src = `${process.env.PUBLIC_URL}/images/placeholders/placeholder.png`}
                    className="event-photo"
                    style={{ cursor: 'pointer' }}
                />
                
                <p>{eventDescription}</p>
            </div>

            {errorMessage && (
                <p className="error-message">{errorMessage}</p>
            )}

            {ticketTypes.length > 0 ? (
                <div className="ticket-list">
                    {ticketTypes.map((ticketType) => (
                        <div key={ticketType.id} className="shop-modal-ticket-type-item">
                            <div className="shop-modal-ticket-type-name">
                                {ticketType.ticket_type}: ${ticketType.price}
                            </div>
                            <div className="shop-modal-tickets-left">
                                Tickets left: {ticketType.available_tickets}
                            </div>
                            <div className="shop-modal-ticket-info">
                                {ticketType.ticket_description || 'No additional information available'}
                            </div>
                            <div className="shop-modal-quantity-controls">
                                <button
                                    onClick={() => handleQuantityChange(ticketType.id, 'decrement', ticketType.available_tickets)}
                                    className="shop-modal-quantity-btn"
                                    disabled={quantities[ticketType.id] === 0}
                                >
                                    -
                                </button>
                                <span className="shop-modal-quantity">{quantities[ticketType.id]}</span>
                                <button
                                    onClick={() => handleQuantityChange(ticketType.id, 'increment', ticketType.available_tickets)}
                                    className={`shop-modal-quantity-btn ${quantities[ticketType.id] >= ticketType.available_tickets || quantities[ticketType.id] >= maxTickets ? 'disabled' : ''}`}
                                    disabled={quantities[ticketType.id] >= ticketType.available_tickets || quantities[ticketType.id] >= maxTickets}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Buy Tickets Button */}
                    <button className="buy-tickets-button" onClick={handleBuyTickets}>
                        Buy Tickets
                    </button>
                </div>
            ) : (
                <p>No ticket types available for this event.</p>
            )}

            {/* Ticket details modal */}
            {showDetails && (
                <div className="ticket-details-slide">
                    {/* Ticket purchase modal or logic can go here */}
                    <div className="ticket-details">
                        <h3>Ticket Purchase</h3>
                        <p>You've selected the following tickets:</p>
                        {Object.entries(quantities).map(([ticketId, quantity]) => {
                            if (quantity > 0) {
                                const selectedTicket = ticketTypes.find(ticket => ticket.id === parseInt(ticketId, 10));
                                return (
                                    <div key={ticketId}>
                                        {selectedTicket.ticket_type} - {quantity} x ${selectedTicket.price} = ${quantity * selectedTicket.price}
                                    </div>
                                );
                            }
                            return null;
                        })}
                        {/* Redirect to /buy-ticket when proceeding */}
                        <button className="proceed-button" onClick={proceedToPayment}>Proceed to Payment</button>
                        <button className="close-details" onClick={() => setShowDetails(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

export default ViewTickets;
