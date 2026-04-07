import React from 'react';

const ReservationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
          <p className="text-gray-600 mt-1">Manage bookings and reservations</p>
        </div>
        <button className="btn-primary">New Reservation</button>
      </div>

      <div className="card">
        <p className="text-gray-600">Reservations calendar and list will be displayed here.</p>
      </div>
    </div>
  );
};

export default ReservationsPage;
