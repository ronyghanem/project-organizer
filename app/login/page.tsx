"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
    setLoading(false);
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        {/* Brand mark */}
        <div className="mb-6 flex flex-col items-center gap-3 text-center sm:mb-8">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow-lg shadow-violet-900/40">
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 opacity-70 blur-xl animate-glow-pulse" />
            <Sparkles size={26} className="relative text-white" />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-violet-300/80">
              Life Organizer
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="glass-panel relative overflow-hidden rounded-3xl border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/40 sm:p-9">
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />

          <div className="relative">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              Sign in to keep your universe organized.
            </p>

            <form onSubmit={handleLogin} className="mt-7 space-y-4">
              <div className="relative">
                <Mail
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-violet-400/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-violet-500/20"
                  required
                />
              </div>

              <div className="relative">
                <Lock
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-violet-400/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-violet-500/20"
                  required
                />
              </div>

              {error && (
                <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-cosmic group flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Login
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 space-y-3 text-center text-sm">
              <Link
                href="/forgot-password"
                className="text-violet-300 transition hover:text-violet-200"
              >
                Forgot password?
              </Link>

              <p className="text-slate-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-violet-300 transition hover:text-violet-200"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
