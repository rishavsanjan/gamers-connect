"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface User {
    id: string;
    name?: string;
    email: string;
    username:string;
}

interface UserContextType {
    user: User | null;
    isLoggedIn: boolean;
    setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType>({
    user: null,
    isLoggedIn: false,
    setUser: () => { },
});

export const UserProvider = ({ children, initialUser }: any) => {
    const [user, setUser] = useState<User | null>(initialUser);

    const isLoggedIn = !!user;

    return (
        <UserContext.Provider value={{ user, isLoggedIn, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
