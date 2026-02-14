"use client";

import React, { useState } from 'react';

interface SettingsProps {
    setCurrentView: (view: any) => void;
}

export function ProfileSettings({ setCurrentView }: SettingsProps) {
    const [name, setName] = useState("Owner Profile");
    const [email, setEmail] = useState("admin@sitesync.com");
    const [theme, setTheme] = useState("dark");

    return (
        <section className="settings-view" style={{ padding: '40px', color: 'white' }}>
            <h2 className="section-title" style={{ marginBottom: '30px' }}><i className="fa-solid fa-user-gear"></i> Profile Settings</h2>

            <div className="settings-panel" style={{ background: 'rgba(20,20,20,0.6)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #d35400' }}>
                        <img src="https://ui-avatars.com/api/?name=Owner&background=d35400&color=fff" style={{ width: '100%', height: '100%' }} alt="Profile" />
                    </div>
                    <button className="action-pill">Change Avatar</button>
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>Display Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#ccc' }}>Theme Preference</label>
                    <select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                    >
                        <option value="dark">Dark Mode</option>
                        <option value="light">Light Mode</option>
                        <option value="system">System Default</option>
                    </select>
                </div>

                <button className="action-pill" style={{ marginTop: '10px' }}>Save Changes</button>
            </div>
            <button className="floating-back-btn" onClick={() => setCurrentView('landing')}>
                <i className="fa-solid fa-arrow-left"></i> Back
            </button>
        </section>
    );
}

export function AppSettings({ setCurrentView }: SettingsProps) {
    const [notifications, setNotifications] = useState(true);
    const [dataSync, setDataSync] = useState(true);
    const [locationTracking, setLocationTracking] = useState(true);

    return (
        <section className="settings-view" style={{ padding: '40px', color: 'white' }}>
            <h2 className="section-title" style={{ marginBottom: '30px' }}><i className="fa-solid fa-sliders"></i> App Settings</h2>

            <div className="settings-panel" style={{ background: 'rgba(20,20,20,0.6)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>

                <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                        <div style={{ fontWeight: '600' }}>Push Notifications</div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>Receive alerts for new tasks and messages</div>
                    </div>
                    <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                        <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} style={{ opacity: 0, width: 0, height: 0 }} />
                        <span className="slider" style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: notifications ? '#d35400' : '#ccc', transition: '.4s', borderRadius: '34px' }}></span>
                        <span className="slider-circle" style={{ position: 'absolute', content: '""', height: '20px', width: '20px', left: notifications ? '26px' : '4px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                    </label>
                </div>

                <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                        <div style={{ fontWeight: '600' }}>Background Data Sync</div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>Keep data updated even when app is closed</div>
                    </div>
                    <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                        <input type="checkbox" checked={dataSync} onChange={() => setDataSync(!dataSync)} style={{ opacity: 0, width: 0, height: 0 }} />
                        <span className="slider" style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: dataSync ? '#d35400' : '#ccc', transition: '.4s', borderRadius: '34px' }}></span>
                        <span className="slider-circle" style={{ position: 'absolute', content: '""', height: '20px', width: '20px', left: dataSync ? '26px' : '4px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                    </label>
                </div>

                <div className="setting-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0' }}>
                    <div>
                        <div style={{ fontWeight: '600' }}>Real-time Location</div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>Share your location with team members</div>
                    </div>
                    <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px' }}>
                        <input type="checkbox" checked={locationTracking} onChange={() => setLocationTracking(!locationTracking)} style={{ opacity: 0, width: 0, height: 0 }} />
                        <span className="slider" style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: locationTracking ? '#d35400' : '#ccc', transition: '.4s', borderRadius: '34px' }}></span>
                        <span className="slider-circle" style={{ position: 'absolute', content: '""', height: '20px', width: '20px', left: locationTracking ? '26px' : '4px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                    </label>
                </div>

            </div>
            <button className="floating-back-btn" onClick={() => setCurrentView('landing')}>
                <i className="fa-solid fa-arrow-left"></i> Back
            </button>
        </section>
    );
}

export function SiteOptions({ setCurrentView }: SettingsProps) {
    return (
        <section className="settings-view" style={{ padding: '40px', color: 'white' }}>
            <h2 className="section-title" style={{ marginBottom: '30px' }}><i className="fa-solid fa-sitemap"></i> Site Options</h2>

            <div className="settings-panel" style={{ background: 'rgba(20,20,20,0.6)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ padding: '20px', background: 'rgba(52, 152, 219, 0.1)', borderRadius: '8px', borderLeft: '4px solid #3498db', marginBottom: '20px' }}>
                    <h4 style={{ margin: '0 0 5px 0', color: '#3498db' }}>Current Site: Bhubaneswar_Main</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#ccc' }}>ID: SITE-8829 | Status: Active</p>
                </div>

                <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Site Configuration</h3>

                <div className="option-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <button className="option-card" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px', textAlign: 'left', cursor: 'pointer' }}>
                        <i className="fa-solid fa-layer-group" style={{ fontSize: '24px', color: '#e67e22', marginBottom: '10px' }}></i>
                        <div style={{ fontWeight: '600' }}>Manage Zones</div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>Configure operational zones and boundaries</div>
                    </button>

                    <button className="option-card" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px', textAlign: 'left', cursor: 'pointer' }}>
                        <i className="fa-solid fa-users-gear" style={{ fontSize: '24px', color: '#2ecc71', marginBottom: '10px' }}></i>
                        <div style={{ fontWeight: '600' }}>Team Access</div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>Manage user permissions for this site</div>
                    </button>

                    <button className="option-card" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px', textAlign: 'left', cursor: 'pointer' }}>
                        <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '24px', color: '#e74c3c', marginBottom: '10px' }}></i>
                        <div style={{ fontWeight: '600' }}>Safety Protocols</div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>Update site-specific safety guidelines</div>
                    </button>

                    <button className="option-card" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px', textAlign: 'left', cursor: 'pointer' }}>
                        <i className="fa-solid fa-file-pdf" style={{ fontSize: '24px', color: '#9b59b6', marginBottom: '10px' }}></i>
                        <div style={{ fontWeight: '600' }}>Generate Reports</div>
                        <div style={{ fontSize: '0.8rem', color: '#888' }}>Download site activity logs</div>
                    </button>
                </div>
            </div>
            <button className="floating-back-btn" onClick={() => setCurrentView('landing')}>
                <i className="fa-solid fa-arrow-left"></i> Back
            </button>
        </section>
    );
}
