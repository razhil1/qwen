import React from 'react';

const MaintenancePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance</h1>
          <p className="text-gray-600 mt-1">Work orders and repairs</p>
        </div>
        <button className="btn-primary">New Work Order</button>
      </div>

      <div className="card">
        <p className="text-gray-600">Maintenance work orders will be displayed here.</p>
      </div>
    </div>
  );
};

export default MaintenancePage;
