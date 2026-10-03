import React, { useEffect, useState } from 'react';
import { Users, Search, ShieldCheck, User as UserIcon } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { User, PaginatedResult } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';

export const UserListPage: React.FC = () => {
  const { showToast } = useToast();
  const [data, setData] = useState<PaginatedResult<User> | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({ search, limit: 20 });
      if (res.data) setData(res.data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch user directory', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-sky-400" /> User Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">View registered customer profiles and activity metrics (Password hashes hidden)</p>
        </div>

        <div className="relative max-w-xs">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <LoadingSpinner label="Loading user directory..." />
      ) : (
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-950/60">
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Joined Date</th>
                  <th className="py-3.5 px-4">Activity</th>
                </tr>
              </thead>
              <tbody>
                {data?.items && data.items.length > 0 ? (
                  data.items.map((u) => (
                    <tr key={u.id} className="border-b border-slate-800/60 hover:bg-slate-800/40">
                      <td className="py-3 px-4 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-sky-400 font-bold text-xs flex items-center justify-center border border-slate-700">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-white">{u.name}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{u.email}</td>
                      <td className="py-3 px-4">
                        {u.role === 'ADMIN' ? (
                          <span className="bg-sky-500/10 text-sky-400 font-bold text-[11px] px-2.5 py-0.5 rounded-full border border-sky-500/20">ADMIN</span>
                        ) : (
                          <span className="bg-slate-800 text-slate-300 font-medium text-[11px] px-2.5 py-0.5 rounded-full">CUSTOMER</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 font-semibold text-slate-300">
                        {u._count?.orders || 0} orders • {u._count?.reviews || 0} reviews
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
