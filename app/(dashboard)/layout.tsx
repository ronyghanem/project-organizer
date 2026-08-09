"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

import Sidebar from "@/components/Sidebar";
import AuthGuard from "@/app/auth/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="flex min-h-screen w-full overflow-x-hidden bg-slate-50 dark:bg-slate-950">

        {/* ================= DESKTOP SIDEBAR ================= */}

        <aside className="hidden lg:block">
          <Sidebar />
        </aside>

        {/* ================= MOBILE OVERLAY ================= */}

        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
            className="
              fixed
              inset-0
              z-40
              bg-black/40
              backdrop-blur-[2px]
              lg:hidden
            "
          />
        )}

        {/* ================= MOBILE SIDEBAR ================= */}

        <aside
          className={`
            fixed
            inset-y-0
            left-0
            z-50
            flex
            h-screen
            w-[280px]
            max-w-[85vw]
            flex-col
            bg-white
            shadow-2xl
            transition-transform
            duration-300
            ease-in-out
            dark:bg-slate-900
            lg:hidden
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }
          `}
        >
          {/* Mobile sidebar header */}
          <div
            className="
              flex
              h-16
              shrink-0
              items-center
              justify-between
              border-b
              border-slate-200
              px-4
              dark:border-slate-700
            "
          >
            <span className="text-lg font-semibold text-slate-900 dark:text-white">
              Organizer
            </span>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                text-slate-600
                transition
                hover:bg-slate-100
                hover:text-slate-900
                dark:text-slate-300
                dark:hover:bg-slate-800
              "
            >
              <X size={22} />
            </button>
          </div>

          {/* Scrollable sidebar content */}
          <div
            className="
              min-h-0
              flex-1
              overflow-y-auto
              overflow-x-hidden
            "
            onClick={(e) => {
              const target = e.target as HTMLElement;

              if (target.closest("a")) {
                setSidebarOpen(false);
              }
            }}
          >
            <Sidebar />
          </div>
        </aside>

        {/* ================= MAIN CONTENT ================= */}

        <main
          className="
            min-w-0
            flex-1
            bg-slate-50
            dark:bg-slate-950
          "
        >
          {/* Mobile top bar */}
          <header
            className="
              sticky
              top-0
              z-30
              flex
              h-16
              items-center
              border-b
              border-slate-200
              bg-white/95
              px-4
              backdrop-blur
              dark:border-slate-800
              dark:bg-slate-950/95
              lg:hidden
            "
          >
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                text-slate-700
                transition
                hover:bg-slate-100
                active:scale-95
                dark:text-slate-200
                dark:hover:bg-slate-800
              "
            >
              <Menu size={24} />
            </button>

            <div className="ml-3 min-w-0">
              <p className="truncate text-base font-semibold text-slate-900 dark:text-white">
                Organizer
              </p>
            </div>
          </header>

          {/* Page content */}
          <div
            className="
              w-full
              min-w-0
              p-4
              sm:p-6
              lg:p-8
            "
          >
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
