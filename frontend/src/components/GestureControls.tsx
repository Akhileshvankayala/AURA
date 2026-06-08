import React, { useState } from 'react';
import { Card } from './ui/Card';

export const GestureControls: React.FC<GestureControlsProps> = () => {
  const [hoveredGesture, setHoveredGesture] = useState<string | null>(null);

  const gestures = [
    { emoji: '👋', name: 'wave', label: 'Mark Attendance', description: 'Show WAVE gesture to mark attendance', action: 'mark_attendance' },
    { emoji: '✌️', name: 'peace', label: 'View Stats', description: 'Show PEACE gesture to view stats', action: 'view_stats' },
    { emoji: '🤟', name: 'rock', label: 'Open Chat', description: 'Show ROCK gesture to open chat', action: 'open_chat' },
    { emoji: '✊', name: 'fist', label: 'Teacher View', description: 'Show FIST gesture to teacher view', action: 'teacher_view' }
  ];

  return (
    <div className="animate-slide-up">
      <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">Gesture Controls</h3>
      <div className="grid grid-cols-4 gap-4">
        {gestures.map((gesture, index) => (
          <div
            key={gesture.name}
            className="relative animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
            onMouseEnter={() => setHoveredGesture(gesture.name)}
            onMouseLeave={() => setHoveredGesture(null)}
          >
            <Card
              hover
              className="p-6 text-center group relative overflow-hidden"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {gesture.emoji}
              </div>
              <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">
                {gesture.label}
              </div>
              {hoveredGesture === gesture.name && (
                <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap z-10 animate-scale-in shadow-soft-lg">
                  {gesture.description}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-900 dark:border-t-neutral-100"></div>
                </div>
              )}
            </Card>
          </div>
        ))}
      </div>
      <p className="text-neutral-500 dark:text-neutral-500 mt-6 text-center">
        Use hand gestures in front of the camera or click the icons above
      </p>
    </div>
  );
};