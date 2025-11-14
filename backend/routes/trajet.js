import express from 'express';
import pool from '../config/db.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all trajets with search and pagination
router.get('/', async (req, res) => {
  try {
    const { ville_depart, ville_arrivee, date_depart, heure_depart, page = 1, limit = 10 } = req.query;

    console.log('🔍 Paramètres de recherche reçus:', { 
      ville_depart, 
      ville_arrivee, 
      date_depart, 
      heure_depart 
    });

    let query = `
      SELECT t.*, tr.nom_train, tr.numero_train, tr.nombre_places 
      FROM trajet t 
      JOIN train tr ON t.id_train = tr.id 
      WHERE 1=1
    `;
    const params = [];
    let paramCount = 0;

    if (ville_depart) {
      paramCount++;
      query += ` AND t.ville_depart ILIKE $${paramCount}`;
      params.push(`%${ville_depart}%`);
    }

    if (ville_arrivee) {
      paramCount++;
      query += ` AND t.ville_arrivee ILIKE $${paramCount}`;
      params.push(`%${ville_arrivee}%`);
    }

    if (date_depart) {
      paramCount++;
      query += ` AND t.date_depart = $${paramCount}`;
      params.push(date_depart);
    }

    if (heure_depart) {
      paramCount++;
      query += ` AND t.heure_depart >= $${paramCount}`;
      params.push(heure_depart);
    }

    query += ` ORDER BY t.date_depart, t.heure_depart`;
    
    // Pour le debug, on retire la pagination temporairement
    // query += ` LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    // params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    console.log('📝 Requête SQL:', query);
    console.log('🔢 Paramètres:', params);

    const trajets = await pool.query(query, params);
    
    console.log(`✅ ${trajets.rows.length} trajet(s) trouvé(s)`);

    // Calculer l'heure d'arrivée pour chaque trajet
    const trajetsWithArrival = trajets.rows.map(trajet => {
      const departureTime = new Date(`1970-01-01T${trajet.heure_depart}`);
      const arrivalTime = new Date(departureTime.getTime() + trajet.duree * 60000);
      const heure_arrivee = arrivalTime.toTimeString().slice(0, 5);
      
      return {
        ...trajet,
        heure_arrivee,
        prix_formatted: `${Math.round(trajet.prix).toLocaleString('fr-FR')} Ar`,
        image_url: trajet.image_url || `https://source.unsplash.com/featured/600x400/?${trajet.ville_arrivee},madagascar,train`
      };
    });

    res.json(trajetsWithArrival);
  } catch (error) {
    console.error('❌ Erreur dans GET /trajets:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des trajets' });
  }
});

// Get trajet by ID
router.get('/:id', async (req, res) => {
  try {
    const trajet = await pool.query(`
      SELECT t.*, tr.nom_train, tr.numero_train, tr.nombre_places 
      FROM trajet t 
      JOIN train tr ON t.id_train = tr.id 
      WHERE t.id = $1
    `, [req.params.id]);

    if (trajet.rows.length === 0) {
      return res.status(404).json({ message: 'Trajet non trouvé' });
    }
    
    // Calculer l'heure d'arrivée
    const departureTime = new Date(`1970-01-01T${trajet.rows[0].heure_depart}`);
    const arrivalTime = new Date(departureTime.getTime() + trajet.rows[0].duree * 60000);
    const heure_arrivee = arrivalTime.toTimeString().slice(0, 5);
    
    const trajetWithArrival = {
      ...trajet.rows[0],
      heure_arrivee,
      prix_formatted: `${Math.round(trajet.rows[0].prix).toLocaleString('fr-FR')} Ar`,
      image_url: trajet.rows[0].image_url || `https://source.unsplash.com/featured/600x400/?${trajet.rows[0].ville_arrivee},madagascar,train`
    };

    res.json(trajetWithArrival);
  } catch (error) {
    console.error('❌ Erreur dans GET /trajets/:id:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération du trajet' });
  }
});

// Create trajet (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { ville_depart, ville_arrivee, date_depart, heure_depart, duree, prix, id_train, image_url } = req.body;

    // Validation des données requises
    if (!ville_depart || !ville_arrivee || !date_depart || !heure_depart || !duree || !prix || !id_train) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
    }

    const newTrajet = await pool.query(
      'INSERT INTO trajet (ville_depart, ville_arrivee, date_depart, heure_depart, duree, prix, id_train, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [ville_depart, ville_arrivee, date_depart, heure_depart, duree, prix, id_train, image_url || null]
    );

    res.status(201).json({
      message: 'Trajet créé avec succès',
      trajet: newTrajet.rows[0]
    });
  } catch (error) {
    console.error('❌ Erreur dans POST /trajets:', error);
    
    if (error.code === '23503') { // Foreign key violation
      return res.status(400).json({ message: 'Le train sélectionné n\'existe pas' });
    }
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({ message: 'Un trajet similaire existe déjà' });
    }
    
    res.status(500).json({ message: 'Erreur serveur lors de la création du trajet' });
  }
});

// Update trajet (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { ville_depart, ville_arrivee, date_depart, heure_depart, duree, prix, id_train, image_url } = req.body;

    // Validation des données requises
    if (!ville_depart || !ville_arrivee || !date_depart || !heure_depart || !duree || !prix || !id_train) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis' });
    }

    const updatedTrajet = await pool.query(
      'UPDATE trajet SET ville_depart = $1, ville_arrivee = $2, date_depart = $3, heure_depart = $4, duree = $5, prix = $6, id_train = $7, image_url = $8 WHERE id = $9 RETURNING *',
      [ville_depart, ville_arrivee, date_depart, heure_depart, duree, prix, id_train, image_url || null, req.params.id]
    );

    if (updatedTrajet.rows.length === 0) {
      return res.status(404).json({ message: 'Trajet non trouvé' });
    }

    res.json({
      message: 'Trajet mis à jour avec succès',
      trajet: updatedTrajet.rows[0]
    });
  } catch (error) {
    console.error('❌ Erreur dans PUT /trajets/:id:', error);
    
    if (error.code === '23503') {
      return res.status(400).json({ message: 'Le train sélectionné n\'existe pas' });
    }
    if (error.code === '23505') {
      return res.status(400).json({ message: 'Un trajet similaire existe déjà' });
    }
    
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du trajet' });
  }
});

// Delete trajet (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deletedTrajet = await pool.query('DELETE FROM trajet WHERE id = $1 RETURNING *', [req.params.id]);
    
    if (deletedTrajet.rows.length === 0) {
      return res.status(404).json({ message: 'Trajet non trouvé' });
    }

    res.json({ 
      message: 'Trajet supprimé avec succès',
      trajet: deletedTrajet.rows[0]
    });
  } catch (error) {
    console.error('❌ Erreur dans DELETE /trajets/:id:', error);
    
    if (error.code === '23503') {
      return res.status(400).json({ 
        message: 'Impossible de supprimer ce trajet car il est référencé par des réservations' 
      });
    }
    
    res.status(500).json({ message: 'Erreur serveur lors de la suppression du trajet' });
  }
});

// Route pour récupérer les villes disponibles
router.get('/villes/disponibles', async (req, res) => {
  try {
    const villes = await pool.query(`
      SELECT DISTINCT ville_arrivee as ville 
      FROM trajet 
      WHERE ville_arrivee IS NOT NULL 
      ORDER BY ville_arrivee
    `);
    
    res.json(villes.rows.map(row => row.ville));
  } catch (error) {
    console.error('❌ Erreur dans GET /trajets/villes/disponibles:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des villes' });
  }
});

export default router;