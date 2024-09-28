"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import UserCard from "../components/Cards/UserCard";
import ProtectedRoute from "../components/Routes/ProtectedRoutes";

interface Permissions {
  module: string;
  operations: string[];
}

interface User {
  id: string;
  username: string;
  full_name: string;
  roles: string[];
  permissions: Permissions[];
  date_created: string;
  date_updated: string;
}

// ¿Todo esto iria en un context nuevo?
const apiUsuarios = "https://fleet-manager-gzui.onrender.com/api/users";

// Usuarios de prueba (generados con IA) si la API falla
const UsersPruebas: User[] = [
  {
    id: "1",
    username: "john_doe",
    full_name: "John Doe",
    roles: ["developer", "operator"],
    permissions: [{ module: "dashboard", operations: ["read"] }],
    date_created: "2023-01-01",
    date_updated: "2023-06-15",
  },
  {
    id: "2",
    username: "jane_smith",
    full_name: "Jane Smith",
    roles: ["admin", "client"],
    permissions: [
      { module: "dashboard", operations: ["read", "write"] },
      { module: "users", operations: ["read", "write", "delete"] },
    ],
    date_created: "2023-02-15",
    date_updated: "2023-06-20",
  },
  {
    id: "3",
    username: "bob_johnson",
    full_name: "Bob Johnson",
    roles: ["supervisor", "manager"],
    permissions: [
      { module: "dashboard", operations: ["read", "write"] },
      { module: "reports", operations: ["read", "create"] },
    ],
    date_created: "2023-03-10",
    date_updated: "2023-06-25",
  },
];

//Colores por rol
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
  const [users, setUsers] = useState<User[]>([]);

  // Función para obtener los usuarios
  const fetchUsers = async () => {
    try {
      const response = await axios.get(apiUsuarios);
      const fetchedUsers = response.data;
      setUsers(fetchedUsers);
    } catch (error) {
      console.log(
        "Error al obtener los usuarios, usando datos de prueba:",
        error
      );
      setUsers(UsersPruebas); // En caso de error, usamos los datos de prueba
    }
  };

  // llama a la función de fetch cuando el componente se renderiza
  useEffect(() => {
    fetchUsers();
  }, []);

  // Alert para ver los permisos de cada usuario
  const handleViewPermisos = (user: User) => {
    Swal.fire({
      title: `Permisos de ${user.full_name}`,
      html: `
        <table class="min-w-full table-auto bg-gray-800 text-left text-gray-300">
          <thead>
            <tr class="border-b border-gray-600">
              <th class="py-2 px-4">Módulo</th>
              <th class="py-2 px-4">Operaciones</th>
            </tr>
          </thead>
          <tbody>
            ${user.permissions
              .map(
                (permiso) => `
              <tr class="border-b border-gray-600">
                <td class="py-2 px-4 font-bold">${permiso.module}</td>
                <td class="py-2 px-4">
                  ${permiso.operations
                    .map(
                      (operacion) => `
                      <span class="block items-center text-sm">
                        ${operacion}
                      </span>
                    `
                    )
                    .join("")}
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      `,
      confirmButtonText: "Cerrar",
      customClass: {
        popup: "bg-gray-900 text-white",
      },
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 p-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-400">Usuarios</h1>

        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full bg-gray-700 shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-gray-200 text-left text-sm uppercase font-semibold border-b border-gray-700">
                <th className="px-6 py-3">Nombre de usuario</th>
                <th className="px-6 py-3">Nombre completo</th>
                <th className="px-6 py-3">Roles</th>
                <th className="px-6 py-3">Creado</th>
                <th className="px-6 py-3">Actualizado</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 text-gray-200">
              {users.map((user) => (
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
                  <td className="px-6 py-4">
                    {user.date_created.slice(0, 10)}
                  </td>
                  <td className="px-6 py-4">
                    {user.date_updated.slice(0, 10)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleViewPermisos(user)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                      Ver permisos
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vista tipo card para pantallas pequeñas */}
        <div className="lg:hidden grid grid-cols-1 gap-4 mt-6">
          {users.map((user) => (
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
