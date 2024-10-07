import React from 'react';
import Header from '../Header/Header';
import FeaturedVendors from '../FeaturedVendors/FeaturedVendors';
import UpcomingEvents from '../UpcomingEvents/UpcomingEvents';
import FeaturedBlogs from '../FeaturedBlogs/FeaturedBlogs';
import EventCalendar from '../EventCalendar/EventCalendar';
import './Home.css';

const Home = () => {
  return (
    <>
      <Header />
      <FeaturedVendors />
      <div className="home">
        <div className="main-content">
          <div className="calendar-section">
            <EventCalendar />
          </div>
          <div className="content-sections">
            <div className="upcoming-events-section">
              <UpcomingEvents />
            </div>
            <div className="featured-blogs-section">
              <FeaturedBlogs />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
