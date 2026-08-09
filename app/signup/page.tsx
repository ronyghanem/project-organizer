"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function SignupPage() {


  const router = useRouter();


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");





  async function handleSignup(e: React.FormEvent) {

    e.preventDefault();

    setLoading(true);
    setError("");



    const { data, error } = await supabase.auth.signUp({

      email,

      password,

      options: {

        data: {

          full_name: name,

        },

      },

    });




    if(error){

      setError(error.message);
      setLoading(false);
      return;

    }





    if(data.user){

      router.push("/");

    }


    setLoading(false);


  }






  return (

    <main className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-slate-50
      p-6
    ">


      <div className="
        w-full
        max-w-md
        rounded-2xl
        bg-white
        p-8
        shadow
      ">


        <h1 className="
          text-3xl
          font-bold
          text-slate-900
        ">
          Create account
        </h1>


        <p className="
          mt-2
          text-slate-500
        ">
          Start organizing your life.
        </p>





        <form
          onSubmit={handleSignup}
          className="mt-6 space-y-4"
        >


          <input

            type="text"

            placeholder="Full name"

            value={name}

            onChange={(e)=>setName(e.target.value)}

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

            {loading ? "Creating..." : "Create account"}

          </button>



        </form>






        <p className="
          mt-6
          text-center
          text-sm
          text-slate-500
        ">

          Already have an account?

          {" "}

          <Link
            href="/login"
            className="text-indigo-600"
          >
            Login
          </Link>


        </p>




      </div>


    </main>

  );

}