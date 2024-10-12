import './Tools.css';
import axios from 'axios';
import Survey from '../Survey/Survey';
import AddBlog from '../Add/AddBlog/AddBlog';
import VendorMap from '../VendorMap/VendorMap';
import AddEvent from '../Add/AddEvent/AddEvent';
import AddGuest from '../Add/AddGuest/AddGuest';
import ViewVendor from '../ViewVendor/ViewVendor';
import AddTicket from '../Add/AddTicket/AddTicket';
import React, { useState, useEffect } from 'react';
import AddVendor from '../Add/AddVendor/AddVendor';
import EditBlog from '../Edit/EditBlogs/EditBlogs';
import EditTickets from '../Edit/EditTickets/EditTickets';
import EditVendor from '../Edit/EditVendor/EditVendor';
import EditEvents from '../Edit/EditEvents/EditEvents';
import AddDiscount from '../Add/AddDiscount/AddDiscount';
import EditDiscount from '../Edit/EditDiscount/EditDiscount';
import EditGuestVendor from '../Edit/EditGuestVendor/EditGuestVendor';

const Tools = () => {
  const [isMapOpen, setMapOpen] = useState(false);
  const [scrapeStatus, setScrapeStatus] = useState('');
  const [backupStatus, setBackupStatus] = useState('');
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [isAddTicketOpen, setIsAddTicketOpen] = useState(false);
  const [isAddDiscountOpen, setIsAddDiscountOpen] = useState(false);
  const [isEditGuestOpen, setEditGuestOpen] = useState(false);
  const [isEditEventOpen, setEditEventOpen] = useState(false);
  const [isEditTicketsOpen, setIsEditTicketsOpen] = useState(false);
  const [isEditDiscountOpen, setIsEditDiscountOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedGuestId, setSelectedGuestId] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [activeDiscounts, setActiveDiscounts] = useState([]);
  const [isViewVendorOpen, setViewVendorOpen] = useState(false);
  const [isEditVendorOpen, setEditVendorOpen] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [isVendorModalOpen, setVendorModalOpen] = useState(false);
  const [isAddBlogModalOpen, setIsAddBlogModalOpen] = useState(false);
  const [isEditBlogModalOpen, setIsEditBlogModalOpen] = useState(false);

  useEffect(() => {
    fetchActiveDiscounts(); // Fetch active discounts when the component mounts
  }, []);

  const fetchActiveDiscounts = () => {
    axios.get('http://localhost:5000/api/discounts/active')
      .then(response => {
        setActiveDiscounts(response.data); // Store the active discounts
      })
      .catch(error => {
        console.error('Error fetching active discounts:', error);
      });
  };

  const handleScrape = () => {
    setScrapeStatus('Scraping in progress...');
    axios.get('http://localhost:5000/api/scrape')
      .then(() => {
        setScrapeStatus('Scraping completed successfully!');
      })
      .catch(error => {
        console.error('Error during scraping:', error);
        setScrapeStatus('Error occurred during scraping. Please try again.');
      });
  };

  const performBackup = () => {
    setBackupStatus('Backup in progress...');
    axios.get('http://localhost:5000/api/backup')
      .then(() => {
        setBackupStatus('Backup completed successfully!');
      })
      .catch(error => {
        console.error('Error during backup:', error);
        setBackupStatus('Error occurred during backup. Please try again.');
      });
  };

  const handleVendorButtonClick = (action) => {
    switch (action) {
      case 'add':
        setVendorModalOpen(true);
        break;
      case 'edit':
        setEditVendorOpen(true);
        break;
      default:
        console.warn('Unknown action:', action);
    }
  };

  const handleEditDiscountClick = (discount) => {
    setSelectedDiscount(discount);
    setIsEditDiscountOpen(true);
  };

  const handleBackToDiscountList = () => {
    setIsEditDiscountOpen(false);
    setSelectedDiscount(null);
    fetchActiveDiscounts();
  };

  const handleCloseEditDiscount = () => {
    setIsEditDiscountOpen(false);
    setSelectedDiscount(null);
  };

  const handleCloseMap = () => {
    setMapOpen(false);
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
    setIsAddTicketOpen(false);
    setIsEditTicketsOpen(false);
    setIsAddDiscountOpen(false);
    setIsEditDiscountOpen(false);
    setViewVendorOpen(false);
    setSelectedDiscount(null);
  };

  const handleVendorClick = (vendorId) => {
    setSelectedVendorId(vendorId);
    setMapOpen(false);
    setViewVendorOpen(true);
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
        <div className="vendor-button-container">
          VENDORS:
          <button className="vendor-add-button" onClick={() => handleVendorButtonClick('add')}>
            Add
            <img src={`${process.env.PUBLIC_URL}/images/icons/add.png`} alt="Add Vendor" className="icon" />
          </button>
          <button className="vendor-edit-button" onClick={() => handleVendorButtonClick('edit')}>
            Edit
            <img src={`${process.env.PUBLIC_URL}/images/icons/edit.png`} alt="Edit Vendor" className="icon" />
          </button>
        </div>

        <div className="guest-button-container">
          GUESTS:
          <button className="guest-add-button" onClick={() => setIsAddGuestOpen(true)}>
            Add
            <img src={`${process.env.PUBLIC_URL}/images/icons/add.png`} alt="Add Guest" className="icon" />
          </button>
          <button className="guest-edit-button" onClick={() => setEditGuestOpen(true)}>
            Edit
            <img src={`${process.env.PUBLIC_URL}/images/icons/edit.png`} alt="Edit Guest" className="icon" />
          </button>
        </div>

        <div className="event-button-container">
          EVENTS:
          <button className="event-add-button" onClick={() => setIsAddEventOpen(true)}>
            Add
            <img src={`${process.env.PUBLIC_URL}/images/icons/add.png`} alt="Add Event" className="icon" />
          </button>
          <button className="event-edit-button" onClick={() => setEditEventOpen(true)}>
            Edit
            <img src={`${process.env.PUBLIC_URL}/images/icons/edit.png`} alt="Edit Event" className="icon" />
          </button>
        </div>

        <div className="blog-button-container">
          BLOGS:
          <button className="blog-add-button" onClick={() => setIsAddBlogModalOpen(true)}>
            Add
            <img src={`${process.env.PUBLIC_URL}/images/icons/add.png`} alt="Add Blog" className="icon" />
          </button>
          <button className="blog-edit-button" onClick={() => setIsEditBlogModalOpen(true)}>
            Edit
            <img src={`${process.env.PUBLIC_URL}/images/icons/edit.png`} alt="Edit Blog" className="icon" />
          </button>
        </div>

        <div className="ticket-button-container">
          TICKETS:
          <button className="ticket-add-button" onClick={() => setIsAddTicketOpen(true)}>
            Add
            <img src={`${process.env.PUBLIC_URL}/images/icons/add.png`} alt="Add Ticket" className="icon" />
          </button>
          <button className="ticket-edit-button" onClick={() => setIsEditTicketsOpen(true)}>
            Edit
            <img src={`${process.env.PUBLIC_URL}/images/icons/edit.png`} alt="Edit Ticket" className="icon" />
          </button>
        </div>

        <div className="discount-button-container">
          DISCOUNTS:
          <button className="discount-add-button" onClick={() => setIsAddDiscountOpen(true)}>
            Add
            <img src={`${process.env.PUBLIC_URL}/images/icons/add.png`} alt="Add Discount" className="icon" />
          </button>
          <button className="discount-edit-button" onClick={() => setIsEditDiscountOpen(true)}>
            Edit
            <img src={`${process.env.PUBLIC_URL}/images/icons/edit.png`} alt="Edit Discount" className="icon" />
          </button>
        </div>
      </div>
        <hr className='tools-divider' />
          {/* Utility Buttons Section */}
          <div className="utility-button-container">
            <button className="view-map-button" onClick={() => setMapOpen(true)}>View Vendor Map</button>
            <button className="add-survey-button" onClick={() => setIsSurveyOpen(true)}>Survey</button>
            <button className="scrape-button" onClick={handleScrape}>Scrape Latest Posts</button>
            <button className="perform-backup-button" onClick={performBackup}>Perform Backup</button>
          </div>

        {scrapeStatus && <p className="scrape-status">{scrapeStatus}</p>}
        {backupStatus && <p className="backup-status">{backupStatus}</p>}
      </div>

      {/* Vendor Map Modal */}
      {isMapOpen && (
        <VendorMap 
          onClose={handleCloseMap} 
          onVendorClick={(vendorId) => {
            setSelectedVendorId(vendorId);
            setMapOpen(false);
            setViewVendorOpen(true);
          }}
        />
      )}

      {/* Modals for Add, Edit, and View Vendor */}
      <AddVendor isOpen={isVendorModalOpen} onClose={() => setVendorModalOpen(false)} />
      <EditVendor isOpen={isEditVendorOpen} onClose={() => setEditVendorOpen(false)} vendorId={selectedVendorId} />
      {selectedVendorId && (
        <ViewVendor vendorId={selectedVendorId} onClose={() => setSelectedVendorId(null)} />
      )}

      {/* Add & Edit Components */}
      <AddTicket isOpen={isAddTicketOpen} onClose={() => setIsAddTicketOpen(false)} />
      <EditTickets isOpen={isEditTicketsOpen} onClose={() => setIsEditTicketsOpen(false)} ticket={selectedTicket} />
      <AddDiscount isOpen={isAddDiscountOpen} onClose={() => setIsAddDiscountOpen(false)} />
      <EditDiscount 
        isOpen={isEditDiscountOpen} 
        onClose={handleCloseEditDiscount} 
        discount={selectedDiscount} 
        onBackToDiscountList={handleBackToDiscountList} 
      />

      <AddEvent isOpen={isAddEventOpen} onClose={() => setIsAddEventOpen(false)} />
      <AddGuest isOpen={isAddGuestOpen} onClose={() => setIsAddGuestOpen(false)} />
      <Survey isOpen={isSurveyOpen} onClose={() => setIsSurveyOpen(false)} />
      <AddBlog isOpen={isAddBlogModalOpen} onClose={closeAddBlogModal} />
      <EditBlog isOpen={isEditBlogModalOpen} onClose={closeEditBlogModal} />
      <EditGuestVendor isOpen={isEditGuestOpen} onClose={() => setEditGuestOpen(false)} guestId={selectedGuestId} />
      <EditEvents isOpen={isEditEventOpen} onClose={() => setEditEventOpen(false)} />

      {isViewVendorOpen && (
        <ViewVendor vendorId={selectedVendorId} onClose={() => setViewVendorOpen(false)} />
      )}
    </div>
  );
};

export default Tools;
