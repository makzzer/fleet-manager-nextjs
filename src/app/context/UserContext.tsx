'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/router";

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
    authenticateUser: (username: string, password: string) => Promise<AuthResponse>;
    logoutUser: () => void;
}

// Creamos el UserContext
const UserContext = createContext<UserContextProps | undefined>(undefined);

export const useUser = () => {


    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser debe ser usado dentro de UserProvider');
    }
    return context;
};


// Provider para envolver la aplicación
export const UserProvider = ({ children }: { children: ReactNode }) => {


    const [authenticatedUser, setAuthenticatedUser] = useState<User | null>(null);

    // Función para guardar el usuario en localStorage
    const saveUserToLocalStorage = (user: User | null) => {
        if (user) {
            localStorage.setItem('authenticatedUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('authenticatedUser');
        }
    };

    // Recuperar usuario desde localStorage si existe
    useEffect(() => {
        const storedUser = localStorage.getItem('authenticatedUser');
        if (storedUser) {
            setAuthenticatedUser(JSON.parse(storedUser));
        }
    }, []);

    // Función para autenticar al usuario
    const authenticateUser = useCallback(async (username: string, password: string): Promise<AuthResponse> => {
        try {
            const response = await axios.post(apiAuthBackend, { username, password });

            const user = response.data; // Aquí recibes el objeto User si es exitoso
            setAuthenticatedUser(user); // Guardamos el usuario autenticado en el estado
            saveUserToLocalStorage(user); // Guardamos el usuario en localStorage
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
        saveUserToLocalStorage(null); // Eliminamos el usuario de localStorage
    }, []);

    return (
        <UserContext.Provider value={{
            authenticatedUser,
            authenticateUser,
            logoutUser,
        }}>
            {children}
        </UserContext.Provider>
    );
};