// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';

import authRoutes from './routes/auth.js';
import trainRoutes from './routes/train.js';
import trajetRoutes from './routes/trajet.js';
import reservationRoutes from './routes/reservation.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();

// Middleware global
app.use(cors());
app.use(express.json());

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/trajets', trajetRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/admin', adminRoutes);

// Route de test du serveur
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Route de test connexion DB
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, dbTime: result.rows[0].now });
  } catch (err) {
    console.error('Erreur DB:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Démarrage serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
