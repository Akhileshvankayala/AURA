import React, { useState, useEffect } from 'react';
import { Moon, Sun, Settings, ArrowLeft, Zap } from 'lucide-react';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import { LandingPage } from './components/LandingPage';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { ChatInterface } from './components/ChatInterface';
import { EdgeCaseModals } from './components/EdgeCaseModals';
import { Button } from './components/ui/Button';
import type { ViewMode } from './types';

const AppContent: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Keyboard shortcut for chat (C key)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only trigger if not typing in an input field
      const target = event.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.isContentEditable) {
        const key = event.key.toLowerCase();
        
        if (key === 'c' && !event.ctrlKey && !event.metaKey && !event.altKey) {
          setIsChatOpen(true);
        } else if (key === 't' && !event.ctrlKey && !event.metaKey && !event.altKey) {
          // Switch to teacher view
          setCurrentView('teacher');
        } else if (key === 'v' && !event.ctrlKey && !event.metaKey && !event.altKey) {
          // Show view stats notification (only works in student view)
          if (currentView === 'student') {
            // Trigger the same action as the gesture/button
            handleGestureActivate('peace');
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentView]);

  const handleGestureActivate = (gesture: string) => {
    switch (gesture) {
      case 'peace':
        // Show attendance stats notification
        setTimeout(() => {
          // Stats are visible in side panel, could add a highlight effect
          console.log('Viewing attendance statistics');
        }, 100);
        break;
      case 'wave':
        // Mark attendance with potential edge cases
        const shouldShowError = Math.random() < 0.3; // 30% chance of error
        if (shouldShowError) {
          const errors = ['multiple-faces', 'low-light', 'unknown-face'];
          setActiveModal(errors[Math.floor(Math.random() * errors.length)]);
        } else {
          // Show success notification for attendance marking
          console.log('Attendance marked successfully');
        }
        break;
      case 'rock':
        // Open chat interface
        setIsChatOpen(true);
        break;
      case 'fist':
        // Switch to teacher dashboard
        setCurrentView('teacher');
        break;
    }
  };

  // Demo sequence for hackathon
  useEffect(() => {
    if (currentView === 'student') {
      // Simulate various edge cases for demo
      const demoSequence = [
        { delay: 8000, modal: 'gesture-not-recognized' },
        { delay: 18000, modal: 'voice-unclear' },
        { delay: 28000, modal: 'network-error' }
      ];

      const timeouts = demoSequence.map(({ delay, modal }) =>
        setTimeout(() => {
          if (Math.random() < 0.3) { // 30% chance to show each demo modal
            setActiveModal(modal);
          }
        }, delay)
      );

      return () => timeouts.forEach(clearTimeout);
    }
  }, [currentView]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/30 dark:from-neutral-900 dark:to-neutral-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200/60 dark:border-neutral-800/60">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {currentView !== 'landing' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentView('landing')}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Home</span>
                </Button>
              )}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-soft">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-2xl text-neutral-900 dark:text-neutral-100">
                  Attendify
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              
              {currentView !== 'landing' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-20">
        {currentView === 'landing' && (
          <LandingPage onLaunchDemo={() => setCurrentView('student')} />
        )}

        {currentView === 'student' && (
          <StudentDashboard onGestureActivate={handleGestureActivate} />
        )}

        {currentView === 'teacher' && (
          <TeacherDashboard onBack={() => setCurrentView('student')} />
        )}
      </div>

      {/* Chat Interface */}
      <ChatInterface
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Edge Case Modals */}
      <EdgeCaseModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;