"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type Note = {
  id: number;
  title: string;
  content: string;
};

export default function NotesPage() {
  const { t } = useLanguage();

  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("notes")
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

    setNotes(data || []);
    setLoading(false);
  }

  async function addNote() {
    if (!title.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("notes")
      .insert({
        title: title.trim(),
        content,
        user_id: user.id,
      });

    if (error) {
      console.log(error);
      return;
    }

    setTitle("");
    setContent("");

    loadNotes();
  }

  async function deleteNote(id: number) {
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error);
      return;
    }

    loadNotes();
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
          {t("notes")}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Write down your ideas, reminders, and important information.
        </p>
      </div>

      {/* Add note */}
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
          dark:border-white/10
          dark:bg-[#0b0b1f]
        "
      >
        <div className="space-y-3">

          {/* Title */}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("noteTitle")}
            className="
              min-h-12
              w-full
              min-w-0
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
              dark:border-white/10
              dark:bg-slate-800
              dark:text-white
            "
          />

          {/* Content */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t("noteContent")}
            rows={5}
            className="
              w-full
              min-w-0
              resize-y
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              text-base
              leading-6
              text-slate-900
              outline-none
              placeholder:text-slate-400
              focus:border-indigo-500
              focus:ring-4
              focus:ring-indigo-50
              dark:border-white/10
              dark:bg-slate-800
              dark:text-white
            "
          />

          {/* Add button */}
          <button
            type="button"
            onClick={addNote}
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
            "
          >
            <Plus size={18} />
            <span>{t("addNote")}</span>
          </button>

        </div>
      </div>

      {/* Notes list */}
      <div
        className="
          grid
          w-full
          min-w-0
          grid-cols-1
          gap-3
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >

        {loading && (
          <div
            className="
              rounded-xl
              border
              border-slate-200
              bg-white
              p-4
              sm:col-span-2
              lg:col-span-3
              dark:border-white/10
              dark:bg-[#0b0b1f]
            "
          >
            <p className="text-sm text-slate-500">
              {t("loading")}
            </p>
          </div>
        )}

        {!loading && notes.length === 0 && (
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
              sm:col-span-2
              lg:col-span-3
              dark:border-white/10
              dark:bg-[#0b0b1f]
            "
          >
            <p className="text-sm text-slate-500">
              No notes yet.
            </p>
          </div>
        )}

        {notes.map((note) => (
          <article
            key={note.id}
            className="
              flex
              min-w-0
              flex-col
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-4
              shadow-sm
              sm:p-5
              dark:border-white/10
              dark:bg-[#0b0b1f]
            "
          >

            {/* Note header */}
            <div className="flex min-w-0 items-start justify-between gap-3">

              <h2
                className="
                  min-w-0
                  flex-1
                  break-words
                  text-base
                  font-semibold
                  text-slate-900
                  sm:text-lg
                  dark:text-white
                "
              >
                {note.title}
              </h2>

              <button
                type="button"
                onClick={() => deleteNote(note.id)}
                aria-label="Delete note"
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

            {/* Note content */}
            {note.content && (
              <p
                className="
                  mt-3
                  break-words
                  whitespace-pre-wrap
                  text-sm
                  leading-6
                  text-slate-600
                  dark:text-slate-400
                "
              >
                {note.content}
              </p>
            )}

          </article>
        ))}

      </div>
    </main>
  );
}
