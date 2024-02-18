//Register.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from './Config';
import { createUserWithEmailAndPassword, deleteUser, sendEmailVerification } from '@firebase/auth';


const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try{
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            if (!userCredential.user.email.endsWith("@ucla.edu")) {
                alert("Invalid email! Please use a UCLA email.");
                deleteUser(auth.currentUser);
                return;
            }
            await sendEmailVerification(auth.currentUser);
            await userCredential.user.updateProfile({
                displayName: name,
            })
            await db.collection('profiles').doc(userCredential.user.uid).set({
                name,
                bio,
            });
            
        }
        catch (error){
            setError(error.message);
        }
    };

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);
    };

    return (
        <div>
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
                    <label>Profile Picture:</label>
                    <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
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
