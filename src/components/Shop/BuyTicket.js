import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'; // Import Stripe components
import './BuyTicket.css';

const BuyTicket = ({ eventId, eventName, selectedQuantity, onClose }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');  // Optional phone number
    const [quantity, setQuantity] = useState(selectedQuantity);  // Start with the selected quantity
    const [availableTickets, setAvailableTickets] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const stripe = useStripe();  // Stripe hook
    const elements = useElements();  // Elements hook

    // Fetch the available tickets for the event on modal open
    useEffect(() => {
        const fetchAvailableTickets = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/tickets/availability?eventId=${eventId}`);
                const result = await response.json();

                if (response.ok) {
                    setAvailableTickets(result.availableTickets);
                } else {
                    setErrorMessage(result.message || 'Failed to fetch ticket availability.');
                }
            } catch (error) {
                console.error('Error fetching ticket availability:', error);
                setErrorMessage('Error fetching ticket availability.');
            }
        };

        fetchAvailableTickets();
    }, [eventId]);

    const handlePurchase = async () => {
        // Validate required fields
        if (!firstName || !lastName || !email) {
            alert('Please provide your full name and email to proceed.');
            return;
        }
    
        if (quantity > availableTickets) {
            alert('Not enough tickets available. Please reduce the quantity.');
            return;
        }
    
        // Stripe Payment Handling
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            alert('Card details are required.');
            return;
        }
    
        try {
            // Create a PaymentMethod first before PaymentIntent
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
    
            // Send PaymentMethod to backend to create a PaymentIntent
            const response = await fetch('http://localhost:5000/api/tickets/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    phoneNumber,
                    quantity,
                    eventId,
                    paymentMethodId: paymentMethod.id,  // Send the PaymentMethod ID
                }),
            });            
    
            const responseText = await response.text();
            console.log('Raw response from server:', responseText); // Log raw response
    
            let result;
            try {
                result = JSON.parse(responseText); // Parse JSON if possible
            } catch (parseError) {
                throw new Error(`Failed to parse server response: ${responseText}`);
            }
    
            if (response.ok) {
                alert('Ticket purchase successful! Check your email for confirmation.');
                setAvailableTickets((prevTickets) => prevTickets - quantity);
                onClose();
            } else {
                alert(`Purchase failed: ${result.message}`);
            }
        } catch (error) {
            console.error('Error purchasing tickets:', error);
            alert('Error processing your purchase. Please try again later.');
        }
    };       

    const getTicketColorClass = (availableTickets) => {
        if (availableTickets > 20) {
            return 'tickets-available';  // Green color for plenty of tickets
        } else if (availableTickets > 5) {
            return 'tickets-warning';  // Yellow color for limited tickets
        } else {
            return 'tickets-critical';  // Red color for almost sold out
        }
    };

    return (
        <div className="buy-ticket-modal">
            <div className="buy-ticket-content">
                <h2>Buy Tickets for {eventName}</h2>
                {errorMessage ? (
                    <p className="error-message">{errorMessage}</p>
                ) : (
                    <>
                        <p className={`available-tickets ${getTicketColorClass(availableTickets)}`}>
                            Available Tickets: {availableTickets}
                        </p>
                        
                        {/* First Name */}
                        <input
                            type="text"
                            className="buy-ticket-input first-name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="First Name"
                            required
                        />
                        
                        {/* Last Name */}
                        <input
                            type="text"
                            className="buy-ticket-input last-name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Last Name"
                            required
                        />

                        {/* Email */}
                        <input
                            type="email"
                            className="buy-ticket-input email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                        />

                        {/* Phone Number (Optional) */}
                        <input
                            type="tel"
                            className="buy-ticket-input phone-number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Phone Number (Optional)"
                        />

                        {/* Ticket Quantity */}
                        <input
                            type="number"
                            className="buy-ticket-input ticket-quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            min="1"
                            max={availableTickets}  // Prevent going over available tickets
                        />

                        {/* Stripe Card Element for payment */}
                        <div className="card-element">
                        <CardElement
                            options={{
                                style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#32325d',
                                    '::placeholder': {
                                    color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#fa755a',
                                    iconColor: '#fa755a',
                                },
                                },
                                hidePostalCode: true, // Hides the postal code field
                            }}
                            />
                        </div>

                        <button className="buy-ticket-btn" onClick={handlePurchase}>Complete Purchase</button>
                    </>
                )}
                <button className="close-modal" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default BuyTicket;
