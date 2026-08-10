"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface QuickShoppingModalProps {
  open: boolean;
  onClose: () => void;
  onShoppingAdded?: () => void;
}

export default function QuickShoppingModal({
  open,
  onClose,
  onShoppingAdded,
}: QuickShoppingModalProps) {
  const [item, setItem] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!item.trim()) {
      setError("Please enter a shopping item.");
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
        .from("shopping_items")
        .insert({
          user_id: user.id,
          name: item.trim(),
          completed: false,
        });

      if (insertError) {
        console.error(
          "Error adding shopping item:",
          insertError
        );

        setError(insertError.message);
        return;
      }

      setItem("");

      onShoppingAdded?.();
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
            Update Shopping
          </h2>

          <button type="button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            value={item}
            onChange={(e) => setItem(e.target.value)}
            placeholder="e.g. Milk"
            autoFocus
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
          />

          {error && (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white transition hover:bg-amber-400 disabled:opacity-50"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Adding..." : "Add Item"}
          </button>
        </form>
      </div>
    </div>
  );
}
