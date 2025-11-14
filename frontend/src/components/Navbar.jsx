import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">RC</span>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-800">RailConnect</span>
              <span className="block text-xs text-gray-500 -mt-1">Fianarantsoa</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
              Accueil
            </Link>
            <Link to="/search" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
              Rechercher
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                {user.role === 'admin' && (
                  <div className="relative group">
                    <button className="text-gray-600 hover:text-green-600 transition-colors font-medium flex items-center">
                      Administration
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">
                        Tableau de bord
                      </Link>
                      <Link to="/admin/trains" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">
                        Gestion trains
                      </Link>
                      <Link to="/admin/trajets" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">
                        Gestion trajets
                      </Link>
                      <Link to="/admin/reservations" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600">
                        Gestion réservations
                      </Link>
                    </div>
                  </div>
                )}
                <Link to="/my-reservations" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
                  Mes Réservations
                </Link>
                <Link to="/profile" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
                  Profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-green-600 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-600 hover:text-green-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                Accueil
              </Link>
              <Link to="/search" className="text-gray-600 hover:text-green-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                Rechercher
              </Link>
              
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <>
                      <div className="text-gray-400 text-sm font-semibold mt-2">Administration</div>
                      <Link to="/admin" className="text-gray-600 hover:text-green-600 pl-4" onClick={() => setIsMenuOpen(false)}>
                        Tableau de bord
                      </Link>
                      <Link to="/admin/trains" className="text-gray-600 hover:text-green-600 pl-4" onClick={() => setIsMenuOpen(false)}>
                        Gestion trains
                      </Link>
                      <Link to="/admin/trajets" className="text-gray-600 hover:text-green-600 pl-4" onClick={() => setIsMenuOpen(false)}>
                        Gestion trajets
                      </Link>
                      <Link to="/admin/reservations" className="text-gray-600 hover:text-green-600 pl-4" onClick={() => setIsMenuOpen(false)}>
                        Gestion réservations
                      </Link>
                    </>
                  )}
                  <Link to="/my-reservations" className="text-gray-600 hover:text-green-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                    Mes Réservations
                  </Link>
                  <Link to="/profile" className="text-gray-600 hover:text-green-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                    Profil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-red-500 hover:text-red-600 font-medium"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-green-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                    Connexion
                  </Link>
                  <Link to="/register" className="text-gray-600 hover:text-green-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;