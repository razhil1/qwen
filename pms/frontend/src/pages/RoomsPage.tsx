import React from 'react';

const RoomsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rooms</h1>
          <p className="text-gray-600 mt-1">Room inventory management</p>
        </div>
        <button className="btn-primary">Add Room</button>
      </div>

      <div className="card">
        <p className="text-gray-600">Room grid and status will be displayed here.</p>
      </div>
    </div>
  );
};

export default RoomsPage;
