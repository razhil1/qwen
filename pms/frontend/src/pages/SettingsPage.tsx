import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">System configuration</p>
      </div>

      <div className="card">
        <p className="text-gray-600">Settings and configuration options will be displayed here.</p>
      </div>
    </div>
  );
};

export default SettingsPage;
