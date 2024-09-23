import React, { useState } from 'react';
import axios from 'axios';
import './Scrape.css'; // Import the Scrape.css file for styling

const Scrape = () => {
  const [status, setStatus] = useState(''); // State to store the status of the scraping process

  // Function to initiate the scraping
  const handleScrape = () => {
    setStatus('Scraping in progress...');

    // Send a request to the backend to initiate the scraping
    axios.get('http://localhost:5000/api/scrape') // This endpoint should trigger the Python script
      .then(response => {
        // Assuming the backend returns a success message
        setStatus('Scraping completed successfully!');
      })
      .catch(error => {
        // Handle errors
        console.error('Error during scraping:', error);
        setStatus('Error occurred during scraping. Please try again.');
      });
  };

  return (
    <div className="scrape-container">
      <h1>Admin Tools - Scrape Latest Posts</h1>
      <p>Click the button below to scrape the latest three posts from all vendors.</p>
      <button className="scrape-button" onClick={handleScrape}>
        Scrape Latest Posts
      </button>
      {status && <p className="scrape-status">{status}</p>}
    </div>
  );
};

export default Scrape;
