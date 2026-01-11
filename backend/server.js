require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const healthRoutes = require('./routes/health');
const notificationRoutes = require('./routes/notifications');

const connectDB = require('./config/db'); 
// if you have db config
// If DB connection is directly inside server.js, keep that instead

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(cors());
app.use(express.json());

/* ---------- ROUTES ---------- */
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/notifications', notificationRoutes);

/* ---------- TEST ROUTE ---------- */
app.get('/', (req, res) => {
  res.send('API is running');
});

/* ---------- START SERVER ---------- */
const PORT = process.env.PORT || 5000;

connectDB();
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
