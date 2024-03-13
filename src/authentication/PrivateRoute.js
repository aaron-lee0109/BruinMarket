import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { Context } from './AuthContext';

export default function PrivateRoute({ children }) {
    const { user } = useContext(Context);

    // If user is not signed in, bring them back to login page
    if(!user) {
        return <Navigate to = "/login" replace/>
    }
    else {
        return children;
    }
}
