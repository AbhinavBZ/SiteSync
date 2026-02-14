"use client";

import React from 'react';

interface LandingViewProps {
    setCurrentView: (view: any) => void;
}

export default function LandingView({ setCurrentView }: LandingViewProps) {
    return (
        <section id="view-landing" className="view active" style={{ display: 'block', overflowY: 'auto', height: '100%' }}>
            {/* HERO SECTION */}
            <div className="landing-hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        MAP<br />
                        INTEGRATED<br />
                        ATTENDANCE
                    </h1>
                    <p className="hero-subtitle">
                        SiteSync automates attendance for remote teams using smart
                        geofencing, real-time tracking, and anti-cheat logic to eliminate time
                        fraud and optimize efficiency.
                    </p>
                </div>

                <div className="hero-graphic">
                    <img
                        src="/Gemini_Generated_Image_p5g5i7p5g5i7p5g5.png"
                        alt="Smart Site Tracking"
                        className="hero-image"
                    />
                </div>

                {/* Bottom Navigation Bar */}
                <nav className="bottom-nav-bar">
                    <button className="nav-item active" onClick={() => setCurrentView('summary')}>Dashboard</button>
                    <button className="nav-item" onClick={() => setCurrentView('assignments')}>Today's Assignment</button>
                    <button className="nav-item" onClick={() => setCurrentView('attendance')}>Attendance</button>
                    <button className="nav-item" onClick={() => setCurrentView('report')}>Report</button>
                </nav>
            </div>

            {/* ABOUT US SECTION */}
            <div className="landing-about" style={{ marginTop: '190px' }}>
                <div className="about-container">
                    <div className="about-content">
                        <h3 className="section-label">Who We Are</h3>
                        <p className="about-description">
                            SiteSync is a pioneer in geospatial workforce management solutions.
                            We bridge the gap between physical operations and digital tracking,
                            ensuring that your team is exactly where they need to be, when they need to be there.
                        </p>

                        <div className="contact-info">
                            <h4 className="contact-header">Get in Touch</h4>
                            <a href="mailto:contact@sitesync.com" className="contact-item">
                                <i className="fa-solid fa-envelope"></i>
                                <span>contact@sitesync.com</span>
                            </a>
                            <a href="tel:+919608933866" className="contact-item">
                                <i className="fa-solid fa-phone"></i>
                                <span>+919608933866</span>
                            </a>
                            <div className="contact-item">
                                <i className="fa-solid fa-location-dot"></i>
                                <span>ITER, Bhubaneswar 751030<br />Odisha, India</span>
                            </div>
                        </div>
                    </div>

                    <div className="about-visual">
                        <h2 className="big-about-text">ABOUT<br />US</h2>
                    </div>
                </div>
            </div>
        </section>
    );
}
