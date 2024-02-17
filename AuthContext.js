import React, { createContext, useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged } from '@firebase/auth'

export const AuthContext = createContext();

export function AuthProvider({children}) {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setLoading(false);
            setUser(currentUser);
        });
        return unsubscribe;
    }, [])

    const values = {user}

    return (
        <AuthContext.Provider value={values}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
