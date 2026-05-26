import React, { useState, useEffect } from "react";
import { Microscope, Clock, FileText } from "lucide-react";

const LabDashboard = () => {
  const [stats, setStats] = useState({
    totalReports: 125,
    pendingTests: 8,
    completedToday: 15,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Lab Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Reports</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalReports}</p>
            </div>
            <Microscope className="w-12 h-12 text-purple-100" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-orange-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Tests</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingTests}</p>
            </div>
            <Clock className="w-12 h-12 text-orange-100" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Completed Today</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.completedToday}</p>
            </div>
            <FileText className="w-12 h-12 text-green-100" />
          </div>
        </div>
      </div>

      {/* Queue */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Lab Tests Queue</h2>
        <div className="space-y-4">
          <p className="text-gray-600 text-center py-8">No pending tests in queue</p>
        </div>
      </div>
    </div>
  );
};

export default LabDashboard;
