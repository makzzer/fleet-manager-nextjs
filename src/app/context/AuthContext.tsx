'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import axios from "axios";

// API para autenticación de usuarios
const apiAuthBackend = `https://fleet-manager-gzui.onrender.com/api/users/auths`;

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

interface AuthResponse {
  user?: User;
  error?: string;
}

interface UserContextProps {
  authenticatedUser: User | null;
  isLoading: boolean; // Añadimos el estado de carga
  authenticateUser: (username: string, password: string) => Promise<AuthResponse>;
  logoutUser: () => void;
}

// Creamos el UserContext
const AuthContext = createContext<UserContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useUser debe ser usado dentro de UserProvider');
  }
  return context;
};

// Provider para envolver la aplicación
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga

  // Cargar usuario desde localStorage cuando la aplicación se monta
  useEffect(() => {
    const storedUser = localStorage.getItem('authenticatedUser');
    if (storedUser) {
      setAuthenticatedUser(JSON.parse(storedUser));
    }
    setIsLoading(false); // Terminamos de cargar
  }, []);

  // Función para autenticar al usuario
  const authenticateUser = useCallback(async (username: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await axios.post(apiAuthBackend, { username, password });
      
      const user = response.data; // Aquí recibes el objeto User si es exitoso
      setAuthenticatedUser(user); // Guardamos el usuario autenticado
      localStorage.setItem('authenticatedUser', JSON.stringify(user)); // Guardar usuario en localStorage
      return { user }; // Devolvemos el usuario en caso de éxito

    } catch (error) {
      // Manejar error (e.g., credenciales incorrectas)
      console.error('Error authenticating user:', error);
      return { error: 'Usuario o contraseña incorrectos' }; // Mensaje de error
    }
  }, []);

  // Función para cerrar sesión
  const logoutUser = useCallback(() => {
    setAuthenticatedUser(null); // Reseteamos el usuario autenticado a null
    localStorage.removeItem('authenticatedUser'); // Remover usuario de localStorage
  }, []);

  return (
    <AuthContext.Provider value={{
      authenticatedUser,
      isLoading, // Pasamos el estado de carga
      authenticateUser,
      logoutUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};