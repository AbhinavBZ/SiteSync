"use client";

import React from 'react';

interface Message {
    id: string;
    text: string;
    sender: 'me' | 'other';
    type: 'text' | 'image';
    content?: string; // for image url
}

interface ChatViewProps {
    setCurrentView: (view: any) => void;
    messages?: Message[];
    addMessage?: (text: string) => void;
}

interface Task {
    id: string;
    text: string;
    status: 'done' | 'issue' | 'pending';
}

export default function ChatView({ setCurrentView, messages = [], addMessage }: ChatViewProps) {
    const [inputValue, setInputValue] = React.useState('');
    const [activeTab, setActiveTab] = React.useState<'chat' | 'task'>('chat');
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    // Mock Task Data
    const [tasks, setTasks] = React.useState<Task[]>([
        { id: '1', text: 'IRA meta', status: 'done' },
        { id: '2', text: 'Circuit replacement', status: 'issue' },
        { id: '3', text: 'Router link', status: 'pending' },
        { id: '4', text: 'Tar coil', status: 'pending' }
    ]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    React.useEffect(() => {
        if (activeTab === 'chat') {
            scrollToBottom();
        }
    }, [messages, activeTab]);

    const handleSendMessage = () => {
        if (inputValue.trim() && addMessage) {
            addMessage(inputValue);
            setInputValue('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const toggleTaskStatus = (id: string) => {
        setTasks(prev => prev.map(t => {
            if (t.id === id) {
                // Cycle status: pending -> done -> issue -> pending
                const nextStatus: Task['status'] =
                    t.status === 'pending' ? 'done' :
                        t.status === 'done' ? 'issue' : 'pending';
                return { ...t, status: nextStatus };
            }
            return t;
        }));
    };

    return (
        <section id="view-chat" className="view active">
            <div className="chat-tabs">
                <button
                    className={`chat-tab ${activeTab === 'chat' ? 'active' : ''}`}
                    onClick={() => setActiveTab('chat')}
                >
                    Chat
                </button>
                <button
                    className={`chat-tab ${activeTab === 'task' ? 'active' : ''}`}
                    onClick={() => setActiveTab('task')}
                >
                    Task
                </button>
            </div>

            {activeTab === 'chat' ? (
                <div className="chat-main-area">
                    <div className="chat-header">@SauravTripathy</div>

                    <div className="chat-messages" id="chat-messages">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`message ${msg.sender === 'me' ? 'outgoing' : 'incoming'}`}>
                                <div className={`bubble ${msg.type === 'image' ? 'img-bubble' : ''} ${msg.text === 'Great 👍' ? 'check' : ''}`}>
                                    {msg.type === 'image' ? (
                                        <img src={msg.content} alt="attachment" />
                                    ) : (
                                        msg.text
                                    )}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-area">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button className="send-btn" onClick={handleSendMessage}><i className="fa-solid fa-arrow-up"></i></button>
                    </div>
                </div>
            ) : (
                <div className="chat-main-area task-view-area" style={{ padding: '20px', color: 'white' }}>
                    <div className="chat-header">Task Management</div>
                    <div className="task-list-container">
                        {tasks.map(task => (
                            <div
                                key={task.id}
                                className="task-item"
                                onClick={() => toggleTaskStatus(task.id)}
                                style={{
                                    padding: '15px',
                                    margin: '10px 0',
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer'
                                }}
                            >
                                <span>{task.text}</span>
                                <span className={`status-badge status-${task.status}`} style={{
                                    padding: '5px 10px',
                                    borderRadius: '15px',
                                    fontSize: '0.8rem',
                                    background: task.status === 'done' ? 'rgba(46, 204, 113, 0.2)' :
                                        task.status === 'issue' ? 'rgba(231, 76, 60, 0.2)' : 'rgba(255,255,255,0.1)',
                                    color: task.status === 'done' ? '#2ecc71' :
                                        task.status === 'issue' ? '#e74c3c' : '#ccc'
                                }}>
                                    {task.status.toUpperCase()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Right Side Task Status */}
            <div className="task-status-sidebar">
                <div className="status-group">
                    <div className="status-header">Done <div className="line"></div>
                    </div>
                    <ul className="task-list">
                        {tasks.filter(t => t.status === 'done').map(t => (
                            <li key={t.id} className="done-item"><i className="fa-regular fa-circle-check"></i> {t.text}</li>
                        ))}
                    </ul>
                </div>
                <div className="status-group">
                    <div className="status-header">Issues <div className="line"></div>
                    </div>
                    <ul className="task-list">
                        {tasks.filter(t => t.status === 'issue').map(t => (
                            <li key={t.id} className="issue-item"><i className="fa-solid fa-triangle-exclamation"></i> {t.text}</li>
                        ))}
                    </ul>
                </div>
                {/* Pending Tasks Section */}
                <div className="status-group" style={{ marginTop: '20px' }}>
                    <div className="status-header" style={{ color: '#aaa' }}>Pending <div className="line" style={{ background: '#555' }}></div>
                    </div>
                    <ul className="task-list">
                        {tasks.filter(t => t.status === 'pending').map(t => (
                            <li key={t.id} style={{ color: '#888', padding: '5px 0' }}>• {t.text}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <button className="floating-back-btn" onClick={() => setCurrentView('summary')} style={{ position: 'fixed', bottom: '20px', left: '20px' }}>
                <i className="fa-solid fa-arrow-left"></i> Back
            </button>
        </section>
    );
}
