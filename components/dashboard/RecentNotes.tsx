"use client";

import { useEffect, useState } from "react";
import { NotebookPen } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";



type Note = {

  id:number;

  title:string;

  content:string;

};





export default function RecentNotes(){



  const { t } = useLanguage();



  const [notes,setNotes] = useState<Note[]>([]);

  const [loading,setLoading] = useState(true);







  useEffect(()=>{

    fetchNotes();

  },[]);







  async function fetchNotes(){



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

      .from("notes")

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







    setNotes(data || []);

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



        <NotebookPen

          size={18}

          className="text-purple-500"

        />





        <div>



          <h2 className="text-lg font-semibold text-slate-900">


            {t("recentNotes")}


          </h2>






          <p className="text-sm text-slate-500">


            {t("latestIdeas")}


          </p>





        </div>




      </div>








      {loading && (

        <p className="text-sm text-slate-500">

          {t("loadingNotes")}

        </p>

      )}







      {!loading && notes.length === 0 && (

        <p className="text-sm text-slate-500">

          {t("noNotes")}

        </p>

      )}








      <div className="space-y-3">





        {notes.map((note)=>(



          <div

            key={note.id}

            className="
            rounded-lg
            bg-transparent
            p-3
            "

          >




            <h3 className="font-medium text-slate-900">

              {note.title}


            </h3>





            <p className="mt-1 text-sm text-slate-500 line-clamp-2">

              {note.content}


            </p>





          </div>



        ))}





      </div>






    </section>


  );

}