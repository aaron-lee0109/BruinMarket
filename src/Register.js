//Register.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './Config';
import { setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword, deleteUser, sendEmailVerification, updateProfile } from 'firebase/auth';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try{
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            if (!(userCredential.user.email.endsWith("@ucla.edu") || 
                  userCredential.user.email.endsWith("@g.ucla.edu"))) {
                alert("Invalid email! Please use a UCLA email.");
                deleteUser(auth.currentUser);
                return;
            }
            await sendEmailVerification(auth.currentUser);

            // updateProfile wasn't working properly, so fixed it (was using outdated syntax)
            updateProfile(auth.currentUser, {
                displayName: name,
            });
            // Save user profile data to Firestore
            setDoc(doc(db, "profiles", userCredential.user.uid), {
                name,
                email,
                bio,
                uid: userCredential.user.uid
            });
        }
        catch (error){
            setError(error.message);
        }
    };

    return (
        <div>
            <nav class="nav">
                <a href="/" class="name">
                    <img src="img/logo.png" class="logo" />
                </a>
            </nav>
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>    
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label>Bio:</label>
                    <input value={bio} onChange={(e) => setBio(e.target.value)} />
                </div>
                <div>
                    <button type="submit">Register</button>
                </div>
            </form>
            {error && <div>{error}</div>}
        </div>
    );
};

export default Register;
