//Login.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import signInWithEmailAndPassword from firebase/auth
import { auth } from './Config';
import { Navbar } from './Navbar';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // If login is successful, you can redirect the user to another page or perform any other action
            console.log("User logged in successfully");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <Navbar />
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    <button type="submit">Login</button>
                </div>
            </form>
            {error && <div>{error}</div>}
            <p>Don't have an account?</p>
        </div>
    );
};

export default Login;