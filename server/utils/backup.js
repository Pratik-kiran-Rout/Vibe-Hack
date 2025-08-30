const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const cron = require('node-cron');

const BACKUP_DIR = path.join(__dirname, '../backups');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

const createBackup = async () => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(BACKUP_DIR, `backup-${timestamp}.json`);
    
    // Simple JSON backup (for MongoDB, you'd use mongodump)
    const mongoose = require('mongoose');
    const Blog = require('../models/Blog');
    const User = require('../models/User');
    
    const [blogs, users] = await Promise.all([
      Blog.find({}).lean(),
      User.find({}).select('-password').lean()
    ]);
    
    const backupData = {
      timestamp: new Date(),
      version: '1.0',
      data: {
        blogs,
        users
      }
    };
    
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
    
    console.log(`Backup created: ${backupFile}`);
    
    // Clean old backups (keep last 7 days)
    cleanOldBackups();
    
    return backupFile;
  } catch (error) {
    console.error('Backup failed:', error);
    throw error;
  }
};

const cleanOldBackups = () => {
  try {
    const files = fs.readdirSync(BACKUP_DIR);
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    files.forEach(file => {
      const filePath = path.join(BACKUP_DIR, file);
      const stats = fs.statSync(filePath);
      
      if (stats.mtime.getTime() < sevenDaysAgo) {
        fs.unlinkSync(filePath);
        console.log(`Deleted old backup: ${file}`);
      }
    });
  } catch (error) {
    console.error('Error cleaning old backups:', error);
  }
};

const restoreBackup = async (backupFile) => {
  try {
    const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    
    // This is a simplified restore - in production, you'd want more sophisticated logic
    console.log(`Restoring backup from ${backupData.timestamp}`);
    console.log(`Backup contains ${backupData.data.blogs.length} blogs and ${backupData.data.users.length} users`);
    
    // In a real implementation, you'd restore to database here
    return true;
  } catch (error) {
    console.error('Restore failed:', error);
    throw error;
  }
};

// Schedule daily backups at 2 AM
const scheduleBackups = () => {
  cron.schedule('0 2 * * *', () => {
    console.log('Starting scheduled backup...');
    createBackup();
  });
  
  console.log('Backup scheduler initialized - daily backups at 2 AM');
};

module.exports = {
  createBackup,
  restoreBackup,
  scheduleBackups,
  cleanOldBackups
};