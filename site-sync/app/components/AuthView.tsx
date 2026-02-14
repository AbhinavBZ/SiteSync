"use client";

import React, { useState } from 'react';
import '../auth.css'; // Import the CSS we just created

interface AuthViewProps {
    onLogin: () => void;
}

export default function AuthView({ onLogin }: AuthViewProps) {
    const [isRightPanelActive, setIsRightPanelActive] = useState(false);
    const [showSignInPassword, setShowSignInPassword] = useState(false);
    const [showSignUpPassword, setShowSignUpPassword] = useState(false);

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        // Add actual authentication logic here
        // For now, prompt mock success
        onLogin();
    };

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        // Add actual registration logic here
        alert("Registration Successful! Please Login.");
        setIsRightPanelActive(false);
    };

    return (
        <div className="auth-wrapper">
            <div className={`auth-container ${isRightPanelActive ? 'right-panel-active' : ''}`} id="auth-container">

                {/* Sign Up Form */}
                <div className="form-container sign-up-container">
                    <form onSubmit={handleSignUp}>
                        <h1 className="auth-header">Register Employee</h1>
                        <p className="auth-subtitle">Create a new workspace profile</p>

                        <div className="auth-input-group">
                            <input type="text" className="auth-input" placeholder="Full Name" autoComplete="name" required />
                        </div>

                        <div className="auth-input-group">
                            <input type="email" className="auth-input" placeholder="Work Email" autoComplete="username" required />
                        </div>

                        <div className="auth-input-group">
                            <input
                                type={showSignUpPassword ? "text" : "password"}
                                className="auth-input"
                                placeholder="Create Password"
                                autoComplete="new-password"
                                required
                            />
                            <span className="auth-toggle-password" onClick={() => setShowSignUpPassword(!showSignUpPassword)}>
                                {showSignUpPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07-2.3 2.3"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                )}
                            </span>
                        </div>

                        <button className="auth-action-btn">Register ID</button>
                    </form>
                </div>

                {/* Sign In Form */}
                <div className="form-container sign-in-container">
                    <form onSubmit={handleSignIn}>
                        <h1 className="auth-header">Employee Login</h1>
                        <p className="auth-subtitle">Access your dashboard & projects</p>

                        <div className="auth-input-group">
                            <input type="text" className="auth-input" placeholder="Employee ID / Email" autoComplete="username" defaultValue="admin@sitesync.com" required />
                        </div>

                        <div className="auth-input-group">
                            <input
                                type={showSignInPassword ? "text" : "password"}
                                className="auth-input"
                                placeholder="Password"
                                autoComplete="current-password"
                                defaultValue="password"
                                required
                            />
                            <span className="auth-toggle-password" onClick={() => setShowSignInPassword(!showSignInPassword)}>
                                {showSignInPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07-2.3 2.3"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                )}
                            </span>
                        </div>

                        <a href="#" className="auth-forgot-pass">Forgot Password?</a>
                        <button className="auth-action-btn">Access Portal</button>
                    </form>
                </div>

                {/* Overlay Container */}
                <div className="auth-overlay-container">
                    <div className="auth-overlay">
                        <div className="auth-overlay-panel auth-overlay-left">
                            <h1 className="auth-header" style={{ fontSize: '32px' }}>Welcome Back</h1>
                            <p style={{ marginTop: '20px', marginBottom: '30px', opacity: 0.9 }}>Already have an Employee ID? Login to continue your work.</p>
                            <button className="auth-ghost-btn" onClick={() => setIsRightPanelActive(false)}>Return to Login</button>
                        </div>
                        <div className="auth-overlay-panel auth-overlay-right">
                            <h1 className="auth-header" style={{ fontSize: '32px' }}>Join the Team</h1>
                            <p style={{ marginTop: '20px', marginBottom: '30px', opacity: 0.9 }}>New to the organization? Register your details to get started.</p>
                            <button className="auth-ghost-btn" onClick={() => setIsRightPanelActive(true)}>Create Profile</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
