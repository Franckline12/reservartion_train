import express from 'express';
import pool from '../config/db.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all trains
router.get('/', async (req, res) => {
  try {
    const trains = await pool.query('SELECT * FROM train ORDER BY id DESC');
    res.json(trains.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get train by ID
router.get('/:id', async (req, res) => {
  try {
    const train = await pool.query('SELECT * FROM train WHERE id = $1', [req.params.id]);
    if (train.rows.length === 0) return res.status(404).json({ message: 'Train non trouvé' });
    res.json(train.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Create train
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { nom_train, numero_train, nombre_places } = req.body;
    const newTrain = await pool.query(
      'INSERT INTO train (nom_train, numero_train, nombre_places) VALUES ($1, $2, $3) RETURNING *',
      [nom_train, numero_train, nombre_places]
    );
    res.status(201).json(newTrain.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Update train
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { nom_train, numero_train, nombre_places } = req.body;
    const updatedTrain = await pool.query(
      'UPDATE train SET nom_train = $1, numero_train = $2, nombre_places = $3 WHERE id = $4 RETURNING *',
      [nom_train, numero_train, nombre_places, req.params.id]
    );
    if (updatedTrain.rows.length === 0) return res.status(404).json({ message: 'Train non trouvé' });
    res.json(updatedTrain.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Delete train
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deletedTrain = await pool.query('DELETE FROM train WHERE id = $1 RETURNING *', [req.params.id]);
    if (deletedTrain.rows.length === 0) return res.status(404).json({ message: 'Train non trouvé' });
    res.json({ message: 'Train supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
