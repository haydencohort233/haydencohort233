import React from 'react';
import Header from '../Header/Header';
import FeaturedVendors from '../FeaturedVendors/FeaturedVendors';
import UpcomingEvents from '../UpcomingEvents/UpcomingEvents';
import FeaturedBlogs from '../FeaturedBlogs/FeaturedBlogs';
import './Home.css';

const Home = () => {
  return (
    <>
      <Header />
      <FeaturedVendors />
      <div className="home">
        <div className="main-content">
          <div className="content-sections">
            <UpcomingEvents />
            <FeaturedBlogs />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
