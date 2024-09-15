const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const backupDatabase = () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(__dirname, 'backups', `backup-${timestamp}.sql`);

  const mysqldumpCommand = `mysqldump --host=${process.env.DB_HOST} --user=${process.env.DB_USER} --password=${process.env.DB_PASS} ${process.env.DB_NAME} > ${backupFile}`;

  exec(mysqldumpCommand, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error creating backup: ${err.message}`);
      return;
    }

    console.log(`Backup saved to ${backupFile}`);
  });
};

// Ensure backup directory exists
const backupDir = path.join(__dirname, 'backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// Run the backup function
backupDatabase();
