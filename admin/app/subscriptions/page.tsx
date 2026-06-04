'use client';

import { useEffect, useState } from 'react';

interface Subscription {
  id: string;
  userId: string;
  userName: string;
  plan: string;
  amount: number;
  status: string;
  startDate: string;
  endDate: string;
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeSubscriptions: 0,
    goldCount: 0,
    platinumCount: 0,
  });

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_URL}/api/admin/subscriptions`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data.subscriptions || []);
        setStats(data.stats || stats);
      }
    } catch {
      // Failed to load
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Subscriptions & Revenue</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 rounded-xl p-4 border text-center">
          <p className="text-2xl font-bold text-green-700">₹{stats.totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-green-600">Total Revenue</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border text-center">
          <p className="text-2xl font-bold text-blue-700">{stats.activeSubscriptions}</p>
          <p className="text-sm text-blue-600">Active Subscriptions</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 border text-center">
          <p className="text-2xl font-bold text-yellow-700">{stats.goldCount}</p>
          <p className="text-sm text-yellow-600">Gold Plan</p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 border text-center">
          <p className="text-2xl font-bold text-purple-700">{stats.platinumCount}</p>
          <p className="text-sm text-purple-600">Platinum Plan</p>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center py-8">Loading...</p>
      ) : subscriptions.length === 0 ? (
        <div className="bg-white rounded-xl p-8 border text-center">
          <p className="text-gray-500 text-lg">No subscriptions yet</p>
          <p className="text-gray-400 text-sm mt-2">Subscriptions will appear here when users purchase plans</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Plan</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Start Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">End Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{sub.userName}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      sub.plan === 'GOLD' ? 'bg-yellow-100 text-yellow-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {sub.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3">₹{sub.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      sub.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(sub.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(sub.endDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
