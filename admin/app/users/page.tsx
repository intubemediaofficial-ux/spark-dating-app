'use client';

import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  age: number;
  gender: string;
  photos: string[];
  city: string | null;
  isVerified: boolean;
  isActive: boolean;
  isBanned: boolean;
  profileApproved: boolean;
  createdAt: string;
  lastActive: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadUsers();
  }, [page, statusFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getUsers(page, search, statusFilter);
      setUsers(data.users);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadUsers();
  };

  const handleBan = async (userId: string) => {
    if (!confirm('Are you sure you want to toggle ban for this user?')) return;
    try {
      await adminAPI.toggleBan(userId);
      loadUsers();
    } catch (error) {
      alert('Failed to ban/unban user');
    }
  };

  const handleApprove = async (userId: string, approved: boolean) => {
    try {
      await adminAPI.approveProfile(userId, approved);
      loadUsers();
    } catch (error) {
      alert('Failed to approve/reject profile');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Users Management</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-400 outline-none"
          />
        </form>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-300 outline-none"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
          <option value="unverified">Unverified</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">User</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Details</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500">No users found</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.photos?.[0] || 'https://via.placeholder.com/40'}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.phone || user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <p>{user.age} yrs, {user.gender}</p>
                    <p className="text-gray-400">{user.city || 'No city'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {user.isBanned && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Banned</span>}
                      {user.isVerified && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Verified</span>}
                      {user.profileApproved && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Approved</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleBan(user.id)}
                        className={`text-xs px-3 py-1 rounded ${user.isBanned ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                      >
                        {user.isBanned ? 'Unban' : 'Ban'}
                      </button>
                      {!user.profileApproved && (
                        <button
                          onClick={() => handleApprove(user.id, true)}
                          className="text-xs px-3 py-1 rounded bg-blue-100 text-blue-700"
                        >
                          Approve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-600">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
