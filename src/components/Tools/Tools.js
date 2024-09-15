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
        <h2>Admin Tools</h2>
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
          <button className="view-map-button" onClick={() => setMapOpen(true)}>
            View Vendor Map
          </button>
          <button className="add-survey-button" onClick={() => setIsSurveyOpen(true)}>
            Survey
          </button>
        </div>
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
