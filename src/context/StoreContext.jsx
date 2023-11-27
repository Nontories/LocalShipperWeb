import React, { createContext, useState } from 'react';

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

    const updateStore = (storeData) => {
        setStore(storeData);
    };

    const updateToken= (token) => {
        setToken(token);
    };

    return (
        <UserContext.Provider value={{ store, token, updateStore, updateToken }}>
            {children}
        </UserContext.Provider>
    );
};
