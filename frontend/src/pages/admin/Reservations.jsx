import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';

const AdminReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await adminService.getReservations();
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (reservationId, newStatus) => {
    try {
      await adminService.updateReservationStatus(reservationId, newStatus);
      fetchReservations();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Erreur lors de la mise à jour');
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
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestion des Réservations</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trajet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Réservation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Billet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Places
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {reservation.client_prenom} {reservation.client_nom}
                    </div>
                    <div className="text-sm text-gray-500">{reservation.client_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {reservation.ville_depart} → {reservation.ville_arrivee}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(reservation.date_depart).toLocaleDateString('fr-FR')} à {reservation.heure_depart.substring(0, 5)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {reservation.nom_train}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(reservation.date_reservation).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                    {reservation.numero_billet}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reservation.nombre_places}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {Math.round(reservation.prix_total).toLocaleString('fr-FR')} Ar
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(reservation.statut)}`}>
                      {reservation.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {reservation.statut === 'en attente' && (
                      <>
                        <button
                          onClick={() => updateStatus(reservation.id, 'confirmé')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Confirmer
                        </button>
                        <button
                          onClick={() => updateStatus(reservation.id, 'annulé')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Annuler
                        </button>
                      </>
                    )}
                    {reservation.statut === 'confirmé' && (
                      <button
                        onClick={() => updateStatus(reservation.id, 'annulé')}
                        className="text-red-600 hover:text-red-900"
                      >
                        Annuler
                      </button>
                    )}
                    {reservation.statut === 'annulé' && (
                      <button
                        onClick={() => updateStatus(reservation.id, 'en attente')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Remettre en attente
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reservations.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">
              Aucune réservation trouvée.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReservations;