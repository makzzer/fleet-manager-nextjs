'use client';

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

interface AuthContextProps {
  authenticatedUser: User | null;
  isLoading: boolean;
  authenticateUser: (username: string, password: string) => Promise<AuthResponse>;
  logoutUser: () => void;
  hasPermission: (requiredPermissions: Permissions[]) => boolean;
  hasRole: (role: string) => boolean; // Añadimos la función para verificar roles
  hasModuleAccess: (module: string) => boolean; //acá añado la funcion para verificar si el usuario tiene el modulo habilitado
}

// Creamos el AuthContext
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
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

      const user = response.data; // Acá recibo el objeto User si es exitoso
      setAuthenticatedUser(user); // Guardamos el usuario autenticado
      localStorage.setItem('authenticatedUser', JSON.stringify(user)); // Guardamos el usuario en localStorage
      return { user }; // Devolvemos el usuario en caso de éxito

    } catch (error) {
      console.error('Error authenticating user:', error);
      return { error: 'Usuario o contraseña incorrectos' };
    }
  }, []);

  // Función para cerrar sesión
  const logoutUser = useCallback(() => {
    setAuthenticatedUser(null);
    localStorage.removeItem('authenticatedUser'); // Remover usuario de localStorage
  }, []);

  // Función para verificar si el usuario tiene TODOS los permisos necesarios
  const hasPermission = (requiredPermissions: Permissions[]): boolean => {
    if (!authenticatedUser) return false;

    return requiredPermissions.every(({ module, operations }) =>
      authenticatedUser.permissions.some(
        (perm) => perm.module === module && operations.every((op) => perm.operations.includes(op))
      )
    );
  };

  // Función para verificar si el usuario tiene un rol específico
  const hasRole = (role: string): boolean => {
    if (!authenticatedUser) return false;
    return authenticatedUser.roles.includes(role.toUpperCase());
  };


  // Función para verificar si el usuario tiene acceso a un módulo específico
  const hasModuleAccess = (module: string): boolean => {
    if (!authenticatedUser) return false;
    return authenticatedUser.permissions.some((perm) => perm.module === module);
  };


  return (
    <AuthContext.Provider value={{
      authenticatedUser,
      isLoading,
      authenticateUser,
      logoutUser,
      hasPermission,
      hasRole,
      hasModuleAccess,
    }}>
      {children}
    </AuthContext.Provider>
  );
};