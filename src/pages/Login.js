import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword} from 'firebase/auth'; // Import signInWithEmailAndPassword from firebase/auth
import { auth } from '../authentication/Config';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password).then(authUser => {
                // Check if user's email is verified when they sign in
                if(!authUser.user.emailVerified) { 
                    alert("Please verify email before signing in!");
                    // Sign them out if email isn't verified
                    auth.signOut();
                }
                else {
                    navigate("/");
                }
            })
        } catch (error) {
            switch(error.code) {
                case "auth/invalid-credential":
                    setError("Incorrect email or password.");
                    break;
                case "auth/too-many-requests":
                    setError("Account temporarily disabled due to multiple failed login attempts. Reset your password or try again later.")
                    break;
                default:
                    setError(error.message)
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
            <h2 class="header2">Login</h2>
            <form onSubmit={handleLogin} className="form">
                <div>
                    <label>Email:</label>
                    <input type="email" placeholder="Enter your UCLA email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <p><Link to="/verifyemail">Verification link expired?</Link></p>
                <div>
                    <label>Password:</label>
                    <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <p><Link to="/resetpassword">Forgot password?</Link></p>
                <div>
                    {error && <div>{error}</div>}  
                </div>
                <div>
                    <button type="submit">Login</button>
                </div>
            </form>

            <p class="register">Don't have an account? <Link to="/register">Register</Link></p>
            
        </div>
    );
};

export default Login;