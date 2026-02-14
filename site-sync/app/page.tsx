"use client";

import { useState } from 'react';
import Header from './components/Header';
import LandingView from './components/LandingView';
import DashboardView from './components/DashboardView';
import AssignmentsView from './components/AssignmentsView';
import ChatView from './components/ChatView';
import AttendanceView from './components/AttendanceView';
import ReportView from './components/ReportView';

import AuthView from './components/AuthView';
import { ProfileSettings, AppSettings, SiteOptions } from './components/SettingsViews';

export type View = 'landing' | 'summary' | 'assignments' | 'chat' | 'attendance' | 'report' | 'profile-settings' | 'app-settings' | 'site-options';

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  type: 'text' | 'image';
  content?: string; // for image url
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<View>('landing');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Send a screenshot', sender: 'other', type: 'text' },
    { id: '2', text: '', sender: 'me', type: 'image', content: 'https://via.placeholder.com/300x180' },
    { id: '3', text: 'Great 👍', sender: 'other', type: 'text' }
  ]);

  const addMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'me',
      type: 'text'
    };
    setMessages(prev => [...prev, newMessage]);
  };

  if (!isLoggedIn) {
    return <AuthView onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLogout={() => setIsLoggedIn(false)}
      />

      <main id="app-container" style={{ flexGrow: 1, position: 'relative' }}>
        {currentView === 'landing' && <LandingView setCurrentView={setCurrentView} />}
        {currentView === 'summary' && (
          <DashboardView
            setCurrentView={setCurrentView}
            addMessage={addMessage}
          />
        )}
        {currentView === 'assignments' && <AssignmentsView setCurrentView={setCurrentView} />}
        {currentView === 'chat' && (
          <ChatView
            setCurrentView={setCurrentView}
            messages={messages}
            addMessage={addMessage}
          />
        )}
        {currentView === 'attendance' && <AttendanceView setCurrentView={setCurrentView} />}
        {currentView === 'report' && <ReportView setCurrentView={setCurrentView} />}
        {currentView === 'profile-settings' && <ProfileSettings setCurrentView={setCurrentView} />}
        {currentView === 'app-settings' && <AppSettings setCurrentView={setCurrentView} />}
        {currentView === 'site-options' && <SiteOptions setCurrentView={setCurrentView} />}
      </main>

    </div>
  );
}
