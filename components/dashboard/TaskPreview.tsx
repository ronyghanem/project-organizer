"use client";

import { useEffect, useState } from "react";
import { CheckSquare } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";



type Task = {

  id:number;

  title:string;

  completed:boolean;

};





export default function TaskPreview(){



  const { t } = useLanguage();



  const [tasks,setTasks] = useState<Task[]>([]);

  const [loading,setLoading] = useState(true);








  useEffect(()=>{

    fetchTasks();

  },[]);








  async function fetchTasks(){


    const {

      data:{
        user

      }

    } = await supabase.auth.getUser();




    if(!user){

      setLoading(false);

      return;

    }






    const {

      data,

      error

    } = await supabase

      .from("tasks")

      .select("*")

      .eq(
        "user_id",
        user.id
      )

      .order(
        "created_at",
        {
          ascending:false
        }

      )

      .limit(5);







    if(error){

      console.log(error);

      setLoading(false);

      return;

    }






    setTasks(data || []);

    setLoading(false);


  }









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



        <CheckSquare

          size={18}

          className="text-blue-500"

        />





        <div>


          <h2

            className="
            text-lg
            font-semibold
            text-slate-900
            "

          >

            {t("tasks")}


          </h2>




          <p className="text-sm text-slate-500">

            {t("taskPriority")}


          </p>



        </div>




      </div>








      {loading && (

        <p className="text-sm text-slate-500">

          {t("loadingTasks")}

        </p>

      )}








      {!loading && tasks.length === 0 && (

        <p className="text-sm text-slate-500">

          {t("noTasks")}

        </p>

      )}








      <div className="space-y-2">



        {tasks.map((task)=>(



          <div

            key={task.id}

            className="
            flex
            justify-between
            rounded-lg
            bg-transparent
            px-3
            py-2
            "

          >





            <span

              className={

                task.completed

                ?

                "text-sm text-slate-400 line-through"

                :

                "text-sm text-slate-700"

              }

            >

              {task.title}


            </span>






            <span className="text-xs text-slate-500">


              {

                task.completed

                ?

                t("done")

                :

                t("pending")

              }


            </span>





          </div>



        ))}





      </div>






    </section>


  );

}