import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fisheries', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✓ MongoDB connected'))
.catch(err => console.log('✗ MongoDB connection error:', err));

// ==================== SCHEMAS ====================

// BMU Schema
const bmuSchema = new mongoose.Schema({
  odkId: String,
  name: String,
  lat: Number,
  lng: Number,
  members: Number,
  women: Number,
  youth: Number,
  production: Number,
  lastInspection: Date,
  riskRating: String,
  syncedAt: { type: Date, default: Date.now },
  rawData: Object,
});

// Inspection Schema
const inspectionSchema = new mongoose.Schema({
  odkId: String,
  site: String,
  date: Date,
  inspector: String,
  status: String,
  findings: String,
  syncedAt: { type: Date, default: Date.now },
  rawData: Object,
});

// Cooperative Schema
const cooperativeSchema = new mongoose.Schema({
  odkId: String,
  name: String,
  members: Number,
  women: Number,
  youth: Number,
  production: Number,
  status: String,
  syncedAt: { type: Date, default: Date.now },
  rawData: Object,
});

// Data Sync Log Schema
const syncLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  status: String,
  recordsImported: Number,
  errors: [String],
  details: String,
});

const BMU = mongoose.model('BMU', bmuSchema);
const Inspection = mongoose.model('Inspection', inspectionSchema);
const Cooperative = mongoose.model('Cooperative', cooperativeSchema);
const SyncLog = mongoose.model('SyncLog', syncLogSchema);

// ==================== ODK INTEGRATION ====================

const odkConfig = {
  baseURL: process.env.ODK_BASE_URL || 'https://kc.kobotoolbox.org/api/v1',
  username: process.env.ODK_USERNAME || '',
  password: process.env.ODK_PASSWORD || '',
};

// Create authenticated axios instance for ODK
const odkClient = axios.create({
  baseURL: odkConfig.baseURL,
  auth: {
    username: odkConfig.username,
    password: odkConfig.password,
  },
});

// ==================== API ENDPOINTS ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Sync data from ODK/KoboToolbox
app.post('/api/sync', async (req, res) => {
  try {
    console.log('Starting ODK data sync...');
    const syncLog = new SyncLog({
      status: 'in_progress',
      recordsImported: 0,
      errors: [],
    });

    let recordsImported = 0;
    const errors = [];

    // Fetch BMU data from ODK form (form ID: bmu_monitoring)
    try {
      const bmuResponse = await odkClient.get('/forms/bmu_monitoring/data.json');
      const bmuRecords = bmuResponse.data;

      for (const record of bmuRecords) {
        await BMU.findOneAndUpdate(
          { odkId: record._id },
          {
            odkId: record._id,
            name: record.bmu_name || '',
            lat: parseFloat(record.gps_location?.split(' ')[0]) || 0,
            lng: parseFloat(record.gps_location?.split(' ')[1]) || 0,
            members: parseInt(record.total_members) || 0,
            women: parseInt(record.women_members) || 0,
            youth: parseInt(record.youth_members) || 0,
            production: parseFloat(record.monthly_production) || 0,
            lastInspection: record.last_inspection_date || new Date(),
            riskRating: record.risk_assessment || 'Medium',
            rawData: record,
          },
          { upsert: true }
        );
        recordsImported++;
      }
      console.log(`✓ Imported ${recordsImported} BMU records`);
    } catch (err) {
      errors.push(`BMU sync error: ${err.message}`);
      console.error('BMU sync error:', err.message);
    }

    // Fetch Inspection data
    try {
      const inspectionResponse = await odkClient.get('/forms/inspection_form/data.json');
      const inspectionRecords = inspectionResponse.data;

      for (const record of inspectionRecords) {
        await Inspection.findOneAndUpdate(
          { odkId: record._id },
          {
            odkId: record._id,
            site: record.site_name || '',
            date: record.inspection_date || new Date(),
            inspector: record.inspector_name || '',
            status: record.inspection_status || 'Pending',
            findings: record.findings || '',
            rawData: record,
          },
          { upsert: true }
        );
        recordsImported++;
      }
      console.log(`✓ Imported inspection records`);
    } catch (err) {
      errors.push(`Inspection sync error: ${err.message}`);
      console.error('Inspection sync error:', err.message);
    }

    syncLog.status = 'completed';
    syncLog.recordsImported = recordsImported;
    syncLog.errors = errors;
    syncLog.details = `Successfully synced ${recordsImported} records from ODK/KoboToolbox`;
    await syncLog.save();

    res.json({
      success: true,
      message: 'Sync completed',
      recordsImported,
      errors: errors.length > 0 ? errors : null,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Sync error:', error);
    const syncLog = new SyncLog({
      status: 'failed',
      errors: [error.message],
      details: 'Sync operation failed',
    });
    await syncLog.save();

    res.status(500).json({
      success: false,
      message: 'Sync failed',
      error: error.message,
    });
  }
});

// Get all BMUs
app.get('/api/bmus', async (req, res) => {
  try {
    const bmus = await BMU.find().sort({ name: 1 });
    res.json(bmus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all data (BMUs) - Generic data endpoint
app.get('/api/data', async (req, res) => {
  try {
    const bmus = await BMU.find().sort({ name: 1 });
    res.json({
      success: true,
      data: bmus,
      count: bmus.length,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all inspections
app.get('/api/inspections', async (req, res) => {
  try {
    const inspections = await Inspection.find().sort({ date: -1 });
    res.json(inspections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all cooperatives
app.get('/api/cooperatives', async (req, res) => {
  try {
    const cooperatives = await Cooperative.find().sort({ name: 1 });
    res.json(cooperatives);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get sync logs
app.get('/api/sync-logs', async (req, res) => {
  try {
    const logs = await SyncLog.find().sort({ timestamp: -1 }).limit(10);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get latest sync status
app.get('/api/sync-status', async (req, res) => {
  try {
    const latestSync = await SyncLog.findOne().sort({ timestamp: -1 });
    if (!latestSync) {
      return res.json({ status: 'never_synced', message: 'No sync has been performed yet' });
    }
    res.json(latestSync);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test ODK connection
app.post('/api/test-odk-connection', async (req, res) => {
  try {
    const response = await odkClient.get('/users/current');
    res.json({
      success: true,
      message: 'ODK connection successful',
      user: response.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ODK connection failed',
      error: error.message,
    });
  }
});

// ==================== SERVER START ====================

app.listen(PORT, () => {
  console.log(`\n🎣 Fisheries Monitoring Backend Server`);
  console.log(`📊 Running on http://localhost:${PORT}`);
  console.log(`\nAPI Endpoints:`);
  console.log(`  GET  /api/health - Server health check`);
  console.log(`  GET  /api/data - Get all data (BMUs)`);
  console.log(`  GET  /api/bmus - Get all BMUs`);
  console.log(`  POST /api/sync - Sync data from ODK/KoboToolbox`);
  console.log(`  GET  /api/inspections - Get all inspections`);
  console.log(`  GET  /api/cooperatives - Get all cooperatives`);
  console.log(`  GET  /api/sync-logs - Get sync logs`);
  console.log(`  GET  /api/sync-status - Get latest sync status`);
  console.log(`  POST /api/test-odk-connection - Test ODK connection\n`);
});

export default app;
