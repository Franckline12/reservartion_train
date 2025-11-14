import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [searchParams, setSearchParams] = useState({
    ville_depart: 'Fianarantsoa',
    ville_arrivee: '',
    date_depart: '',
    heure_depart: '',
    passagers: 1,
    classe: 'standard'
  });

  const [imageLoaded, setImageLoaded] = useState({});
  const [imageErrors, setImageErrors] = useState({});

  // Photos locales de vos destinations
  const popularDestinations = [
    { 
      ville: 'Antananarivo', 
      prix: '45 000 Ar', 
      duree: '8h', 
      image: '/images/destinations/antananarivo.jpg',
      description: 'Capital vibrante de Madagascar'
    },
    { 
      ville: 'Manakara', 
      prix: '25 000 Ar', 
      duree: '4h', 
      image: '/images/destinations/manakara.jpg',
      description: 'Côte Est et canal des Pangalanes'
    },
    { 
      ville: 'Ranohira', 
      prix: '35 000 Ar', 
      duree: '3h', 
      image: '/images/destinations/ranohira.jpg',
      description: 'Porte du parc national de l\'Isalo'
    },
    { 
      ville: 'Ambalavao', 
      prix: '15 000 Ar', 
      duree: '1h', 
      image: '/images/destinations/ambalavao.jpg',
      description: 'Terre des zébus et du papier Antemoro'
    },
    { 
      ville: 'Antsirabe', 
      prix: '40 000 Ar', 
      duree: '5h', 
      image: '/images/destinations/antsirabe.jpg',
      description: 'Ville d\'eaux thermales et de lacs'
    },
    { 
      ville: 'Mananjary', 
      prix: '38 000 Ar', 
      duree: '6h', 
      image: '/images/destinations/mananjary.jpg',
      description: 'Plages de sable fin et cocotiers'
    },
    { 
      ville: 'Ihosy', 
      prix: '28 000 Ar', 
      duree: '2h', 
      image: '/images/destinations/ihosy.jpg',
      description: 'Porte du Sud et paysages montagneux'
    },
    { 
      ville: 'Morondava', 
      prix: '55 000 Ar', 
      duree: '10h', 
      image: '/images/destinations/morondava.jpg',
      description: 'Allée des Baobabs et côte Ouest'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const searchData = {
      ville_depart: searchParams.ville_depart,
      ville_arrivee: searchParams.ville_arrivee,
      date_depart: searchParams.date_depart,
      heure_depart: searchParams.heure_depart
    };
    const params = new URLSearchParams(searchData);
    navigate(`/search?${params.toString()}`);
  };

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const handleImageLoad = (ville) => {
    setImageLoaded(prev => ({ ...prev, [ville]: true }));
  };

  const handleImageError = (ville) => {
    console.log(`Erreur de chargement de l'image pour ${ville}`);
    setImageErrors(prev => ({ ...prev, [ville]: true }));
    setImageLoaded(prev => ({ ...prev, [ville]: true }));
  };

  const selectDestination = (destination) => {
    // Mettre à jour les paramètres de recherche
    setSearchParams({
      ...searchParams,
      ville_arrivee: destination.ville
    });
    
    // Naviguer directement vers la page de recherche
    const searchData = {
      ville_depart: 'Fianarantsoa',
      ville_arrivee: destination.ville,
      date_depart: searchParams.date_depart || '',
      heure_depart: searchParams.heure_depart || ''
    };
    
    const params = new URLSearchParams(searchData);
    navigate(`/search?${params.toString()}`);
  };

  // Fonction pour obtenir une image de fallback
  const getFallbackImage = (ville) => {
    const fallbackImages = {
      'Antananarivo': '🏙️',
      'Manakara': '🌊',
      'Ranohira': '🏞️',
      'Ambalavao': '🐏',
      'Antsirabe': '🌋',
      'Mananjary': '🏖️',
      'Ihosy': '⛰️',
      'Morondava': '🌳'
    };
    return fallbackImages[ville] || '🚆';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section avec Formulaire de Recherche */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              RailConnect
              <span className="block text-3xl md:text-4xl font-light mt-2">
                Fianarantsoa Railway
              </span>
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Voyagez à travers les hauts plateaux malgaches avec confort et sérénité
            </p>
          </div>

          {/* Formulaire de Recherche */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gare de départ
                  </label>
                  <select
                    name="ville_depart"
                    value={searchParams.ville_depart}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 bg-gray-50"
                  >
                    <option value="Fianarantsoa">Fianarantsoa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gare d'arrivée
                  </label>
                  <select
                    name="ville_arrivee"
                    value={searchParams.ville_arrivee}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                    required
                  >
                    <option value="">Sélectionnez une gare</option>
                    {popularDestinations.map(dest => (
                      <option key={dest.ville} value={dest.ville}>
                        {dest.ville}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de départ
                  </label>
                  <input
                    type="date"
                    name="date_depart"
                    value={searchParams.date_depart}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure de départ
                  </label>
                  <select
                    name="heure_depart"
                    value={searchParams.heure_depart}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                  >
                    <option value="">Toute la journée</option>
                    <option value="06:00">06:00</option>
                    <option value="07:30">07:30</option>
                    <option value="08:00">08:00</option>
                    <option value="09:00">09:00</option>
                    <option value="10:30">10:30</option>
                    <option value="11:00">11:00</option>
                    <option value="14:00">14:00</option>
                    <option value="16:00">16:00</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passagers
                  </label>
                  <select
                    name="passagers"
                    value={searchParams.passagers}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                  >
                    {[1,2,3,4,5,6,7,8].map(num => (
                      <option key={num} value={num}>
                        {num} {num > 1 ? 'voyageurs' : 'voyageur'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Classe
                  </label>
                  <select
                    name="classe"
                    value={searchParams.classe}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                  >
                    <option value="standard">Classe Standard</option>
                    <option value="premium">Classe Premium</option>
                    <option value="business">Classe Affaires</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-12 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg w-full md:w-auto flex items-center justify-center space-x-3"
                >
                  <span>🔍</span>
                  <span>Rechercher un train</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Destinations Populaires avec vos images locales */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Destinations populaires depuis Fianarantsoa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-green-300 transform hover:-translate-y-1"
                onClick={() => selectDestination(destination)}
              >
                <div className="h-48 overflow-hidden bg-gray-100 relative">
                  {/* Loading skeleton */}
                  {!imageLoaded[destination.ville] && (
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
                      <div className="text-gray-500 text-sm">Chargement...</div>
                    </div>
                  )}
                  
                  {/* Image ou fallback */}
                  {imageErrors[destination.ville] ? (
                    // Fallback avec emoji si l'image ne charge pas
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500">
                      <span className="text-6xl text-white">
                        {getFallbackImage(destination.ville)}
                      </span>
                    </div>
                  ) : (
                    // Votre image locale
                    <img 
                      src={destination.image} 
                      alt={`Voyage en train de Fianarantsoa vers ${destination.ville}`}
                      className={`w-full h-full object-cover transition-all duration-500 ${
                        imageLoaded[destination.ville] 
                          ? 'opacity-100 scale-100' 
                          : 'opacity-0 scale-105'
                      }`}
                      onLoad={() => handleImageLoad(destination.ville)}
                      onError={() => handleImageError(destination.ville)}
                      loading="lazy"
                    />
                  )}
                  
                  {/* Overlay avec nom de la ville */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-white font-semibold text-lg">
                      {destination.ville}
                    </h3>
                  </div>
                </div>
                
                <div className="p-4">
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {destination.description}
                  </p>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-1">⏱️</span>
                      {destination.duree}
                    </div>
                    <div className="text-green-600 font-bold text-lg">
                      {destination.prix}
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      selectDestination(destination);
                    }}
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                  >
                    Réserver maintenant
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi choisir RailConnect */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Pourquoi choisir RailConnect ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎫</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Réservation facile</h3>
              <p className="text-gray-600">
                Réservez vos billets en quelques clics seulement avec notre interface intuitive et conviviale.
                Pas de files d'attente, pas de stress.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Meilleurs prix</h3>
              <p className="text-gray-600">
                Garantie des tarifs les plus compétitifs du marché avec des promotions régulières
                et pas de frais cachés.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Service fiable</h3>
              <p className="text-gray-600">
                Une ponctualité exemplaire et un service client disponible 24h/24 
                pour votre tranquillité d'esprit.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🚆</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Confort optimal</h3>
              <p className="text-gray-600 text-sm">
                Trains modernes et climatisés avec des sièges confortables pour un voyage agréable
                à travers les paysages malgaches.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">📱</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Application mobile</h3>
              <p className="text-gray-600 text-sm">
                Gérez vos réservations depuis votre smartphone avec notre application mobile
                disponible sur iOS et Android.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Une expérience de voyage complète
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="text-3xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold mb-2">Recherche intuitive</h3>
              <p className="text-white/80 text-sm">
                Trouvez facilement les trajets qui correspondent à vos besoins en quelques secondes
              </p>
            </div>
            
            <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="text-3xl mb-4">🎟️</div>
              <h3 className="text-lg font-semibold mb-2">Réservation rapide</h3>
              <p className="text-white/80 text-sm">
                Réservez vos billets en quelques secondes seulement avec paiement sécurisé
              </p>
            </div>
            
            <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="text-lg font-semibold mb-2">Gestion simplifiée</h3>
              <p className="text-white/80 text-sm">
                Consultez, modifiez et annulez vos réservations facilement à tout moment
              </p>
            </div>
            
            <div className="text-center p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="text-3xl mb-4">👤</div>
              <h3 className="text-lg font-semibold mb-2">Profil personnel</h3>
              <p className="text-white/80 text-sm">
                Gérez vos informations, préférences et historique de voyage en un seul endroit
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Prêt à explorer Madagascar ?
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de voyageurs qui nous font confiance pour découvrir 
            les merveilles de l'île Rouge en train.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/search"
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
            >
              Commencer ma recherche
            </Link>
            {!user && (
              <Link
                to="/register"
                className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-600 hover:text-white transition-colors"
              >
                Créer mon compte
              </Link>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-6">
            ✅ Réservation sécurisée • ✅ Support 24h/24 • ✅ Meilleur prix garanti
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;