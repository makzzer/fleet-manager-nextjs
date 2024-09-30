// src/components/ListaUsuarios.tsx
"use client";

import { useUser } from "../context/UserContext";
import { useState } from "react";
import Swal from "sweetalert2";
import UserCard from "../components/Cards/UserCard";
import ProtectedRoute from "../components/Routes/ProtectedRoutes";

const rolColors: { [key: string]: string } = {
  MANAGER: "bg-yellow-500",
  SUPERVISOR: "bg-purple-500",
  ADMIN: "bg-green-500",
  OPERATOR: "bg-red-500",
  CLIENT: "bg-blue-500",
  DEVELOPER: "bg-gray-500",
  CUSTOMER: "bg-teal-500",
};

const ListaUsuarios = () => {
  const { users, fetchUsers } = useUser(); // Accede al contexto de usuario
  const [searchTerm, setSearchTerm] = useState<string>(""); // Estado para la barra de búsqueda
  const [selectedRole, setSelectedRole] = useState<string>(""); // Estado para el filtro por rol

  /* Filtra los usuarios según el término de búsqueda y el rol */
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
      html: user.permissions.map((perm: any) => `
        <div>
          <strong>${perm.module}:</strong>
          <span>${perm.operations.join(", ")}</span>
        </div>`).join(""),
      confirmButtonText: "Cerrar",
      customClass: {
        popup: "bg-gray-900 text-white",
      },
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold text-blue-400">Usuarios</h1>
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre o username"
          className="w-full lg:w-1/2 px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Tabla de usuarios */}
        <div className="hidden lg:block overflow-x-auto mt-6">
          <table className="min-w-full bg-gray-700 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-800 text-gray-200 text-left text-sm uppercase font-semibold border-b border-gray-700">
                <th className="px-6 py-3">Nombre de usuario</th>
                <th className="px-6 py-3">Nombre completo</th>
                <th className="px-6 py-3">Roles</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 text-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-700">
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4">{user.full_name}</td>
                  <td className="px-6 py-4">
                    {user.roles.map((role) => (
                      <span key={role} className={`${rolColors[role]} text-white text-xs px-2 py-1 rounded-full`}>
                        {role}
                      </span>
                    ))}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleViewPermisos(user)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Ver permisos
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ListaUsuarios;