import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Users, BedDouble, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get('/api/dashboard');
        setDashboardData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  const stats = [
    { name: 'Arrivals Today', value: dashboardData?.arrivals || 0, icon: Calendar, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Departures Today', value: dashboardData?.departures || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'In-House Guests', value: dashboardData?.inHouse || 0, icon: BedDouble, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Available Rooms', value: dashboardData?.roomStatus?.available || 0, icon: DollarSign, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your property management overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`${stat.bg} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Room Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Status Overview</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Available</span>
              <span className="font-medium">{dashboardData?.roomStatus?.available || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Occupied</span>
              <span className="font-medium">{dashboardData?.roomStatus?.occupied || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Dirty</span>
              <span className="font-medium">{dashboardData?.roomStatus?.dirty || 0}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="btn-primary text-sm">New Reservation</button>
            <button className="btn-secondary text-sm">Check-In</button>
            <button className="btn-secondary text-sm">Check-Out</button>
            <button className="btn-secondary text-sm">New Guest</button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
          Attention Needed
        </h3>
        <div className="text-gray-600 text-sm">
          No urgent items requiring attention.
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
