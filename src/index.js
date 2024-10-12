// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Home from './components/Home/Home';
import Events from './components/Events/Events';
import VendorList from './components/VendorList/VendorList';
import Blog from './components/Blog/Blog';
import AdminPage from './components/AdminPage/AdminPage';
import ScrapedPosts from './components/ScrapedPosts/ScrapedPosts';
import Shop from './components/Shop/Shop';
import BuyTicket from './components/Shop/BuyTicket';
import ViewTickets from './components/ViewTickets/ViewTickets';

// Load Stripe using the publishable key from the environment variable
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'your-fallback-key');

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Router basename="/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/vendors" element={<VendorList />} />
        <Route path="/blogs" element={<Blog />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/scraped-posts" element={<ScrapedPosts />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/view-tickets" element={<ViewTickets />} />
        <Route 
          path="/buy-ticket" 
          element={
            <Elements stripe={stripePromise}>
              <BuyTicket />
            </Elements>
          } 
        />
      </Routes>
    </Router>
  </React.StrictMode>
);
