"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";



type ShoppingItem = {

  id:number;

  name:string;

  completed:boolean;

};





export default function ShoppingPreview(){



  const { t } = useLanguage();



  const [items,setItems] = useState<ShoppingItem[]>([]);

  const [loading,setLoading] = useState(true);







  useEffect(()=>{

    fetchItems();

  },[]);








  async function fetchItems(){



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

      .from("shopping_items")

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






    setItems(data || []);

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


        <ShoppingCart

          size={18}

          className="text-amber-500"

        />





        <div>


          <h2 className="text-lg font-semibold text-slate-900">


            {t("shopping")}


          </h2>





          <p className="text-sm text-slate-500">


            {t("remainingItems")}


          </p>



        </div>



      </div>








      {loading && (

        <p className="text-sm text-slate-500">

          {t("loadingShopping")}

        </p>

      )}







      {!loading && items.length === 0 && (

        <p className="text-sm text-slate-500">

          {t("noShopping")}

        </p>

      )}








      <div className="space-y-2">



        {items.map((item)=>(



          <div

            key={item.id}

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

                item.completed

                ?

                "text-sm text-slate-400 line-through"

                :

                "text-sm text-slate-700"

              }

            >

              {item.name}


            </span>






            <span className="text-xs text-slate-500">


              {

                item.completed

                ?

                t("bought")

                :

                t("needed")

              }


            </span>




          </div>



        ))}




      </div>







    </section>


  );

}