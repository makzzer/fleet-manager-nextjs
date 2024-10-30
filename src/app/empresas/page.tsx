"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../components/Routes/ProtectedRoutes";
import { useEnterprise } from "../context/EnterpriseContext";
import { FaEye, FaFilter, FaPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import { MdFormatListBulletedAdd } from "react-icons/md";

const Empresas = () => {
  const { enterprises, fetchEnterprises, createEnterprise } = useEnterprise();

  const [filteredEnterprises, setFilteredEnterprises] = useState(enterprises);
  const [quantityVisibleEnterprises, setQuantityVisibleEnterprises] =
    useState(10);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEnterprises = async () => {
      await fetchEnterprises();
      setFilteredEnterprises(enterprises);
    };
    loadEnterprises();
    setLoading(false);
  }, [fetchEnterprises, setFilteredEnterprises, enterprises]);

  const assignColor = (index: number) => {
    const colors = [
      'border-cyan-100 text-cyan-100',
      'border-cyan-200 text-cyan-200',
      'border-cyan-300 text-cyan-300',
      'border-cyan-400 text-cyan-400',
      'border-cyan-500 text-cyan-500',
      'border-teal-100 text-teal-100',
      'border-teal-200 text-teal-200',
      'border-teal-300 text-teal-300',
      'border-teal-400 text-teal-400',
      'border-teal-500 text-teal-500',
      'border-blue-100 text-blue-100',
      'border-blue-200 text-blue-200',
      'border-blue-300 text-blue-300',
      'border-blue-400 text-blue-400',
      'border-blue-500 text-blue-500',
    ];
    return colors[index];
  };

  const visibleEnterprises = filteredEnterprises.slice(
    0,
    quantityVisibleEnterprises
  );

  const handleVerMas = () => {
    setQuantityVisibleEnterprises((prevVisible) => prevVisible + 10);
  };

  const handleAddEnterprise = () => {
    Swal.fire({
      title: "Ingrese el nombre de la empresa",
      html: `
      <div class="flex flex-col md:flex-row justify-center gap-6 w-full max-w-4xl mx-auto">
        <input id="nombre" class="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nombre de empresa">
      </div>
    `,
      customClass: {
        popup: "bg-gray-800 text-white w-full max-w-4xl p-6 rounded-lg",
        title: "text-2xl font-bold mb-4",
      },
      confirmButtonText: "Agregar",
      showCancelButton: true,
      preConfirm: () => {
        const nombreElement = document.getElementById(
          "nombre"
        ) as HTMLSelectElement;

        const nombre = nombreElement?.value;

        if (!nombre) {
          Swal.showValidationMessage(
            "Por favor, completa todos los campos correctamente."
          );
          return null;
        }

        return { nombre };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        createEnterprise(result.value.nombre);

        Swal.fire({
          title: "Empresa agregada con éxito",
          icon: "success",
        });
      }
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedRoute requiredModule="USERS">
      <div className="p-6 bg-gray-900 rounded-xl min-h-screen text-white">
        <div className="flex flex-col sm:flex-row justify-between mb-6">
          <h1 className="md:text-4xl text-3xl font-bold text-blue-400 mb-4 sm:mb-0">
            Gestión de Empresas
          </h1>
        </div>
        <div className="flex flex-col lg:flex-row justify-between mb-6 gap-4 lg:items-center">
          <h2 className="md:text-2xl text-xl font-bold text-gray-300">
            Total de empresas:
            <span className="text-gray-400"> {enterprises.length}</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              placeholder="Buscar..."
              className="bg-gray-600 px-4 py-2 lg:py-1 rounded-full"
            />
            <button className="px-4 rounded-lg bg-gray-600 text-gray-300 py-2 hover:bg-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 flex items-center justify-center">
              <FaFilter className="mr-2" />Filtros
            </button>
            <button
              onClick={() => handleAddEnterprise()}
              className="px-4 rounded-lg bg-blue-500 py-2 hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 flex items-center justify-center"
            >
              <FaPlus className="mr-2" /> Agregar empresa
            </button>
          </div>
        </div>
        <div className="relative overflow-x-auto bg-gray-800 shadow-md rounded-lg p-6">
          <table className="min-w-full divide-y divide-gray-600 table-auto">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                  Empresa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                  Modulos
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-200 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-600 text-gray-200">
              {filteredEnterprises.length > 0 ? (
                visibleEnterprises.map((enterprise, index) => (
                  <tr key={enterprise.id}>
                    <td className={`px-6 py-4 whitespace-nowrap rounded-full`}>
                      {index}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap rounded-full`}>
                      {enterprise.name}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap rounded-full w-1/2`}>
                      <div className="flex flex-wrap gap-1">
                      {enterprise.modules.map((module, index) => (
                        <span 
                        key={`${enterprise.id}-${index}`}
                        className={`text-xs px-3 py-1 rounded-full border-2 ${assignColor(index)} font-semibold shadow-md`}
                        >
                          {module}
                        </span>
                      ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex justify-end space-x-4">
                      <button
                      onClick={() => console.log("handleView(orden.id)")}
                      className="text-sky-600 hover:text-sky-800"
                      >
                        <MdFormatListBulletedAdd className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => console.log("handleView(orden.id)")}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-300">
                    No se encontraron empresas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {quantityVisibleEnterprises < filteredEnterprises.length && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleVerMas}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              >
                Ver más
              </button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Empresas;