import React from 'react';

const PropertiesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 mt-1">Manage your properties</p>
        </div>
        <button className="btn-primary">Add Property</button>
      </div>

      <div className="card">
        <p className="text-gray-600">Properties list will be displayed here.</p>
      </div>
    </div>
  );
};

export default PropertiesPage;
