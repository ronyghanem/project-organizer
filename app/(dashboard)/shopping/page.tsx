"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type Item = {
  id: number;
  name: string;
  completed: boolean;
};

export default function ShoppingPage() {
  const { t } = useLanguage();

  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("shopping_items")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    setItems(data || []);
    setLoading(false);
  }

  async function addItem() {
    if (!name.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("shopping_items")
      .insert({
        name: name.trim(),
        completed: false,
        user_id: user.id,
      });

    if (error) {
      console.log(error);
      return;
    }

    setName("");
    loadItems();
  }

  async function toggleItem(item: Item) {
    const { error } = await supabase
      .from("shopping_items")
      .update({
        completed: !item.completed,
      })
      .eq("id", item.id);

    if (error) {
      console.log(error);
      return;
    }

    loadItems();
  }

  async function deleteItem(id: number) {
    const { error } = await supabase
      .from("shopping_items")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error);
      return;
    }

    loadItems();
  }

  return (
    <main className="w-full min-w-0 space-y-5 sm:space-y-6">

      {/* Page header */}
      <div>
        <h1
          className="
            text-2xl
            font-bold
            tracking-tight
            text-slate-900
            dark:text-white
            sm:text-3xl
          "
        >
          {t("shopping")}
        </h1>
      </div>

      {/* Add item */}
      <div
        className="
          w-full
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-4
          shadow-sm
          sm:p-5
          dark:border-slate-700
          dark:bg-slate-900
        "
      >
        <div
          className="
            flex
            flex-col
            gap-3
            sm:flex-row
          "
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addItem();
              }
            }}
            placeholder={t("shoppingPlaceholder")}
            className="
              min-h-12
              w-full
              min-w-0
              flex-1
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              text-base
              text-slate-900
              outline-none
              placeholder:text-slate-400
              focus:border-indigo-500
              focus:ring-4
              focus:ring-indigo-50
              dark:border-slate-700
              dark:bg-slate-800
              dark:text-white
            "
          />

          <button
            type="button"
            onClick={addItem}
            className="
              flex
              min-h-12
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-slate-900
              px-5
              py-3
              text-sm
              font-medium
              text-white
              transition
              hover:bg-slate-800
              active:scale-[0.99]
              sm:w-auto
              sm:shrink-0
            "
          >
            <Plus size={18} />

            <span>{t("add")}</span>
          </button>
        </div>
      </div>

      {/* Items */}
      <div className="w-full min-w-0 space-y-3">

        {/* Loading */}
        {loading && (
          <div
            className="
              rounded-xl
              border
              border-slate-200
              bg-white
              p-4
              dark:border-slate-700
              dark:bg-slate-900
            "
          >
            <p className="text-sm text-slate-500">
              {t("loading")}
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && items.length === 0 && (
          <div
            className="
              rounded-xl
              border
              border-dashed
              border-slate-300
              bg-white
              px-4
              py-10
              text-center
              dark:border-slate-700
              dark:bg-slate-900
            "
          >
            <p className="text-sm text-slate-500">
              No shopping items yet.
            </p>
          </div>
        )}

        {/* Shopping items */}
        {items.map((item) => (
          <div
            key={item.id}
            className="
              flex
              w-full
              min-w-0
              items-center
              gap-3
              rounded-xl
              border
              border-slate-200
              bg-white
              p-3
              shadow-sm
              sm:p-4
              dark:border-slate-700
              dark:bg-slate-900
            "
          >

            {/* Item */}
            <button
              type="button"
              onClick={() => toggleItem(item)}
              className="
                min-w-0
                flex-1
                cursor-pointer
                rounded-lg
                px-2
                py-2
                text-left
                text-sm
                transition
                hover:bg-slate-50
                sm:text-base
                dark:hover:bg-slate-800
              "
            >
              <span
                className={
                  item.completed
                    ? "block break-words text-slate-400 line-through"
                    : "block break-words text-slate-800 dark:text-white"
                }
              >
                {item.name}
              </span>
            </button>

            {/* Delete */}
            <button
              type="button"
              onClick={() => deleteItem(item.id)}
              aria-label="Delete shopping item"
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-lg
                text-red-500
                transition
                hover:bg-red-50
                hover:text-red-600
                active:scale-95
                dark:hover:bg-red-950/30
              "
            >
              <Trash2 size={18} />
            </button>

          </div>
        ))}

      </div>
    </main>
  );
}
