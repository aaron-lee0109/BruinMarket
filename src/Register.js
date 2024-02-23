//Register.js

import React, { useState } from 'react';
import { auth} from './Config';
import { createUserWithEmailAndPassword, deleteUser, sendEmailVerification, updateProfile } from '@firebase/auth';
import { storage, db } from "./Config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [error, setError] = useState(null);
    const [url, setUrl] = useState(null);

    const handleRegister = async (e) => {
        e.preventDefault();
        try{
            console.log(profilePicture);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            if (!(userCredential.user.email.endsWith("@ucla.edu") || 
                  userCredential.user.email.endsWith("@g.ucla.edu"))) {
                alert("Invalid email! Please use a UCLA email.");
                deleteUser(auth.currentUser);
                return;
            }
            await sendEmailVerification(auth.currentUser);
            // Upload profile picture to storage
            const imageRef = ref(storage, `profile-image/${profilePicture.name}`);
            uploadBytes(imageRef, profilePicture).then(() => {
                getDownloadURL(imageRef)
                    .then((url => {
                        setUrl(url);
                }));
            });
            console.log(url);
            updateProfile(auth.currentUser, {
                displayName: name,
                photoURL: url,
            });
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
        if(e.target.files[0]) { 
            setProfilePicture(e.target.files[0]);
        }
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
