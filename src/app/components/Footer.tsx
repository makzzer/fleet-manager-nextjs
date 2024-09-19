import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-4">
      <div className="container mx-auto text-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} TrackerAPP.</p>
        <p className="text-sm">Todos los derechos reservados.</p>
        <ul className="flex justify-center space-x-4 mt-2">
          <li>
            <a href="#" className="hover:text-gray-400">Privacidad</a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400">Términos</a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400">Contacto</a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
