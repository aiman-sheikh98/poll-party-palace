import React from 'react';
import PastPollResults from '@/components/PastPollResults';

const Analytics: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 p-4">
      <div className="max-w-6xl mx-auto">
        <PastPollResults />
      </div>
    </div>
  );
};

export default Analytics;