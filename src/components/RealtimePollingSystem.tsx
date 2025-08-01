import React, { useState } from 'react';
import { useRealtimePolling } from '@/hooks/useRealtimePolling';
import RoleSelector from './RoleSelector';
import TeacherInterface from './TeacherInterface';
import StudentInterface from './StudentInterface';

const RealtimePollingSystem: React.FC = () => {
  const { userRole, setUserRole } = useRealtimePolling();

  const handleRoleSelect = (role: 'teacher' | 'student') => {
    setUserRole(role);
  };

  if (!userRole) {
    return <RoleSelector onSelectRole={handleRoleSelect} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 p-4">
      <div className="max-w-6xl mx-auto">
        {userRole === 'teacher' ? <TeacherInterface /> : <StudentInterface />}
      </div>
    </div>
  );
};

export default RealtimePollingSystem;