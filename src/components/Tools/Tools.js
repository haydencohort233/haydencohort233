import React, { useState, useEffect, useRef } from 'react';
import AddVendor from '../AddVendor/AddVendor';
import VendorMap from '../VendorMap/VendorMap';
import AddEvent from '../AddEvent/AddEvent';
import AddGuest from '../AddGuest/AddGuest';
import Survey from '../Survey/Survey';
import './Tools.css';

const Tools = () => {
  const [isVendorModalOpen, setVendorModalOpen] = useState(false);
  const [isMapOpen, setMapOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);

  const modalRefs = {
    vendor: useRef(null),
    map: useRef(null),
    event: useRef(null),
    guest: useRef(null),
    survey: useRef(null),
  };

  // Close all modals function
  const closeAllModals = () => {
    setVendorModalOpen(false);
    setMapOpen(false);
    setIsAddEventOpen(false);
    setIsAddGuestOpen(false);
    setIsSurveyOpen(false);
  };

  // Handle outside click and ESC key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (isVendorModalOpen && !modalRefs.vendor.current?.contains(event.target)) ||
        (isMapOpen && !modalRefs.map.current?.contains(event.target)) ||
        (isAddEventOpen && !modalRefs.event.current?.contains(event.target)) ||
        (isAddGuestOpen && !modalRefs.guest.current?.contains(event.target)) ||
        (isSurveyOpen && !modalRefs.survey.current?.contains(event.target))
      ) {
        closeAllModals();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeAllModals();
      }
    };

    const handleResize = () => {
      closeAllModals();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [isVendorModalOpen, isMapOpen, isAddEventOpen, isAddGuestOpen, isSurveyOpen]);

  return (
    <div className="tools">
      <div className="admin-tools">
        <h2>Admin Tools</h2>
      </div>
      <div className="tools-buttons">
        <button className="add-vendor-button" onClick={() => setVendorModalOpen(true)}>
          Add Vendor
        </button>
        <button className="view-map-button" onClick={() => setMapOpen(true)}>
          View Vendor Map
        </button>
        <button className="add-event-button" onClick={() => setIsAddEventOpen(true)}>
          Add Event
        </button>
        <button className="add-guest-button" onClick={() => setIsAddGuestOpen(true)}>
          Add Guest
        </button>
        <button className="add-blog-button">Add Blog</button>
        <button className="add-survey-button" onClick={() => setIsSurveyOpen(true)}>
          Survey
        </button>
      </div>

      <AddVendor isOpen={isVendorModalOpen} onClose={() => setVendorModalOpen(false)} ref={modalRefs.vendor} />
      {isMapOpen && <VendorMap onClose={() => setMapOpen(false)} ref={modalRefs.map} />}
      <AddEvent isOpen={isAddEventOpen} onClose={() => setIsAddEventOpen(false)} ref={modalRefs.event} />
      <AddGuest isOpen={isAddGuestOpen} onClose={() => setIsAddGuestOpen(false)} ref={modalRefs.guest} />
      <Survey isOpen={isSurveyOpen} onClose={() => setIsSurveyOpen(false)} ref={modalRefs.survey} />
    </div>
  );
};

export default Tools;
