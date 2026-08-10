"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface QuickNoteModalProps {
  open: boolean;
  onClose: () => void;
  onNoteAdded?: () => void;
}

export default function QuickNoteModal({
  open,
  onClose,
  onNoteAdded,
}: QuickNoteModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a note title.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in.");
        return;
      }

      const { error: insertError } = await supabase
        .from("notes")
        .insert({
          user_id: user.id,
          title: title.trim(),
          content: content.trim() || null,
        });

      if (insertError) {
        console.error("Error adding note:", insertError);
        setError(insertError.message);
        return;
      }

      setTitle("");
      setContent("");

      onNoteAdded?.();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Write a Note
          </h2>

          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note..."
            rows={5}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
          />

          {error && (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Saving..." : "Save Note"}
          </button>
        </form>
      </div>
    </div>
  );
}
