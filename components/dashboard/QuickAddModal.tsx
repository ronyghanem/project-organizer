"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface QuickAddModalProps {
  open: boolean;
  onClose: () => void;
  onTaskAdded?: () => void;
}

export default function QuickAddModal({
  open,
  onClose,
  onTaskAdded,
}: QuickAddModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("You must be logged in to add a task.");
        return;
      }

      const { error: insertError } = await supabase
        .from("tasks")
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim() || null,
          completed: false,
        });

      if (insertError) {
        console.error("Error adding task:", insertError);

        setError(
          insertError.message || "Unable to add task. Please try again."
        );

        return;
      }

      // Reset form
      setTitle("");
      setDescription("");

      // Tell the dashboard that a task was added
      onTaskAdded?.();

      // Close modal
      onClose();
    } catch (error) {
      console.error("Unexpected error adding task:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-black/50
        p-4
      "
      onClick={onClose}
    >
      <div
        className="
          w-full max-w-md
          rounded-2xl
          border border-slate-200
          bg-white
          p-6
          shadow-xl
          dark:border-white/10
          dark:bg-slate-900
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Add Task
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg p-2
              text-slate-500
              transition
              hover:bg-slate-100
              hover:text-slate-900
              dark:hover:bg-white/10
              dark:hover:text-white
            "
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="task-title"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Task title
            </label>

            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Finish project report"
              autoFocus
              className="
                w-full rounded-xl
                border border-slate-200
                bg-slate-50
                px-4 py-3
                text-sm text-slate-900
                outline-none
                transition
                focus:border-violet-400
                focus:ring-2
                focus:ring-violet-500/20
                dark:border-white/10
                dark:bg-white/5
                dark:text-white
                dark:placeholder-slate-500
              "
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="task-description"
              className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Description
              <span className="ml-1 font-normal text-slate-400">
                (optional)
              </span>
            </label>

            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add some details..."
              rows={3}
              className="
                w-full resize-none rounded-xl
                border border-slate-200
                bg-slate-50
                px-4 py-3
                text-sm text-slate-900
                outline-none
                transition
                focus:border-violet-400
                focus:ring-2
                focus:ring-violet-500/20
                dark:border-white/10
                dark:bg-white/5
                dark:text-white
                dark:placeholder-slate-500
              "
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                flex-1 rounded-xl
                border border-slate-200
                px-4 py-3
                text-sm font-medium
                text-slate-700
                transition
                hover:bg-slate-100
                disabled:opacity-50
                dark:border-white/10
                dark:text-slate-300
                dark:hover:bg-white/5
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                flex-1 rounded-xl
                bg-violet-600
                px-4 py-3
                text-sm font-semibold
                text-white
                transition
                hover:bg-violet-500
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Adding...
                </span>
              ) : (
                "Add Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
