import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await adminService.getDashboard();
      setStats(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setError('Erreur de chargement des données. Vérifiez votre connexion.');
      
      // Données de démonstration en cas d'erreur
      setStats({
        revenue: 0,
        reservations: {
          total_reservations: 0,
          confirmed_reservations: 0,
          pending_reservations: 0
        },
        popularRoutes: [],
        recentReservations: []
      });
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Protection contre les données null
  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Données non disponibles</h2>
          <p className="text-gray-600 mb-4">Impossible de charger les données du tableau de bord.</p>
          <button
            onClick={fetchDashboard}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Tableau de Bord Administrateur - RailConnect</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Revenus totaux</p>
                <p className="text-2xl font-bold text-gray-800">
                  {Math.round(stats.revenue || 0).toLocaleString('fr-FR')} Ar
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">🎫</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Réservations totales</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.reservations?.total_reservations || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.reservations?.pending_reservations || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Confirmées</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.reservations?.confirmed_reservations || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Trajets populaires */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Trajets les plus populaires</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.popularRoutes || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ville_depart" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="reservation_count" fill="#10B981" name="Nombre de réservations" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Répartition des réservations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Statut des réservations</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Confirmées', value: stats.reservations?.confirmed_reservations || 0 },
                    { name: 'En attente', value: stats.reservations?.pending_reservations || 0 },
                    { name: 'Annulées', value: (stats.reservations?.total_reservations || 0) - (stats.reservations?.confirmed_reservations || 0) - (stats.reservations?.pending_reservations || 0) }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: 'Confirmées', value: stats.reservations?.confirmed_reservations || 0 },
                    { name: 'En attente', value: stats.reservations?.pending_reservations || 0 },
                    { name: 'Annulées', value: (stats.reservations?.total_reservations || 0) - (stats.reservations?.confirmed_reservations || 0) - (stats.reservations?.pending_reservations || 0) }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Réservations récentes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Réservations récentes</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trajet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(stats.recentReservations || []).map((reservation) => (
                  <tr key={reservation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {reservation.prenom} {reservation.nom}
                      </div>
                      <div className="text-sm text-gray-500">{reservation.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {reservation.ville_depart} → {reservation.ville_arrivee}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(reservation.date_reservation).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        reservation.statut === 'confirmé' ? 'bg-green-100 text-green-800' :
                        reservation.statut === 'en attente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {reservation.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {Math.round(reservation.prix_total || 0).toLocaleString('fr-FR')} Ar
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {(stats.recentReservations || []).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune réservation récente
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;