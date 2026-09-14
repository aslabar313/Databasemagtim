'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Lock, User, AlertCircle, Shield } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const cleanUsername = username.trim().toLowerCase();
      // Mengubah username menjadi sintaks internal email Supabase jika pengguna menginput username
      const authIdentifier = cleanUsername.includes('@')
        ? cleanUsername
        : `${cleanUsername}@magetantimur.internal`;

      const { error: authError } = await supabase.auth.signInWithPassword({
        email: authIdentifier,
        password,
      });

      if (authError) {
        setError('Username atau password salah. Silakan periksa kembali.');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full space-y-8 bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
        <div className="text-center">
          <div className="inline-flex p-3 rounded-xl bg-blue-500/10 text-blue-400 mb-4 border border-blue-500/20">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">DATABASEMAGTIM</h2>
          <p className="mt-2 text-sm text-slate-400">
            Satu Database. Satu Sumber Data. Lebih Mudah Mengelola Jamaah.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Username
              </label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition text-sm"
                  placeholder="masukkan username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Memproses Login...' : 'Masuk Aplikasi'}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-700/50">
          <p className="text-xs text-slate-500">
            Akun dibuat khusus oleh Superadmin (Login menggunakan Username & Password).
          </p>
        </div>
      </div>
    </div>
  );
}
