"use client";

import React, { useState } from 'react';

type View = 'landing' | 'summary' | 'assignments' | 'chat' | 'attendance' | 'report' | 'profile-settings' | 'app-settings' | 'site-options';

interface HeaderProps {
    currentView: View;
    setCurrentView: (view: View) => void;
    onLogout: () => void;
}

export default function Header({ currentView, setCurrentView, onLogout }: HeaderProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const toggleProfile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsProfileOpen(!isProfileOpen);
    };

    // Close on outside click is handled better in a global click listener or just simpler here for now
    // In a real app we'd use a hook like useOnClickOutside

    React.useEffect(() => {
        const closeDropdown = () => setIsProfileOpen(false);
        if (isProfileOpen) {
            window.addEventListener('click', closeDropdown);
        }
        return () => window.removeEventListener('click', closeDropdown);
    }, [isProfileOpen]);

    return (
        <header id="main-header">
            <div className="logo-container">
                <div className="logo-circle">
                    <div className="logo-inner"></div>
                </div>
                <span className="logo-text">SiteSync</span>
            </div>
            <div className="top-nav">
                <div className="header-actions-box">
                    <button
                        id="home-btn"
                        className={`nav-pill ${currentView === 'landing' ? 'active' : ''}`}
                        onClick={() => setCurrentView('landing')}
                    >
                        Home <div className="nav-indicator"></div>
                    </button>

                    <div className="actions-divider"></div>

                    <div className="profile-menu-container">
                        <div className="profile-icon" id="profile-trigger" onClick={toggleProfile}>
                            <img src="https://ui-avatars.com/api/?name=Owner&background=d35400&color=fff" alt="Profile" />
                        </div>
                        <div className={`dropdown-menu ${isProfileOpen ? 'show' : ''}`} id="profile-dropdown">
                            <div className="menu-header">
                                <span className="menu-user-name">Owner Profile</span>
                                <span className="menu-user-role">Administrator</span>
                            </div>
                            <ul className="menu-list">
                                <li className="menu-item" onClick={() => { setCurrentView('profile-settings'); setIsProfileOpen(false); }}><i className="fa-solid fa-user-gear"></i> Profile Settings</li>
                                <li className="menu-item" onClick={() => { setCurrentView('app-settings'); setIsProfileOpen(false); }}><i className="fa-solid fa-sliders"></i> App Settings</li>
                                <li className="menu-item" onClick={() => { setCurrentView('site-options'); setIsProfileOpen(false); }}><i className="fa-solid fa-sitemap"></i> Site Options</li>
                                <div className="menu-divider"></div>
                                <li className="menu-item text-danger" onClick={() => { onLogout(); setIsProfileOpen(false); }}><i className="fa-solid fa-right-from-bracket"></i> Logout</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
