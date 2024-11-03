import React, { useState, useRef, useEffect } from "react";
import { IconButton } from "@mui/material";
//import { FaCheck, FaFire } from "react-icons/fa";
//import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
//import Image from "next/image";
import { useRouter } from "next/navigation";
import QRCode from "react-qr-code"; // Importamos el componente QRCode

interface Producto {
  id: string;
  name: string;
  brand: string;
  description: string;
  category: string;
  quantity: number;
  measurement: string;
  price: number;
  preference_provider_id: string;
  min_stock: number;
}

interface ProductTableProps {
  products: Producto[];
  measurementUnits: { [key: string]: string };
}

const ProductTable: React.FC<ProductTableProps> = ({ products, measurementUnits }) => {
  const [showScrollIcon, setShowScrollIcon] = useState(true);
  const tableRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleScroll = () => {
    if (tableRef.current) {
      const { scrollLeft } = tableRef.current;
      setShowScrollIcon(scrollLeft === 0);
    }
  };

  const handleView = (id: string) => {
    router.push(`/productos/${id}`);
  };

  const handleInter = (id: string) => {
    router.push(`/inter_p/${id}`);
  };

  useEffect(() => {
    const table = tableRef.current;
    if (table) {
      table.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (table) {
        table.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div
      className="bg-gray-800 shadow-md rounded-lg p-6 overflow-x-auto relative"
      ref={tableRef}
    >
      <table className="min-w-full divide-y divide-gray-600 table-auto">
        <thead className="bg-gray-800">
          <tr className="rounded-lg">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
              Producto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
              Marca
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
              Categoria
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-200 uppercase tracking-wider">
              Cantidad
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-200 uppercase tracking-wider">
              Unidad de medida
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-200 uppercase tracking-wider">
              Precio
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-200 uppercase tracking-wider">
              Acciones
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
              QR
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-600 text-gray-200">
          {products.map((product) => {
            // Usamos una ruta relativa en el QR para evitar problemas con diferentes dominios
            // const qrValue = `/productos/${product.id}/page`;
            const qrValue = `${window.location.origin}/inter_p/${product.id}`;
            return (

              <tr key={product.id} className={""}>
                <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.brand}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">{product.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {measurementUnits[product.measurement] || product.measurement}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-center">{product.price}</td>
                <td className="px-6 py-4 whitespace-nowrap flex space-x-2 justify-end">
                  <IconButton
                    aria-label="Ver producto"
                    color="primary"
                    title="Ver producto"
                    onClick={() => handleInter(product.id)}
                    // onClick={() => handleView(product.id)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    aria-label="Descargar QR"
                    color="success"
                    title="Descargar QR"
                  >
                    <DownloadIcon />
                  </IconButton>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center"> <QRCode value={qrValue} size={64} bgColor="#1a202c" fgColor="#ffffff" /></td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {/* Flecha con bounce solo en responsive */}
      {showScrollIcon && (
        <div className="absolute bottom-0 right-0 p-2 text-gray-500 md:hidden">
          <svg
            className="w-6 h-6 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            ></path>
          </svg>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
