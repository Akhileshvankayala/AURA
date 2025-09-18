import React from 'react';
import { AlertTriangle, Users, Camera, Hand, Volume2, WifiOff } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

interface EdgeCaseModalsProps {
  activeModal: string | null;
  onClose: () => void;
}

export const EdgeCaseModals: React.FC<EdgeCaseModalsProps> = ({ activeModal, onClose }) => {
  const getModalContent = () => {
    switch (activeModal) {
      case 'multiple-faces':
        return {
          title: 'Multiple Faces Detected',
          icon: <Users className="w-16 h-16 text-orange-500 mx-auto mb-6" />,
          content: (
            <div className="text-center">
              <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                Multiple faces detected in the camera feed. The system is resolving the primary face for attendance marking.
              </p>
              <div className="flex items-center justify-center space-x-2 text-orange-600 dark:text-orange-400 mb-6 bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Resolving primary face...</span>
              </div>
              <Button variant="secondary" onClick={onClose} className="w-full">
                Understood
              </Button>
            </div>
          )
        };

      case 'low-light':
        return {
          title: 'Poor Lighting Conditions',
          icon: <Camera className="w-16 h-16 text-yellow-500 mx-auto mb-6" />,
          content: (
            <div className="text-center">
              <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                Lighting conditions are not optimal for accurate face recognition. Please adjust your position or lighting.
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
                <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                  💡 Tip: Position yourself facing a light source for better detection
                </p>
              </div>
              <Button variant="primary" onClick={onClose} className="w-full">
                Try Again
              </Button>
            </div>
          )
        };

      case 'unknown-face':
        return {
          title: 'Unknown Face Detected',
          icon: <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />,
          content: (
            <div className="text-center">
              <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                Face detected but not recognized in the system. Please ensure you are registered for this class.
              </p>
              <div className="space-y-3">
                <Button variant="primary" className="w-full">
                  Register New Student
                </Button>
                <Button variant="outline" onClick={onClose} className="w-full">
                  Try Again
                </Button>
              </div>
            </div>
          )
        };

      case 'gesture-not-recognized':
        return {
          title: 'Gesture Not Recognized',
          icon: <Hand className="w-16 h-16 text-accent-500 mx-auto mb-6" />,
          content: (
            <div className="text-center">
              <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                The gesture was not clearly recognized. Please try again with one of the supported gestures.
              </p>
              <div className="grid grid-cols-5 gap-3 mb-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4">
                {[
                  { emoji: '👍', label: 'Classes' },
                  { emoji: '✌️', label: 'Stats' },
                  { emoji: '👋', label: 'Mark' },
                  { emoji: '🤟', label: 'Chat' },
                  { emoji: '✊', label: 'Teacher' }
                ].map((gesture) => (
                  <div key={gesture.label} className="text-center">
                    <div className="text-2xl mb-1">{gesture.emoji}</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-500 font-medium">{gesture.label}</div>
                  </div>
                ))}
              </div>
              <Button variant="primary" onClick={onClose} className="w-full">
                Try Again
              </Button>
            </div>
          )
        };

      case 'voice-unclear':
        return {
          title: 'Voice Not Clear',
          icon: <Volume2 className="w-16 h-16 text-primary-500 mx-auto mb-6" />,
          content: (
            <div className="text-center">
              <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                Your voice message was unclear due to background noise. Please confirm the message before sending.
              </p>
              <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4 mb-6">
                <p className="text-sm text-primary-700 dark:text-primary-300 font-medium mb-2">
                  Did you mean:
                </p>
                <p className="text-primary-900 dark:text-primary-100 font-medium italic">
                  "Can I get an extension for my assignment?"
                </p>
              </div>
              <div className="space-y-3">
                <Button variant="primary" className="w-full">
                  Yes, Send This Message
                </Button>
                <Button variant="outline" onClick={onClose} className="w-full">
                  No, Try Again
                </Button>
              </div>
            </div>
          )
        };

      case 'network-error':
        return {
          title: 'Network Connection Lost',
          icon: <WifiOff className="w-16 h-16 text-red-500 mx-auto mb-6" />,
          content: (
            <div className="text-center">
              <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                Message delivery failed due to network connectivity issues. The message has been saved locally.
              </p>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                  📱 Your message will be sent automatically when connection is restored
                </p>
              </div>
              <Button variant="secondary" onClick={onClose} className="w-full">
                Understood
              </Button>
            </div>
          )
        };

      case 'classes-needed-overlay':
        return {
          title: 'Classes Needed Analysis',
          icon: <AlertTriangle className="w-16 h-16 text-primary-500 mx-auto mb-6" />,
          content: (
            <div className="text-center">
              <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                Based on your current attendance, here's what you need to reach 75%.
              </p>
              <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-6 mb-6">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">3 More Classes</div>
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  Attend 3 more classes to reach the minimum 75% requirement
                </p>
              </div>
              <Button variant="primary" onClick={onClose} className="w-full">
                Got It
              </Button>
            </div>
          )
        };

      default:
        return null;
    }
  };

  const modalContent = getModalContent();
  if (!modalContent) return null;

  return (
    <Modal isOpen={!!activeModal} onClose={onClose} title={modalContent.title}>
      {modalContent.icon}
      {modalContent.content}
    </Modal>
  );
};