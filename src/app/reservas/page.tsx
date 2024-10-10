"use client";
import { useRouter } from "next/navigation";

const Home_reservas = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center rounded-xl justify-center bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-6">Bienvenido</h1>
      <h2 className="text-2xl font-semibold mb-6">¿Qué deseas hacer?</h2>

      <div className="flex flex-col space-y-4 w-full max-w-md">
        <button
          onClick={() => router.push("/reservar")}
          className="text-xl w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-md transition-all"
        >
          Reservar
        </button>
        <button
          onClick={() => router.push("/reservas")}
          className="w-full text-xl bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-lg shadow-md transition-all"
        >
          Mi Reserva
        </button>
        <button
          onClick={() => router.push("/reservas")}
          className="w-full text-xl bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg shadow-md transition-all"
        >
          Solicitar Asistencia
        </button>
      </div>
    </div>
  );
}

export default Home_reservas;