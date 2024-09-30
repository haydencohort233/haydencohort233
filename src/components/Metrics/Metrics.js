import React, { useEffect, useState } from 'react';
import './Metrics.css';

const Metrics = () => {
  const [metrics, setMetrics] = useState({
    totalPostsScraped: 'Loading...',
    totalVendorsScraped: 'Loading...',
    lastScrapeTime: 'Loading...',
    averagePostsPerVendor: 'Loading...',
    errorsDuringScraping: 'Loading...',
    totalTimeToComplete: 'Loading...',
    numberOfPostsDownloaded: 'Loading...',
    scrapingSuccessRate: 'Loading...',
    vendorWithMaxPosts: { name: 'Loading...', total_posts: 'Loading...' },
    lastScrapingError: 'Loading...'
  });

  // Fetch metrics from the backend
  const fetchMetrics = () => {
    fetch('http://localhost:5000/api/metrics') // Updated endpoint for general metrics
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch metrics');
        }
        return response.json();
      })
      .then((data) => {
        setMetrics({
          totalPostsScraped: data.totalPostsScraped ?? 'Unknown',
          totalVendorsScraped: data.totalVendorsScraped ?? 'Unknown',
          lastScrapeTime: data.lastScrapeTime ? new Date(data.lastScrapeTime).toLocaleString() : 'Unknown',
          averagePostsPerVendor: data.averagePostsPerVendor ?? 'Unknown',
          errorsDuringScraping: data.errorsDuringScraping ?? 'None',
          totalTimeToComplete: data.totalTimeToComplete + ' seconds' ?? 'Unknown',
          numberOfPostsDownloaded: data.numberOfPostsDownloaded ?? 'Unknown',
          scrapingSuccessRate: data.scrapingSuccessRate + '%' ?? 'Unknown',
          vendorWithMaxPosts: data.vendorWithMaxPosts ?? { name: 'Unknown', total_posts: 'Unknown' },
          lastScrapingError: data.lastScrapingError ?? 'None'
        });
      })
      .catch((error) => {
        console.error('Error fetching metrics:', error);
        setMetrics({
          ...metrics,
          errorsDuringScraping: 'Failed to fetch metrics',
        });
      });
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="metrics-container">
      <h2>Scraping Metrics</h2>
      
      <div className="metric-item">
        <span>Last Scrape Date & Time:</span> {metrics.lastScrapeTime}
      </div>
      <div className="metric-item">
        <span>Total Time to Complete Scrape:</span> {metrics.totalTimeToComplete}
      </div>
      <div className="metric-item">
        <span>Number of Posts Downloaded:</span> {metrics.numberOfPostsDownloaded}
      </div>
      
      <h3>Vendor Info</h3>
      <div className="metric-item">
        <span>Total Vendors Scraped:</span> {metrics.totalVendorsScraped}
      </div>
      <div className="metric-item">
        <span>Vendor with Most Posts:</span> {metrics.vendorWithMaxPosts.name} ({metrics.vendorWithMaxPosts.total_posts} posts)
      </div>
      <div className="metric-item">
        <span>Average Posts per Vendor:</span> {metrics.averagePostsPerVendor}
      </div>

      <h3>Other Info</h3>
      <div className="metric-item">
        <span>Errors During Scraping:</span> {metrics.errorsDuringScraping}
      </div>
      <div className="metric-item">
        <span>Scraping Success Rate:</span> {metrics.scrapingSuccessRate}
      </div>
      <div className="metric-item">
        <span>Last Scraping Error:</span> {metrics.lastScrapingError}
      </div>
    </div>
  );
};

export default Metrics;
