"use client";

import { useUser } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import UserCard from "../components/Cards/UserCard";
import ProtectedRoute from "../components/Routes/ProtectedRoutes";
import { FaEye } from "react-icons/fa";
import { MdGroupAdd } from "react-icons/md";
import LockResetIcon from '@mui/icons-material/LockReset';
import ReactDOM from "react-dom/client";
import AutocompleteSearchBox from "../components/AutocompleteSearchBox";
import { useEnterprise } from "../context/EnterpriseContext";

interface NewUserRequest {
  username: string;
  fullName: string;
  password: string;
  role: string;
  enterprise_id: string | null;
}

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

const allRoles = [
  "Manager",
  "Supervisor",
  "Admin",
  "Operator",
  "Customer",
  "Developer",
];

const rolColors: { [key: string]: string } = {
  MANAGER: "bg-yellow-500",
  SUPERVISOR: "bg-cyan-500",
  ADMIN: "bg-green-500",
  OPERATOR: "bg-red-500",
  CUSTOMER: "bg-teal-500",
  DEVELOPER: "bg-purple-500",
  CLIENT: "bg-blue-500",
};

const ListaUsuarios = () => {
  const { users, fetchUsers, createUser, setRoles, setPassword } = useUser(); // Accede al contexto de usuario
  const { hasRole, hasPermission } = useAuth()
  const [searchTerm, setSearchTerm] = useState<string>(""); // Estado para la barra de búsqueda
  const [selectedRole, setSelectedRole] = useState<string>(""); // Estado para el filtro por rol
  const { enterprises } = useEnterprise();

  useEffect(() => {
    fetchUsers();
  }, [])

  // Filtra los usuarios según el término de búsqueda y el rol
  const filteredUsers = users.filter((user) => {
    const matchesSearchTerm =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole ? user.roles.includes(selectedRole) : true;

    return matchesSearchTerm && matchesRole;
  });

  // Alert para ver permisos de un usuario
  const handleViewPermisos = (user: User) => {
    Swal.fire({
      title: `Permisos de ${user.full_name}`,
      html: user.permissions
        .map(
          (perm: Permissions) => `
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
    let localSelectedEnterpriseId: string | null = null; 
    Swal.fire({
      title: `Agregar un usuario`,
      html: `
      <div class="flex flex-col space-y-4">
          <div id="enterprise-select-container"></div>
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
      didOpen: () => {
        const enterpriseContainer = document.getElementById('enterprise-select-container');
       
        if (hasRole('ADMIN') && enterpriseContainer) {
          ReactDOM.createRoot(enterpriseContainer).render(
            <AutocompleteSearchBox
              options={enterprises.map(enterprise => ({ id: enterprise.id, nombre: enterprise.name }))}
              onSelection={(opcion) => {
                localSelectedEnterpriseId = opcion ? opcion.id : null;
              }}
              placeholder="Seleccionar empresa"
            />
          );
        }
      },
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Registrar",
      focusConfirm: false,
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

        if (!username || !name || !lastName || !password) {
          Swal.showValidationMessage("Completa todos los campos");
          return null;
        }

        if (
          users.some(
            (user) => user.username.toUpperCase() === username.toUpperCase()
          )
        ) {
          Swal.showValidationMessage("El nombre de usuario ya está en uso");
          return null;
        }

        //Validación para verificar que el nombre de usuario
        if (!/^[a-zA-Z0-9]{3,15}$/.test(username)) {
          Swal.showValidationMessage(
            "El nombre de usuario debe ser alfanumérico y tener entre 3 y 15 caracteres"
          );
          return null;
        }

        const full_name = name.concat(" ", lastName);

        //Validación para verificar que el nombre completo no tenga numeros ni caracteres especiales (solo espacios)
        if (!/^[a-zA-Z\s]+$/.test(full_name)) {
          Swal.showValidationMessage(
            "El nombre completo solo debe contener letras"
          );
          return null;
        }
        return { username, full_name, password, enterprise_id: localSelectedEnterpriseId };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const nuevoUsuario: NewUserRequest = {
          ...result.value,
          role: "",
        };

        createUser(nuevoUsuario);

        Swal.fire({
          title: "Usuario creado con éxito",
          text: "El nuevo Usuario ha sido creado y registrado correctamente.",
          icon: "success",
        });
      }
    });
  };

  const handleSetUser = (user: User) => {
    Swal.fire({
      title: `Agregar roles para
       ${user.full_name}`,
      html: `
        <div class="flex flex-col space-y-4">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-300 mb-2">Roles</label>
            <div class="space-y-2">
            ${allRoles
          .map(
            (rol) => `
                  <label class="flex items-center">
                    <input 
                      type="radio" 
                      name="roles" 
                      value="${rol}" 
                      class="form-radio h-5 w-5 text-blue-500 rounded focus:ring-blue-500 focus:ring-offset-slate-800"
                      ${user.roles.includes(rol.toUpperCase()) ? "disabled" : ""
              }
                    >
                    <span class="ml-2 text-gray-900">${rol}</span>
                  </label>
                `
          )
          .join("")}
          </div>
          </div>
      </div>
      `,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Guardar",
      focusConfirm: false,
      preConfirm: () => {
        const rolSeleccionado = (
          document.querySelector(
            'input[name="roles"]:checked'
          ) as HTMLInputElement
        ).value;

        if (!rolSeleccionado) {
          Swal.showValidationMessage("Debe seleccionar un rol.");
          return false;
        }

        const role = rolSeleccionado.toUpperCase();

        return { role };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const role: string = result.value.role;
        setRoles(user.id, role);

        Swal.fire({
          title: "Roles asignados con éxito",
          text: "Los nuevos roles han sidos asignados correctamente.",
          icon: "success",
        });
      }
    });
  };

  const handleSetPassword = (user: User) => {
    Swal.fire({
      title: `Cambiar contraseña para ${user.full_name}`,
      html: `
        <div class="flex flex-col space-y-4">
          <div class="flex flex-col">
            <input id="new-password" type="password" class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" placeholder="Nueva contraseña">
          </div>
          <div class="flex flex-col">
            <input id="confirm-password" type="password" class="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900" placeholder="Confirmar contraseña">
          </div>
        </div>
      `,
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Guardar",
      focusConfirm: false,
      preConfirm: () => {
        const newPassword = (
          document.getElementById("new-password") as HTMLInputElement
        ).value;
        const confirmPassword = (
          document.getElementById("confirm-password") as HTMLInputElement
        ).value;

        if (!newPassword || !confirmPassword) {
          Swal.showValidationMessage("Ambos campos son obligatorios");
          return false;
        }

        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage("Las contraseñas no coinciden");
          return false;
        }

        return { newPassword };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const newPassword = result.value.newPassword;
        setPassword(user.id, newPassword); // Llamada a la función que maneja la actualización de la contraseña

        Swal.fire({
          title: "Contraseña actualizada",
          text: "La contraseña ha sido cambiada exitosamente.",
          icon: "success",
        });
      }
    });
  };

  return (
    <ProtectedRoute requiredModule="USERS">
      <div className="min-h-screen bg-gray-900 rounded-xl p-8">
        <div className="flex justify-between mb-6">
          <h1 className="md:text-4xl text-3xl font-bold text-blue-400 mb-4 sm:mb-0">Gestión de Usuarios</h1>


          {hasPermission([{module: 'USERS', operations: ['POST']}]) && (
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              onClick={handleAddUser}
            >
              Crear usuario
            </button>
          )}
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
                  <td className="px-6 py-4">
                    {user.date_created.slice(0, 10)}
                  </td>
                  <td className="px-6 py-4">
                    {user.date_updated.slice(0, 10)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right flex justify-center">
                    <button
                      onClick={() => handleViewPermisos(user)}
                      className="text-green-600 hover:text-green-800 p-2 rounded-full flex justify-center items-center"
                    >
                      <FaEye className="w-5 h-5" />
                    </button>

                    {/* Mostrar este botón solo si el usuario autenticado es SUPERVISOR */}
                    {hasRole("SUPERVISOR") && (
                      <>
                        <button
                          onClick={() => handleSetUser(user)}
                          className="text-yellow-600 hover:text-yellow-800 p-2 rounded-full flex justify-center items-center"
                        >
                          <MdGroupAdd className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleSetPassword(user)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full flex justify-center items-center"
                        >
                          <LockResetIcon className="w-5 h-5"/>
                          {/* <span className="text-sm font-medium">Cambiar Contraseña</span> */}
                        </button>
                      </>
                    )}
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
              onSetRoles={handleSetUser}
            />
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ListaUsuarios;