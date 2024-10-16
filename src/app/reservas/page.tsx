import Link from "next/link";


const Home_reservas = () => {
  return (
    <div className="flex items-center justify-center rounded-lg bg-gray-900 text-white p-6 min-h-screen">
      <div className="text-center rounded-xl w-full max-w-lg md:max-w-2xl lg:max-w-3xl mt-[-30vh]"> {/* Ajuste de margen superior negativo */}
        <h1 className="text-4xl font-bold mb-8 text-blue-400">Bienvenido</h1>
        <h2 className="text-2xl font-semibold mb-10 text-gray-300">¿Qué deseas hacer?</h2>

        <div className="flex flex-col space-y-6 w-full">
          <Link
            href="/reservar"
            className="text-xl w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105"
          >
            Reservar
          </Link>
          <Link
            href="/mireserva"
            className="w-full text-xl bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105"
          >
            Mi Reserva
          </Link>
          <Link
            href="/solicitarasistencia"
            className="w-full text-xl bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105"
          >
            Solicitar Asistencia
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home_reservas;
