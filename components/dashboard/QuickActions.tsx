"use client";

import {
  Plus,
  NotebookPen,
  ShoppingCart,
  CheckSquare,
} from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";



interface QuickActionsProps {

  onTaskAction?: () => void;

}





export default function QuickActions({

  onTaskAction,

}: QuickActionsProps) {



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




      <div className="mb-5">


        <h2

          className="
          text-lg
          font-semibold
          text-slate-900
          "

        >

          {t("quickActions")}


        </h2>




        <p className="text-sm text-slate-500">


          {t("quickDescription")}


        </p>



      </div>







      <div className="space-y-3">





        <button

          onClick={onTaskAction}

          className="
          flex
          w-full
          items-center
          gap-3
          rounded-xl
          bg-slate-50
          p-4
          text-left
          hover:bg-slate-100
          transition
          "

        >


          <div
            className="
            rounded-lg
            bg-blue-100
            p-2
            "
          >

            <Plus
              size={18}
              className="text-blue-600"
            />

          </div>




          <div>


            <p className="font-medium text-slate-900">

              {t("addTask")}

            </p>


            <p className="text-sm text-slate-500">

              {t("taskDescription")}

            </p>


          </div>



        </button>







        <button

          className="
          flex
          w-full
          items-center
          gap-3
          rounded-xl
          bg-slate-50
          p-4
          text-left
          hover:bg-slate-100
          transition
          "

        >



          <div
            className="
            rounded-lg
            bg-purple-100
            p-2
            "
          >

            <NotebookPen
              size={18}
              className="text-purple-600"
            />

          </div>





          <div>


            <p className="font-medium text-slate-900">

              {t("writeNote")}

            </p>


            <p className="text-sm text-slate-500">

              {t("noteDescription")}

            </p>


          </div>




        </button>








        <button

          className="
          flex
          w-full
          items-center
          gap-3
          rounded-xl
          bg-slate-50
          p-4
          text-left
          hover:bg-slate-100
          transition
          "

        >



          <div

            className="
            rounded-lg
            bg-amber-100
            p-2
            "

          >

            <ShoppingCart

              size={18}

              className="text-amber-600"

            />


          </div>






          <div>


            <p className="font-medium text-slate-900">

              {t("updateShopping")}

            </p>



            <p className="text-sm text-slate-500">

              {t("shoppingDescription")}

            </p>



          </div>




        </button>






      </div>





    </section>


  );

}