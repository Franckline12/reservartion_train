import React, { useState, useEffect } from 'react';
import { trajetService, trainService } from '../../services/api';

const AdminTrajets = () => {
  const [trajets, setTrajets] = useState([]);
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTrajet, setEditingTrajet] = useState(null);
  const [formData, setFormData] = useState({
    ville_depart: 'Fianarantsoa',
    ville_arrivee: '',
    date_depart: '',
    heure_depart: '',
    duree: '',
    prix: '',
    id_train: ''
  });

  useEffect(() => {
    fetchTrajets();
    fetchTrains();
  }, []);

  const fetchTrajets = async () => {
    try {
      const response = await trajetService.search({});
      setTrajets(response.data);
    } catch (error) {
      console.error('Error fetching trajets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrains = async () => {
    try {
      const response = await trainService.getAll();
      setTrains(response.data);
    } catch (error) {
      console.error('Error fetching trains:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        prix: parseFloat(formData.prix),
        duree: parseInt(formData.duree),
        id_train: parseInt(formData.id_train)
      };

      if (editingTrajet) {
        await trajetService.update(editingTrajet.id, data);
      } else {
        await trajetService.create(data);
      }
      setShowForm(false);
      setEditingTrajet(null);
      setFormData({
        ville_depart: 'Fianarantsoa',
        ville_arrivee: '',
        date_depart: '',
        heure_depart: '',
        duree: '',
        prix: '',
        id_train: ''
      });
      fetchTrajets();
    } catch (error) {
      console.error('Error saving trajet:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (trajet) => {
    setEditingTrajet(trajet);
    setFormData({
      ville_depart: trajet.ville_depart,
      ville_arrivee: trajet.ville_arrivee,
      date_depart: trajet.date_depart,
      heure_depart: trajet.heure_depart,
      duree: trajet.duree,
      prix: trajet.prix,
      id_train: trajet.id_train
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce trajet ?')) return;
    
    try {
      await trajetService.delete(id);
      fetchTrajets();
    } catch (error) {
      console.error('Error deleting trajet:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingTrajet(null);
    setFormData({
      ville_depart: 'Fianarantsoa',
      ville_arrivee: '',
      date_depart: '',
      heure_depart: '',
      duree: '',
      prix: '',
      id_train: ''
    });
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestion des Trajets</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            + Ajouter un trajet
          </button>
        </div>

        {/* Formulaire */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingTrajet ? 'Modifier le trajet' : 'Nouveau trajet'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville de départ
                </label>
                <input
                  type="text"
                  required
                  value={formData.ville_depart}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville d'arrivée
                </label>
                <select
                  required
                  value={formData.ville_arrivee}
                  onChange={(e) => setFormData({...formData, ville_arrivee: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Sélectionnez...</option>
                  <option value="Antananarivo">Antananarivo</option>
                  <option value="Manakara">Manakara</option>
                  <option value="Ranohira">Ranohira</option>
                  <option value="Ambalavao">Ambalavao</option>
                  <option value="Antsirabe">Antsirabe</option>
                  <option value="Mananjary">Mananjary</option>
                  <option value="Ihosy">Ihosy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date départ
                </label>
                <input
                  type="date"
                  required
                  value={formData.date_depart}
                  onChange={(e) => setFormData({...formData, date_depart: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure départ
                </label>
                <input
                  type="time"
                  required
                  value={formData.heure_depart}
                  onChange={(e) => setFormData({...formData, heure_depart: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée (minutes)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.duree}
                  onChange={(e) => setFormData({...formData, duree: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="120"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix (Ar)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1000"
                  value={formData.prix}
                  onChange={(e) => setFormData({...formData, prix: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="45000"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Train
                </label>
                <select
                  required
                  value={formData.id_train}
                  onChange={(e) => setFormData({...formData, id_train: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Sélectionnez un train</option>
                  {trains.map(train => (
                    <option key={train.id} value={train.id}>
                      {train.nom_train} ({train.numero_train}) - {train.nombre_places} places
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2 lg:col-span-3 flex space-x-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  {editingTrajet ? 'Modifier' : 'Créer'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des trajets */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trajet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date/Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durée
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Train
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trajets.map((trajet) => (
                <tr key={trajet.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {trajet.ville_depart} → {trajet.ville_arrivee}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(trajet.date_depart).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {trajet.heure_depart.substring(0, 5)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {Math.floor(trajet.duree / 60)}h{trajet.duree % 60}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {trajet.prix_formatted}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{trajet.nom_train}</div>
                    <div className="text-sm text-gray-500">{trajet.numero_train}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(trajet)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(trajet.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTrajets;