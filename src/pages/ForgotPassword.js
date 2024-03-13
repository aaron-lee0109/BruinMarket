import React, { useState } from 'react'
import { auth } from '../authentication/Config';
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const sendResetEmai = async (e) => {
        e.preventDefault();
        try{
            await sendPasswordResetEmail(auth, email)
                .then(() => {
                    alert("Email sent! Reset password with link.");
                    navigate("/login");
                })
        }
        catch (error){
            switch(error.code) {
                case "auth/invalid-email":
                    setError("Invalid email. Please use a UCLA email.");
                    break;
                default:
                    setError(error.message);
            }
        }
    };

    return (
        <div>
            <nav class="nav">
                <a href="/" class="name">
                    <img src="img/logo.png" class="logo" />
                </a>
            </nav>
            <h2 class="header2">Reset Password</h2>
            <p class="whitetext">Forgot your password? Enter your UCLA Email and we'll send you a link to reset your password!</p>
            <form onSubmit={sendResetEmai} className="form">
                <div>
                    <label>Email:</label>
                    <input type="email" placeholder="Enter your UCLA email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    {error && <div>{error}</div>}
                </div>
                <div>
                    <button type="submit">Send reset link</button>
                </div>
            </form>
            <p class="register"><Link to="/login">Back to login</Link></p>
        </div>
    );
};

export default ForgotPassword;
