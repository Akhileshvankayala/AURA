import React, { useState, useEffect, useRef } from 'react';
import { Camera, Wifi, CheckCircle, AlertTriangle } from 'lucide-react';
import * as faceapi from 'face-api.js';
import axios from 'axios';
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
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats>({
    currentPercentage: 0,
    classesAttended: 0,
    totalClasses: 0,
    classesNeeded: 0
  });
  const [currentStudentName, setCurrentStudentName] = useState<string>('Guest');

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

  // Face Recognition Logic
  useEffect(() => {
    let isChecking = true;

    const loadModelsAndRecognize = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        
        // Fetch known students
        const res = await axios.get('http://localhost:5001/api/attendance/students');
        const students = res.data;
        
        if (students.length === 0) return;

        const labeledDescriptors = students.map((s: any) => {
          return new faceapi.LabeledFaceDescriptors(
            s.roll_number,
            [new Float32Array(s.faceDescriptor)]
          );
        });

        const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);

        const checkFaceInterval = setInterval(async () => {
          if (!videoRef.current || !isChecking) return;
          
          try {
            const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
              .withFaceLandmarks()
              .withFaceDescriptor();

            if (detection) {
              const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
              if (bestMatch.label !== 'unknown') {
                // We found a student, mark attendance!
                isChecking = false; // stop checking to avoid spam
                clearInterval(checkFaceInterval);
                
                triggerNotification('success', `Face recognized! Marking attendance for ${bestMatch.label}...`);
                
                await axios.post('http://localhost:5001/api/attendance/mark', {
                  roll_number: bestMatch.label,
                  markedVia: 'Face Recognition'
                });

                // Fetch real stats
                try {
                  const statRes = await axios.get(`http://localhost:5001/api/attendance/stats/${bestMatch.label}`);
                  const data = statRes.data;
                  setAttendanceStats({
                    currentPercentage: data.attendance,
                    classesAttended: data.totalDays,
                    totalClasses: Math.max(30, data.totalDays),
                    classesNeeded: Math.max(0, Math.ceil(0.75 * Math.max(30, data.totalDays)) - data.totalDays)
                  });
                  // Find the student name from our fetched students list
                  const matchingStudent = students.find((s: any) => s.roll_number === bestMatch.label);
                  if (matchingStudent) {
                    setCurrentStudentName(matchingStudent.name);
                  }
                } catch (e) {
                  console.error("Failed to fetch stats", e);
                }

                setTimeout(() => {
                  triggerNotification('success', `Attendance successfully logged!`);
                }, 2000);
              }
            }
          } catch(e) {
            console.error('Face recognition interval error:', e);
          }
        }, 3000); // Check every 3 seconds

        return () => clearInterval(checkFaceInterval);
      } catch (err) {
        console.error("Failed to load models or fetch students", err);
      }
    };

    loadModelsAndRecognize();

    return () => { isChecking = false; };
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
      try {
        const response = await fetch('http://localhost:5000/api/gesture/detect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: imageData }),
        });
        const result = await response.json();
        console.log('Gesture detected:', result);
        
        // Check if gesture was detected with good confidence
        if (result.gesture && result.confidence && result.confidence > 0.6) {
          const gestureClass = result.gesture.toLowerCase();
          
          // Map gesture classes to actions based on labels.txt
          // Real labels are like "0 View Stats", "1 Mark Attendance", "2 Open Chat", "3 Teacher View"
          // Mock labels are "wave", "peace", "rock", "fist"
          if (gestureClass.includes('rock') || gestureClass === 'class_2' || gestureClass.includes('open chat') || gestureClass.startsWith('2')) {
            // Rock gesture = Open Chat
            setIsChatOpen(true);
            triggerNotification('success', 'Chat opened with rock gesture');
          } else if (gestureClass.includes('fist') || gestureClass === 'class_3' || gestureClass.includes('teacher view') || gestureClass.startsWith('3')) {
            // Fist gesture = Teacher View
            onSwitchToTeacher();
            triggerNotification('success', 'Switching to teacher view');
          } else if (gestureClass.includes('peace') || gestureClass === 'class_1' || gestureClass.includes('view stats') || gestureClass.startsWith('0')) {
            // Peace gesture = View Stats
            triggerNotification('success', 'Viewing statistics');
            handleViewStats();
          } else if (gestureClass.includes('wave') || gestureClass === 'class_0' || gestureClass.includes('mark attendance') || gestureClass.startsWith('1')) {
            // Wave gesture = Mark Attendance
            handleMarkAttendance();
            triggerNotification('success', 'Attendance marked with wave gesture');
          }
        }
      } catch (error) {
        console.error('Error detecting gesture:', error);
      }
    }
  };



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
              <GestureControls />
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Quick Stats</h3>
              <p className="text-sm text-primary-500 font-medium mb-6">Student: {currentStudentName}</p>
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