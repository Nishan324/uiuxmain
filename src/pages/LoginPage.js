import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
// import '../styles/login.css';
// import Navbar1 from "./navbar";

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password);
            // const user = userCredentials.user;
            const user = userCredentials.user;
            navigate('/');
        } catch (error) {
            console.error('Firebase Authentication Error:', error);
            console.log('Error Code:', error.code);
            console.log('Error Message:', error.message);
            setError(getErrorMessage(error));
        }
    };

    const getErrorMessage = (error) => {
        if (error.code === "auth/user-not-found") {
            return "Email not found. Please check your email.";
        } else if (error.message === "auth/wrong-password") {
            return "Incorrect password. Please check your password.";
        } else if (error.code === "auth/too-many-requests") {
            return "Your account has been temporarily disabled due to many failed login attempts.";
        } else {
            return "An error occurred. Please try again.";
        }
    };

    return (
        <>
      
            <div className="login-container">
                <div className="login-left">
                    <div className="login-header">
                        <img src="/path-to-your-logo.png" alt="Furniture Logo" className="logo" />
                        <h1>Hi There!</h1>
                        <p>Welcome to PrestinDecor</p>
                    </div>
                    <form onSubmit={handleSubmit} className="login-form">
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div className="checkbox-container">
                            <input
                                type="checkbox"
                                id="showPassword"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                            />
                            <label htmlFor="showPassword">Show Password</label>
                        </div>
                        {error && <div className="error-box">{error}</div>}
                        <button type="submit" className="loginButton">Log In</button>
                        <div className="forgot-password">
                            <Link to="/forgot-password">Forgot Password?</Link>
                        </div>
                    </form>
                    <div className="login-alternatives">
                        <span>OR</span>
                        <button className="google-login">Log in with Google</button>
                        <button className="facebook-login">Log in with Facebook</button>
                    </div>
                    <div className="signup-link">
                        <p>Don’t have an account? <Link to="/signup">Sign Up</Link></p>
                    </div>
                </div>
                <div className="login-right">
                    <div className="right-content">
                        <h2>Are you searching for furniture items?</h2>
                        <img src="/path-to-your-image.jpg" alt="Furniture" className="right-image" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
