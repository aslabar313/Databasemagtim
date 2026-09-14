import { Database, Server, Cloud, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-24 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Database Internal Magetan Timur
        </p>
      </div>

      <div className="relative flex place-items-center my-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-semibold">
            <Database className="w-4 h-4" /> Next.js 15 + Supabase Ready
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Databasemagtim
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Aplikasi database daerah Magetan Timur siap dikembangkan dan dideploy ke Vercel.
          </p>
        </div>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left gap-6">
        <div className="group rounded-xl border border-slate-700 p-6 bg-slate-800/50 hover:bg-slate-800 transition">
          <div className="flex items-center gap-3 mb-3">
            <Server className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-semibold">Supabase Backend</h2>
          </div>
          <p className="text-sm text-slate-400">
            Terintegrasi dengan Supabase untuk autentikasi, database PostgreSQL, dan storage.
          </p>
        </div>

        <div className="group rounded-xl border border-slate-700 p-6 bg-slate-800/50 hover:bg-slate-800 transition">
          <div className="flex items-center gap-3 mb-3">
            <Cloud className="w-6 h-6 text-sky-400" />
            <h2 className="text-xl font-semibold">Vercel Deployment</h2>
          </div>
          <p className="text-sm text-slate-400">
            Siap dipublish langsung melalui integrasi Vercel CI/CD.
          </p>
        </div>

        <div className="group rounded-xl border border-slate-700 p-6 bg-slate-800/50 hover:bg-slate-800 transition">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-semibold">Aman & Responsif</h2>
          </div>
          <p className="text-sm text-slate-400">
            Menggunakan Next.js App Router dan Tailwind CSS untuk performa tinggi.
          </p>
        </div>
      </div>
    </main>
  );
}
