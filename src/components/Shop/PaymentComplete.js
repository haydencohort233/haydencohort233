import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './PaymentComplete.css';

const PaymentComplete = () => {
    const [status, setStatus] = useState('loading');
    const location = useLocation();

    useEffect(() => {
        // Extract payment status from the URL params if available
        const query = new URLSearchParams(location.search);
        const paymentStatus = query.get('payment_intent_status');

        if (paymentStatus === 'succeeded') {
            setStatus('success');
        } else {
            setStatus('failure');
        }
    }, [location]);

    return (
        <div className="payment-complete">
            {status === 'loading' && <p>Loading payment status...</p>}
            {status === 'success' && (
                <div className="payment-success">
                    <h2>Payment Successful!</h2>
                    <p>Thank you for your purchase. Enjoy the event!</p>
                </div>
            )}
            {status === 'failure' && (
                <div className="payment-failure">
                    <h2>Payment Failed</h2>
                    <p>Unfortunately, we couldn't process your payment. Please try again or contact support.</p>
                </div>
            )}
        </div>
    );
};

export default PaymentComplete;
