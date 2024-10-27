import React, { useState, useEffect, useRef } from 'react';
import './NotificationSystem.css';
import { v4 as uuidv4 } from 'uuid';
import { useLocation } from 'react-router-dom';

let addLocalNotification;

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState(() => {
    // Initialize from localStorage if available
    const savedNotifications = localStorage.getItem('notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  });
  const hoverTimeouts = useRef({});
  const countdownIntervals = useRef({});

  const location = useLocation();

  useEffect(() => {
    // Store notifications in local storage whenever they change
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    // Clean up expired notifications
    const currentDateTime = new Date();
    setNotifications((prev) => {
      const validNotifications = prev.filter(notification => {
        return currentDateTime <= new Date(notification.expiresAt);
      });
      localStorage.setItem('notifications', JSON.stringify(validNotifications));
      return validNotifications;
    });
  }, []);

  useEffect(() => {
    // Dismiss all notifications if on an excluded path
    const excludedPaths = ['/buy-ticket', '/register', '/login'];
    if (excludedPaths.includes(location.pathname)) {
      console.log("Dismissing all notifications as path is excluded.");
      setNotifications([]);
      return;
    }

    if (!excludedPaths.includes(location.pathname)) {
      const fetchPersistentNotifications = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/notifications');
      
          if (response.ok && response.headers.get("content-length") !== "0") {
            const data = await response.json();
            if (data.length === 0) {
              console.log("No notifications to display");
            } else {
              const currentDateTime = new Date();
              const validNotifications = data.filter((notification) => {
                const showOn = new Date(notification.show_on);
                const expiresAt = new Date(notification.expires_at);
                return currentDateTime >= showOn && currentDateTime <= expiresAt;
              });
      
              console.log("Valid notifications to display:", validNotifications);
      
              // Add notifications to state without duplicating
              validNotifications.forEach(notification => {
                if (!notifications.some(notif => notif.message === notification.message)) {
                  addNotification(notification.message, notification.type || 'info', notification.priority || 'normal');
                }
              });
            }
          } else {
            console.log("No content in the response body.");
          }
        } catch (error) {
          console.error("Error fetching persistent notifications:", error);
        }
      };      

      fetchPersistentNotifications();
    } else {
      console.log("Persistent notifications are excluded on this path.");
    }
  }, [location.pathname]);

  useEffect(() => {
    // Restart countdowns for notifications on refresh
    notifications.forEach((notification) => {
      startCountdown(notification.id, notification.countdown);
    });
  }, []);

  // Function to add local notifications
  addLocalNotification = (message, type = 'info', priority = 'normal') => {
    const id = uuidv4();
    const countdownTime = priority === 'high' ? 30 : priority === 'low' ? 10 : 15;
    const expiresAt = new Date(Date.now() + countdownTime * 1000);
    setNotifications((prev) => [...prev, { id, message, type, countdown: countdownTime, expiresAt }]);
    startCountdown(id, countdownTime);
  };

  const addNotification = (message, type = 'info', priority = 'normal') => {
    addLocalNotification(message, type, priority); // Treat addNotification as a wrapper for local messages
  };

  const startCountdown = (id, initialTime) => {
    hoverTimeouts.current[id] = setTimeout(() => removeNotification(id), initialTime * 1000); // Remove after the remaining time
    countdownIntervals.current[id] = setInterval(() => {
      setNotifications((prev) =>
        prev.map((notification) => {
          if (notification.id === id) {
            if (notification.countdown > 1) {
              return { ...notification, countdown: notification.countdown - 1 };
            } else {
              clearInterval(countdownIntervals.current[id]);
              removeNotification(id);
              return notification;
            }
          }
          return notification;
        })
      );
    }, 1000);
  };

  const removeNotification = (id) => {
    console.log("Removing notification with ID:", id);
    clearTimeout(hoverTimeouts.current[id]);
    clearInterval(countdownIntervals.current[id]);
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    delete hoverTimeouts.current[id];
    delete countdownIntervals.current[id];
  };

  const handleMouseEnter = (id) => {
    console.log("Mouse entered notification with ID:", id);
    clearTimeout(hoverTimeouts.current[id]); // Prevent auto-dismissal while hovering
    clearInterval(countdownIntervals.current[id]); // Pause countdown
  };

  const handleMouseLeave = (id) => {
    console.log("Mouse left notification with ID:", id);
    startCountdown(id, notifications.find(notification => notification.id === id)?.countdown || 15); // Restart countdown from the current time
  };

  return (
    <div className="notification-container">
      {notifications.map(({ id, message, type, countdown }) => (
        <div 
          key={id} 
          className={`notification notification-${type}`} 
          onMouseEnter={() => handleMouseEnter(id)} 
          onMouseLeave={() => handleMouseLeave(id)}
          onClick={() => removeNotification(id)}
        >
          {message}
          <div className="notification-countdown">{countdown > 0 ? `${countdown}s` : ''}</div>
        </div>
      ))}
    </div>
  );
};

export { addLocalNotification };
export default NotificationSystem;
