import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <h1>Chasing Nostalgia</h1>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/blogs">Blogs</a></li>
          <li><a href="/events">Events</a></li>
          <li><a href="/vendors">Vendors</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
