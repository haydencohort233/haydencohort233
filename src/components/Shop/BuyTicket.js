import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './BuyTicket.css';

const BuyTicket = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedTickets, setSelectedTickets] = useState(state.selectedTickets || []);

    const handlePurchase = async () => {
        if (!firstName || !lastName || !email) {
            setErrorMessage('Full name and email are required.');
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setErrorMessage('Card details are required.');
            return;
        }

        try {
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: {
                    name: `${firstName} ${lastName}`,
                    email,
                    phone: phoneNumber || undefined,
                },
            });

            if (error) {
                setErrorMessage(error.message);
                return;
            }

            const ticketOrders = state.selectedTickets.map(({ event, eventTickets }) => {
                return eventTickets.map(ticket => ({
                    eventId: event.id,
                    ticketTypeId: ticket.ticketType.id,
                    quantity: ticket.quantity,
                    ticketType: ticket.ticketType.ticket_type,
                    price: ticket.ticketType.price,
                }));
            }).flat();

            const response = await fetch('http://localhost:5000/api/tickets/buy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    phoneNumber,
                    ticketOrders,
                    paymentMethodId: paymentMethod.id,
                }),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Purchase Successful. Check your email shortly for confirmation.');
                navigate('/');
            } else {
                setErrorMessage(`Purchase failed: ${result.message}`);
            }
        } catch (error) {
            setErrorMessage('Purchase failed. Please try again later.');
        }
    };

    const handleRemoveTicket = (eventId, ticketTypeId) => {
        setSelectedTickets(selectedTickets.filter(ticket => !(ticket.event.id === eventId && ticket.ticketType.id === ticketTypeId)));
    };

    return (
        <div className="buy-ticket-page">
        <h2>Checkout</h2>
        {selectedTickets.map(({ event, eventTickets }) => (
            <div key={event.id}>
                <h3>{event.title}</h3>
                {eventTickets.map(ticket => (
                    <div className="ticket-item" key={ticket.ticketType.id}>
                        <p>{ticket.ticketType.ticket_type}: ${ticket.ticketType.price} x {ticket.quantity}</p>
                        <button
                            className="remove-ticket-btn"
                            onClick={() => handleRemoveTicket(event.id, ticket.ticketType.id)}
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>
        ))}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

            <input 
                type="text" 
                placeholder="First Name" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
            />
            <input 
                type="text" 
                placeholder="Last Name" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
            />
            <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
            />
            <input
                type="tel"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
            />
            
            <div className="card-element-container">
                <CardElement />
            </div>

            <button className="buy-ticket-btn" onClick={handlePurchase}>Complete Purchase</button>
            <button className="close-modal" onClick={() => navigate(-1)}>Cancel</button>
        </div>
    );
};

export default BuyTicket;
