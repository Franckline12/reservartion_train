import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { trajetService } from '../services/api';

const SearchTrains = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [trajets, setTrajets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchData = {
    ville_depart: searchParams.get('ville_depart') || 'Fianarantsoa',
    ville_arrivee: searchParams.get('ville_arrivee') || '',
    date_depart: searchParams.get('date_depart') || '',
    heure_depart: searchParams.get('heure_depart') || ''
  };

  useEffect(() => {
    // Lancer la recherche automatiquement si on a des critères
    if (searchData.ville_arrivee) {
      handleSearch();
    }
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);

    try {
      console.log('Recherche avec:', searchData);
      const response = await trajetService.search(searchData);
      console.log('Résultats:', response.data);
      setTrajets(response.data);
    } catch (error) {
      console.error('Error searching trains:', error);
      setTrajets([]);
    }

    setLoading(false);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins.toString().padStart(2, '0')}`;
  };

  const formatTime = (timeString) => {
    return timeString.substring(0, 5);
  };

  // Fonction pour calculer l'heure d'arrivée
  const calculateArrivalTime = (heure_depart, duree_minutes) => {
    const [hours, minutes] = heure_depart.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duree_minutes;
    
    const arrivalHours = Math.floor(totalMinutes / 60) % 24;
    const arrivalMinutes = totalMinutes % 60;
    
    return `${arrivalHours.toString().padStart(2, '0')}:${arrivalMinutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {searchData.ville_arrivee 
            ? `Trajets de ${searchData.ville_depart} vers ${searchData.ville_arrivee}`
            : 'Recherche de trains'
          }
        </h1>

        {/* Résumé de la recherche */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">🚆</div>
                <div className="text-sm text-gray-600 font-medium">{searchData.ville_depart}</div>
              </div>
              <div className="text-gray-400 text-xl">→</div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">🎯</div>
                <div className="text-sm text-gray-600 font-medium">{searchData.ville_arrivee || 'Destination'}</div>
              </div>
              {searchData.date_depart && (
                <>
                  <div className="text-gray-400 text-xl">•</div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">📅</div>
                    <div className="text-sm text-gray-600">
                      {new Date(searchData.date_depart).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </>
              )}
            </div>
            <Link
              to="/"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Nouvelle recherche
            </Link>
          </div>
        </div>

        {/* Résultats */}
        {searched && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              {loading ? 'Recherche en cours...' : `${trajets.length} trajet(s) trouvé(s)`}
            </h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="loading-spinner"></div>
              </div>
            ) : trajets.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-600 text-lg mb-4">
                  Aucun trajet trouvé pour votre recherche.
                </p>
                <p className="text-gray-500 mb-6">
                  Essayez de modifier vos critères de recherche ou vérifiez la date.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Retour à l'accueil
                  </Link>
                  <button
                    onClick={() => navigate('/')}
                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Modifier la recherche
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {trajets.map((trajet) => {
                  const heure_arrivee = calculateArrivalTime(trajet.heure_depart, trajet.duree);
                  
                  return (
                    <div key={trajet.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-800">
                                {formatTime(trajet.heure_depart)}
                              </div>
                              <div className="text-sm text-gray-600 font-medium">{trajet.ville_depart}</div>
                            </div>
                            
                            <div className="flex-1 text-center">
                              <div className="text-sm text-gray-500 mb-1">
                                Durée: {formatDuration(trajet.duree)}
                              </div>
                              <div className="h-1 bg-gray-200 my-2 mx-4 rounded-full"></div>
                              <div className="text-xs text-gray-500">
                                {trajet.nom_train} • {trajet.numero_train}
                              </div>
                            </div>
                            
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-800">
                                {formatTime(heure_arrivee)}
                              </div>
                              <div className="text-sm text-gray-600 font-medium">{trajet.ville_arrivee}</div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-semibold">Date:</span>{' '}
                              {new Date(trajet.date_depart).toLocaleDateString('fr-FR', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </div>
                            <div>
                              <span className="font-semibold">Places disponibles:</span>{' '}
                              {trajet.nombre_places}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 md:mt-0 md:ml-6 text-center">
                          <div className="text-2xl font-bold text-green-600 mb-2">
                            {trajet.prix_formatted || `${Math.round(trajet.prix).toLocaleString('fr-FR')} Ar`}
                          </div>
                          <Link
                            to={`/reservation/${trajet.id}`}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold inline-block min-w-[120px]"
                          >
                            Réserver
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {!searched && !searchData.ville_arrivee && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl mb-4">🚆</div>
            <p className="text-gray-600 text-lg mb-4">
              Utilisez le formulaire de recherche pour trouver des trains.
            </p>
            <Link
              to="/"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-block"
            >
              Retour à la recherche
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchTrains;