import React, { useState, useEffect } from 'react';
import { reservationService } from '../services/api';

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await reservationService.getMyReservations();
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (reservationId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      return;
    }

    try {
      await reservationService.cancel(reservationId);
      // Refresh the list
      fetchReservations();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      alert('Erreur lors de l\'annulation');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmé':
        return 'bg-green-100 text-green-800';
      case 'en attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'annulé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Mes réservations</h1>

        {reservations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg mb-4">
              Vous n'avez aucune réservation pour le moment.
            </p>
            <a
              href="/search"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Rechercher un train
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {reservation.ville_depart} → {reservation.ville_arrivee}
                        </h3>
                        <p className="text-gray-600">
                          {new Date(reservation.date_depart).toLocaleDateString('fr-FR')} à {reservation.heure_depart.substring(0, 5)}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.statut)}`}>
                        {reservation.statut}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-semibold">Numéro de billet:</span>
                        <br />
                        {reservation.numero_billet}
                      </div>
                      <div>
                        <span className="font-semibold">Train:</span>
                        <br />
                        {reservation.nom_train}
                      </div>
                      <div>
                        <span className="font-semibold">Date réservation:</span>
                        <br />
                        {new Date(reservation.date_reservation).toLocaleDateString('fr-FR')}
                      </div>
                      <div>
                        <span className="font-semibold">Prix total:</span>
                        <br />
                        <span className="text-blue-600 font-semibold">{reservation.prix_total} €</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 md:ml-6 flex space-x-2">
                    {reservation.statut === 'en attente' && (
                      <button
                        onClick={() => handleCancel(reservation.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Annuler
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReservations;