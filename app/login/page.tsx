"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        console.error("Login error:", error);
        setError(error.message);
        return;
      }

      if (!data.session) {
        setError("Login failed. Please try again.");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch (err) {
      console.error("Unexpected login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError("");
    setGoogleLoading(true);

    try {
      const { error } =
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/`,
          },
        });

      if (error) {
        console.error("Google login error:", error);
        setError(error.message);
        setGoogleLoading(false);
      }

      // If successful, Supabase redirects the browser
      // to Google, so we don't need to do anything else.
    } catch (err) {
      console.error(
        "Unexpected Google login error:",
        err
      );

      setError(
        "Unable to sign in with Google. Please try again."
      );

      setGoogleLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent">
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
            {/* Icon */}
            <div className="relative mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow-lg shadow-violet-900/40">
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 opacity-70 blur-lg animate-glow-pulse" />

              <ShieldCheck
                size={22}
                className="relative text-white"
              />
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Welcome back
            </h1>

            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              Sign in to continue to Life Organizer.
            </p>

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Email / Password form */}
            <form
              onSubmit={handleLogin}
              className="mt-7 space-y-4"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-violet-400/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-violet-500/20"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-300"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-violet-300 transition hover:text-violet-200"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-violet-400/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-violet-500/20"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {/* Login button */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="btn-cosmic group flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in

                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />

              <span className="text-xs font-medium text-slate-500">
                OR
              </span>

              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Google login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading || googleLoading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {googleLoading ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Connecting to Google...
                </>
              ) : (
                <>
                  {/* Google icon */}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill="#4285F4"
                      d="M21.35 12.23c0-.79-.07-1.55-.23-2.23H12v4.22h5.23a4.47 4.47 0 0 1-1.94 2.93v2.43h3.14c1.84-1.7 2.92-4.2 2.92-7.35z"
                    />

                    <path
                      fill="#34A853"
                      d="M12 21.6c2.63 0 4.84-.87 6.45-2.35l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.29v2.51A9.74 9.74 0 0 0 12 21.6z"
                    />

                    <path
                      fill="#FBBC05"
                      d="M6.54 13.71A5.86 5.86 0 0 1 6.23 12c0-.59.1-1.16.31-1.71V7.78H3.29A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.22l3.25-2.51z"
                    />

                    <path
                      fill="#EA4335"
                      d="M12 6.26c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.33 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.71 5.38l3.25 2.51C7.31 7.98 9.46 6.26 12 6.26z"
                    />
                  </svg>

                  Continue with Google
                </>
              )}
            </button>

            {/* Register */}
            <div className="mt-7 text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-violet-300 transition hover:text-violet-200"
              >
                Create an account
              </Link>
            </div>
          </div>

          {/* Security note */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
            <KeyRound size={13} />
            <span>Your account is securely protected.</span>
          </div>
        </div>
      </div>
    </main>
  );
}
