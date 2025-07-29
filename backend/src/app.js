const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('./middlewares/auth');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const departmentRoutes = require('./routes/departments');
const positionRoutes = require('./routes/positions');
const adminRoutes = require('./routes/admin');
const onboardingRoutes = require('./routes/onboarding');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/positions', positionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/onboarding', onboardingRoutes);

// PDF Guide endpoint (только для авторизованных)
app.get('/api/guide-pdf', authenticateToken, (req, res) => {
  console.log('--- [PDF GUIDE REQUEST]', new Date().toISOString());
  console.log('Headers:', req.headers);
  console.log('Authorization:', req.headers.authorization);
  const filePath = path.join(__dirname, '../static/guide.pdf');
  if (!fs.existsSync(filePath)) {
    console.log('PDF guide not found:', filePath);
    return res.status(404).json({ error: 'PDF guide not found' });
  }
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Disposition', 'inline; filename="guide.pdf"');
  const stream = fs.createReadStream(filePath);
  stream.on('open', () => {
    console.log('PDF stream opened, sending file...');
  });
  stream.on('error', (err) => {
    console.error('Error reading PDF:', err);
    res.status(500).json({ error: 'Error reading PDF' });
  });
  stream.on('end', () => {
    console.log('PDF stream ended, file sent.');
  });
  stream.pipe(res);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; 