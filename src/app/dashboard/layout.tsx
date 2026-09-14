import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Users, Home, UserCheck, Shield, LogOut, Search, Activity, Database } from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-slate-700 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600 text-white">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">DATABASEMAGTIM</h1>
              <span className="text-xs text-blue-400 font-medium">Internal System</span>
            </div>
          </div>

          <nav className="p-4 space-y-1 text-sm">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-300 hover:bg-slate-700 hover:text-white transition"
            >
              <Home className="w-4 h-4 text-blue-400" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/dashboard/jamaah"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-300 hover:bg-slate-700 hover:text-white transition"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Data Jamaah</span>
            </Link>

            <Link
              href="/dashboard/keluarga"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-300 hover:bg-slate-700 hover:text-white transition"
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>Data Keluarga</span>
            </Link>

            {profile?.role === 'SUPERADMIN' && (
              <>
                <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Superadmin
                </div>

                <Link
                  href="/dashboard/users"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-300 hover:bg-slate-700 hover:text-white transition"
                >
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span>Manajemen User</span>
                </Link>

                <Link
                  href="/dashboard/logs"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-300 hover:bg-slate-700 hover:text-white transition"
                >
                  <Activity className="w-4 h-4 text-rose-400" />
                  <span>Activity Logs</span>
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* User Footer Profile */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <div className="truncate pr-2">
              <p className="text-sm font-semibold text-white truncate">
                {profile?.full_name || user.email}
              </p>
              <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {profile?.role || 'VIEWER'}
              </span>
            </div>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-slate-800 border-b border-slate-700 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari Jamaah, NIK, atau Kepala Keluarga..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-1.5 pl-9 pr-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>
          <div className="text-xs text-slate-400">
            Magetan Timur &bull; Database System
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-8 overflow-y-auto bg-slate-900">
          {children}
        </main>
      </div>
    </div>
  );
}
