import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">TrainBooking</h3>
            <p className="text-gray-300">
              Votre partenaire de confiance pour les voyages en train.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/search" className="hover:text-white">Rechercher un train</a></li>
              <li><a href="/my-reservations" className="hover:text-white">Mes réservations</a></li>
              <li><a href="/profile" className="hover:text-white">Mon profil</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Email: contact@trainbooking.com</li>
              <li>Téléphone: +33 1 23 45 67 89</li>
              <li>Support: 24h/24, 7j/7</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Informations</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white">Conditions générales</a></li>
              <li><a href="#" className="hover:text-white">Politique de confidentialité</a></li>
              <li><a href="#" className="hover:text-white">Aide & FAQ</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-300">
          <p>&copy; 2024 TrainBooking. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;