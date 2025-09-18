import React from 'react';
import type { AttendanceStats } from '../types';

interface AttendanceOverlayProps {
  stats: AttendanceStats;
}

export const AttendanceOverlay: React.FC<AttendanceOverlayProps> = ({ stats }) => {
  return (
    <div className="absolute top-8 left-8 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-2xl p-6 text-neutral-900 dark:text-neutral-100 min-w-72 shadow-soft-lg border border-white/20 dark:border-neutral-800/60">
      <h3 className="font-semibold mb-4 text-lg">Attendance Overview</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-neutral-600 dark:text-neutral-400">Current Percentage</span>
          <span className={`font-bold text-xl ${stats.currentPercentage >= 75 ? 'text-green-600 dark:text-green-400' : 'text-orange-500 dark:text-orange-400'}`}>
            {stats.currentPercentage}%
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-neutral-600 dark:text-neutral-400">Classes Attended</span>
          <span className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">
            {stats.classesAttended}/{stats.totalClasses}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-neutral-600 dark:text-neutral-400">Need for 75%</span>
          <span className="font-semibold text-primary-600 dark:text-primary-400 text-lg">
            {stats.classesNeeded} more
          </span>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-neutral-500 dark:text-neutral-500 mb-2">
          <span>Progress to minimum</span>
          <span>75% required</span>
        </div>
        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-700 ${
              stats.currentPercentage >= 75 ? 'bg-green-500' : 'bg-primary-500'
            }`}
            style={{ width: `${Math.min(stats.currentPercentage, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};