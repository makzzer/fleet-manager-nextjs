// src/context/UserContext.tsx
"use client";

import axios from "axios";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// API para autenticación de usuarios
const apiUsuarios = "https://fleet-manager-gzui.onrender.com/api/users";

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

interface UserContextProps {
  users: User[];
  fetchUsers: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

// Hook para usar el contexto en cualquier componente
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe ser usado dentro de un UserProvider");
  }
  return context;
};

// Provider que envuelve a la aplicación o a las partes necesarias
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);

  // Función para obtener los usuarios
  const fetchUsers = async () => {
    try {
      const response = await axios.get(apiUsuarios);
      const fetchedUsers = response.data;
      setUsers(fetchedUsers);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      // Usa datos de prueba si hay un error (opcional)
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UserContext.Provider value={{ users, fetchUsers }}>
      {children}
    </UserContext.Provider>
  );
};