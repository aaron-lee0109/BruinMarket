import React, { createContext, useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged } from '@firebase/auth'

export const Context = createContext();

export function AuthContext({children}) {
    const auth = getAuth();
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribe;
        // Check if a user is currently signed in
        unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setLoading(false);
            if (currentUser) {
                setUser(currentUser);
            }
            else {
                setUser(null);
            }
        });
        // Return unsubscribe function to prevent infinite rendering loop
        return () => {
            if(unsubscribe) {
                unsubscribe();
            }
        }
    }, [])
    const values = {
        user: user,
        setUser: setUser
    }

    return <Context.Provider value={values}>
        {!loading &&
            children
        }
    </Context.Provider>
}
