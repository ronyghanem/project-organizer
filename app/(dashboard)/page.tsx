"use client";

import { useEffect, useState } from "react";

import Header from "@/components/dashboard/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import UpcomingCard from "@/components/dashboard/UpcomingCard";
import QuickActions from "@/components/dashboard/QuickActions";
import ShoppingPreview from "@/components/dashboard/ShoppingPreview";
import TaskPreview from "@/components/dashboard/TaskPreview";
import RecentNotes from "@/components/dashboard/RecentNotes";
import QuickAddModal from "@/components/dashboard/QuickAddModal";
import PlanTodayModal from "@/components/dashboard/PlanTodayModal";

import {
  CheckCircle2,
  CalendarDays,
  ShoppingCart,
  BriefcaseBusiness,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [planTodayOpen, setPlanTodayOpen] = useState(false);

  const [stats, setStats] = useState({
    tasks: 0,
    events: 0,
    shopping: 0,
    interviews: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { count: tasksCount } = await supabase
      .from("tasks")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id);

    const { count: eventsCount } = await supabase
      .from("events")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id);

    const { count: shoppingCount } = await supabase
      .from("shopping_items")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id);

    const { count: interviewsCount } = await supabase
      .from("interviews")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("user_id", user.id);

    setStats({
      tasks: tasksCount ?? 0,
      events: eventsCount ?? 0,
      shopping: shoppingCount ?? 0,
      interviews: interviewsCount ?? 0,
    });
  }

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-slate-50
        transition-colors
        duration-500
        dark:bg-slate-950
      "
    >
      {/* Background glow - Light mode */}
      <div
        className="
          pointer-events-none
          absolute
          -left-32
          -top-32
          h-72
          w-72
          rounded-full
          bg-indigo-300/20
          blur-3xl
          dark:bg-indigo-500/10
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[-120px]
          top-1/3
          h-80
          w-80
          rounded-full
          bg-purple-300/20
          blur-3xl
          dark:bg-purple-500/10
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-[-150px]
          left-1/3
          h-80
          w-80
          rounded-full
          bg-blue-300/10
          blur-3xl
          dark:bg-blue-500/10
        "
      />

      <div className="relative z-10 space-y-6">

        {/* Header */}
        <div
          className="
            rounded-3xl
            border
            border-white/60
            bg-white/65
            p-4
            shadow-sm
            backdrop-blur-xl
            transition-all
            duration-500
            sm:p-5
            lg:p-6

            dark:border-white/10
            dark:bg-slate-900/60
            dark:shadow-black/20
          "
        >
          <Header
            onPlanToday={() => setPlanTodayOpen(true)}
          />
        </div>

        {/* Statistics */}
        <section
          className="
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          <StatsCard
            title={t("tasks")}
            value={String(stats.tasks)}
            detail={t("totalTasks")}
            icon={CheckCircle2}
            accent="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
          />

          <StatsCard
            title={t("calendar")}
            value={String(stats.events)}
            detail={t("upcomingEvents")}
            icon={CalendarDays}
            accent="bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
          />

          <StatsCard
            title={t("shopping")}
            value={String(stats.shopping)}
            detail={t("itemsRemaining")}
            icon={ShoppingCart}
            accent="bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
          />

          <StatsCard
            title={t("interviews")}
            value={String(stats.interviews)}
            detail={t("applications")}
            icon={BriefcaseBusiness}
            accent="bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
          />
        </section>

        {/* Main dashboard */}
        <section
          className="
            grid
            grid-cols-1
            gap-5
            lg:grid-cols-2
          "
        >
          {/* Quick Actions */}
          <div
            className="
              rounded-3xl
              border
              border-white/60
              bg-white/65
              p-4
              shadow-sm
              backdrop-blur-xl
              transition-all
              duration-300
              hover:shadow-lg
              sm:p-5

              dark:border-white/10
              dark:bg-slate-900/60
              dark:shadow-black/20
            "
          >
            <QuickActions
              onTaskAction={() => setQuickAddOpen(true)}
            />
          </div>

          {/* Upcoming */}
          <div
            className="
              rounded-3xl
              border
              border-white/60
              bg-white/65
              p-4
              shadow-sm
              backdrop-blur-xl
              transition-all
              duration-300
              hover:shadow-lg
              sm:p-5

              dark:border-white/10
              dark:bg-slate-900/60
              dark:shadow-black/20
            "
          >
            <UpcomingCard />
          </div>

          {/* Shopping */}
          <div
            className="
              rounded-3xl
              border
              border-white/60
              bg-white/65
              p-4
              shadow-sm
              backdrop-blur-xl
              transition-all
              duration-300
              hover:shadow-lg
              sm:p-5

              dark:border-white/10
              dark:bg-slate-900/60
              dark:shadow-black/20
            "
          >
            <ShoppingPreview />
          </div>

          {/* Tasks */}
          <div
            className="
              rounded-3xl
              border
              border-white/60
              bg-white/65
              p-4
              shadow-sm
              backdrop-blur-xl
              transition-all
              duration-300
              hover:shadow-lg
              sm:p-5

              dark:border-white/10
              dark:bg-slate-900/60
              dark:shadow-black/20
            "
          >
            <TaskPreview />
          </div>

          {/* Notes */}
          <div
            className="
              rounded-3xl
              border
              border-white/60
              bg-white/65
              p-4
              shadow-sm
              backdrop-blur-xl
              transition-all
              duration-300
              hover:shadow-lg
              sm:p-5
              lg:col-span-2

              dark:border-white/10
              dark:bg-slate-900/60
              dark:shadow-black/20
            "
          >
            <RecentNotes />
          </div>
        </section>

      </div>

      {/* Modals */}
      <QuickAddModal
        open={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
      />

      <PlanTodayModal
        open={planTodayOpen}
        onClose={() => setPlanTodayOpen(false)}
      />
    </main>
  );
}
