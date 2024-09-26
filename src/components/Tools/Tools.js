// Tools.js
import React, { useState, useEffect } from 'react';
import VendorMap from '../VendorMap/VendorMap';
import Survey from '../Survey/Survey';
import AddVendor from '../Add/AddVendor/AddVendor';
import AddEvent from '../Add/AddEvent/AddEvent';
import AddGuest from '../Add/AddGuest/AddGuest';
import AddBlog from '../Add/AddBlog/AddBlog';
import EditVendor from '../Edit/EditVendor/EditVendor';
import EditGuestVendor from '../Edit/EditGuestVendor/EditGuestVendor';
import EditEvents from '../Edit/EditEvents/EditEvents';
import EditBlog from '../Edit/EditBlogs/EditBlogs';
import axios from 'axios'; // Import axios for API requests
import './Tools.css';

const Tools = () => {
  const [isVendorModalOpen, setVendorModalOpen] = useState(false);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isMapOpen, setMapOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [isAddBlogModalOpen, setIsAddBlogModalOpen] = useState(false);
  const [isEditVendorOpen, setEditVendorOpen] = useState(false);
  const [isEditGuestOpen, setEditGuestOpen] = useState(false);
  const [isEditEventOpen, setEditEventOpen] = useState(false);
  const [isEditBlogModalOpen, setIsEditBlogModalOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [selectedGuestId, setSelectedGuestId] = useState(null);
  const [scrapeStatus, setScrapeStatus] = useState(''); // State for scraping status
  const [backupStatus, setBackupStatus] = useState(''); // State for backup status

  // Function to handle scraping
  const handleScrape = () => {
    setScrapeStatus('Scraping in progress...');

    axios.get('http://localhost:5000/api/scrape') // This endpoint should trigger the Python script
      .then(response => {
        setScrapeStatus('Scraping completed successfully!');
      })
      .catch(error => {
        console.error('Error during scraping:', error);
        setScrapeStatus('Error occurred during scraping. Please try again.');
      });
  };

  // Function to perform a manual backup
  const performBackup = () => {
    setBackupStatus('Backup in progress...');
    axios.get('http://localhost:5000/api/backup') // This endpoint should trigger the backup
      .then(response => {
        setBackupStatus('Backup completed successfully!');
      })
      .catch(error => {
        console.error('Error during backup:', error);
        setBackupStatus('Error occurred during backup. Please try again.');
      });
  };

  const handleAddBlog = () => {
    setIsAddBlogModalOpen(true);
  };

  const handleEditBlog = () => {
    setIsEditBlogModalOpen(true);
  };

  const closeAddBlogModal = () => {
    setIsAddBlogModalOpen(false);
  };

  const closeEditBlogModal = () => {
    setIsEditBlogModalOpen(false);
  };

  const closeAllModals = () => {
    setVendorModalOpen(false);
    setMapOpen(false);
    setIsAddEventOpen(false);
    setIsAddGuestOpen(false);
    setIsSurveyOpen(false);
    setEditVendorOpen(false);
    setEditGuestOpen(false);
    setEditEventOpen(false);
    setIsAddBlogModalOpen(false);
    setIsEditBlogModalOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeAllModals();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="tools">
      <div className="admin-tools">
        <div className="tools-buttons">
          <button className="add-vendor-button" onClick={() => setVendorModalOpen(true)}>
            Add Vendor
          </button>
          <button className="edit-vendor-button" onClick={() => setEditVendorOpen(true)}>
            Edit Vendor
          </button>
          <button className="add-guest-button" onClick={() => setIsAddGuestOpen(true)}>
            Add Guest
          </button>
          <button className="edit-guest-button" onClick={() => setEditGuestOpen(true)}>
            Edit Guests
          </button>
          <button className="add-event-button" onClick={() => setIsAddEventOpen(true)}>
            Add Event
          </button>
          <button className="edit-event-button" onClick={() => setEditEventOpen(true)}>
            Edit Events
          </button>
          <button className="add-blog-button" onClick={handleAddBlog}>
            Add Blog
          </button>
          <button className="edit-blogs-button" onClick={handleEditBlog}>
            Edit Blogs
          </button>
          
          {/* Divider */}
          <div className="tools-divider" />

          {/* Bottom Section - Tools */}
          <button className="view-map-button" onClick={() => setMapOpen(true)}>
            View Vendor Map
          </button>
          <button className="add-survey-button" onClick={() => setIsSurveyOpen(true)}>
            Survey
          </button>
          <button className="scrape-button" onClick={handleScrape}>
            Scrape Latest Posts
          </button>
          <button className="perform-backup-button" onClick={performBackup}>
            Perform Backup
          </button>
        </div>
        {scrapeStatus && <p className="scrape-status">{scrapeStatus}</p>} {/* Display Scraping Status */}
        {backupStatus && <p className="backup-status">{backupStatus}</p>} {/* Display Backup Status */}
      </div>

      <AddVendor isOpen={isVendorModalOpen} onClose={() => setVendorModalOpen(false)} />
      {isMapOpen && <VendorMap onClose={() => setMapOpen(false)} />}
      <AddEvent isOpen={isAddEventOpen} onClose={() => setIsAddEventOpen(false)} />
      <AddGuest isOpen={isAddGuestOpen} onClose={() => setIsAddGuestOpen(false)} />
      <Survey isOpen={isSurveyOpen} onClose={() => setIsSurveyOpen(false)} />

      <EditVendor
        isOpen={isEditVendorOpen}
        onClose={() => setEditVendorOpen(false)}
        vendorId={selectedVendorId}
      />

      <EditGuestVendor
        isOpen={isEditGuestOpen}
        onClose={() => setEditGuestOpen(false)}
        guestId={selectedGuestId}
      />

      <EditEvents isOpen={isEditEventOpen} onClose={() => setEditEventOpen(false)} />

      <AddBlog isOpen={isAddBlogModalOpen} onClose={closeAddBlogModal} />

      <EditBlog isOpen={isEditBlogModalOpen} onClose={closeEditBlogModal} />
    </div>
  );
};

export default Tools;
