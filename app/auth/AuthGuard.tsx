"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";


export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {


  const router = useRouter();

  const [loading, setLoading] = useState(true);



  useEffect(() => {


    checkUser();


  }, []);




  async function checkUser() {


    const {
      data
    } = await supabase.auth.getUser();



    if(!data.user){

      router.push("/login");

      return;

    }


    setLoading(false);

  }





  if(loading){

    return (

      <div className="flex min-h-screen items-center justify-center">

        Loading...

      </div>

    );

  }





  return children;


}