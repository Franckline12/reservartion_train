import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Inscription avec choix de rôle
router.post('/register', [
  body('nom').notEmpty().withMessage('Le nom est requis'),
  body('prenom').notEmpty().withMessage('Le prénom est requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('role').isIn(['client', 'admin']).withMessage('Rôle invalide')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { nom, prenom, email, password, role } = req.body;

    const userExists = await pool.query('SELECT * FROM utilisateurs WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      'INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, nom, prenom, email, role',
      [nom, prenom, email, hashedPassword, role]
    );

    const token = jwt.sign({ userId: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    res.status(201).json({ token, user: newUser.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Connexion
router.post('/login', [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Le mot de passe est requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const user = await pool.query('SELECT * FROM utilisateurs WHERE email = $1', [email]);

    if (user.rows.length === 0) return res.status(400).json({ message: 'Email ou mot de passe incorrect' });

    const isMatch = await bcrypt.compare(password, user.rows[0].mot_de_passe);
    if (!isMatch) return res.status(400).json({ message: 'Email ou mot de passe incorrect' });

    const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    res.json({
      token,
      user: {
        id: user.rows[0].id,
        nom: user.rows[0].nom,
        prenom: user.rows[0].prenom,
        email: user.rows[0].email,
        role: user.rows[0].role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;