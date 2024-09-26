'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, Children } from "react"
import axios from "axios"
import { error } from "console";

const apiUsersBackend = `https://fleet-manager-gzui.onrender.com/api/users`

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
    //habilito acá el seteo para el user que voy a usar en todos los componentes
    setUsers: (users: User[]) => void;
}

//defino el usuarioContext que me crea el context en relacion a las propiedades definidas en el userContextProps
const UserContext = createContext<UserContextProps | undefined>(undefined)

export const useUser = () => {
    //Creo el context con el hook useContext y le paso el usuarioContext que cree arriba
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUsuario debe ser usado dentro de userProvider');
    }
    return context;
};

//Provider Para envolver la aplicación
export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [users, setUsers] = useState<User[]>([])


    const fetchUsers = useCallback(async () => {
        try {
            const response = await axios.get(apiUsersBackend);

            // Aquí accedemos directamente al array de usuarios
            const fetchedUsersData = response.data;

            if (Array.isArray(fetchedUsersData)) {
                const fetchedUsers: User[] = fetchedUsersData.map((item: User) => ({


                    id: item.id,
                    username: item.username,
                    full_name: item.full_name,
                    roles: item.roles,
                    permissions: item.permissions.map((perm) =>({
                        module: perm.module,
                        operations: perm.operations,
                    })),
                    date_created: item.date_created,
                    date_updated: item.date_updated,
                }));

                setUsers(fetchedUsers);

            } else {
                console.error('Error: La respuesta de la API no es un array válido', fetchedUsersData);
            }
        } catch (error) {
            console.error('Error fetching Users:', error);
        }
    }, []);




    //ejecuto autommm 
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);




    return (
        <UserContext.Provider value={{
            users, setUsers, fetchUsers() {

            },
        }}>
            {children}
        </UserContext.Provider>
    );
};