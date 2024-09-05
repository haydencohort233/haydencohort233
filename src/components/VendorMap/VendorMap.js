import React, { useEffect, useRef } from 'react';
import './VendorMap.css';

const VendorMap = ({ location, onClose }) => {
  const mapRef = useRef(null);

  // Mapping locations to specific coordinates
  const locationCoordinates = {
    // Main Building
    "FRONT": { top: '520px', left: '240px', name: 'Chasing Nostalgia'},
    "1A": { top: '15px', left: '20px', name: 'Fleaboard Skateshop' },
    "2A": { top: '75px', left: '20px', name: 'Cherry on Top'  },
    "3A": { top: '135px', left: '20px', name: 'Devilish Clothing'  },
    "4A": { top: '195px', left: '20px', name: 'Ambition Thrift'  },
    "5A": { top: '255px', left: '20px', name: 'Buck Lucky'  },
    "6A": { top: '312px', left: '20px', name: 'GAMERB0YZ'  },
    "7A": { top: '135px', left: '300px', name: 'Supersaiyanfinds'  },
    "8A": { top: '195px', left: '300px', name: 'The Lemonheads'  },
    "9A": { top: '255px', left: '300px', name: 'Gemzies Treasures'  },
    "10A": { top: '320px', left: '300px', name: 'Love Morgue'  },
    "11A": { top: '380px', left: '300px', name: 'Retro_Nani209'  },

    // Side Building
  };

  useEffect(() => {
    const highlightLocation = () => {
      if (!mapRef.current) return;

      // Find the square based on the current location prop
      const selectedSquare = mapRef.current.querySelector(
        `.vendor-location[data-location="${location}"]`
      );

      if (selectedSquare) {
        selectedSquare.classList.add('flashing');
      }

      // Clean up the flashing effect when the component unmounts
      return () => {
        if (selectedSquare) {
          selectedSquare.classList.remove('flashing');
        }
      };
    };

    highlightLocation();
  }, [location]);

  return (
    <div className="vendor-map-modal">
      <div className="vendor-map-overlay" onClick={onClose} />
      <div className="vendor-map-content" ref={mapRef}>
        <button className="close-map-button" onClick={onClose}>
          X
        </button>
        <img
          src="/images/vendor-layout.png"
          alt="Vendor Layout Map"
          className="vendor-map-image"
        />
        {/* Dynamically add squares based on the location mapping */}
        {Object.entries(locationCoordinates).map(([loc, coords]) => (
          <div
            key={loc}
            className="vendor-location"
            data-location={loc}
            style={{ top: coords.top, left: coords.left }}
            title={coords.name} // Adding a title for hover effect
          >
            {/* Display vendor name above the square */}
            <div className="vendor-name">{coords.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default VendorMap;
