'use client';

import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';

interface Stats {
  totalUsers: number;
  activeUsers: number;
  totalMatches: number;
  pendingReports: number;
  bannedUsers: number;
  newUsersThisWeek: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await adminAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><p className="text-gray-500">Loading...</p></div>;
  }

  const statCards = [
    { title: 'Total Users', value: stats?.totalUsers || 0, icon: '👥', color: 'bg-blue-50 text-blue-700' },
    { title: 'Active Users', value: stats?.activeUsers || 0, icon: '✅', color: 'bg-green-50 text-green-700' },
    { title: 'Total Matches', value: stats?.totalMatches || 0, icon: '💕', color: 'bg-pink-50 text-pink-700' },
    { title: 'Pending Reports', value: stats?.pendingReports || 0, icon: '🚨', color: 'bg-red-50 text-red-700' },
    { title: 'Banned Users', value: stats?.bannedUsers || 0, icon: '🚫', color: 'bg-gray-50 text-gray-700' },
    { title: 'New This Week', value: stats?.newUsersThisWeek || 0, icon: '📈', color: 'bg-purple-50 text-purple-700' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <div key={card.title} className={`rounded-xl p-6 ${card.color} border`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">{card.title}</p>
                <p className="text-3xl font-bold mt-1">{card.value.toLocaleString()}</p>
              </div>
              <span className="text-3xl">{card.icon}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
