import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import Tickets from '../Shop/Tickets';
import './Shop.css';

const maxTickets = 4; // Maximum tickets that can be purchased at once

const Shop = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [quantities, setQuantities] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { state } = useLocation();

    useEffect(() => {
        console.log('Received state from ViewEvent:', state);
    
        // If event state is passed, open the Tickets component for that event
        if (state?.eventId) {
            console.log('Opening modal for event:', state.eventName, state.eventId);
            setSelectedEvent({
                id: state.eventId,
                title: state.eventName,
                date: state.eventDate,
                time: state.eventTime || '',
                description: state.eventDescription || '',
                photo_url: state.eventPhoto || '',
                ticketTypes: state.eventTicketTypes || [] // Ensure this line properly sets the ticket types
            });
            setShowModal(true);
        }
    }, [state]);    

    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape' && isFullscreen) {
                setIsFullscreen(false);
            }
        };

        window.addEventListener('keydown', handleEscKey);
        return () => {
            window.removeEventListener('keydown', handleEscKey);
        };
    }, [isFullscreen]);

    // Check if any ticket has been selected
    const isAnyTicketSelected = Object.values(quantities).some(quantity => quantity > 0);

    // Fetch events with available tickets on component mount
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/tickets/events-with-tickets');
                const result = await response.json();

                if (Array.isArray(result)) {
                    setEvents(result);

                    // Initialize quantities for each ticket type starting at 0
                    const initialQuantities = result.reduce((acc, event) => {
                        event.ticketTypes.forEach((ticketType) => {
                            acc[ticketType.id] = 0;
                        });
                        return acc;
                    }, {});
                    setQuantities(initialQuantities);
                } else {
                    console.error('Unexpected API response format:', result);
                    setErrorMessage('Failed to fetch events. Please try again later.');
                }
            } catch (error) {
                console.error('Error fetching events:', error);
                setErrorMessage('Error fetching events. Please try again later.');
            }
        };

        fetchEvents();
    }, []);

    const openEventModal = (event) => {
        setSelectedEvent(event);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedEvent(null);
        setIsFullscreen(false);
    };

    const handlePhotoClick = () => {
        setIsFullscreen(prevState => !prevState);
    };

    const handleImageError = (e) => {
        e.target.src = `${process.env.PUBLIC_URL}/images/placeholders/placeholder.png`;
    };    

    const renderContentWithLineBreaks = (content = '') => {
        if (!content) return null;
        return content.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    const handleQuantityChange = (ticketTypeId, action, availableTickets) => {
        setQuantities((prevQuantities) => {
            const currentQuantity = prevQuantities[ticketTypeId];
            let newQuantity = currentQuantity;

            if (action === 'increment' && currentQuantity < availableTickets && currentQuantity < maxTickets) {
                newQuantity = currentQuantity + 1;
            } else if (action === 'decrement' && currentQuantity > 0) {
                newQuantity = newQuantity - 1;
            }

            return {
                ...prevQuantities,
                [ticketTypeId]: newQuantity,
            };
        });
    };

    // Redirect to BuyTicket page when "Buy Ticket(s)" is clicked
    const handleBuyTicketsClick = () => {
        const selectedTickets = events.reduce((acc, event) => {
            const eventTickets = event.ticketTypes
                .filter(ticketType => quantities[ticketType.id] > 0)
                .map(ticketType => ({
                    ticketType,
                    quantity: quantities[ticketType.id],
                }));
            if (eventTickets.length > 0) {
                acc.push({ event, eventTickets });
            }
            return acc;
        }, []);

        if (selectedTickets.length > 0) {
            navigate('/buy-ticket', {
                state: { selectedTickets },
            });
        }
    };

        // Ensure selectedEvent is not null and has the required properties before rendering
        const renderSelectedEventDetails = () => {
            if (!selectedEvent || !selectedEvent.time) {
                return null; // Return nothing if selectedEvent is null or missing the time property
            }
    
            return (
                <>
                    <h2 className='shop-h2'>{selectedEvent.title}</h2>
                    <p className='shop-event-date'>
                        {new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.time.substring(0, 5)}
                    </p>
                    {/* Add any additional details you need here */}
                </>
            );
        };

    return (
        <>
            <Header />
            <div className="shop-page">
                <h1>Welcome to the Ticket Shop!</h1>
                <p>Select an event to purchase tickets. We have limited seats available!</p>

                {/* Render Tickets Component when selectedEvent is available */}
                {selectedEvent && showModal && (
                    <Tickets
                        eventId={selectedEvent.id}
                        eventName={selectedEvent.title}
                        eventDate={selectedEvent.date}
                    />
                )}

                <div className="shop-page-event-list">
                    {events.length > 0 ? (
                        events.map((event) => {
                            const titlePhoto = event.title_photo
                                ? `http://localhost:5000${event.title_photo}` + (event.title_photo.endsWith('.png') || event.title_photo.endsWith('.jpg') ? '' : '.png')
                                : `${process.env.PUBLIC_URL}/images/placeholders/placeholder.png`;


                            return (
                                <div key={event.id} className="shop-page-event-item" onClick={() => openEventModal(event)}>
                                    <img
                                        src={titlePhoto}
                                        alt={event.title}
                                        onError={handleImageError}
                                        className="shop-page-event-title-photo"
                                    />
                                    <span className="shop-page-event-title">{event.title}</span>
                                    <p className="shop-page-event-date">
                                        {new Date(event.date).toLocaleDateString()} at {event.time.substring(0, 5)}
                                    </p>
                                    <p className="shop-page-event-preview-text">{event.preview_text}</p>
                                </div>
                            );
                        })
                    ) : (
                        <p className="shop-page-no-events-message">No events available at the moment.</p>
                    )}
                </div>

                {/* Event Details Modal */}
                {showModal && selectedEvent && (
                    <div className={`shop-modal-overlay ${isFullscreen ? 'fullscreen-overlay' : ''}`} onClick={closeModal}>
                        {isFullscreen ? (
                            <img
                                src={`http://localhost:5000${selectedEvent.photo_url}`}
                                alt={selectedEvent.title}
                                className="shop-modal-event-photo-fullscreen"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent closing the modal when clicking the fullscreen image
                                    handlePhotoClick(); // Toggle fullscreen mode on click
                                }}
                            />
                        ) : (
                            <div className="shop-modal-content" onClick={(e) => e.stopPropagation()}>
                                <h2 className='shop-h2'>{selectedEvent.title}</h2>
                                <p className='shop-event-date'>
                                    {new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.time.substring(0, 5)}
                                </p>

                                <hr />

                                <div className="shop-modal-event-details">
                                    <div className="shop-modal-photo-container">
                                    <img
                                        src={`http://localhost:5000${selectedEvent.photo_url}`}
                                        alt={selectedEvent.title}
                                        onError={(e) => e.target.src = `${process.env.PUBLIC_URL}/images/placeholders/placeholder.png`}
                                        onClick={handlePhotoClick}
                                        className="shop-modal-event-photo"
                                        style={{ cursor: 'pointer' }}
                                    />
                                        <div className="shop-modal-photo-zoom-text">
                                            <img src={`${process.env.PUBLIC_URL}/images/icons/eye.png`} alt="Zoom" className="shop-modal-eye-icon" />
                                            Click photo to view fullscreen
                                        </div>
                                    </div>

                                    <div className='shop-description'>
                                        {renderContentWithLineBreaks(selectedEvent.description)}
                                    </div>
                                </div>

                                <hr />

                                {selectedEvent.ticketTypes && selectedEvent.ticketTypes.map(ticketType => (
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

                                <div className="shop-modal-buy-ticket-btn-container">
                                    <button
                                        className={`shop-modal-buy-ticket-btn ${!isAnyTicketSelected ? 'disabled' : ''}`}
                                        onClick={handleBuyTicketsClick}
                                        disabled={!isAnyTicketSelected}
                                    >
                                        Buy Ticket(s)
                                    </button>
                                </div>

                                <button className="close-modal-button" onClick={closeModal}>Close</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default Shop;
