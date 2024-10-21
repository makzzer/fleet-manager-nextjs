import Link from "next/link";
import { FaCar, FaClipboardList, FaTools } from "react-icons/fa"; // Importar íconos de react-icons

const Home_reservas = () => {
  return (
    <div className="flex items-center justify-center rounded-lg bg-gray-900 text-white p-6 min-h-screen">
      <div className="text-center rounded-xl w-full max-w-lg md:max-w-2xl lg:max-w-3xl mt-[-30vh]">
        {/* Ajuste de margen superior negativo */}
        <h1 className="text-4xl font-bold mb-8 text-blue-400">
          Bienvenido
        </h1>
        <h2 className="text-2xl font-semibold mb-10 text-gray-300">
          ¿Qué deseas hacer?
        </h2>

        <div className="flex flex-col space-y-8 w-full">
          {/* Botón de Reservar */}
          <Link
            href="/reservar"
            className="flex items-center justify-center gap-4 text-xl w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-4 rounded-lg shadow-xl transform transition-all duration-300 ease-in-out hover:scale-105"
          >
            <FaCar size={28} /> {/* Ícono de auto para el botón de reservar */}
            Reservar
          </Link>

          {/* Botón de Mis Reservas */}
          <Link
            href="/misreservas"
            className="flex items-center justify-center gap-4 w-full text-xl bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold py-4 rounded-lg shadow-xl transform transition-all duration-300 ease-in-out hover:scale-105"
          >
            <FaClipboardList size={28} /> {/* Ícono de lista para el botón de mis reservas */}
            Mis Reservas
          </Link>

          {/* Botón de Solicitar Asistencia */}
          <Link
            href="/solicitarasistencia"
            className="flex items-center justify-center gap-4 w-full text-xl bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold py-4 rounded-lg shadow-xl transform transition-all duration-300 ease-in-out hover:scale-105"
          >
            <FaTools size={28} /> {/* Ícono de herramientas para el botón de asistencia */}
            Solicitar Asistencia
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home_reservas;
