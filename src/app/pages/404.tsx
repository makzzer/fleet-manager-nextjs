import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800 text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Lo sentimos, no encontramos la página que estás buscando.</p>
      <Link href="/">
        <a className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out">
          Volver al inicio
        </a>
      </Link>
    </div>
  );
};

export default NotFoundPage;
