import React from 'react';
import { Camera, Hand, MessageCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface LandingPageProps {
  onLaunchDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchDemo }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/30 dark:from-neutral-900 dark:to-neutral-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-32">
          <div className="text-center animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 mb-8">
              <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400 mr-2" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                AI-Powered Recognition System
              </span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl lg:text-7xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 tracking-tight">
              Attendify
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-neutral-600 dark:text-neutral-400 mb-8 font-light max-w-3xl mx-auto leading-relaxed">
              Face, Gesture, Voice — The Smarter Way to Attendance
            </p>
            
            {/* Description */}
            <p className="text-lg text-neutral-500 dark:text-neutral-500 max-w-2xl mx-auto mb-12 leading-relaxed">
              Experience seamless attendance management with our unified AI recognition system that combines facial detection, gesture control, and voice interaction.
            </p>

            {/* CTA Button */}
            <Button 
              size="lg" 
              onClick={onLaunchDemo}
              className="group shadow-soft-lg"
            >
              <span className="flex items-center">
                Launch Demo
                <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Three Pillars of Recognition
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Powered by advanced AI technology for accurate and efficient attendance tracking
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Face Recognition */}
          <Card hover className="p-8 text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-soft">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Face Recognition</h3>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              Advanced facial recognition technology ensures accurate identity verification with industry-leading precision.
            </p>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium">
              Identity Verification
            </div>
          </Card>

          {/* Gesture Recognition */}
          <Card hover className="p-8 text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-soft">
              <Hand className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Gesture Recognition</h3>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              Intuitive hand gesture controls for seamless interaction. Check stats, mark attendance, and navigate effortlessly.
            </p>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 text-sm font-medium">
              Instant Queries
            </div>
          </Card>

          {/* Voice Interaction */}
          <Card hover className="p-8 text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-soft">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Voice Interaction</h3>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
              Natural language processing enables voice commands and automated communication with faculty members.
            </p>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium">
              Faculty Communication
            </div>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-neutral-100/50 dark:bg-neutral-800/30 border-t border-neutral-200/60 dark:border-neutral-700/60">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="animate-slide-up">
              <div className="text-4xl lg:text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">99.9%</div>
              <div className="text-neutral-600 dark:text-neutral-400 font-medium">Recognition Accuracy</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl lg:text-5xl font-bold text-accent-600 dark:text-accent-400 mb-2">&lt;2s</div>
              <div className="text-neutral-600 dark:text-neutral-400 font-medium">Response Time</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl lg:text-5xl font-bold text-primary-600 dark:text-primary-400 mb-2">24/7</div>
              <div className="text-neutral-600 dark:text-neutral-400 font-medium">System Availability</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};