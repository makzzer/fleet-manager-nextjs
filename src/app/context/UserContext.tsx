// src/context/UserContext.tsx
"use client";

import axios from "axios";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// API para autenticación de usuarios
const apiUsuarios = "https://fleet-manager-vrxj.onrender.com/api/users";

interface NewUserRequest {
  username: string;
  fullName: string;
  password: string;
  role: string;
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

interface UserContextProps {
  users: User[];
  fetchUsers: () => void;
  createUser: (usuario: NewUserRequest) => void;
  setRoles: (id: string, role: string) => void;
  setPassword: (id: string, password: string) => void;
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

  const createUser = async (usuario: NewUserRequest) => {
    try {
      await axios.post(apiUsuarios, usuario);
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const setRoles = async (id: string, role: string) => {
    try {
      await axios.put(`${apiUsuarios}/${id}/roles`, { role });
      fetchUsers();
    } catch (error) {
      console.error("Error assigning role:", error);
    }
  };

  const setPassword = async (id: string, password: string) => {
    try {
      await axios.put(`${apiUsuarios}/${id}/passwords`, {password})
    } catch (error) {
      console.error("Error assigning new password: ", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UserContext.Provider value={{ users, fetchUsers, createUser, setRoles, setPassword }}>
      {children}
    </UserContext.Provider>
  );
};