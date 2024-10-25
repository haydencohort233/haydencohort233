import './BuyTicket.css';
import Header from '../Header/Header';
import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { addLocalNotification } from '../NotificationSystem/NotificationSystem';

const BuyTicket = () => {
  const card = useRef(null);
  const statusContainer = useRef(null);

  const [errorMessage, setErrorMessage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mailingAddress, setMailingAddress] = useState('');
  const [checkoutOption, setCheckoutOption] = useState('guest');
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const [discountMessage, setDiscountMessage] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false); 
  const [isCardAttached, setIsCardAttached] = useState(false);
  const [discountError, setDiscountError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initializeSquare = async () => {
      if (!window.Square) {
        setErrorMessage('Square Payments SDK is not loaded.');
        return;
      }
      try {
        const appId = 'sandbox-sq0idb-Mp4Ra03tNBo7ebyvz7AKNg';
        const locationId = 'LG0QHF9SCS5QC';
        const payments = window.Square.payments(appId, locationId);
        card.current = await payments.card();
        await card.current.attach('#card-container');
      } catch (error) {
        setErrorMessage('Failed to attach card form. Please try again later.');
      }
    };
    initializeSquare();
    return () => {
      if (card.current) {
        card.current.destroy();
        card.current = null;
      }
    };
  }, []);  

  useEffect(() => {
    const { selectedTickets: ticketsFromState } = location.state || {};
    if (!ticketsFromState || ticketsFromState.length === 0) {
      navigate('/shop');
    } else {
      setSelectedTickets(ticketsFromState);
      const total = ticketsFromState.reduce((sum, event) => {
        return sum + event.eventTickets.reduce((eventSum, ticket) => {
          return eventSum + ticket.quantity * ticket.price;
        }, 0);
      }, 0);
      setTotalAmount(total * 100);
    }
  }, [location, navigate]);

const handleDiscountValidation = async () => {
  if (discountCode) {
    try {
      const response = await fetch('http://localhost:5000/api/discounts/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: discountCode }),
      });

      const responseData = await response.json();
      if (response.ok && responseData.discount) {
        console.log('Discount validated:', responseData.discount);
        const discountPercentage = responseData.discount.discount_percentage;
        setDiscountPercentage(discountPercentage);
        setIsDiscountApplied(true);
        setDiscountMessage(`Discount applied: ${discountPercentage}% off`);

        // Recalculate the total amount after applying the discount
        const discountedTotal = totalAmount * (1 - discountPercentage / 100);
        setTotalAmount(Math.round(discountedTotal));
      } else {
        setDiscountError(responseData.message || 'Failed to validate discount');
      }
    } catch (error) {
      setDiscountError('Error validating discount code');
      console.error('Error:', error);
    }
  } else {
    setDiscountError('Please enter a discount code');
  }
};

const handlePayment = async () => {
  const statusContainer = document.getElementById('payment-status-container');
  setIsProcessingPayment(true);
  try {
    const result = await card.current.tokenize();
    if (result.status === 'OK') {
      const response = await fetch('http://localhost:5000/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nonce: result.token,
          amount: totalAmount,
          firstName,
          lastName,
          email,
          phoneNumber,
          selectedTickets,
          checkoutOption,
          discountCode,
          item_type: 'ticket',
        }),
      });
      const responseData = await response.json();
      if (response.ok && responseData.purchaseComplete) {
        addLocalNotification('Payment successful', 'success');
        navigate('/payment-complete', { state: { purchaseComplete: true } });
      } else {
        statusContainer.innerHTML = `Payment Failed: ${responseData.error}`;
      }
    } else {
      throw new Error(`Tokenization failed with status: ${result.status}`);
    }
  } catch (e) {
    console.error('Payment error:', e);
    statusContainer.innerHTML = "Payment Failed";
  } finally {
    setIsProcessingPayment(false);
  }
};

  return (
    <>
      <Header />
      <div className="buy-ticket-page">
        <h2>Checkout</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {isProcessingPayment && (
          <img src={`${process.env.PUBLIC_URL}/images/icons/loading.gif`} alt="Loading..." className="loading-spinner" />
        )}
        {selectedTickets && selectedTickets.length > 0 ? (
          <div className="selected-tickets-summary">
            {selectedTickets.map((event) => (
              <div key={event.event.id} className="event-summary">
                <h4>{event.event.title}</h4>
                {event.eventTickets.map((ticket, index) => (
                  <div key={index} className="ticket-summary">
                    <p>Ticket Type: {ticket.ticketType || 'N/A'}</p>
                    <p>Price: ${ticket.price} x Quantity: {ticket.quantity}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p>No tickets selected. Returning to shop...</p>
        )}

        <div className="form-group">
          <input
            className='buy-ticket-input'
            type="text" 
            placeholder="First Name" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            required 
          />
          <input
            className='buy-ticket-input'
            type="text" 
            placeholder="Last Name" 
            value={lastName} onChange={(e) => setLastName(e.target.value)} 
            required 
          />
          <input
            className='buy-ticket-input'
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input
            className='buy-ticket-input'
            type="tel" 
            placeholder="Phone Number" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
            required 
          />
          <input
            className='buy-ticket-input'
            type="text" 
            placeholder="Mailing Address" 
            value={mailingAddress} 
            onChange={(e) => setMailingAddress(e.target.value)} 
          />
          <input
            className='buy-ticket-input'
            type="text"
            placeholder="Discount Code"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
          <button
            className='buy-ticket-discount-btn'
            onClick={handleDiscountValidation}>Apply Discount</button>
          {discountMessage && <p>{discountMessage}</p>}
        </div>

        <div className="card-element-container">
          <div id="card-container"></div>
          <div className="total-amount">
            <span className="total-amount-heading">Total: ${(totalAmount / 100).toFixed(2)}</span>
          </div>
        </div>

        <div className="action-buttons">
          <button className="buy-ticket-btn" onClick={handlePayment} disabled={isProcessingPayment}>Complete Purchase</button>
          <button className="cancel-btn" onClick={() => navigate('/shop')}>Cancel</button>
        </div>

        <div ref={statusContainer} id="payment-status-container"></div>
      </div>
    </>
  );
};

export default BuyTicket;
