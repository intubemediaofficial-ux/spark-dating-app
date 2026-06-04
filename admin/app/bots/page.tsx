'use client';

import { useEffect, useState } from 'react';

interface Bot {
  id: string;
  name: string;
  age: number;
  gender: string;
  city: string;
  photos: string[];
  isBot: boolean;
}

export default function BotsPage() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, female: 0, male: 0 });
  const [genderFilter, setGenderFilter] = useState('ALL');
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadBots();
  }, [page, genderFilter]);

  const loadBots = async () => {
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const token = localStorage.getItem('admin_token');
      const res = await fetch(
        `${API_URL}/api/admin/bots?page=${page}&gender=${genderFilter}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      if (res.ok) {
        const data = await res.json();
        setBots(data.bots || []);
        setStats(data.stats || { total: 0, female: 0, male: 0 });
      }
    } catch {
      // Failed to load
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Bot Profiles</h2>
        <div className="flex gap-2">
          <select
            value={genderFilter}
            onChange={(e) => { setGenderFilter(e.target.value); setPage(1); }}
            className="border rounded-lg px-3 py-2"
          >
            <option value="ALL">All Genders</option>
            <option value="FEMALE">Female Only</option>
            <option value="MALE">Male Only</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4 border text-center">
          <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
          <p className="text-sm text-blue-600">Total Bots</p>
        </div>
        <div className="bg-pink-50 rounded-xl p-4 border text-center">
          <p className="text-2xl font-bold text-pink-700">{stats.female}</p>
          <p className="text-sm text-pink-600">Female Bots</p>
        </div>
        <div className="bg-indigo-50 rounded-xl p-4 border text-center">
          <p className="text-2xl font-bold text-indigo-700">{stats.male}</p>
          <p className="text-sm text-indigo-600">Male Bots</p>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center py-8">Loading...</p>
      ) : (
        <>
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Photo</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Age</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Gender</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">City</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Photos</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bots.map((bot) => (
                  <tr key={bot.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {bot.photos?.[0] ? (
                        <img src={bot.photos[0]} alt={bot.name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">👤</div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">{bot.name}</td>
                    <td className="px-4 py-3">{bot.age}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        bot.gender === 'FEMALE' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {bot.gender}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{bot.city}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{bot.photos?.length || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-600">Page {page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={bots.length < 20}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
