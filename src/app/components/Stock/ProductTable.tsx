import React, { useState, useRef, useEffect } from 'react';
import { IconButton } from '@mui/material';
import { FaCheck, FaFire } from 'react-icons/fa';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  qr: string | null;
  activo: boolean;
  hot: boolean;
}

interface ProductTableProps {
  products: Product[];
  onProductDeleted: (productId: number) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onProductDeleted }) => {
  const [showScrollIcon, setShowScrollIcon] = useState(true);
  const tableRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (tableRef.current) {
      const { scrollLeft } = tableRef.current;
      setShowScrollIcon(scrollLeft === 0);
    }
  };

  useEffect(() => {
    const table = tableRef.current;
    if (table) {
      table.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (table) {
        table.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="bg-gray-700 shadow-md rounded-lg p-6 overflow-x-auto relative" ref={tableRef}>
      <table className="min-w-full divide-y divide-gray-600 table-auto">
        <thead className="bg-gray-800">
          <tr className='rounded-lg'>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Producto</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">QR</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Precio</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Acciones</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Estado</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Hot</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-600 text-gray-200">
          {products.map((product) => (
            <tr key={product.id} className={!product.activo ? 'opacity-50' : ''}>
              <td className="px-6 py-4 whitespace-nowrap">{product.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {product.qr ? (
                  <img src={product.qr} alt="QR Code" className="w-12 h-12 object-contain" />
                ) : (
                  'Sin QR'
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">${product.price}</td>
              <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
              <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                <IconButton aria-label="Ver producto" color="primary" title="Ver producto">
                  <VisibilityIcon />
                </IconButton>
                <IconButton aria-label="Editar producto" color="warning" title="Editar producto">
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label={product.activo ? 'Desactivar producto' : 'Activar producto'}
                  color={product.activo ? 'error' : 'primary'}
                  title={product.activo ? 'Desactivar producto' : 'Activar producto'}
                >
                  {product.activo ? <DeleteIcon /> : <FaCheck />}
                </IconButton>
                <IconButton aria-label="Descargar QR" color="success" title="Descargar QR">
                  <DownloadIcon />
                </IconButton>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {product.activo ? (
                  <span className="inline-block px-3 py-1 text-sm font-semibold text-green-500 border border-green-500 rounded-full">
                    Activo
                  </span>
                ) : (
                  <span className="inline-block px-3 py-1 text-sm font-semibold text-red-500 border border-red-500 rounded-full">
                    Inactivo
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{product.hot && <FaFire className="text-red-500" />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
