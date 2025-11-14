import express from 'express';
import pool from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get user's reservations
router.get('/my-reservations', authMiddleware, async (req, res) => {
  try {
    const reservations = await pool.query(`
      SELECT r.*, t.ville_depart, t.ville_arrivee, t.date_depart, t.heure_depart, t.duree, t.prix,
             tr.nom_train, tr.numero_train
      FROM reservation r
      JOIN trajet t ON r.id_trajet = t.id
      JOIN train tr ON t.id_train = tr.id
      WHERE r.id_client = $1
      ORDER BY r.date_reservation DESC
    `, [req.user.id]);

    res.json(reservations.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Create reservation
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { id_trajet, nombre_places } = req.body;

    const trajet = await pool.query('SELECT * FROM trajet WHERE id = $1', [id_trajet]);
    if (trajet.rows.length === 0) return res.status(404).json({ message: 'Trajet non trouvé' });

    const numero_billet = 'TKT' + Date.now() + Math.random().toString(36).substr(2, 5);
    const prix_total = trajet.rows[0].prix * nombre_places;

    const newReservation = await pool.query(
      'INSERT INTO reservation (id_client, id_trajet, numero_billet, nombre_places, prix_total) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, id_trajet, numero_billet, nombre_places, prix_total]
    );

    res.status(201).json(newReservation.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Cancel reservation
router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const reservation = await pool.query(
      'UPDATE reservation SET statut = $1 WHERE id = $2 AND id_client = $3 RETURNING *',
      ['annulé', req.params.id, req.user.id]
    );

    if (reservation.rows.length === 0) return res.status(404).json({ message: 'Réservation non trouvée' });
    res.json({ message: 'Réservation annulée avec succès', reservation: reservation.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
