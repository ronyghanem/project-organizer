"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    <main
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-slate-50
        p-6
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-2xl
          bg-white
          p-8
          shadow
        "
      >
        <h1
          className="
            text-3xl
            font-bold
            text-slate-900
          "
        >
          Welcome back
        </h1>

        <p className="mt-2 text-slate-500">
          Login to your organizer.
        </p>

        <form
          onSubmit={handleLogin}
          className="mt-6 space-y-4"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full
              rounded-xl
              border
              px-4
              py-3
            "
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full
              rounded-xl
              border
              px-4
              py-3
            "
            required
          />

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              rounded-xl
              bg-slate-900
              py-3
              text-white
              hover:bg-slate-800
              disabled:opacity-50
            "
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div
          className="
            mt-6
            space-y-3
            text-center
            text-sm
          "
        >
          <Link
            href="/forgot-password"
            className="text-indigo-600"
          >
            Forgot password?
          </Link>

          <p className="text-slate-500">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-indigo-600"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
