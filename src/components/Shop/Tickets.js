import React, { useState, useEffect } from 'react';
import BuyTicket from './BuyTicket';  // Import the BuyTicket modal
import './Tickets.css';

const Tickets = ({ eventId, eventName }) => {
    const [availableTickets, setAvailableTickets] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false);  // Modal state

    // Fetch available tickets for the event
    useEffect(() => {
        const fetchAvailableTickets = async () => {
            console.log(`Fetching available tickets for event ID: ${eventId}`);

            try {
                const response = await fetch(`http://localhost:5000/api/tickets/availability?eventId=${eventId}&t=${new Date().getTime()}`);
                console.log('Raw response:', response);  // Log the raw response

                const result = await response.json();
                console.log('Parsed response:', result);  // Log the parsed JSON result

                if (response.ok) {
                    setAvailableTickets(result.availableTickets);
                    console.log(`Available tickets: ${result.availableTickets}`);  // Log the number of available tickets
                } else {
                    setErrorMessage(result.message || 'Failed to fetch ticket availability.');
                    console.log(`Error: ${result.message}`);  // Log the error message
                }
            } catch (error) {
                console.error('Error fetching ticket availability:', error);  // Log any errors
                setErrorMessage('Error fetching ticket availability.');
            }
        };

        fetchAvailableTickets();
    }, [eventId]);

    // Handle opening the BuyTicket modal
    const handleBuyTicketsClick = () => {
        setShowModal(true);
    };

    // Handle closing the modal
    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="ticket-purchase">
            <h2>Buy Tickets</h2>
            {errorMessage ? (
                <p className="error-message">{errorMessage}</p>
            ) : (
                <>
                    <p>{availableTickets} Tickets remaining</p>
                    <button onClick={handleBuyTicketsClick}>Buy Tickets</button>
                </>
            )}
            {showModal && (
                <BuyTicket
                    eventId={eventId}
                    eventName={eventName}  // Pass event name to the modal
                    onClose={closeModal}  // Pass close handler
                />
            )}
        </div>
    );
};

export default Tickets;
