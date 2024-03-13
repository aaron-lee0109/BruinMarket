import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../authentication/Config';
import { setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword, deleteUser, sendEmailVerification, updateProfile } from 'firebase/auth';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try{
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Check if email domain is a UCLA domain
            if (!(userCredential.user.email.endsWith("@ucla.edu") || 
                  userCredential.user.email.endsWith("@g.ucla.edu"))) {
                alert("Invalid email! Please use a UCLA email.");
                deleteUser(auth.currentUser);
                return;
            }
            await sendEmailVerification(auth.currentUser);
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
            alert("Account sucessfully created! Please verify email before signing in.");
            navigate("/login");
        }
        catch (error){
            switch(error.code) {
                case "auth/email-already-exists":
                case "auth/email-already-in-use":
                    setError("Email already in use");
                    break;
                case "auth/weak-password":
                    setError("Password should be at least 6 characters.");
                    break;
                case "auth/invalid-email":
                    setError("Invalid email. Please use a UCLA email.");
                    break;
                default:
                    setError(error.message);
            }
        }
    };

    return (
        <div class="registerpage">
            <nav class="nav">
                <a href="/" class="name">
                    <img src="img/logo.png" class="logo" />
                </a>
            </nav>
            <h2 class="header2">Register</h2>
            <form onSubmit={handleRegister} className="form">
                <div>
                    <label>Email:</label>
                    <input type="email" placeholder="Enter your UCLA email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>    
                    <label>Name:</label>
                    <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                    <label>Bio:</label>
                    <input value={bio} placeholder="Tell us about yourself (optional)" onChange={(e) => setBio(e.target.value)} />
                </div>
                <div>
                    {error && <div>{error}</div>}  
                </div>
                <div>
                    <button type="submit">Register</button>
                </div>
            </form>

            <p class="register">Already have an account? <Link to="/login"><a>Login</a></Link></p>
        </div>
    );
};

export default Register;
