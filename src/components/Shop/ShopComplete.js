import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import './ShopComplete.css';

const ShopComplete = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const purchaseEmail = location.state?.email || ''; // Get the email passed from the previous state

  useEffect(() => {
    const purchaseInfo = location.state?.purchaseComplete;

    if (!purchaseInfo) {
      // Redirect to home if no purchase information is found
      navigate('/');
    } else {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  const handleReturnToShop = () => {
    navigate('/shop');
  };

  if (loading) {
    return (
      <div className="shop-complete-loading">
        <img src={`${process.env.PUBLIC_URL}/images/icons/loading.gif`} alt="Loading..." />
        <p>Loading, please wait...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="shop-complete-container">
        <h1>Thank you for your purchase!</h1>
        <hr />
        <p className="shop-complete-message">
          Your transaction was successful. A confirmation email has been sent to <strong>{purchaseEmail}</strong>.
        </p>
        <p className="shop-complete-info">
          The email may take 1-5 minutes to arrive. Please check your inbox and spam folder.
        </p>
        <p className="shop-complete-footer">See you soon!</p>
          <button className="return-to-shop-btn" onClick={handleReturnToShop}>
            Return to Shop
          </button>
          <button className="return-home-btn" onClick={() => navigate('/')}>
            Return Home
          </button>
      </div>
    </>
  );
};

export default ShopComplete;
