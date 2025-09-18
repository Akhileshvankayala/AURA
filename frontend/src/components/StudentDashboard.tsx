import React, { useState, useEffect, useRef } from 'react';
import { Camera, Wifi, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card } from './ui/Card';
import { GestureControls } from './GestureControls';
import { AttendanceOverlay } from './AttendanceOverlay';
import { ChatInterface } from './ChatInterface';
import type { AttendanceStats } from '../types';

interface StudentDashboardProps {
  onGestureActivate: (gesture: string) => void;
  onOpenChat: () => void;
  onSwitchToTeacher: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
  onGestureActivate, 
  onOpenChat, 
  onSwitchToTeacher 
}) => {
  const [attendanceStats] = useState<AttendanceStats>({
    currentPercentage: 78,
    classesAttended: 23,
    totalClasses: 30,
    classesNeeded: 3
  });

  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'warning'>('success');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Camera feed logic
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error("Camera access denied:", err);
      });
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach(track => track.stop());
      }
    };
  }, []);

  // Poll for gesture every second
  useEffect(() => {
    const interval = setInterval(() => {
      sendGestureFrame();
    }, 1000); // every 1 second
    return () => clearInterval(interval);
  }, []);

  // Capture a frame from the video and send to backend
  const sendGestureFrame = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg');
      const response = await fetch('http://localhost:5000/api/gesture/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData }),
      });
      const result = await response.json();
      if (result.key === 'c' && !isChatOpen) {
        setIsChatOpen(true); // Open chat interface
      }
      if (result.key === 't') {
        onSwitchToTeacher(); // This switches to teacher view
      }
      // Handle other cases as needed
    }
  };

  useEffect(() => {
    // Simulate attendance marking on component load
    setTimeout(() => {
      setNotificationMessage('Attendance marked successfully');
      setNotificationType('success');
      setShowNotification(true);
      
      setTimeout(() => setShowNotification(false), 4000);
    }, 1000);
  }, []);

  const triggerNotification = (type: 'success' | 'warning', message: string) => {
    setNotificationType(type);
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleViewStats = () => {
    // Highlight the stats panel or show a notification
    triggerNotification('success', 'Viewing attendance statistics');
  };

  const handleMarkAttendance = () => {
    // Simulate attendance marking with potential edge cases
    const shouldShowError = Math.random() < 0.3; // 30% chance of error
    if (shouldShowError) {
      // This would trigger edge case modals in the parent component
      onGestureActivate('wave');
    } else {
      triggerNotification('success', 'Attendance marked successfully');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/30 dark:from-neutral-900 dark:to-neutral-800 p-6">
      {/* Notification Banner */}
      {showNotification && (
        <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-2xl shadow-soft-lg backdrop-blur-sm transition-all duration-300 animate-slide-up ${
          notificationType === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-orange-500 text-white'
        }`}>
          <div className="flex items-center space-x-3">
            {notificationType === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            <span className="font-medium">{notificationMessage}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Student Dashboard</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">Use gestures to interact with the system</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Camera Feed */}
          <div className="lg:col-span-3 animate-slide-up">
            <Card className="relative overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl relative overflow-hidden">
                {/* Real Camera Feed */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    width={640}
                    height={360}
                    style={{ borderRadius: '16px', background: '#222' }}
                  />
                </div>

                {/* Status Indicators */}
                <div className="absolute top-6 left-6 flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-green-500/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-medium">Live</span>
                  </div>
                </div>

                <div className="absolute top-6 right-6 flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                  <Wifi className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">Connected</span>
                </div>
              </div>
            </Card>

            {/* Gesture Controls */}
            <div className="mt-8">
              <GestureControls 
                onGestureClick={onGestureActivate}
                onOpenChat={onOpenChat}
                onSwitchToTeacher={onSwitchToTeacher}
                onViewStats={handleViewStats}
                onMarkAttendance={handleMarkAttendance}
              />
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">Quick Stats</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">Current Attendance</span>
                  <span className={`font-bold text-xl ${attendanceStats.currentPercentage >= 75 ? 'text-green-600 dark:text-green-400' : 'text-orange-500 dark:text-orange-400'}`}>
                    {attendanceStats.currentPercentage}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">Classes Attended</span>
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-lg">
                    {attendanceStats.classesAttended}/{attendanceStats.totalClasses}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600 dark:text-neutral-400">Need for 75%</span>
                  <span className="font-semibold text-primary-600 dark:text-primary-400 text-lg">
                    {attendanceStats.classesNeeded} more
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="pt-2">
                  <div className="flex justify-between text-sm text-neutral-500 dark:text-neutral-500 mb-2">
                    <span>Progress to 75%</span>
                    <span>{attendanceStats.currentPercentage}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-700 ${
                        attendanceStats.currentPercentage >= 75 ? 'bg-green-500' : 'bg-primary-500'
                      }`}
                      style={{ width: `${Math.min(attendanceStats.currentPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* System Status */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">System Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Face Recognition</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">Active</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Gesture Detection</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">Ready</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Voice Recognition</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">Enabled</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Attendance Marked</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-500">2 minutes ago</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                  <div>
                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Stats Viewed</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-500">5 minutes ago</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent-500 rounded-full mt-2"></div>
                  <div>
                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Message Sent</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-500">15 minutes ago</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <ChatInterface isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};