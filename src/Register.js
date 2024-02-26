//Register.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, storage } from './Config';
import { setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword, deleteUser, sendEmailVerification, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [error, setError] = useState(null);
    const [url, setUrl] = useState(null);
    const [imageError, setImageError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();

    // this is my implementation of storing profile images in the storage. I have not added the part of adding the url of the profile image to the user data in the database
    const imgTypes = ['image/png', 'image/PNG', 'image/jpg', 'image/jpeg']
    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);
        if(file){
            if(file && imgTypes.includes(file.type)){
                setProfilePicture(file);
                setImageError('');
            }
            else {
                setProfilePicture(null);
                setImageError('Please select a valid image file type (jpg or png)')
            }
        }
        else{
            console.log('Please select your file'); // CHANGE LATER 
        }
    };

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
            // updateProfile wasn't working properly, so fixed it (was using outdated syntax)
            updateProfile(auth.currentUser, {
                displayName: name,
                photoURL: url,
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
