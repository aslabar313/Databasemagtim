'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { UserPlus, Shield, User, Key, CheckCircle, AlertCircle } from 'lucide-react';

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('VIEWER');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const supabase = createClient();

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch('/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, fullName, password, role }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Gagal membuat user.');
      }

      setMessage({ type: 'success', text: `User @${username} berhasil dibuat!` });
      setUsername('');
      setFullName('');
      setPassword('');
      setRole('VIEWER');
      setModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Manajemen Pengguna</h1>
          <p className="text-sm text-slate-400">Buat dan kelola akun operator/admin daerah.</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm transition flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Tambah User Baru
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}
        >
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Modal Tambah User */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 max-w-md w-full p-6 rounded-2xl space-y-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white">Tambah Pengguna Baru</h3>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Username (Tanpa Email)</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="contoh: ahmad_magtim"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  placeholder="Ahmad Sholihin"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    placeholder="Minimal 6 karakter"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Role / Hak Akses</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="VIEWER">VIEWER (Hanya Lihat)</option>
                  <option value="OPERATOR">OPERATOR (Input Data Jamaah)</option>
                  <option value="ADMIN">ADMIN (Kelola Data & Operator)</option>
                  <option value="SUPERADMIN">SUPERADMIN (Akses Penuh)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-sm font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabel User */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-700 uppercase text-[11px] tracking-wider">
            <tr>
              <th className="py-3.5 px-6">Username</th>
              <th className="py-3.5 px-6">Nama Lengkap</th>
              <th className="py-3.5 px-6">Role</th>
              <th className="py-3.5 px-6">Status</th>
              <th className="py-3.5 px-6">Dibuat Pada</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">Memuat data pengguna...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">Belum ada data user.</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-700/30 transition">
                  <td className="py-4 px-6 font-semibold text-white">@{u.username}</td>
                  <td className="py-4 px-6">{u.full_name}</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 text-xs rounded font-medium ${u.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {u.is_active ? 'Aktif' : 'Non-aktif'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-400 text-xs">
                    {new Date(u.created_at).toLocaleDateString('id-ID')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
