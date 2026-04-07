import React from 'react';

const GuestsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Guests</h1>
          <p className="text-gray-600 mt-1">Guest management</p>
        </div>
        <button className="btn-primary">Add Guest</button>
      </div>

      <div className="card">
        <p className="text-gray-600">Guest list will be displayed here.</p>
      </div>
    </div>
  );
};

export default GuestsPage;
