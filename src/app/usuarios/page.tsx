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

interface newUser {
  username: string;
  fullName: string;
  roles: string[];
  password: string;
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

const allRoles = [
  "manager",
  "supervisor",
  "admin",
  "operator",
  "client",
  "developer",
  "customer",
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

  // Función para crear un nuevo usuario
  const createUsers = async (newUsuario: newUser) => {
    try {
      console.log(newUsuario);
    } catch (error) {
      console.log(error);
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

  // Formulario para agregar usuarios
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
          <div class="flex flex-col">
            <label class="block text-sm font-medium text-gray-300 mb-2">Roles</label>
            <div class="space-y-2">
              ${allRoles
                .map(
                  (rol) =>
                    `
                  <label class="flex items-center">
                    <input type="checkbox" name="roles" value="${rol}" class="form-checkbox h-5 w-5 text-blue-500 rounded focus:ring-blue-500 focus:ring-offset-slate-800">
                    <span class="ml-2 text-gray-900">${rol}</span>
                  </label>
                `
                )
                .join("")}
            </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Registrar",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const username = (
          document.getElementById("add-user-userName") as HTMLInputElement
        ).value;
        const name = (
          document.getElementById("add-user-name") as HTMLInputElement
        ).value;
        const lastName = (
          document.getElementById("add-user-lastName") as HTMLInputElement
        ).value;
        const password = (
          document.getElementById("add-user-password") as HTMLInputElement
        ).value;

        //Hace un array con el valor de todos los checkbox que fueron seleccionados
        const roles = Array.from(
          document.querySelectorAll('input[name="roles"]:checked')
        ).map((el) => (el as HTMLInputElement).value);

        if (
          !username ||
          !name ||
          !lastName ||
          !password ||
          roles.length === 0
        ) {
          Swal.showValidationMessage(
            "Por favor, complete todos los campos correctamente."
          );
          return false;
        }

        //Concatena el nombre con el apellido para crear el nombre completo
        const fullName = name.concat(" ", lastName);

        return { username, fullName, password, roles };
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        const { username, fullName, password, roles } = result.value;
        const usuarioNuevo: newUser = { username, fullName, password, roles };

        createUsers(usuarioNuevo);

        Swal.fire({
          title: "Agregado!",
          text: "El usuario ha sido creado con exito.",
          icon: "success",
        });
      }
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl font-bold text-blue-400">Usuarios</h1>
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={() => handleAddUser()}
          >
            Crear usuario
          </button>
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
