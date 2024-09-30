"use client";

import { useUser } from "../context/UserContext";
import { useState } from "react";
import Swal from "sweetalert2";
import UserCard from "../components/Cards/UserCard";
import ProtectedRoute from "../components/Routes/ProtectedRoutes";
import { FaEdit, FaTrashAlt, FaEye, FaCheck } from "react-icons/fa";


const rolColors: { [key: string]: string } = {
  MANAGER: "bg-yellow-500",
  SUPERVISOR: "bg-cian-500",
  ADMIN: "bg-green-500",
  OPERATOR: "bg-red-500",
  CLIENT: "bg-gray-500",
  DEVELOPER: "bg-purple-500",
  CUSTOMER: "bg-teal-500",
};

const ListaUsuarios = () => {
  const { users } = useUser(); // Accede al contexto de usuario
  const [searchTerm, setSearchTerm] = useState<string>(""); // Estado para la barra de búsqueda
  const [selectedRole, setSelectedRole] = useState<string>(""); // Estado para el filtro por rol

  // Filtra los usuarios según el término de búsqueda y el rol
  const filteredUsers = users.filter((user) => {
    const matchesSearchTerm =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole ? user.roles.includes(selectedRole) : true;

    return matchesSearchTerm && matchesRole;
  });

  // Alert para ver permisos de un usuario
  const handleViewPermisos = (user: any) => {
    Swal.fire({
      title: `Permisos de ${user.full_name}`,
      html: user.permissions
        .map(
          (perm: any) => `
          <div>
            <strong>${perm.module}:</strong>
            <span>${perm.operations.join(", ")}</span>
          </div>`
        )
        .join(""),
      confirmButtonText: "Cerrar",
      customClass: {
        popup: "bg-gray-900 text-white",
      },
    });
  };

  // Función para agregar usuarios (no cambiado visualmente)
  const handleAddUser = () => {
    Swal.fire({
      title: `Agregar un usuario`,
      html: `
        <div class="flex flex-col space-y-4">
          <div class="flex flex-col">
            <input id="add-user-userName" class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" placeholder="Nombre de usuario">
          </div>
          <div class="flex flex-col">
            <input id="add-user-name" class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" placeholder="Nombre/s">
          </div>
          <div class="flex flex-col">
            <input id="add-user-lastName" class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" placeholder="Apellido">
          </div>
          <div class="flex flex-col">
            <input id="add-user-password" type="password" class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" placeholder="Contraseña">
          </div>
      </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Registrar",
      showLoaderOnConfirm: true,
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold text-blue-400">Usuarios</h1>
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={handleAddUser}
          >
            Crear usuario
          </button>
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6 space-y-4 lg:space-y-0">
          <input
            type="text"
            placeholder="Buscar por nombre o username"
            className="w-full lg:w-1/2 px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Filtro por roles */}
          <select
            className="w-full lg:w-1/4 px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">Todos los roles</option>
            {Object.keys(rolColors).map((rol) => (
              <option key={rol} value={rol}>
                {rol}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full bg-gray-700 shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-gray-200 text-left text-sm uppercase font-semibold border-b border-gray-700">
                <th className="px-6 py-3">Nombre de usuario</th>
                <th className="px-6 py-3">Nombre completo</th>
                <th className="px-6 py-3">Roles</th>
                <th className="px-6 py-3">Creado</th>
                <th className="px-6 py-3">Actualizado</th>
                <th className="px-6 py-3 text-right">Permisos</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 text-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-700">
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4">{user.full_name}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((rol) => (
                        <span
                          key={rol}
                          className={`${rolColors[rol]} text-white text-xs px-2 py-1 rounded-full`}
                        >
                          {rol}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">{user.date_created.slice(0, 10)}</td>
                  <td className="px-6 py-4">{user.date_updated.slice(0, 10)}</td>

                  <td className="px-6 py-4 whitespace-nowrap text-right flex justify-center">
                    <button
                      onClick={() => handleViewPermisos(user)}
                      className="text-green-600 hover:text-green-800 p-2 rounded-full flex justify-center items-center"
                    >
                      <FaEye className="w-5 h-5" />
                    </button>
                  </td>


                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vista tipo card para pantallas pequeñas */}
        <div className="lg:hidden grid grid-cols-1 gap-4 mt-6">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onViewPermisos={handleViewPermisos}
            />
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ListaUsuarios;