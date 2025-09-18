import React from 'react';
import { Users, TrendingUp, AlertTriangle, Trophy, BookOpen, Clock, ArrowLeft } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import type { Student } from '../types';

interface TeacherDashboardProps {
  onBack: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onBack }) => {
  const students: Student[] = [
    { id: '1', name: 'Alice Johnson', attendance: 95, classesAttended: 28, totalClasses: 30, status: 'hero' },
    { id: '2', name: 'Bob Smith', attendance: 87, classesAttended: 26, totalClasses: 30, status: 'normal' },
    { id: '3', name: 'Charlie Brown', attendance: 78, classesAttended: 23, totalClasses: 30, status: 'normal' },
    { id: '4', name: 'Diana Prince', attendance: 92, classesAttended: 27, totalClasses: 30, status: 'hero' },
    { id: '5', name: 'Eva Martinez', attendance: 68, classesAttended: 20, totalClasses: 30, status: 'edge' },
    { id: '6', name: 'Frank Wilson', attendance: 73, classesAttended: 22, totalClasses: 30, status: 'edge' }
  ];

  const totalPresent = 24;
  const classAverage = 82;
  const belowThreshold = students.filter(s => s.attendance < 75).length;

  const getStatusBadge = (status: Student['status']) => {
    switch (status) {
      case 'hero':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
            <Trophy className="w-3 h-3 mr-1" />
            Hero
          </span>
        );
      case 'edge':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            At Risk
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
            Normal
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50/30 dark:from-neutral-900 dark:to-neutral-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Teacher Dashboard</h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">Class overview and student analytics</p>
          </div>
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Student View</span>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium mb-1">Students Present</p>
                <p className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">{totalPresent}</p>
                <p className="text-green-600 dark:text-green-400 text-sm font-medium flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +3 from last class
                </p>
              </div>
              <div className="p-4 bg-primary-500 rounded-2xl shadow-soft">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium mb-1">Class Average</p>
                <p className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">{classAverage}%</p>
                <p className="text-green-600 dark:text-green-400 text-sm font-medium flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Above target (75%)
                </p>
              </div>
              <div className="p-4 bg-green-500 rounded-2xl shadow-soft">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm font-medium mb-1">Below 75%</p>
                <p className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">{belowThreshold}</p>
                <p className="text-orange-500 dark:text-orange-400 text-sm font-medium flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Need attention
                </p>
              </div>
              <div className="p-4 bg-orange-500 rounded-2xl shadow-soft">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Student Leaderboard */}
        <Card className="p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Student Leaderboard</h2>
            <div className="flex items-center space-x-2 text-sm text-neutral-500 dark:text-neutral-500">
              <Clock className="w-4 h-4" />
              <span>Updated 5 minutes ago</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="text-left py-4 px-4 font-semibold text-neutral-700 dark:text-neutral-300 text-sm uppercase tracking-wide">Rank</th>
                  <th className="text-left py-4 px-4 font-semibold text-neutral-700 dark:text-neutral-300 text-sm uppercase tracking-wide">Name</th>
                  <th className="text-center py-4 px-4 font-semibold text-neutral-700 dark:text-neutral-300 text-sm uppercase tracking-wide">Attendance</th>
                  <th className="text-center py-4 px-4 font-semibold text-neutral-700 dark:text-neutral-300 text-sm uppercase tracking-wide">Classes</th>
                  <th className="text-center py-4 px-4 font-semibold text-neutral-700 dark:text-neutral-300 text-sm uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {students
                  .sort((a, b) => b.attendance - a.attendance)
                  .map((student, index) => (
                    <tr key={student.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="py-5 px-4">
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">#{index + 1}</span>
                          {index < 3 && (
                            <Trophy className={`w-4 h-4 ml-2 ${
                              index === 0 ? 'text-yellow-500' : 
                              index === 1 ? 'text-neutral-400' : 'text-orange-500'
                            }`} />
                          )}
                        </div>
                      </td>
                      <td className="py-5 px-4">
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100 text-lg">{student.name}</div>
                      </td>
                      <td className="py-5 px-4 text-center">
                        <span className={`font-bold text-xl ${
                          student.attendance >= 90 ? 'text-green-600 dark:text-green-400' :
                          student.attendance >= 75 ? 'text-primary-600 dark:text-primary-400' :
                          'text-red-500 dark:text-red-400'
                        }`}>
                          {student.attendance}%
                        </span>
                      </td>
                      <td className="py-5 px-4 text-center">
                        <span className="text-neutral-600 dark:text-neutral-400 font-medium">
                          {student.classesAttended}/{student.totalClasses}
                        </span>
                      </td>
                      <td className="py-5 px-4 text-center">
                        {getStatusBadge(student.status)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};