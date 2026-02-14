"use client";

import React, { useState } from 'react';

interface AssignmentsViewProps {
    setCurrentView: (view: any) => void;
}

export default function AssignmentsView({ setCurrentView }: AssignmentsViewProps) {

    // Mock Data
    const [dailyTasks, setDailyTasks] = useState([
        { id: 'dt1', title: 'Circuit Check - Sec 5', location: 'Sector 5', priority: 'high', time: '10:00 AM' },
        { id: 'dt2', title: 'Router Install - Unit 4', location: 'Unit 4', priority: 'med', time: '11:30 AM' },
        { id: 'dt3', title: 'Line Fault - OM Road', location: 'OM Road', priority: 'high', time: '01:00 PM' },
        { id: 'dt4', title: 'Maintenance - Hub A', location: 'Hub A', priority: 'low', time: '03:00 PM' }
    ]);

    const [assignmentWorkers, setAssignmentWorkers] = useState([
        { id: 'w1', name: 'Arun Kumar', status: 'available', avatar: 'AK' },
        { id: 'w2', name: 'Saurav Tripathy', status: 'busy', avatar: 'ST' },
        { id: 'w3', name: 'Amit Sahoo', status: 'available', avatar: 'AS' },
        { id: 'w4', name: 'Keshari Prasad', status: 'available', avatar: 'KP' },
        { id: 'w5', name: 'Badal Mahto', status: 'busy', avatar: 'BM' }
    ]);

    const [ongoingTasks, setOngoingTasks] = useState([
        { id: 'ot1', title: 'Morning Briefing', worker: 'All Team', status: 'Completed', time: '09:00 AM' },
        { id: 'ot2', title: 'Vehicle Check', worker: 'Keshari Prasad', status: 'In Progress', time: '09:15 AM' }
    ]);

    const [selectedDailyTaskId, setSelectedDailyTaskId] = useState<string | null>(null);
    const [selectedDailyWorkerId, setSelectedDailyWorkerId] = useState<string | null>(null);

    // Logic
    const isReadyToAssign = selectedDailyTaskId && selectedDailyWorkerId;

    const handleAssign = () => {
        if (!selectedDailyTaskId || !selectedDailyWorkerId) return;

        const taskIdx = dailyTasks.findIndex(t => t.id === selectedDailyTaskId);
        const workerIdx = assignmentWorkers.findIndex(w => w.id === selectedDailyWorkerId);

        if (taskIdx > -1 && workerIdx > -1) {
            const task = dailyTasks[taskIdx];
            const worker = assignmentWorkers[workerIdx];

            // Add to ongoing
            const newOngoing = {
                id: 'ot' + Date.now(),
                title: task.title,
                worker: worker.name,
                status: 'In Progress',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setOngoingTasks([newOngoing, ...ongoingTasks]);

            // Update worker status
            const updatedWorkers = [...assignmentWorkers];
            updatedWorkers[workerIdx] = { ...updatedWorkers[workerIdx], status: 'busy' };
            setAssignmentWorkers(updatedWorkers);

            // Remove task
            const updatedTasks = [...dailyTasks];
            updatedTasks.splice(taskIdx, 1);
            setDailyTasks(updatedTasks);

            // Reset selection
            setSelectedDailyTaskId(null);
            setSelectedDailyWorkerId(null);
        }
    };

    return (
        <section id="view-assignments" className="view active">
            <div className="dashboard-header-secondary">
                <h3 className="section-title">Task Management</h3>
            </div>

            <div className="assignment-dashboard-grid">

                {/* COLUMN 1: MISSION QUEUE (Daily Tasks) */}
                <div className="dashboard-col col-tasks" id="col-tasks">
                    <div className="dashboard-panel panel-full-height" id="panel-todays-tasks">
                        <div className="panel-header">
                            <div className="ph-left"><i className="fa-solid fa-list-check"></i> Mission Queue</div>
                            <span className="badge-count" id="today-task-count">{dailyTasks.length}</span>
                        </div>
                        <div className="panel-body custom-scroll" id="today-task-list">
                            {dailyTasks.length === 0 ? <div className="empty-state">All caught up!</div> : dailyTasks.map(task => (
                                <div
                                    key={task.id}
                                    className={`item-card task-card ${selectedDailyTaskId === task.id ? 'selected' : ''}`}
                                    onClick={() => setSelectedDailyTaskId(selectedDailyTaskId === task.id ? null : task.id)}
                                >
                                    <div className="task-header">
                                        <span><span className={`priority-spot priority-${task.priority}`}></span>{task.title}</span>
                                    </div>
                                    <div className="task-meta">
                                        <span><i className="fa-solid fa-location-dot"></i> {task.location}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* COLUMN 2: RESOURCES (Workers + Notes) */}
                <div className="dashboard-col col-resources" id="col-resources">
                    {/* Top: Workforce */}
                    <div className="dashboard-panel panel-half-height" id="panel-avail-workers">
                        <div className="panel-header">
                            <div className="ph-left"><i className="fa-solid fa-users-gear"></i> Workforce</div>
                            <span className="badge-count" id="avail-worker-count">{assignmentWorkers.length}</span>
                        </div>
                        <div className="panel-body custom-scroll" id="avail-worker-list">
                            {assignmentWorkers.map(worker => (
                                <div
                                    key={worker.id}
                                    className={`item-card worker-card ${selectedDailyWorkerId === worker.id ? 'selected' : ''}`}
                                    style={{ opacity: worker.status === 'available' ? 1 : 0.6, cursor: worker.status === 'available' ? 'pointer' : 'not-allowed' }}
                                    onClick={() => {
                                        if (worker.status === 'available') {
                                            setSelectedDailyWorkerId(selectedDailyWorkerId === worker.id ? null : worker.id);
                                        }
                                    }}
                                >
                                    <div className="worker-info">
                                        <div className="worker-avatar">{worker.avatar}</div>
                                        <span className="worker-name">{worker.name}</span>
                                    </div>
                                    <span className={`status-tag ${worker.status}`}>{worker.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom: Notes */}
                    <div className="dashboard-panel panel-half-height panel-notes">
                        <div className="panel-header">
                            <div className="ph-left"><i className="fa-regular fa-clipboard"></i> Field Notes</div>
                        </div>
                        <div className="notes-wrapper">
                            <textarea id="assignment-notes" placeholder="Log field updates..." onChange={(e) => {
                                // Simple persistence simulation
                                localStorage.setItem('siteSync_dailyNotes', e.target.value);
                            }}></textarea>
                        </div>
                    </div>
                </div>

                {/* COLUMN 3: LIVE OPERATIONS (Ongoing) */}
                <div className="dashboard-col col-ongoing" id="col-ongoing">
                    <div className="ongoing-header-actions">
                        <button
                            id="assign-btn-action"
                            className={`assign-action-btn ${isReadyToAssign ? 'ready' : 'disabled'}`}
                            onClick={handleAssign}
                            disabled={!isReadyToAssign}
                        >
                            <span className="btn-icon"><i className="fa-solid fa-rocket"></i></span>
                            <span className="btn-text">DEPLOY UNIT</span>
                        </button>
                    </div>
                    <div className="dashboard-panel panel-full-height" id="panel-ongoing">
                        <div className="panel-header">
                            <div className="ph-left"><i className="fa-solid fa-satellite-dish"></i> Live Operations</div>
                            <span className="status-live-indicator">● LIVE</span>
                        </div>
                        <div className="panel-body custom-scroll" id="ongoing-list">
                            {ongoingTasks.length === 0 ? <div className="empty-state">No live operations</div> : (
                                <table className="live-ops-table">
                                    <thead>
                                        <tr>
                                            <th>Operation</th>
                                            <th>Unit</th>
                                            <th>Time</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ongoingTasks.map(task => (
                                            <tr key={task.id} className="live-ops-row">
                                                <td className="op-name">{task.title}</td>
                                                <td className="op-unit"><div className="mini-avatar">{task.worker.charAt(0)}</div> {task.worker.split(' ')[0]}</td>
                                                <td className="op-time">{task.time}</td>
                                                <td className="op-status">
                                                    <span className={`status-pill-small ${task.status === 'Completed' ? 'st-done' : 'st-active'}`}>
                                                        {task.status === 'In Progress' ? 'Active' : task.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            {/* Floating Back Button */}
            <button className="floating-back-btn" onClick={() => setCurrentView('summary')}>
                <i className="fa-solid fa-arrow-left"></i> Back
            </button>
        </section>
    );
}
