import React, { createContext, useEffect, useState } from 'react';
import { getRole } from '../api/auth';

export const UserContext = createContext();

export const StoreProvider = ({ children }) => {
    const [store, setStore] = useState(() => {
        const storedItem = localStorage.getItem("store");
        return storedItem ? JSON.parse(storedItem) : {};
    });

    const [token, setToken] = useState(() => {
        const token = localStorage.getItem("token");
        return token ? JSON.parse(token) : {};
    });

    const [role, setRole] = useState(async () => {
        const response = await getRole(token)
        if (response?.status === 200) {
            return response?.data?.role
        } else {
            return undefined
        }
    });

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const response = await getRole(token);
                if (response?.status === 200) {
                    setRole(response?.data?.role);
                } else {
                    setRole(null);
                }
            } catch (error) {
                console.error('Error fetching role:', error);
                setRole(null);
            }
        };

        fetchRole();
    }, [token]);
    
    const updateStore = (storeData) => {
        setStore(storeData);
    };

    const updateToken = (token) => {
        setToken(token);
    };

    const updateRole = (role) => {
        setRole(role);
    };

    return (
        <UserContext.Provider value={{ store, token, role, updateStore, updateToken, updateRole }}>
            {children}
        </UserContext.Provider>
    );
};
