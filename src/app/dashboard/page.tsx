import { createClient } from '@/lib/supabase/server';
import { Users, UserCheck, Shield, Activity, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();

  const [{ count: countJamaah }, { count: countKeluarga }, { count: countUsers }] = await Promise.all([
    supabase.from('members').select('*', { count: 'exact', head: true }),
    supabase.from('families').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Utama</h1>
        <p className="text-sm text-slate-400">Ringkasan statistik data jamaah Daerah Magetan Timur.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Total Jamaah</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">{countJamaah || 0}</h3>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Total Keluarga</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">{countKeluarga || 0}</h3>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Total Pengguna Sistem</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">{countUsers || 0}</h3>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
            <Shield className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 to-slate-800 border border-blue-500/30 p-6 rounded-2xl flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold text-white">Manajemen Data Jamaah</h3>
          <p className="text-sm text-slate-400">Tambahkan atau sesuaikan data jamaah dan kelompok di Daerah Magetan Timur.</p>
        </div>
        <Link
          href="/dashboard/jamaah"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Kelola Jamaah
        </Link>
      </div>
    </div>
  );
}
