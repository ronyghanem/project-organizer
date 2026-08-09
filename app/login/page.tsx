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




    if(error){

      setError(error.message);
      setLoading(false);
      return;

    }



    router.push("/");

    setLoading(false);

  }






  async function handleGoogleLogin() {
  setLoading(true);
  setError("");

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://organ-izer.vercel.app";

  const { error } =
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          `${siteUrl}/auth/callback`,
      },
    });

  if (error) {
    console.error(
      "Google login error:",
      error
    );

    setError(error.message);
    setLoading(false);
  }
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

            onChange={(e)=>setEmail(e.target.value)}

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

            onChange={(e)=>setPassword(e.target.value)}

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

            disabled={loading}

            className="
            w-full
            rounded-xl
            bg-slate-900
            py-3
            text-white
            hover:bg-slate-800
            "

          >

            {loading ? "Logging in..." : "Login"}

          </button>



        </form>







        <div className="my-6 flex items-center gap-3">


          <div className="h-px flex-1 bg-slate-200"/>


          <span className="text-sm text-slate-400">
            OR
          </span>


          <div className="h-px flex-1 bg-slate-200"/>


        </div>







        <button

          type="button"

          onClick={handleGoogleLogin}

          disabled={loading}

          className="
          flex
          w-full
          items-center
          justify-center
          gap-3
          rounded-xl
          border
          border-slate-200
          py-3
          hover:bg-slate-50
          "

        >


          <img

            src="https://www.google.com/favicon.ico"

            className="h-5 w-5"

            alt="Google"

          />


          Continue with Google


        </button>







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


            Don't have an account?


            {" "}


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