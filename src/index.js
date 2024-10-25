import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import NotificationSystem from './components/NotificationSystem/NotificationSystem';
import Home from './components/Home/Home';
import Events from './components/Events/Events';
import VendorList from './components/VendorList/VendorList';
import Blog from './components/Blog/Blog';
import AdminPage from './components/AdminPage/AdminPage';
import ScrapedPosts from './components/ScrapedPosts/ScrapedPosts';
import Shop from './components/Shop/Shop';
import BuyTicket from './components/Shop/BuyTicket';
import ViewTickets from './components/ViewTickets/ViewTickets';
import ShopComplete from './components/Shop/ShopComplete';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router basename="/">
    <>
      <NotificationSystem />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/vendors" element={<VendorList />} />
        <Route path="/blogs" element={<Blog />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/scraped-posts" element={<ScrapedPosts />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/view-tickets" element={<ViewTickets />} />
        <Route path="/buy-ticket" element={<BuyTicket />} />
        <Route path="/payment-complete" element={<ShopComplete />} />
      </Routes>
    </>
  </Router>
);
