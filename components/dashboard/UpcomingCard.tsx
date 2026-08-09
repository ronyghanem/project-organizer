"use client";

import { CalendarDays } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";


export default function UpcomingCard() {


  const { t } = useLanguage();



  return (

    <section
      className="
      rounded-2xl
      border
      border-slate-200
      bg-white
      p-5
      shadow-sm
      "
    >



      <div className="mb-4 flex items-center gap-2">


        <CalendarDays
          size={18}
          className="text-purple-500"
        />


        <div>


          <h2 className="
          text-lg
          font-semibold
          text-slate-900
          ">

            {t("upcoming")}

          </h2>



          <p className="
          text-sm
          text-slate-500
          ">

            {t("yourNextItems")}

          </p>


        </div>


      </div>






      <div className="space-y-3">


        <div
          className="
          rounded-lg
          bg-slate-50
          p-3
          "
        >


          <p className="text-sm text-slate-500">

            2026-08-07

          </p>



          <p className="
          font-medium
          text-slate-900
          ">

            {t("interview")}

          </p>



        </div>



      </div>





    </section>

  );

}