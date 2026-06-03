'use client';

import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';

interface Report {
  id: string;
  reason: string;
  description: string | null;
  status: string;
  createdAt: string;
  reporter: { id: string; name: string; photos: string[] };
  reported: { id: string; name: string; photos: string[]; email: string | null; phone: string | null };
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('PENDING');

  useEffect(() => {
    loadReports();
  }, [statusFilter]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getReports(statusFilter);
      setReports(data.reports);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (reportId: string, status: string, banUser: boolean) => {
    const action = banUser ? 'resolve and BAN the reported user' : 'resolve this report';
    if (!confirm(`Are you sure you want to ${action}?`)) return;
    try {
      await adminAPI.resolveReport(reportId, status, banUser);
      loadReports();
    } catch (error) {
      alert('Failed to resolve report');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Reports</h2>

      {/* Status Filter */}
      <div className="flex gap-3 mb-6">
        {['PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              statusFilter === status
                ? 'bg-red-500 text-white'
                : 'bg-white border text-gray-600 hover:bg-gray-50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-gray-500 py-8">Loading...</p>
        ) : reports.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No reports found</p>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="bg-white rounded-xl border p-5">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  {/* Reporter */}
                  <div className="text-center">
                    <img
                      src={report.reporter.photos?.[0] || 'https://via.placeholder.com/40'}
                      alt={report.reporter.name}
                      className="w-12 h-12 rounded-full object-cover mx-auto"
                    />
                    <p className="text-xs text-gray-500 mt-1">Reporter</p>
                    <p className="text-sm font-medium">{report.reporter.name}</p>
                  </div>

                  <div className="text-2xl self-center text-gray-300">→</div>

                  {/* Reported */}
                  <div className="text-center">
                    <img
                      src={report.reported.photos?.[0] || 'https://via.placeholder.com/40'}
                      alt={report.reported.name}
                      className="w-12 h-12 rounded-full object-cover mx-auto"
                    />
                    <p className="text-xs text-gray-500 mt-1">Reported</p>
                    <p className="text-sm font-medium">{report.reported.name}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                    {report.reason.replace('_', ' ')}
                  </span>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {report.description && (
                <p className="text-sm text-gray-600 mt-3 bg-gray-50 p-3 rounded">
                  &quot;{report.description}&quot;
                </p>
              )}

              {/* Actions */}
              {report.status === 'PENDING' && (
                <div className="flex gap-3 mt-4 pt-3 border-t">
                  <button
                    onClick={() => handleResolve(report.id, 'DISMISSED', false)}
                    className="text-sm px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => handleResolve(report.id, 'RESOLVED', false)}
                    className="text-sm px-4 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
                  >
                    Resolve (Warn)
                  </button>
                  <button
                    onClick={() => handleResolve(report.id, 'RESOLVED', true)}
                    className="text-sm px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    Resolve + Ban User
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
