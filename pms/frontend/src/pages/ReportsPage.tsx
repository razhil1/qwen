import React from 'react';

const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">Analytics and reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-2">Revenue Report</h3>
          <p className="text-gray-600 text-sm">Daily, weekly, monthly revenue</p>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">Occupancy Report</h3>
          <p className="text-gray-600 text-sm">Occupancy rates over time</p>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">Guest Report</h3>
          <p className="text-gray-600 text-sm">Guest demographics and sources</p>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
