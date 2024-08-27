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
      <div className="home">
        <div className="main-content">
          <h1>Welcome to Our Thrift Store</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis malesuada suscipit.</p>
          <div className="content-sections">
            <UpcomingEvents />
            <FeaturedVendors />
          </div>
          <FeaturedBlogs />
        </div>
      </div>
    </>
  );
};

export default Home;
