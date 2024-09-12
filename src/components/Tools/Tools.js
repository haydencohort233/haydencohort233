import React, { useState, useEffect, useRef } from 'react';
import AddVendor from '../Add/AddVendor/AddVendor';
import VendorMap from '../VendorMap/VendorMap';
import AddEvent from '../Add/AddEvent/AddEvent';
import AddGuest from '../Add/AddGuest/AddGuest';
import Survey from '../Survey/Survey';
import EditVendor from '../Edit/EditVendor/EditVendor';
import EditGuestVendor from '../Edit/EditGuestVendor/EditGuestVendor';
import EditEvents from '../Edit/EditEvents/EditEvents';
import AddBlog from '../Add/AddBlog/AddBlog'; // Add the correct AddBlog import
import './Tools.css';

const Tools = () => {
  const [isVendorModalOpen, setVendorModalOpen] = useState(false);
  const [isMapOpen, setMapOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [isEditVendorOpen, setEditVendorOpen] = useState(false);
  const [isEditGuestOpen, setEditGuestOpen] = useState(false);
  const [isEditEventOpen, setEditEventOpen] = useState(false);
  const [isAddBlogModalOpen, setIsAddBlogModalOpen] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [selectedGuestId, setSelectedGuestId] = useState(null);

  const modalRefs = {
    vendor: useRef(null),
    map: useRef(null),
    event: useRef(null),
    guest: useRef(null),
    survey: useRef(null),
    editVendor: useRef(null),
    editGuest: useRef(null),
    editEvent: useRef(null),
    addBlog: useRef(null), // Add Blog ref
  };

  // Function to handle "Add Blog" button click
  const handleAddBlog = () => {
    setIsAddBlogModalOpen(true);
  };

  // Function to close the "Add Blog" modal
  const closeAddBlogModal = () => {
    setIsAddBlogModalOpen(false);
  };

  // Close all modals function
  const closeAllModals = () => {
    setVendorModalOpen(false);
    setMapOpen(false);
    setIsAddEventOpen(false);
    setIsAddGuestOpen(false);
    setIsSurveyOpen(false);
    setEditVendorOpen(false);
    setEditGuestOpen(false);
    setEditEventOpen(false);
    setIsAddBlogModalOpen(false); // Close blog modal
  };

  // Handle outside click and ESC key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (isVendorModalOpen && modalRefs.vendor.current && !modalRefs.vendor.current.contains(event.target)) ||
        (isMapOpen && modalRefs.map.current && !modalRefs.map.current.contains(event.target)) ||
        (isAddEventOpen && modalRefs.event.current && !modalRefs.event.current.contains(event.target)) ||
        (isAddGuestOpen && modalRefs.guest.current && !modalRefs.guest.current.contains(event.target)) ||
        (isSurveyOpen && modalRefs.survey.current && !modalRefs.survey.current.contains(event.target)) ||
        (isEditVendorOpen && modalRefs.editVendor.current && !modalRefs.editVendor.current.contains(event.target)) ||
        (isEditGuestOpen && modalRefs.editGuest.current && !modalRefs.editGuest.current.contains(event.target)) ||
        (isEditEventOpen && modalRefs.editEvent.current && !modalRefs.editEvent.current.contains(event.target)) ||
        (isAddBlogModalOpen && modalRefs.addBlog.current && !modalRefs.addBlog.current.contains(event.target)) // Add this for AddBlog
      ) {
        closeAllModals();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [
    isVendorModalOpen,
    isMapOpen,
    isAddEventOpen,
    isAddGuestOpen,
    isSurveyOpen,
    isEditVendorOpen,
    isEditGuestOpen,
    isEditEventOpen,
    isAddBlogModalOpen, // Add this for AddBlog
  ]);

  return (
    <div className="tools">
      <div className="admin-tools">
        <h2>Admin Tools</h2>
      </div>
      <div className="tools-buttons">
        <button className="add-vendor-button" onClick={() => setVendorModalOpen(true)}>
          Add Vendor
        </button>
        <button className="edit-vendor-button" onClick={() => setEditVendorOpen(true)}> {/* Example vendor ID */}
          Edit Vendor
        </button>
        <button className="add-guest-button" onClick={() => setIsAddGuestOpen(true)}>
          Add Guest
        </button>
        <button className="edit-guest-button" onClick={() => setEditGuestOpen(true)}> {/* Example guest ID */}
          Edit Guests
        </button>
        <button className="view-map-button" onClick={() => setMapOpen(true)}>
          View Vendor Map
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
        <button className="add-survey-button" onClick={() => setIsSurveyOpen(true)}>
          Survey
        </button>
      </div>

      {/* Modals */}
      <AddVendor isOpen={isVendorModalOpen} onClose={() => setVendorModalOpen(false)} ref={modalRefs.vendor} />
      {isMapOpen && <VendorMap onClose={() => setMapOpen(false)} ref={modalRefs.map} />}
      <AddEvent isOpen={isAddEventOpen} onClose={() => setIsAddEventOpen(false)} ref={modalRefs.event} />
      <AddGuest isOpen={isAddGuestOpen} onClose={() => setIsAddGuestOpen(false)} ref={modalRefs.guest} />
      <Survey isOpen={isSurveyOpen} onClose={() => setIsSurveyOpen(false)} ref={modalRefs.survey} />

      {/* Edit Vendor modal */}
      <EditVendor
        isOpen={isEditVendorOpen}
        onClose={() => setEditVendorOpen(false)}
        vendorId={selectedVendorId}
        ref={modalRefs.editVendor}
      />

      {/* Edit Guest modal */}
      <EditGuestVendor
        isOpen={isEditGuestOpen}
        onClose={() => setEditGuestOpen(false)}
        guestId={selectedGuestId}
        ref={modalRefs.editGuest}
      />

      {/* Edit Events modal */}
      <EditEvents
        isOpen={isEditEventOpen} // Use EditEvents here
        onClose={() => setEditEventOpen(false)}
        ref={modalRefs.editEvent}
      />

      {/* Add Blog modal */}
      <AddBlog isOpen={isAddBlogModalOpen} onClose={closeAddBlogModal} ref={modalRefs.addBlog} />
    </div>
  );
};

export default Tools;
