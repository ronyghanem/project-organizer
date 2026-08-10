"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function initializeRecovery() {
      try {
        /*
         * Supabase PKCE recovery links can arrive as:
         *
         * /reset-password?code=xxxxx
         *
         * Exchange that code for a session first.
         */
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        if (code) {
          console.log("Recovery code detected");

          const { error } =
            await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            console.error(
              "Recovery code exchange error:",
              error
            );

            if (mounted) {
              setError(
                "This password reset link is invalid or has expired."
              );
              setChecking(false);
            }

            return;
          }

          /*
           * Remove the code from the browser URL after
           * exchanging it successfully.
           */
          window.history.replaceState(
            {},
            document.title,
            "/reset-password"
          );

          if (mounted) {
            setError("");
            setChecking(false);
          }

          return;
        }

        /*
         * If there is no code, check whether Supabase already
         * created a recovery session.
         */
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session) {
          setError("");
          setChecking(false);
        } else {
          setError(
            "This password reset link is invalid or has expired."
          );
          setChecking(false);
        }
      } catch (err) {
        console.error(
          "Password recovery initialization error:",
          err
        );

        if (mounted) {
          setError(
            "Unable to verify the password reset link."
          );
          setChecking(false);
        }
      }
    }

    initializeRecovery();

    /*
     * Listen for Supabase recovery events.
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(
          "Auth event:",
          event,
          "Session:",
          !!session
        );

        if (!mounted) return;

        if (
          event === "PASSWORD_RECOVERY" &&
          session
        ) {
          setError("");
          setChecking(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleResetPassword(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters long."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      /*
       * Make sure a recovery session still exists.
       */
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError(
          "Your password reset session has expired. Please request a new reset link."
        );
        return;
      }

      /*
       * Update the password.
       */
      const { error } =
        await supabase.auth.updateUser({
          password,
        });

      if (error) {
        console.error(
          "Update password error:",
          error
        );

        setError(error.message);
        return;
      }

      setSuccess(true);

      /*
       * Sign out after successfully changing the password
       * so the user must log in with the new password.
       */
      await supabase.auth.signOut();

      setTimeout(() => {
        router.replace("/login");
      }, 1500);
    } catch (err) {
      console.error(
        "Unexpected password update error:",
        err
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
        <div className="text-center">
          <Loader2
            size={30}
            className="mx-auto animate-spin text-violet-400"
          />

          <p className="mt-4 text-sm text-slate-400">
            Verifying reset link...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl sm:p-8">

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
            Reset your password
          </h1>

          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            Choose a new password for your account.
          </p>

          {/* Success */}
          {success ? (
            <div className="mt-7 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0"
              />

              <div>
                <p className="font-semibold">
                  Password updated successfully!
                </p>

                <p className="mt-1 text-emerald-300/80">
                  Redirecting you to login...
                </p>
              </div>
            </div>
          ) : error ? (
            <>
              <div className="mt-7 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>

              <div className="mt-6 flex flex-col gap-3 text-center">
                <Link
                  href="/forgot-password"
                  className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-violet-300 transition hover:text-violet-200"
                >
                  Request a new reset link
                  <ArrowRight size={14} />
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-1.5 text-sm font-medium text-slate-400 transition hover:text-white"
                >
                  <ArrowLeft size={14} />
                  Back to login
                </Link>
              </div>
            </>
          ) : (
            <>
              <form
                onSubmit={handleResetPassword}
                className="mt-7 space-y-4"
              >
                {/* New password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    New password
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      id="password"
                      type="password"
                      placeholder="Enter your new password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-violet-400/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-violet-500/20"
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Confirm new password
                  </label>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(
                          e.target.value
                        )
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-violet-400/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-violet-500/20"
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
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
                      Updating password...
                    </>
                  ) : (
                    <>
                      Update password

                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-300 transition hover:text-violet-200"
                >
                  <ArrowLeft size={14} />
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
