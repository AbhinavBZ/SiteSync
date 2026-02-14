"use client";

import React, { useState, useEffect } from 'react';

interface AttendanceViewProps {
    setCurrentView: (view: any) => void;
}

export default function AttendanceView({ setCurrentView }: AttendanceViewProps) {
    const [workers, setWorkers] = useState<any[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1)); // Feb 2026

    useEffect(() => {
        // Generate Mock Data
        const assignmentWorkers = [
            { id: 'w1', name: 'Arun Kumar', role: 'Technician', avatar: 'AK' },
            { id: 'w2', name: 'Saurav Tripathy', role: 'Supervisor', avatar: 'ST' },
            { id: 'w3', name: 'Amit Sahoo', role: 'Cable Specialist', avatar: 'AS' },
            { id: 'w4', name: 'Keshari Prasad', role: 'Field Engineer', avatar: 'KP' },
            { id: 'w5', name: 'Badal Mahto', role: 'Logistics', avatar: 'BM' },
            { id: 'w6', name: 'Rajesh Singh', role: 'Technician', avatar: 'RS' },
            { id: 'w7', name: 'Priya Das', role: 'Coordinator', avatar: 'PD' },
        ];

        const generateMonthlyAttendance = (workerId: string) => {
            const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
            const records = [];
            for (let i = 1; i <= daysInMonth; i++) {
                const rand = Math.random();
                let status = 'present';
                // Weekends (assuming sat/sun for mock) - roughly every 7 days
                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
                const dayOfWeek = date.getDay();

                if (dayOfWeek === 0) status = 'off'; // Sunday
                else if (rand > 0.95) status = 'absent';
                else if (rand > 0.9) status = 'leave';
                else if (rand > 0.85) status = 'late';

                records.push({ day: i, status: status, date: date });
            }
            return records;
        };

        const workersWithAttendance = assignmentWorkers.map(w => ({
            ...w,
            attendance: generateMonthlyAttendance(w.id)
        }));

        setWorkers(workersWithAttendance);
    }, [currentMonth]);

    const handleMonthChange = (direction: 'prev' | 'next') => {
        const newDate = new Date(currentMonth);
        if (direction === 'prev') newDate.setMonth(newDate.getMonth() - 1);
        else newDate.setMonth(newDate.getMonth() + 1);
        setCurrentMonth(newDate);
    };

    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'present': return '#2ecc71';
            case 'absent': return '#e74c3c';
            case 'late': return '#f1c40f';
            case 'leave': return '#3498db';
            case 'off': return '#95a5a6';
            default: return '#555';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'present': return 'P';
            case 'absent': return 'A';
            case 'late': return 'L';
            case 'leave': return 'OL';
            case 'off': return '-';
            default: return '';
        }
    };

    const toggleStatus = (workerId: string, dayIndex: number) => {
        setWorkers(prev => prev.map(w => {
            if (w.id !== workerId) return w;
            const newAttendance = [...w.attendance];
            const currentStatus = newAttendance[dayIndex].status;
            let nextStatus = 'present';

            if (currentStatus === 'present') nextStatus = 'late';
            else if (currentStatus === 'late') nextStatus = 'leave';
            else if (currentStatus === 'leave') nextStatus = 'absent';
            else if (currentStatus === 'absent') nextStatus = 'off';
            else if (currentStatus === 'off') nextStatus = 'present';

            newAttendance[dayIndex] = { ...newAttendance[dayIndex], status: nextStatus };
            return { ...w, attendance: newAttendance };
        }));
    };

    // Calculate Summary Stats
    const totalPresent = workers.reduce((acc, w) => acc + w.attendance.filter((r: any) => r.status === 'present').length, 0);
    const totalAbsent = workers.reduce((acc, w) => acc + w.attendance.filter((r: any) => r.status === 'absent').length, 0);
    const totalLate = workers.reduce((acc, w) => acc + w.attendance.filter((r: any) => r.status === 'late').length, 0);

    return (
        <section id="view-attendance" className="view active" style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)', // Cleaner dark bg
            color: 'white',
            overflowY: 'auto',
            height: '100vh',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header Area */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                background: 'rgba(255,255,255,0.03)',
                padding: '15px 20px',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)'
            }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: 'white' }}>
                        <i className="fa-solid fa-calendar-check" style={{ marginRight: '10px', color: '#e67e22' }}></i>
                        Attendance Register
                    </h2>
                    <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '5px' }}>
                        Manage staff attendance and timesheets
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <div className="month-selector" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                        background: 'rgba(0,0,0,0.3)',
                        padding: '8px 15px',
                        borderRadius: '30px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <button onClick={() => handleMonthChange('prev')} className="icon-btn-simple">
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                        <span style={{ fontWeight: '600', minWidth: '120px', textAlign: 'center' }}>
                            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <button onClick={() => handleMonthChange('next')} className="icon-btn-simple">
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="action-btn-secondary">
                            <i className="fa-solid fa-file-export"></i> Export
                        </button>
                        <button className="action-btn-primary">
                            <i className="fa-solid fa-floppy-disk"></i> Save
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '15px',
                marginBottom: '20px'
            }}>
                <StatCard label="Total Staff" value={workers.length} icon="fa-users" color="#3498db" />
                <StatCard label="Present (Avg)" value={Math.round(totalPresent / daysInMonth)} icon="fa-check-circle" color="#2ecc71" />
                <StatCard label="Absent (Total)" value={totalAbsent} icon="fa-user-slash" color="#e74c3c" />
                <StatCard label="Late Arrivals" value={totalLate} icon="fa-clock" color="#f1c40f" />
            </div>

            {/* Attendance Spreadsheet */}
            <div className="sheet-container" style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
            }}>
                {/* Scrollable Table Area */}
                <div style={{ overflow: 'auto', flex: 1 }} className="custom-scroll">
                    <table style={{
                        width: '100%',
                        borderCollapse: 'separate',
                        borderSpacing: 0,
                        fontSize: '0.9rem'
                    }}>
                        <thead style={{
                            position: 'sticky',
                            top: 0,
                            zIndex: 10,
                            background: '#1a1a1a',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                        }}>
                            <tr>
                                <th style={{
                                    padding: '15px',
                                    textAlign: 'left',
                                    minWidth: '200px',
                                    borderBottom: '1px solid #333',
                                    borderRight: '1px solid #333',
                                    position: 'sticky',
                                    left: 0,
                                    zIndex: 20,
                                    background: '#1a1a1a'
                                }}>Employee</th>
                                {days.map(d => {
                                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
                                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                                    return (
                                        <th key={d} style={{
                                            padding: '10px 5px',
                                            textAlign: 'center',
                                            minWidth: '40px',
                                            borderBottom: '1px solid #333',
                                            borderRight: '1px solid rgba(255,255,255,0.05)',
                                            color: isWeekend ? '#e74c3c' : '#aaa',
                                            fontWeight: '600'
                                        }}>
                                            <div style={{ fontSize: '0.7rem', marginBottom: '2px' }}>
                                                {date.toLocaleDateString('en-US', { weekday: 'narrow' })}
                                            </div>
                                            {d}
                                        </th>
                                    );
                                })}
                                <th style={{ padding: '15px', minWidth: '80px', borderBottom: '1px solid #333' }}>Stats</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workers.map((worker, idx) => (
                                <tr key={worker.id} style={{ background: idx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                                    <td style={{
                                        padding: '10px 15px',
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        borderRight: '1px solid #333',
                                        position: 'sticky',
                                        left: 0,
                                        background: '#141414',
                                        zIndex: 5
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '32px', height: '32px', borderRadius: '50%',
                                                background: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '0.8rem', fontWeight: 'bold'
                                            }}>
                                                {worker.avatar}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '600' }}>{worker.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#777' }}>{worker.role}</div>
                                            </div>
                                        </div>
                                    </td>
                                    {worker.attendance.map((record: any, dayIdx: number) => (
                                        <td key={dayIdx}
                                            onClick={() => toggleStatus(worker.id, dayIdx)}
                                            style={{
                                                padding: '5px',
                                                textAlign: 'center',
                                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                borderRight: '1px solid rgba(255,255,255,0.05)',
                                                cursor: 'pointer',
                                                transition: 'background 0.2s'
                                            }}
                                            className="attendance-cell-hover"
                                        >
                                            <div style={{
                                                width: '28px', height: '28px',
                                                borderRadius: '6px',
                                                margin: '0 auto',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                background: `${getStatusColor(record.status)}22`, // 20% opacity bg
                                                color: getStatusColor(record.status),
                                                fontWeight: '600',
                                                fontSize: '0.8rem',
                                                border: `1px solid ${getStatusColor(record.status)}44`
                                            }}>
                                                {getStatusLabel(record.status)}
                                            </div>
                                        </td>
                                    ))}
                                    <td style={{
                                        padding: '10px',
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        textAlign: 'center',
                                        color: '#aaa',
                                        fontSize: '0.8rem'
                                    }}>
                                        {Math.round((worker.attendance.filter((r: any) => r.status === 'present').length / daysInMonth) * 100)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Legend Footer */}
                <div style={{
                    padding: '15px 20px',
                    background: '#1a1a1a',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    gap: '20px',
                    fontSize: '0.85rem',
                    color: '#aaa'
                }}>
                    <LegendItem label="Present" color="#2ecc71" code="P" />
                    <LegendItem label="Absent" color="#e74c3c" code="A" />
                    <LegendItem label="Late" color="#f1c40f" code="L" />
                    <LegendItem label="Leave" color="#3498db" code="OL" />
                    <LegendItem label="Weekly Off" color="#95a5a6" code="-" />
                    <div style={{ marginLeft: 'auto', fontStyle: 'italic', color: '#666' }}>
                        *Click on cells to update status
                    </div>
                </div>
            </div>
            <button className="floating-back-btn" onClick={() => setCurrentView('summary')}>
                <i className="fa-solid fa-arrow-left"></i> Back
            </button>
        </section>
    );
}

// Helper Components
const StatCard = ({ label, value, icon, color }: any) => (
    <div style={{
        background: 'rgba(255,255,255,0.03)',
        padding: '15px',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    }}>
        <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: `${color}20`, color: color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem'
        }}>
            <i className={`fa-solid ${icon}`}></i>
        </div>
        <div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '4px' }}>{label}</div>
        </div>
    </div>
);

const LegendItem = ({ label, color, code }: any) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
            width: '20px', height: '20px', borderRadius: '4px',
            background: `${color}22`, border: `1px solid ${color}44`,
            color: color, fontSize: '0.7rem', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
        }}>{code}</div>
        <span>{label}</span>
    </div>
);
