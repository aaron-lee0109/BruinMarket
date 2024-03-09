import React, { useState } from 'react'
import { auth } from '../authentication/Config';
import { sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const resendVerification = async (e) => {
        e.preventDefault();
        try{
            await signInWithEmailAndPassword(auth, email, password);
            sendEmailVerification(auth.currentUser)
                .then(() => {
                    alert("Email sent! Verify email with link.");
                    auth.signOut();
                    navigate("/login");
                })
        }
        catch (error){
            const errorCode = error.code;
            const errorMessage = error.message;
        }
    }

    return (
        <div>
            <nav class="nav">
                <a href="/" class="name">
                    <img src="img/logo.png" class="logo" />
                </a>
            </nav>
            <h2 class="header2">Resend Verification Link</h2>
            <p class="whitetext">Verification link expired? Enter your UCLA email and password, and we'll send you a new link to verify your email</p>
            <form onSubmit={resendVerification} className="form">
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div>
                    <button type="submit">Resend verification link</button>
                </div>
            </form>
            <p className="register"><Link to="/login">Back to login</Link></p>
        </div>
    );
};

export default ForgotPassword;
