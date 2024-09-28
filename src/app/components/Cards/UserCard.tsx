import React from "react";

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
  SUPERVISOR: "bg-purple-500",
  ADMIN: "bg-green-500",
  OPERATOR: "bg-red-500",
  CLIENT: "bg-blue-500",
  DEVELOPER: "bg-gray-500",
  CUSTOMER: "bg-teal-500",
};

interface UserCardProps {
  user: User;
  onViewPermisos: (user: User) => void;
}

//Recibe la función para ver los permisos desde el componente padre
const UserCard: React.FC<UserCardProps> = ({ user, onViewPermisos }) => (
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
      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
    >
      Permisos
    </button>
  </div>
);

export default UserCard;
