import Link from 'next/link'

export default function NotFound() {
  return (
    <div className=" flex flex-col  items-center justify-center rounded-xl p-6 bg-gray-900  text-white  min-h-[70vh]">


      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Lo sentimos, no encontramos la página que estás buscando.</p>
      <Link href="/"
        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out">
        Volver al inicio
      </Link>
    </div>
  );
}