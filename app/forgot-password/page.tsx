"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  KeyRound,
  Mail,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const { error } =
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo:
            `${window.location.origin}/reset-password`,
        });

      if (error) {
        console.error("Password reset error:", error);
        setError(error.message);
        return;
      }

      setMessage(
        "Check your email for a password reset link."
      );
    } catch (err) {
      console.error("Unexpected password reset error:", err);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="relative">
            {/* Icon */}
            <div className="relative mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow-lg shadow-violet-900/40">
              <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 opacity-70 blur-lg animate-glow-pulse" />

              <KeyRound
                size={22}
                className="relative text-white"
              />
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Forgot your password?
            </h1>

            <p className="mt-2 text-sm text-slate-400 sm:text-base">
              Enter your email and we&apos;ll send you
              a password reset link.
            </p>

            {/* Form */}
            <form
              onSubmit={handleReset}
              className="mt-7 space-y-4"
            >
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

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* Success */}
              {message && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                  {message}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-cosmic group flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    Send reset link

                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Back to login */}
            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-300 transition hover:text-violet-200"
              >
                <ArrowLeft size={14} />
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
