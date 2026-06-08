import React, { useState, useRef, useEffect } from 'react';
import { Camera, User, Mail, Hash, CheckCircle, ArrowLeft } from 'lucide-react';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface RegistrationPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({ onBack, onSuccess }) => {
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({ name: '', roll_number: '', email: '' });
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [faceDescriptor, setFaceDescriptor] = useState<number[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
        setIsModelLoaded(true);
      } catch (err) {
        console.error("Error loading face models", err);
      }
    };
    loadModels();
  }, []);

  const startCamera = async () => {
    if (navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
  };

  useEffect(() => {
    if (step === 2) {
      startCamera();
    } else {
      stopCamera();
    }
    return stopCamera;
  }, [step]);

  const handleCapture = async () => {
    if (!videoRef.current || !isModelLoaded) return;
    setIsCapturing(true);

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    const base64Image = canvas.toDataURL('image/jpeg');

    try {
      const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        setCapturedImage(base64Image);
        setFaceDescriptor(Array.from(detection.descriptor));
        stopCamera();
      } else {
        alert("No face detected! Please ensure your face is clearly visible.");
      }
    } catch (err) {
      console.error(err);
      alert("Error detecting face. Ensure models are loaded.");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleSubmit = async () => {
    if (!faceDescriptor || !capturedImage) return;
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:5001/api/attendance/register', {
        ...formData,
        faceDescriptor,
        imageBase64: capturedImage
      });
      alert('Registration Successful!');
      onSuccess();
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.error || err.message || 'Unknown error';
      alert(`Registration failed: ${errorMsg}\n\nDid you forget to fill in the .env file with your Cloudinary and MongoDB details?`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTeacherSubmit = async () => {
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:5001/api/attendance/register-teacher', {
        name: formData.name,
        email: formData.email,
        password: formData.roll_number // Using roll_number field as password for teacher
      });
      alert('Teacher Registration Successful!');
      onSuccess();
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.error || err.message || 'Unknown error';
      alert(`Registration failed: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 p-6 flex items-center justify-center">
      <Card className="max-w-xl w-full p-8 animate-slide-up shadow-2xl border-white/10 bg-black/40 backdrop-blur-xl">
        <Button variant="ghost" onClick={onBack} className="mb-6 flex items-center gap-2 text-white/70 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <h2 className="text-3xl font-bold text-white mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400">
          Registration
        </h2>

        {/* Role Toggle */}
        <div className="flex bg-white/5 rounded-xl p-1 mb-8">
          <button 
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${role === 'student' ? 'bg-primary-500 text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
            onClick={() => { setRole('student'); setStep(1); }}
          >
            Student
          </button>
          <button 
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${role === 'teacher' ? 'bg-accent-500 text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
            onClick={() => { setRole('teacher'); setStep(1); }}
          >
            Teacher
          </button>
        </div>

        {step === 1 ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">{role === 'student' ? 'Roll Number' : 'Password'}</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={role === 'student' ? 'text' : 'password'}
                  value={formData.roll_number}
                  onChange={e => setFormData({ ...formData, roll_number: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder={role === 'student' ? '22ABCD123' : 'Secure password'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Email Address (for notifications)</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-primary-500 transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <Button 
              className="w-full mt-8 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white shadow-lg shadow-primary-500/25 transition-all rounded-xl py-4"
              onClick={() => {
                if(formData.name && formData.roll_number && formData.email) {
                  if (role === 'student') setStep(2);
                  else handleTeacherSubmit();
                }
                else alert('Please fill all fields');
              }}
              disabled={isSubmitting}
            >
              {role === 'student' ? 'Continue to Face Capture' : (isSubmitting ? 'Registering...' : 'Complete Teacher Registration')}
            </Button>
          </div>
        ) : (
          <div className="space-y-6 text-center">
            {!capturedImage ? (
              <div className="space-y-4">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-black/50 border border-white/10">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  {!isModelLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                      <span className="text-white animate-pulse">Loading AI Models...</span>
                    </div>
                  )}
                </div>
                <Button 
                  onClick={handleCapture} 
                  disabled={!isModelLoaded || isCapturing}
                  className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl py-4 flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" /> 
                  {isCapturing ? 'Analyzing...' : 'Capture Face'}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative aspect-square max-w-[200px] mx-auto rounded-full overflow-hidden border-4 border-green-500 shadow-xl shadow-green-500/20">
                  <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center backdrop-blur-[2px]">
                    <CheckCircle className="w-12 h-12 text-white drop-shadow-md" />
                  </div>
                </div>
                <p className="text-green-400 font-medium">Face Successfully Analyzed!</p>
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1 text-white border-white/20 hover:bg-white/10" onClick={() => setCapturedImage(null)}>Retake</Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg shadow-green-500/25"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Registering...' : 'Complete Registration'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
