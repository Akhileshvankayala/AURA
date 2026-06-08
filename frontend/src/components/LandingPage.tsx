import React from 'react';
import { Camera, Hand, MessageCircle, ArrowRight, Sparkles, UserPlus } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

interface LandingPageProps {
  onLaunchDemo: () => void;
  onRegister: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchDemo, onRegister }) => {
  return (
    <div className="min-h-screen bg-neutral-950 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/20 rounded-full blur-[120px] animate-pulse-glow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-500/20 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-20 lg:py-32">
          <div className="text-center animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full glass border-primary-500/30 mb-8 glow-border animate-float">
              <Sparkles className="w-4 h-4 text-primary-400 mr-2" />
              <span className="text-sm font-medium text-primary-300 tracking-wide uppercase">
                AI-Powered Recognition System
              </span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-6xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 mb-6 tracking-tight glow-text animate-pulse-glow">
              AURA
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-neutral-300 mb-8 font-light max-w-3xl mx-auto leading-relaxed tracking-widest uppercase">
              AI-UNIFIED RECOGNITION FOR ATTENDANCE
            </p>
            
            {/* Description */}
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Experience seamless attendance management with our unified AI recognition system that combines facial detection, gesture control, and voice interaction.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Button 
                size="lg"
                onClick={onLaunchDemo}
                className="w-full sm:w-auto bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white shadow-[0_0_20px_rgba(20,184,166,0.4)] hover:shadow-[0_0_30px_rgba(20,184,166,0.6)] transition-all group border-none"
              >
                <span className="flex items-center space-x-2">
                  <span className="font-semibold tracking-wide">LAUNCH DASHBOARD</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={onRegister}
                className="w-full sm:w-auto glass border-white/20 hover:bg-white/10 text-neutral-200 transition-all flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-5 h-5" />
                <span className="font-semibold tracking-wide">REGISTER STUDENT</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl lg:text-4xl font-bold text-neutral-100 mb-4">
            Three Pillars of Recognition
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Powered by advanced AI technology for accurate and efficient attendance tracking
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Face Recognition */}
          <Card hover className="glass-card p-8 text-center group border-white/5">
            <div className="w-16 h-16 bg-primary-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(20,184,166,0.3)] border border-primary-500/30">
              <Camera className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-100 mb-3">Face Recognition</h3>
            <p className="text-neutral-400 leading-relaxed mb-4">
              Advanced facial recognition technology ensures accurate identity verification with industry-leading precision.
            </p>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-900/30 text-primary-300 text-sm font-medium border border-primary-500/20">
              Identity Verification
            </div>
          </Card>

          {/* Gesture Recognition */}
          <Card hover className="glass-card p-8 text-center group border-white/5">
            <div className="w-16 h-16 bg-accent-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(168,85,247,0.3)] border border-accent-500/30">
              <Hand className="w-8 h-8 text-accent-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-100 mb-3">Gesture Recognition</h3>
            <p className="text-neutral-400 leading-relaxed mb-4">
              Intuitive hand gesture controls for seamless interaction. Check stats, mark attendance, and navigate effortlessly.
            </p>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent-900/30 text-accent-300 text-sm font-medium border border-accent-500/20">
              Instant Queries
            </div>
          </Card>

          {/* Voice Interaction */}
          <Card hover className="glass-card p-8 text-center group border-white/5">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(20,184,166,0.2)] border border-white/10">
              <MessageCircle className="w-8 h-8 text-neutral-100" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-100 mb-3">Voice Interaction</h3>
            <p className="text-neutral-400 leading-relaxed mb-4">
              Natural language processing enables voice commands and automated communication with faculty members.
            </p>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-primary-900/30 to-accent-900/30 text-primary-300 text-sm font-medium border border-white/10">
              Faculty Communication
            </div>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <div className="glass border-t border-white/10 relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="animate-slide-up">
              <div className="text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 mb-2 drop-shadow-[0_0_10px_rgba(20,184,166,0.5)]">99.9%</div>
              <div className="text-neutral-400 font-medium tracking-wide uppercase text-sm">Recognition Accuracy</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-600 mb-2 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">&lt;2s</div>
              <div className="text-neutral-400 font-medium tracking-wide uppercase text-sm">Response Time</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400 mb-2 drop-shadow-[0_0_10px_rgba(20,184,166,0.5)]">24/7</div>
              <div className="text-neutral-400 font-medium tracking-wide uppercase text-sm">System Availability</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};