"use client";

import { X } from "lucide-react";


interface QuickAddModalProps {
  open: boolean;
  onClose: () => void;
}


export default function QuickAddModal({
  open,
  onClose,
}: QuickAddModalProps) {


  if (!open) return null;


  return (

    <div
      className="
      fixed
      inset-0
      z-[9999]
      flex
      items-center
      justify-center
      bg-black/50
      "
    >


      <div
        className="
        w-full
        max-w-md
        rounded-2xl
        bg-white
        p-6
        shadow-xl
        "
      >


        <div className="flex items-center justify-between">


          <h2 className="text-xl font-semibold">
            Quick Add
          </h2>


          <button
            onClick={onClose}
          >

            <X size={20}/>

          </button>


        </div>



        <p className="mt-5 text-slate-600">

          Modal is working 🎉

        </p>



      </div>


    </div>

  );

}