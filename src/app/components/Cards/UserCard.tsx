import React from "react";
import { FaEye } from "react-icons/fa";
import { MdGroupAdd } from "react-icons/md";
import { useAuth } from "@/app/context/AuthContext";

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

// Colores por rol
const rolColors: { [key: string]: string } = {
  MANAGER: "bg-yellow-500",
  SUPERVISOR: "bg-cyan-500",
  ADMIN: "bg-green-500",
  OPERATOR: "bg-red-500",
  CUSTOMER: "bg-teal-500",
  DEVELOPER: "bg-purple-500",
  CLIENT: "bg-blue-500",
};

interface UserCardProps {
  user: User;
  onViewPermisos: (user: User) => void;
  onSetRoles: (user: User) => void;
}



//Recibe la función para ver los permisos desde el componente padre
const UserCard: React.FC<UserCardProps> = ({
  user,
  onViewPermisos,
  onSetRoles,

}) => {
  const { hasRole } = useAuth()


  return (

    <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-xl font-semibold text-white mb-2">{user.full_name}</h3>
      <p className="text-slate-300 mb-2">@{user.username}</p>
      <div className="flex flex-wrap gap-1 mb-2">
        {user.roles.map((rol) => (
          <span
            key={rol}
            className={`${rolColors[rol]} text-white text-xs px-2 py-1 rounded-full`}
          >
            {rol}
          </span>
        ))}
      </div>
      <p className="text-slate-300 text-sm mb-1">
        Creado: {user.date_created.slice(0, 10)}
      </p>
      <p className="text-slate-300 text-sm mb-3">
        Actualizado: {user.date_updated.slice(0, 10)}
      </p>

      <button
        onClick={() => onViewPermisos(user)}
        className="text-green-600 hover:text-green-800 p-1 text-center"
      >
        <FaEye className="w-5 h-5" />
      </button>


      {/* Mostrar este botón solo si el usuario autenticado es SUPERVISOR */}
      {hasRole("SUPERVISOR") && (
        <button
          onClick={() => onSetRoles(user)}
          className="text-yellow-600 hover:text-yellow-800 p-1 text-center"
        >
          <MdGroupAdd className="w-5 h-5" />
        </button>
      )}


    </div>
  );
}

export default UserCard;
