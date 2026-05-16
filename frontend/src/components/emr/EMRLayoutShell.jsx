import React from "react";
import { ArrowLeftIcon, UserIcon, CalendarIcon, DocumentCheckIcon } from "@heroicons/react/24/outline";

const EMRLayoutShell = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Back Button and Patient Info */}
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors">
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">John Doe</span>
                </div>
                
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  ID: PAT-2024-001
                </div>
                
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4" />
                  <span>May 12, 2026</span>
                </div>
              </div>
            </div>

            {/* Right Section - Save Button */}
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              <DocumentCheckIcon className="h-4 w-4 mr-2" />
              Save Consultation
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Desktop Layout - 3 Panel Grid */}
        <div className="hidden lg:grid lg:grid-cols-4 lg:gap-6">
          {/* Left Panel - 25% */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
              {/* Panel Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Patient info</h2>
              </div>
              
              {/* Panel Content - Scrollable */}
              <div className="px-6 py-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
                <div className="space-y-4">
                  {/* Patient Details Placeholder */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">John Doe</p>
                        <p className="text-sm text-gray-500">35 years, Male</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Blood Group:</span>
                        <span className="ml-1 font-medium">O+</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <span className="ml-1 font-medium">+1 234 567 8900</span>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-gray-500">Emergency Contact:</span>
                      <span className="ml-1 font-medium">Jane Doe (Wife) - +1 234 567 8901</span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-gray-500">Address:</span>
                      <span className="ml-1 font-medium">123 Main St, City, State 12345</span>
                    </div>
                  </div>

                  {/* Appointment History Placeholder */}
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Visits</h3>
                    <div className="space-y-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium text-gray-900">General Checkup</p>
                              <p className="text-xs text-gray-600">Dr. Smith</p>
                            </div>
                            <span className="text-xs text-gray-500">Apr {15 - i}, 2026</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Panel - 50% */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
              {/* Panel Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Consultation</h2>
              </div>
              
              {/* Panel Content - Scrollable */}
              <div className="px-6 py-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
                <div className="space-y-6">
                  {/* Chief Complaint */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chief Complaint
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Enter chief complaint..."
                    ></textarea>
                  </div>

                  {/* Symptoms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Symptoms
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                        Headache
                        <button className="ml-2 text-blue-600 hover:text-blue-800">×</button>
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                        Fever
                        <button className="ml-2 text-blue-600 hover:text-blue-800">×</button>
                      </span>
                    </div>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Add symptom and press Enter..."
                    />
                  </div>

                  {/* Diagnosis */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Diagnosis
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                      placeholder="Enter diagnosis..."
                    ></textarea>
                  </div>

                  {/* Clinical Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clinical Notes
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={6}
                      placeholder="Enter detailed clinical notes..."
                    ></textarea>
                  </div>

                  {/* Vital Signs */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Vital Signs</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Blood Pressure</label>
                        <input
                          type="text"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="120/80"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Heart Rate</label>
                        <input
                          type="text"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="72 bpm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Temperature</label>
                        <input
                          type="text"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="98.6°F"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Weight</label>
                        <input
                          type="text"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="70 kg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Height</label>
                        <input
                          type="text"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="175 cm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">SpO2</label>
                        <input
                          type="text"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          placeholder="98%"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - 25% */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
              {/* Panel Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Prescription</h2>
              </div>
              
              {/* Panel Content - Scrollable */}
              <div className="px-6 py-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
                <div className="space-y-4">
                  {/* Prescription Form */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Diagnosis
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Enter diagnosis..."
                    ></textarea>
                  </div>

                  {/* Medicines */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Medicines
                      </label>
                      <button className="text-blue-500 hover:text-blue-700 text-sm">
                        + Add
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {[1, 2].map((i) => (
                        <div key={i} className="border border-gray-200 rounded-lg p-3">
                          <div className="space-y-2">
                            <input
                              type="text"
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="Medicine name"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                className="px-2 py-1 border border-gray-300 rounded text-sm"
                                placeholder="Dosage"
                              />
                              <input
                                type="text"
                                className="px-2 py-1 border border-gray-300 rounded text-sm"
                                placeholder="Duration"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Additional notes..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Stacked Vertically */}
        <div className="lg:hidden space-y-6">
          {/* Center Panel First on Mobile */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Consultation</h2>
            </div>
            <div className="px-4 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chief Complaint</label>
                  <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={3} placeholder="Enter chief complaint..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
                  <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={4} placeholder="Enter diagnosis..."></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Left Panel - Patient Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Patient info</h2>
            </div>
            <div className="px-4 py-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">John Doe</p>
                    <p className="text-sm text-gray-500">35 years, Male</p>
                  </div>
                </div>
                <div className="text-sm space-y-1">
                  <div><span className="text-gray-500">Blood:</span> <span className="font-medium">O+</span></div>
                  <div><span className="text-gray-500">Phone:</span> <span className="font-medium">+1 234 567 8900</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Prescription */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Prescription</h2>
            </div>
            <div className="px-4 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medicines</label>
                  <div className="border border-gray-200 rounded-lg p-3">
                    <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-sm mb-2" placeholder="Medicine name" />
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" className="px-2 py-1 border border-gray-300 rounded text-sm" placeholder="Dosage" />
                      <input type="text" className="px-2 py-1 border border-gray-300 rounded text-sm" placeholder="Duration" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* File Upload Section - Full Width Below All Panels */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Attachments</h2>
          </div>
          <div className="px-6 py-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="space-y-2">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-lg font-medium text-gray-900">Drop files here or click to upload</p>
                <p className="text-sm text-gray-500">PDF, JPG, PNG up to 5MB each</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMRLayoutShell;
