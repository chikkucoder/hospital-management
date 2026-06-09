import React, { useState, useEffect } from "react";
import { Users, Clock, FileText, Pill } from "lucide-react";

const DoctorDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 45,
    appointmentsToday: 8,
    pendingReports: 3,
    prescriptions: 12,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-emerald-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Patients</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalPatients}</p>
            </div>
            <Users className="w-12 h-12 text-emerald-100" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Appointments Today</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.appointmentsToday}</p>
            </div>
            <Clock className="w-12 h-12 text-blue-100" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Reports</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingReports}</p>
            </div>
            <FileText className="w-12 h-12 text-purple-100" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-orange-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Prescriptions Issued</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.prescriptions}</p>
            </div>
            <Pill className="w-12 h-12 text-orange-100" />
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activities</h2>
        <div className="space-y-4">
          <p className="text-gray-600 text-center py-8">No recent activities</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
