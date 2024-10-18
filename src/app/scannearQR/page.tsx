import React from 'react';
import QrScanner from '../components/QrScanner';
import Link from 'next/link';

const ScanPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 mt-4">Escanea tu código QR</h1>
      <div className="flex flex-col items-center justify-center ">
        <div className="flex items-center justify-center w-full max-w-md ">
          <div className='pb-[400px]'>
            <QrScanner />
          </div>


        </div>
        <div className="flex flex-col items-center text-center gap-1 justify-around">

          <Link
            href="/dashboard"
            className="bg-red-500 w-[280px] hover:bg-red-700  mb-60 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          >
            Volver
          </Link>
        </div>


      </div>


    </div>
  );
};

export default ScanPage;