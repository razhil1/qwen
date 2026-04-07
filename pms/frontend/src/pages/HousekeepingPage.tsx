import React from 'react';

const HousekeepingPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Housekeeping</h1>
          <p className="text-gray-600 mt-1">Cleaning tasks and schedules</p>
        </div>
        <button className="btn-primary">Create Task</button>
      </div>

      <div className="card">
        <p className="text-gray-600">Housekeeping tasks will be displayed here.</p>
      </div>
    </div>
  );
};

export default HousekeepingPage;
