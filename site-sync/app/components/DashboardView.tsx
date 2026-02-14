"use client";

import React, { useEffect, useState } from 'react';

interface DashboardViewProps {
    setCurrentView: (view: any) => void;
    addMessage?: (text: string) => void;
}

export default function DashboardView({ setCurrentView, addMessage }: DashboardViewProps) {
    // Mock Data State
    const [onSiteData, setOnSiteData] = useState([
        { name: 'Arun Kumar', time: '8:03 am', location: 'Pokhriput', task: 'IRA meta', status: 'green' },
        { name: 'Saurav Tripathy', time: '8:16 am', location: 'Dum-Duma', task: 'Circuit replacement', status: 'green' },
        { name: 'Amit Sahoo', time: '8:35 am', location: 'Khandagiri', task: 'Tar coil', status: 'red' },
        { name: 'Keshari Prasad', time: '9:02 am', location: 'Patia', task: 'Router link', status: 'green' },
        { name: 'Badal Mahto', time: '9:10 am', location: 'Keonjhar', task: 'Coil seal', status: 'red' }
    ]);

    const [reqData, setReqData] = useState([
        { task: 'IRA meta', count: 3 },
        { task: 'Circuit replacement', count: 1 },
        { task: 'Tar coil', count: 4 },
        { task: 'Router link', count: 11 },
        { task: 'Coil seal', count: 5 }
    ]);

    const [completedData, setCompletedData] = useState([
        { task: 'Site Survey', count: 12 },
        { task: 'Cable Laying', count: 5 }
    ]);

    // Live Time State
    const [timeState, setTimeState] = useState({
        hour: '9',
        minute: '30',
        ampm: 'am'
    });




    // Chat Input State
    const [chatInput, setChatInput] = useState('');

    // Reminder State
    const [reminders, setReminders] = useState([
        { id: 1, title: 'Submit Safety Report', time: 'Due: Today, 5:00 PM', color: '#e74c3c' },
        { id: 2, title: 'Vehicle Maintenance', time: 'Tomorrow, 9:00 AM', color: '#f1c40f' },
        { id: 3, title: 'Team Meeting', time: 'Fri, 4:00 PM', color: '#2ecc71' }
    ]);
    const [isAddingReminder, setIsAddingReminder] = useState(false);
    const [reminderStep, setReminderStep] = useState<'name' | 'time'>('name');
    const [newReminderInput, setNewReminderInput] = useState('');
    const [tempReminderName, setTempReminderName] = useState('');

    const handleAddReminder = (name: string, time: string) => {
        const newReminder = {
            id: Date.now(),
            title: name,
            time: time,
            color: '#3498db' // Default blue for new user added reminders
        };
        setReminders([...reminders, newReminder]);
        setIsAddingReminder(false);
        setReminderStep('name');
        setNewReminderInput('');
    };

    const handleSendMessage = () => {
        if (chatInput.trim() && addMessage) {
            addMessage(chatInput);
            setChatInput('');
            setCurrentView('chat');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const options: Intl.DateTimeFormatOptions = {
                timeZone: 'Asia/Kolkata',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            };
            const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(now);
            const hour = parts.find(p => p.type === 'hour')?.value || '12';
            const minute = parts.find(p => p.type === 'minute')?.value || '00';
            const ampm = parts.find(p => p.type === 'dayPeriod')?.value?.toLowerCase() || 'am';

            setTimeState({ hour, minute, ampm });
        };

        updateTime(); // Initial call
        const timer = setInterval(updateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    // Computed Summaries
    const totalOnSite = onSiteData.length;
    const totalLate = onSiteData.filter(u => u.status === 'red').length;
    const totalOnTime = totalOnSite - totalLate;

    const totalReqItems = reqData.reduce((acc, curr) => acc + curr.count, 0);
    const totalReqTasks = reqData.length;

    const totalCompletedItems = completedData.reduce((acc, curr) => acc + curr.count, 0);
    const totalCompletedTasks = completedData.length;

    return (
        <section id="view-summary" className="view active">
            <div className="dashboard-header">
                <div className="time-display" id="time-display-summary">
                    {timeState.hour}<span className="blink-colon">:</span>{timeState.minute} {timeState.ampm}
                </div>
                <div className="welcome-text">Overview</div>
            </div>

            <div className="summary-grid">
                {/* Attendance Summary Card */}
                <div className="summary-card" id="card-attendance" onClick={() => setCurrentView('attendance')}>
                    <div className="card-icon"><i className="fa-solid fa-users"></i></div>
                    <div className="card-title">Attendance</div>
                    <div className="card-value" id="summary-attendance-count">{totalOnSite}</div>
                    <div className="card-subtext" id="summary-attendance-status">{totalOnTime} On Time, {totalLate} Late</div>
                </div>

                {/* Requirements Summary Card */}
                <div className="summary-card" id="card-requirements" onClick={() => setCurrentView('summary')}>
                    <div className="card-icon"><i className="fa-solid fa-clipboard-list"></i></div>
                    <div className="card-title">Requirements</div>
                    <div className="card-value" id="summary-req-count">{totalReqItems}</div>
                    <div className="card-subtext" id="summary-req-total">{totalReqTasks} Active Tasks</div>
                </div>

                {/* Completed Tasks Summary Card */}
                <div className="summary-card" id="card-completed" onClick={() => setCurrentView('report')}>
                    <div className="card-icon"><i className="fa-solid fa-check-double"></i></div>
                    <div className="card-title">Completed</div>
                    <div className="card-value" id="summary-completed-count">{totalCompletedItems}</div>
                    <div className="card-subtext" id="summary-completed-total">{totalCompletedTasks} Tasks Done</div>
                </div>
            </div>

            {/* Detailed Dashboard Content */}
            <div className="detailed-dashboard-section" id="detailed-dashboard-content">
                <div className="dashboard-header-secondary">
                    <h3 className="section-title">Today's Assignment</h3>
                </div>

                <div className="map-card-container full-width">
                    <div className="map-visual" id="map-visual">
                        <div className="map-bg"></div>
                        <div className="map-pin" style={{ top: '30%', left: '20%' }} title="Arun"><i className="fa-solid fa-map-pin"></i>
                        </div>
                        <div className="map-pin" style={{ top: '50%', left: '60%' }} title="Saurav"><i
                            className="fa-solid fa-map-pin"></i></div>
                        <div className="map-pin" style={{ top: '20%', left: '80%' }} title="Amit"><i className="fa-solid fa-map-pin"></i>
                        </div>
                    </div>
                    <button className="open-map-btn" onClick={() => alert('Full map view would open here.')}>Open Full Map</button>
                </div>

                <div className="lists-container" style={{ marginTop: '30px' }}>

                </div>

                {/* Staff Overview Section - moved out of lists-container to be full width */}
                <div className="staff-overview-section" style={{
                    marginTop: '60px',
                    background: 'rgba(20, 20, 20, 0.6)',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid rgba(142, 112, 101, 0.66)'
                }}>
                    <h3 className="section-title">Staff Overview</h3>
                    <div className="staff-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
                        {onSiteData.map((staff, index) => (
                            <div key={index} className="staff-card" style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                padding: '15px',
                                borderRadius: '12px',
                                border: '1px solid rgba(193, 193, 193, 0.43)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div className="staff-avatar" style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: '#555',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.9rem'
                                    }}>
                                        {staff.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{staff.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{staff.location}</div>
                                    </div>
                                </div>
                                <div style={{
                                    marginTop: '8px',
                                    padding: '6px 10px',
                                    background: 'rgba(0,0,0,0.2)',
                                    borderRadius: '6px',
                                    fontSize: '0.85rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <span>{staff.task}</span>
                                    <span className={`status-dot ${staff.status}`} style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        backgroundColor: staff.status === 'green' ? '#2ecc71' : '#e74c3c'
                                    }}></span>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>
                                    <i className="fa-regular fa-clock" style={{ marginRight: '5px' }}></i>
                                    In at {staff.time}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reminders & Warehouse Section */}
            <div className="dual-section-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', marginTop: '70px', marginLeft: '20px', marginRight: '20px' }}>

                {/* Reminders Section */}
                <div className="reminders-section" style={{
                    background: 'rgba(20, 20, 20, 0.6)',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid rgba(142, 112, 101, 0.66)'
                }}>
                    <div className="dashboard-header-secondary">
                        <h3 className="section-title">Reminders</h3>
                    </div>
                    <div className="reminder-list" style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {reminders.map((reminder) => (
                            <div key={reminder.id} className="reminder-item" style={{
                                background: `rgba(${reminder.color === '#e74c3c' ? '231, 76, 60' : reminder.color === '#f1c40f' ? '241, 196, 15' : '46, 204, 113'}, 0.1)`,
                                borderLeft: `4px solid ${reminder.color}`,
                                padding: '12px',
                                borderRadius: '0 8px 8px 0',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{reminder.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{reminder.time}</div>
                                </div>
                                <i className={`fa-regular ${reminder.color === '#e74c3c' ? 'fa-bell' : 'fa-calendar'}`} style={{ color: reminder.color }}></i>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '15px' }}>
                        {!isAddingReminder ? (
                            <button
                                onClick={() => setIsAddingReminder(true)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px dashed rgba(255,255,255,0.2)',
                                    background: 'transparent',
                                    color: '#aaa',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}>
                                <i className="fa-solid fa-plus"></i> Add Reminder
                            </button>
                        ) : (
                            <div className="add-reminder-form" style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px' }}>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder={reminderStep === 'name' ? "Enter task name..." : "Enter due time..."}
                                    value={newReminderInput}
                                    onChange={(e) => setNewReminderInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            if (reminderStep === 'name') {
                                                if (newReminderInput.trim()) {
                                                    setTempReminderName(newReminderInput);
                                                    setNewReminderInput('');
                                                    setReminderStep('time');
                                                }
                                            } else {
                                                if (newReminderInput.trim()) {
                                                    handleAddReminder(tempReminderName, newReminderInput);
                                                }
                                            }
                                        } else if (e.key === 'Escape') {
                                            setIsAddingReminder(false);
                                            setReminderStep('name');
                                            setNewReminderInput('');
                                        }
                                    }}
                                    style={{
                                        width: '100%',
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'white',
                                        outline: 'none',
                                        fontSize: '0.9rem'
                                    }}
                                />
                                <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '5px', textAlign: 'right' }}>
                                    Press Enter to {reminderStep === 'name' ? 'Next' : 'Add'}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Warehouse Resource Management */}
                <div className="warehouse-section" style={{
                    background: 'rgba(20, 20, 20, 0.6)',
                    padding: '25px',
                    borderRadius: '20px',
                    border: '1px solid rgba(158, 110, 110, 0.85)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                }}>
                    <div className="dashboard-header-secondary" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 className="section-title" style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>Warehouse Inventory</h3>
                        <div style={{ fontSize: '0.8rem', color: '#888', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '20px' }}>Live Update</div>
                    </div>

                    <div className="resource-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div className="resource-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '40px', height: '40px', background: 'rgba(52, 152, 219, 0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3498db', fontSize: '1.1rem' }}>
                                    <i className="fa-solid fa-cable-car"></i>
                                </div>
                                <div>
                                    <div style={{ fontWeight: '600', color: '#eee' }}>Fiber Optic Cable</div>
                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>Stock ID: FC-204</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#3498db' }}>120m</div>
                                <div style={{ fontSize: '0.75rem', color: '#aaa' }}>Available</div>
                            </div>
                        </div>

                        <div className="resource-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '40px', height: '40px', background: 'rgba(231, 76, 60, 0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e74c3c', fontSize: '1.1rem' }}>
                                    <i className="fa-solid fa-plug"></i>
                                </div>
                                <div>
                                    <div style={{ fontWeight: '600', color: '#eee' }}>RJ45 Connectors</div>
                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>Stock ID: CN-99</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#e74c3c' }}>45</div>
                                <div style={{ fontSize: '0.75rem', color: '#e74c3c' }}>Low Stock</div>
                            </div>
                        </div>

                        <div className="resource-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '40px', height: '40px', background: 'rgba(46, 204, 113, 0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2ecc71', fontSize: '1.1rem' }}>
                                    <i className="fa-solid fa-router"></i>
                                </div>
                                <div>
                                    <div style={{ fontWeight: '600', color: '#eee' }}>Wifi 6 Routers</div>
                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>Stock ID: RTR-AX</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#2ecc71' }}>8</div>
                                <div style={{ fontSize: '0.75rem', color: '#2ecc71' }}>In Stock</div>
                            </div>
                        </div>

                        <div style={{ marginTop: '5px', textAlign: 'center' }}>
                            <button style={{ background: 'transparent', border: 'none', color: '#aaa', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '5px 15px', borderRadius: '20px', width: '100%', margin: '0 auto', transition: 'background 0.2s' }}>
                                View Full Inventory <i className="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="quick-actions" style={{ marginBottom: '90px' }}>
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                    <button className="action-pill" onClick={() => setCurrentView('assignments')}>Manage Assignments</button>
                    <button className="action-pill" onClick={() => setCurrentView('chat')}>Open Chat</button>
                </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="action-footer">
                <div className="action-label">Chat / Call with</div>
                <div className="user-select">
                    <div className="user-avatar"></div>
                    <span>@Saurav Tripathy</span>
                </div>
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="action-input"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <div className="action-icons">
                    <button className="icon-btn" id="footer-chat-btn" onClick={handleSendMessage}><i className="fa-solid fa-arrow-up"></i></button>
                    <button className="icon-btn"><i className="fa-solid fa-phone"></i></button>
                </div>
            </div>
        </section>
    );
}
