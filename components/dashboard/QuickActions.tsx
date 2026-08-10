"use client";

import {
  Plus,
  NotebookPen,
  ShoppingCart,
} from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";

interface QuickActionsProps {
  onTaskAction?: () => void;
  onNoteAction?: () => void;
  onShoppingAction?: () => void;
}

export default function QuickActions({
  onTaskAction,
  onNoteAction,
  onShoppingAction,
}: QuickActionsProps) {
  const { t } = useLanguage();

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          {t("quickActions")}
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t("quickDescription")}
        </p>
      </div>

      <div className="space-y-3">

        {/* Add Task */}
        <button
          type="button"
          onClick={onTaskAction}
          className="
            flex w-full items-center gap-3
            rounded-xl
            bg-transparent
            p-4
            text-left
            transition
            hover:bg-slate-100
            dark:hover:bg-white/5
          "
        >
          <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-500/10">
            <Plus
              size={18}
              className="text-blue-600 dark:text-blue-400"
            />
          </div>

          <div>
            <p className="font-medium text-slate-900 dark:text-white">
              {t("addTask")}
            </p>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t("taskDescription")}
            </p>
          </div>
        </button>

        {/* Write Note */}
        <button
          type="button"
          onClick={onNoteAction}
          className="
            flex w-full items-center gap-3
            rounded-xl
            bg-transparent
            p-4
            text-left
            transition
            hover:bg-slate-100
            dark:hover:bg-white/5
          "
        >
          <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-500/10">
            <NotebookPen
              size={18}
              className="text-purple-600 dark:text-purple-400"
            />
          </div>

          <div>
            <p className="font-medium text-slate-900 dark:text-white">
              {t("writeNote")}
            </p>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t("noteDescription")}
            </p>
          </div>
        </button>

        {/* Update Shopping */}
        <button
          type="button"
          onClick={onShoppingAction}
          className="
            flex w-full items-center gap-3
            rounded-xl
            bg-transparent
            p-4
            text-left
            transition
            hover:bg-slate-100
            dark:hover:bg-white/5
          "
        >
          <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-500/10">
            <ShoppingCart
              size={18}
              className="text-amber-600 dark:text-amber-400"
            />
          </div>

          <div>
            <p className="font-medium text-slate-900 dark:text-white">
              {t("updateShopping")}
            </p>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t("shoppingDescription")}
            </p>
          </div>
        </button>

      </div>
    </section>
  );
}
