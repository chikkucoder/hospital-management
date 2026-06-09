import React, { useState, useEffect } from "react";

const PendingSamples = () => {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSamples, setSelectedSamples] = useState([]);

  useEffect(() => {
    fetchPendingSamples();
  }, []);

  const fetchPendingSamples = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await labService.getPendingSamples();
      // setSamples(response.data);
      setSamples([]);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching pending samples:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSample = (sampleId) => {
    setSelectedSamples((prev) =>
      prev.includes(sampleId)
        ? prev.filter((id) => id !== sampleId)
        : [...prev, sampleId]
    );
  };

  const handleMarkAsProcessed = async () => {
    if (selectedSamples.length === 0) {
      alert("Please select at least one sample");
      return;
    }

    try {
      // TODO: Replace with actual API call
      // await labService.markSamplesAsProcessed(selectedSamples);
      setSelectedSamples([]);
      fetchPendingSamples();
    } catch (err) {
      setError(err.message);
      console.error("Error marking samples as processed:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Pending Samples</h1>
        {selectedSamples.length > 0 && (
          <button
            onClick={handleMarkAsProcessed}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
          >
            Mark as Processed ({selectedSamples.length})
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {samples.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No pending samples. All samples have been processed!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Sample ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Patient Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Test Type
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Received Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {samples.map((sample) => (
                  <tr
                    key={sample._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedSamples.includes(sample._id)}
                        onChange={() => handleSelectSample(sample._id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {sample.sampleId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {sample.patientName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {sample.testType}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(sample.receivedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {sample.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingSamples;
