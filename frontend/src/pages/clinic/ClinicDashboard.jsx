import React, { useState } from "react";
import { Users, Plus, History, ReceiptIndianRupee } from "lucide-react";

const ClinicDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 156,
    newPatients: 12,
    totalBilling: 45000,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Clinic Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Patients</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalPatients}</p>
            </div>
            <Users className="w-12 h-12 text-blue-100" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-green-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">New Patients This Month</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.newPatients}</p>
            </div>
            <Plus className="w-12 h-12 text-green-100" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md border-l-4 border-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Billing</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">₹{stats.totalBilling}</p>
            </div>
            <ReceiptIndianRupee className="w-12 h-12 text-purple-100" />
          </div>
        </div>
      </div>

      {/* Recent Patients */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Patients</h2>
        <div className="space-y-4">
          <p className="text-gray-600 text-center py-8">No recent patients</p>
        </div>
      </div>
    </div>
  );
};

export default ClinicDashboard;
