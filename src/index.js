import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import Events from './components/Events/Events';
import VendorList from './components/VendorList/VendorList';
import Blog from './components/Blog/Blog';
import AdminPage from './components/AdminPage/AdminPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/vendors" element={<VendorList />} />
        <Route path="/blogs" element={<Blog />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
