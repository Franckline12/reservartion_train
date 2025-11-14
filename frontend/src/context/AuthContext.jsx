import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      const userObj = JSON.parse(userData);
      setUser(userObj);
      
      // Configurer axios pour envoyer le token dans toutes les requêtes
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      console.log('Utilisateur connecté:', userObj);
    } else {
      console.log('Aucun utilisateur connecté');
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Tentative de connexion pour:', email);
      
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;
      
      console.log('Connexion réussie, rôle:', user.role);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // IMPORTANT: Configurer le header Authorization
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      
      return { success: true };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erreur de connexion' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', userData);

      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Erreur d'inscription" 
      };
    }
  };

  const logout = () => {
    console.log('Déconnexion');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};