import express from 'express';
import pool from '../config/db.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all reservations (admin only)
router.get('/reservations', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const reservations = await pool.query(`
      SELECT r.*, 
             u.nom as client_nom, u.prenom as client_prenom, u.email as client_email,
             t.ville_depart, t.ville_arrivee, t.date_depart, t.heure_depart, t.duree,
             tr.nom_train, tr.numero_train
      FROM reservation r
      JOIN utilisateurs u ON r.id_client = u.id
      JOIN trajet t ON r.id_trajet = t.id
      JOIN train tr ON t.id_train = tr.id
      ORDER BY r.date_reservation DESC
    `);

    res.json(reservations.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Update reservation status
router.put('/reservations/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { statut } = req.body;

    const reservation = await pool.query(
      'UPDATE reservation SET statut = $1 WHERE id = $2 RETURNING *',
      [statut, req.params.id]
    );

    if (reservation.rows.length === 0) return res.status(404).json({ message: 'Réservation non trouvée' });
    res.json({ message: 'Statut mis à jour', reservation: reservation.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Dashboard statistics
router.get('/dashboard', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const revenue = await pool.query(`SELECT COALESCE(SUM(prix_total), 0) as total_revenue FROM reservation WHERE statut = 'confirmé'`);
    const reservations = await pool.query(`
      SELECT COUNT(*) as total_reservations,
             SUM(CASE WHEN statut = 'confirmé' THEN 1 ELSE 0 END) as confirmed_reservations,
             SUM(CASE WHEN statut = 'en attente' THEN 1 ELSE 0 END) as pending_reservations
      FROM reservation
    `);
    const popularRoutes = await pool.query(`
      SELECT t.ville_depart, t.ville_arrivee, COUNT(r.id) as reservation_count
      FROM trajet t
      LEFT JOIN reservation r ON t.id = r.id_trajet
      GROUP BY t.ville_depart, t.ville_arrivee
      ORDER BY reservation_count DESC
      LIMIT 5
    `);
    const recentReservations = await pool.query(`
      SELECT r.*, u.nom, u.prenom, t.ville_depart, t.ville_arrivee
      FROM reservation r
      JOIN utilisateurs u ON r.id_client = u.id
      JOIN trajet t ON r.id_trajet = t.id
      ORDER BY r.date_reservation DESC
      LIMIT 10
    `);

    res.json({
      revenue: revenue.rows[0].total_revenue,
      reservations: reservations.rows[0],
      popularRoutes: popularRoutes.rows,
      recentReservations: recentReservations.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
