import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { trajetService, reservationService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Reservation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [trajet, setTrajet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [formData, setFormData] = useState({
    nombre_places: 1
  });

  useEffect(() => {
    const fetchTrajet = async () => {
      try {
        const response = await trajetService.getById(id);
        setTrajet(response.data);
      } catch (error) {
        console.error('Error fetching trajet:', error);
        navigate('/search');
      } finally {
        setLoading(false);
      }
    };

    fetchTrajet();
  }, [id, navigate]);

  const handleReservation = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    setReserving(true);

    try {
      await reservationService.create({
        id_trajet: id,
        nombre_places: formData.nombre_places
      });
      
      navigate('/my-reservations');
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert('Erreur lors de la réservation');
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!trajet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Trajet non trouvé</h2>
          <button
            onClick={() => navigate('/search')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retour à la recherche
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = trajet.prix * formData.nombre_places;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Confirmer votre réservation</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trajet Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Détails du trajet</h2>
              
              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{trajet.heure_depart.substring(0, 5)}</div>
                  <div className="text-gray-600">{trajet.ville_depart}</div>
                </div>
                
                <div className="flex-1 text-center">
                  <div className="text-sm text-gray-500">Durée: {trajet.duree}</div>
                  <div className="h-1 bg-gray-200 my-2 mx-4"></div>
                  <div className="text-xs text-gray-500">
                    {trajet.nom_train} - {trajet.numero_train}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {new Date(`1970-01-01T${trajet.heure_depart}`).getTime() + 
                     new Date(`1970-01-01T${trajet.duree}`).getTime()}
                  </div>
                  <div className="text-gray-600">{trajet.ville_arrivee}</div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Date:</span>{' '}
                    {new Date(trajet.date_depart).toLocaleDateString('fr-FR')}
                  </div>
                  <div>
                    <span className="font-semibold">Train:</span> {trajet.nom_train}
                  </div>
                  <div>
                    <span className="font-semibold">Numéro:</span> {trajet.numero_train}
                  </div>
                  <div>
                    <span className="font-semibold">Places disponibles:</span> {trajet.nombre_places}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reservation Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Votre réservation</h2>
              
              <form onSubmit={handleReservation}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de places
                  </label>
                  <select
                    value={formData.nombre_places}
                    onChange={(e) => setFormData({ nombre_places: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num} place(s)</option>
                    ))}
                  </select>
                </div>

                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span>Prix unitaire:</span>
                    <span>{trajet.prix} €</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Nombre de places:</span>
                    <span>{formData.nombre_places}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-blue-600">{totalPrice} €</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={reserving}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 font-semibold"
                >
                  {reserving ? 'Réservation...' : 'Confirmer la réservation'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;