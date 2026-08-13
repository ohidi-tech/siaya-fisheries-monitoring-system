# ODK/KoboToolbox Integration Setup Guide

## Overview

The Fisheries Monitoring System integrates with ODK/KoboToolbox to automatically collect and sync data from field enumerators into the dashboard.

### Data Flow Architecture
```
📱 Enumerators (Field Level)
       ↓
🔗 ODK/KoboToolbox (Data Collection)
       ↓
💾 MongoDB Database (Data Storage)
       ↓
📊 Dashboard (Analytics & Reports)
```

## Prerequisites

1. **ODK/KoboToolbox Account**
   - Create a free account at https://kc.kobotoolbox.org
   - Create forms for data collection (BMU monitoring, inspections, cooperatives)

2. **MongoDB Installation**
   - Local: Download from https://www.mongodb.com/try/download/community
   - Cloud: MongoDB Atlas (https://www.mongodb.com/cloud/atlas) - Recommended for production

3. **Node.js** (v16+)
   - Already installed if you've set up this project

## Setup Steps

### 1. Configure Environment Variables

Copy the example file and add your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/fisheries
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fisheries

# ODK/KoboToolbox Configuration
ODK_BASE_URL=https://kc.kobotoolbox.org/api/v1
ODK_USERNAME=your_username@email.com
ODK_PASSWORD=your_password_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 2. Start MongoDB (if using local installation)

**Windows:**
```bash
mongod
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### 3. Start the Backend Server

In a new terminal:

```bash
npm run server
```

Expected output:
```
🎣 Fisheries Monitoring Backend Server
📊 Running on http://localhost:5000

API Endpoints:
  GET  /api/health - Server health check
  POST /api/sync - Sync data from ODK/KoboToolbox
  GET  /api/bmus - Get all BMUs
  GET  /api/inspections - Get all inspections
  GET  /api/cooperatives - Get all cooperatives
  GET  /api/sync-logs - Get sync logs
  GET  /api/sync-status - Get latest sync status
  POST /api/test-odk-connection - Test ODK connection
```

### 4. Start the Frontend (in another terminal)

```bash
npm run dev
```

The dashboard will be available at http://localhost:5173

### 5. Test ODK Connection

1. Navigate to the **Data Sync (ODK)** section in the dashboard
2. Click **"Test ODK Connection"**
3. If successful, you'll see: ✓ ODK Connection Successful!
4. If failed, check your credentials in `.env`

### 6. Sync Data

1. Click **"Start Full Sync"**
2. The system will:
   - Connect to your ODK/KoboToolbox account
   - Download all form submissions
   - Parse and store in MongoDB
   - Display results and sync logs

## API Endpoints Reference

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Test ODK Connection
```bash
curl -X POST http://localhost:5000/api/test-odk-connection
```

### Start Sync
```bash
curl -X POST http://localhost:5000/api/sync
```

### Get All BMUs
```bash
curl http://localhost:5000/api/bmus
```

### Get All Inspections
```bash
curl http://localhost:5000/api/inspections
```

### Get Sync Logs
```bash
curl http://localhost:5000/api/sync-logs
```

### Get Latest Sync Status
```bash
curl http://localhost:5000/api/sync-status
```

## ODK Form Field Mappings

The system expects these form fields in your ODK/KoboToolbox forms:

### BMU Monitoring Form (form_id: `bmu_monitoring`)
- `bmu_name` - BMU Name
- `gps_location` - GPS coordinates (format: "lat lng")
- `total_members` - Total members
- `women_members` - Number of women members
- `youth_members` - Number of youth members
- `monthly_production` - Production in tons/month
- `last_inspection_date` - Date of last inspection
- `risk_assessment` - Risk rating (Low/Medium/High)

### Inspection Form (form_id: `inspection_form`)
- `site_name` - Site/BMU name
- `inspection_date` - Date of inspection
- `inspector_name` - Inspector name
- `inspection_status` - Status (Passed/Failed/Pending)
- `findings` - Inspection findings

### Cooperative Form (form_id: `cooperative_form`)
- `cooperative_name` - Cooperative name
- `total_members` - Total members
- `women_members` - Women members
- `youth_members` - Youth members
- `monthly_production` - Production metrics
- `status` - Cooperative status

## Troubleshooting

### Connection Failed
**Problem:** "Cannot reach backend server"
- **Solution:** Ensure server is running with `npm run server`
- Check if port 5000 is available

### Authentication Failed
**Problem:** "ODK connection failed" with 401/403 error
- **Solution:** Verify ODK credentials in `.env`
- Ensure your ODK account has API access enabled

### No Data Synced
**Problem:** "Records imported: 0"
- **Solution:** 
  - Verify form IDs match exactly (bmu_monitoring, inspection_form, etc.)
  - Check that submissions exist in your ODK/KoboToolbox account
  - Review sync logs for detailed error messages

### MongoDB Connection Error
**Problem:** "MongoDB connection failed"
- **Solution:**
  - Verify MongoDB is running
  - Check connection string in `.env`
  - For Atlas, ensure IP whitelist includes your computer

## Production Deployment

For production deployment:

1. **Use MongoDB Atlas** instead of local MongoDB
2. **Set NODE_ENV=production**
3. **Use a process manager** like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "fisheries-server"
   ```
4. **Set up HTTPS** with a reverse proxy (Nginx/Apache)
5. **Use environment-based configuration** for secrets

## Data Retention & Backup

- All synced data is stored in MongoDB
- Implement regular backups (MongoDB has built-in backup tools)
- Sync logs are kept for audit trail
- Consider archiving old data for compliance

## Support & Documentation

- **ODK Documentation:** https://docs.getodk.org/
- **KoboToolbox:** https://support.kobotoolbox.org/
- **MongoDB Docs:** https://docs.mongodb.com/
- **Express.js:** https://expressjs.com/

---

**Last Updated:** 2026-08-13
**Version:** 1.0
