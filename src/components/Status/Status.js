// Status.js
import React, { useEffect, useState } from 'react';
import './Status.css';

const Status = () => {
  const [statusData, setStatusData] = useState({
    dbStatus: 'Checking...',
    dbSize: 'Loading...',
    uptime: 'Loading...',
    lastBackup: 'Loading...',
    backupSize: 'Loading...',
    backupStatus: 'Loading...',
    largestTable: 'Loading...',
    mostRecentEntry: 'Loading...',
  });

  // Fetch database and backup status
  const fetchStatus = () => {
    fetch('http://localhost:5000/api/status')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch status');
        }
        return response.json();
      })
      .then((data) => {
        setStatusData({
          dbStatus: data.dbStatus ? 'Online' : 'Offline',
          dbSize: data.dbSize || 'Unknown',
          uptime: `${(data.uptime / 3600).toFixed(2)} hours`, // Convert uptime from seconds to hours
          lastBackup: data.lastBackup || 'Unknown',
          backupSize: data.backupSize || 'Unknown',
          backupStatus: data.backupStatus || 'Unknown',
          largestTable: data.largestTable || 'Unknown',
          mostRecentEntry: data.mostRecentEntry || 'Unknown',
        });
      })
      .catch((error) => {
        console.error('Error fetching status:', error);
        setStatusData({
          ...statusData,
          dbStatus: 'Database Offline',
        });
      });
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="status-container">
      <h2>Database Status</h2>
      <div className="status-item">
        <span>Status:</span> {statusData.dbStatus}
      </div>
      <div className="status-item">
        <span>Database Size:</span> {statusData.dbSize}
      </div>
      <div className="status-item">
        <span>Uptime:</span> {statusData.uptime}
      </div>
      <div className="status-item">
        <span>Largest Table:</span> {statusData.largestTable}
      </div>
      <div className="status-item">
        <span>Most Recent Table Entry:</span> {statusData.mostRecentEntry}
      </div>
      <div className="status-item">
        <span>Last Backup:</span> {statusData.lastBackup}
      </div>
      <div className="status-item">
        <span>Backup Size:</span> {statusData.backupSize}
      </div>
      <div className="status-item">
        <span>Backup Status:</span> {statusData.backupStatus}
      </div>
    </div>
  );
};

export default Status;
