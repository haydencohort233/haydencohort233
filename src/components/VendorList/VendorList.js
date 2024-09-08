import React, { useEffect, useState } from 'react';
import VendorCard from '../VendorCard/VendorCard';
import Header from '../Header/Header';
import './VendorList.css';

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [sortOrder, setSortOrder] = useState('location');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [vendorsPerPage, setVendorsPerPage] = useState(20);

  // Detect viewport size and set vendorsPerPage
  useEffect(() => {
    const handleResize = () => {
      setVendorsPerPage(window.innerWidth <= 768 ? 10 : 20);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial value

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5000/api/vendors?sort=${sortOrder}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch vendor data');
        }
        return response.json();
      })
      .then((data) => {
        setVendors(data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError('Failed to load list of Vendors');
        setIsLoading(false);
        console.error('Error fetching vendor data:', error);
      });
  }, [sortOrder]);

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const parseLocation = (location) => {
    const match = location.match(/(\d+)([A-Z]?)/i);
    return match ? [parseInt(match[1]), match[2] || ''] : [0, ''];
  };

  const sortedVendors = [...vendors].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.name.localeCompare(b.name);
    } else if (sortOrder === 'desc') {
      return b.name.localeCompare(a.name);
    } else if (sortOrder === 'location') {
      const [numA, letterA] = parseLocation(a.location);
      const [numB, letterB] = parseLocation(b.location);
      if (numA === numB) return letterA.localeCompare(letterB);
      return numA - numB;
    } else {
      return 0;
    }
  });

  // Pagination calculations
  const indexOfLastVendor = currentPage * vendorsPerPage;
  const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
  const currentVendors = sortedVendors.slice(indexOfFirstVendor, indexOfLastVendor);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Total number of pages
  const totalPages = Math.ceil(sortedVendors.length / vendorsPerPage);

  // Render pagination buttons
  const renderPaginationButtons = () => {
    return (
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
            disabled={totalPages === 1 || currentPage === i + 1}
          >
            {i + 1}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="vendor-list">
      <Header />
      {renderPaginationButtons()}
      <div className="sort-options">
        <label htmlFor="sort">Sort by:</label>
        <select id="sort" value={sortOrder} onChange={handleSortChange}>
          <option value="asc">Name: Ascending</option>
          <option value="desc">Name: Descending</option>
          <option value="new">New Vendors</option>
          <option value="old">Old Vendors</option>
          <option value="location">Location</option>
        </select>
      </div>
      {isLoading ? (
        <div className="loading-message">Loading vendor data...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="vendor-grid">
            {currentVendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={{
                  name: vendor.name,
                  description: vendor.description,
                  location: vendor.location,
                  category: vendor.category,
                  avatar: vendor.avatar,
                  vendorphoto: vendor.vendorphoto,
                  datecreated: vendor.datecreated,
                }}
              />
            ))}
          </div>
          {renderPaginationButtons()}
        </>
      )}
    </div>
  );
};

export default VendorList;
