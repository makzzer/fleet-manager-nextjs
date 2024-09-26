'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"
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
    usuarios: User[];
    fetchUsers: () => void;
}

//defino el usuarioContext que me crea el context en relacion a las propiedades definidas en el userContextProps
const UsuarioContext = createContext<UserContextProps | undefined>(undefined)

export const useUser = () => {
    //Creo el context con el hook useContext y le paso el usuarioContext que cree arriba
    const context = useContext(UsuarioContext)
    if (!context) {
        throw new Error('useUsuario debe ser usado dentro de userProvider');
    }
    return context;
}

