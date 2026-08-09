"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Sparkles } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";



interface HeaderProps {

  onPlanToday?: () => void;

}





export default function Header({

  onPlanToday,

}: HeaderProps) {



  const { t } = useLanguage();



  const [name,setName] = useState("User");

  const [avatar,setAvatar] = useState("");






  useEffect(()=>{

    loadProfile();

  },[]);







  async function loadProfile(){



    const {

      data:{
        user
      }

    } = await supabase.auth.getUser();




    if(!user) return;





    setName(

      user.user_metadata?.full_name ||

      user.email?.split("@")[0] ||

      "User"

    );





    setAvatar(

      user.user_metadata?.avatar_url ||

      ""

    );



  }









  return (


    <div

      className="
      rounded-2xl
      border
      border-slate-200
      bg-white
      p-6
      shadow-sm
      flex
      flex-col
      gap-5
      md:flex-row
      md:items-center
      md:justify-between
      "

    >




      <div>



        <p

          className="
          flex
          items-center
          gap-2
          text-sm
          font-medium
          text-indigo-600
          "

        >

          <Sparkles size={16}/>


          {t("dailyOverview") || "Daily overview"}


        </p>






        <div className="mt-3 flex items-center gap-3">


          {
            avatar && (

              <img

                src={avatar}

                alt="avatar"

                className="
                h-12
                w-12
                rounded-full
                object-cover
                "

              />

            )
          }





          <h1

            className="
            text-3xl
            font-semibold
            text-slate-900
            "

          >

            {t("welcome")} {name} 👋


          </h1>




        </div>







        <p

          className="
          mt-2
          text-sm
          text-slate-500
          "

        >

          {t("description") ||
          "You have tasks, notes, interviews, and events to manage today."}



        </p>



      </div>








      <button

        onClick={onPlanToday}

        className="
        flex
        items-center
        justify-center
        gap-2
        rounded-xl
        bg-slate-900
        px-5
        py-3
        text-white
        hover:bg-slate-800
        "

      >

        <CalendarDays size={18}/>


        {t("plan")}



      </button>






    </div>


  );


}