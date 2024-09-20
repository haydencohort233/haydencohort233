import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import Events from './components/Events/Events';
import VendorList from './components/VendorList/VendorList';
import Blog from './components/Blog/Blog';
import AdminPage from './components/AdminPage/AdminPage';
import DisplaySocials from './components/DisplaySocials/DisplaySocials';

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
        <Route path="/socials" element={<DisplaySocials />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
