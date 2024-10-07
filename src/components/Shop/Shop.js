import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';  // Load Stripe
import { Elements } from '@stripe/react-stripe-js';  // Elements provider
import BuyTicket from './BuyTicket';  // Use the BuyTicket modal
import './Shop.css';

const maxTickets = 4;  // Maximum tickets that can be purchased at once

// Load Stripe using the publishable key from the environment variable
const stripePromise = loadStripe(
    process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'your-fallback-key'
  );

const Shop = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [quantities, setQuantities] = useState({});
    const [showModal, setShowModal] = useState(false);

    // Fetch events with available tickets on component mount
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/tickets/events-with-tickets');
                const result = await response.json();
                setEvents(result); // Assuming the API returns a list of events with tickets

                // Initialize quantities for each event
                const initialQuantities = result.reduce((acc, event) => {
                    acc[event.id] = 1;  // Set default quantity to 1 for each event
                    return acc;
                }, {});
                setQuantities(initialQuantities);

            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchEvents();
    }, []);

    // Handle opening the BuyTicket modal
    const handleBuyTicketsClick = (event) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

    // Handle closing the modal
    const closeModal = () => {
        setShowModal(false);
    };

    // Handle quantity change for specific event
    const handleQuantityChange = (eventId, action, availableTickets) => {
        setQuantities((prevQuantities) => {
            const currentQuantity = prevQuantities[eventId];
            let newQuantity = currentQuantity;

            if (action === 'increment' && currentQuantity < availableTickets && currentQuantity < maxTickets) {
                newQuantity = currentQuantity + 1;
            } else if (action === 'decrement' && currentQuantity > 1) {
                newQuantity = currentQuantity - 1;
            }

            return {
                ...prevQuantities,
                [eventId]: newQuantity, // Only update the quantity for the specific event
            };
        });
    };

    const formatEventDate = (dateString, timeString) => {
        const dateTimeString = `${dateString}T${timeString}`;
        const date = new Date(dateTimeString);
    
        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

    return (
        <div className="shop-page">
            <h1>Welcome to the Ticket Shop!</h1>
            <p>Select an event to purchase tickets. We have limited seats available!</p>

            {/* Event listing */}
            <div className="event-list">
                {events.length > 0 ? (
                    events.map((event) => (
                        <div key={event.id} className="event-item">
                            <h3>{event.title}</h3>
                            <p>{formatEventDate(event.date, event.time)}</p>
                            <p>{event.preview_text}</p>
                            <p className="tickets-left">Tickets left: {event.tickets}</p>  {/* Show tickets left */}
                            {event.tickets > 0 ? (
                                <div className="ticket-purchase-controls">
                                    <div className="quantity-controls">
                                        <button
                                            onClick={() => handleQuantityChange(event.id, 'decrement', event.tickets)}
                                            className="quantity-btn"
                                            disabled={quantities[event.id] === 1}
                                        >
                                            -
                                        </button>
                                        <span className="quantity">{quantities[event.id]}</span>
                                        <button
                                            onClick={() => handleQuantityChange(event.id, 'increment', event.tickets)}
                                            className={`quantity-btn ${quantities[event.id] >= event.tickets || quantities[event.id] >= maxTickets ? 'disabled' : ''}`}
                                            disabled={quantities[event.id] >= event.tickets || quantities[event.id] >= maxTickets}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        className="buy-ticket-btn"
                                        onClick={() => handleBuyTicketsClick(event)}
                                    >
                                        Buy Tickets
                                    </button>
                                </div>
                            ) : (
                                <p className="sold-out-label">SOLD OUT!</p>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No events available at the moment.</p>
                )}
            </div>

            {/* Render BuyTicket modal inside Elements provider */}
            {showModal && selectedEvent && (
                <Elements stripe={stripePromise}>
                    <BuyTicket
                        eventId={selectedEvent.id}
                        eventName={selectedEvent.title}
                        selectedQuantity={quantities[selectedEvent.id]}
                        onClose={closeModal}
                    />
                </Elements>
            )}
        </div>
    );
};

export default Shop;
