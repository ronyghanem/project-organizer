"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  CalendarDays,
  CheckSquare,
  ShoppingCart,
  Notebook,
  BriefcaseBusiness,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight,
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";

type UserType = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
} | null;

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();

  const [user, setUser] = useState<UserType>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);
  }

  async function logout() {
    setLoggingOut(true);

    await supabase.auth.signOut();

    router.push("/login");
  }

  const links = [
    {
      name: t("dashboard"),
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: t("calendar"),
      href: "/calendar",
      icon: CalendarDays,
    },
    {
      name: t("tasks"),
      href: "/tasks",
      icon: CheckSquare,
    },
    {
      name: t("shopping"),
      href: "/shopping",
      icon: ShoppingCart,
    },
    {
      name: t("notes"),
      href: "/notes",
      icon: Notebook,
    },
    {
      name: t("interviews"),
      href: "/interviews",
      icon: BriefcaseBusiness,
    },
    {
      name: t("settings"),
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <aside
      className="
        relative
        z-50
        flex
        min-h-screen
        w-64
        shrink-0
        flex-col
        border-r
        border-white/50
        bg-white/75
        p-4
        shadow-xl
        backdrop-blur-2xl

        dark:border-white/10
        dark:bg-[#08081a]/70
      "
    >
      {/* Background glow */}
      <div
        className="
          pointer-events-none
          absolute
          -left-20
          -top-20
          h-48
          w-48
          rounded-full
          bg-indigo-400/20
          blur-3xl
          animate-glow-pulse
          dark:bg-violet-500/20
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-20
          -right-20
          h-48
          w-48
          rounded-full
          bg-purple-400/10
          blur-3xl
          animate-float-slow
          dark:bg-fuchsia-500/10
        "
      />

      {/* Logo */}
      <div className="relative mb-8 shrink-0">

        <Link
          href="/"
          className="
            flex
            items-center
            gap-3
            rounded-2xl
            px-2
            py-2
            transition-all
            duration-300
            hover:scale-[1.02]
          "
        >
          <div
            className="
              relative
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-gradient-to-br
              from-indigo-500
              via-purple-500
              to-pink-500
              text-white
              shadow-lg
              shadow-indigo-500/25
            "
          >
            <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-60 blur-md animate-glow-pulse" />
            <Sparkles size={19} className="relative animate-spin-slow" />
          </div>

          <div className="min-w-0">
            <h1
              className="
                truncate
                text-base
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              Life Organizer
            </h1>

            <p className="text-[11px] text-slate-400">
              Organize your life
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1">

        <p
          className="
            mb-3
            px-3
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.18em]
            text-slate-400
            dark:text-slate-500
          "
        >
          Menu
        </p>

        <div className="space-y-1.5">

          {links.map((link) => {
            const Icon = link.icon;

            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  group
                  relative
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-2.5
                  text-sm
                  font-medium
                  transition-all
                  duration-300

                  ${
                    isActive
                      ? `
                        bg-indigo-500/10
                        text-indigo-700
                        shadow-sm
                        dark:bg-indigo-500/15
                        dark:text-indigo-300
                      `
                      : `
                        text-slate-600
                        hover:bg-white/80
                        hover:text-slate-900
                        dark:text-slate-400
                        dark:hover:bg-white/5
                        dark:hover:text-white
                      `
                  }
                `}
              >
                {isActive && (
                  <span
                    className="
                      absolute
                      left-0
                      top-1/2
                      h-6
                      w-1
                      -translate-y-1/2
                      rounded-r-full
                      bg-gradient-to-b
                      from-indigo-500
                      to-purple-500
                    "
                  />
                )}

                <span
                  className={`
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    transition-all
                    duration-300

                    ${
                      isActive
                        ? `
                          bg-indigo-500
                          text-white
                          shadow-md
                          shadow-indigo-500/25
                        `
                        : `
                          bg-slate-100
                          text-slate-500
                          group-hover:bg-indigo-50
                          group-hover:text-indigo-600
                          dark:bg-white/5
                          dark:text-slate-400
                          dark:group-hover:bg-indigo-500/10
                          dark:group-hover:text-indigo-300
                        `
                    }
                  `}
                >
                  <Icon
                    size={17}
                    className="
                      transition-transform
                      duration-300
                      group-hover:scale-110
                    "
                  />
                </span>

                <span className="min-w-0 flex-1 truncate">
                  {link.name}
                </span>

                <ChevronRight
                  size={14}
                  className={`
                    transition-all
                    duration-300
                    ${
                      isActive
                        ? "opacity-60"
                        : "translate-x-[-4px] opacity-0 group-hover:translate-x-0 group-hover:opacity-50"
                    }
                  `}
                />
              </Link>
            );
          })}

        </div>
      </nav>

      {/* Profile at the END of the sidebar */}
      <div
        className="
          relative
          mt-8
          shrink-0
          rounded-2xl
          border
          border-white/60
          bg-white/80
          p-3
          shadow-lg
          backdrop-blur-xl

          dark:border-white/10
          dark:bg-white/[0.07]
        "
      >
        <div className="mb-3 flex items-center gap-3">

          <div className="relative shrink-0">

            <img
              src={
                user?.user_metadata?.avatar_url ||
                "/default-avatar.png"
              }
              alt="Profile avatar"
              className="
                h-10
                w-10
                rounded-full
                border-2
                border-white
                object-cover
                shadow-md
                dark:border-white/10
              "
            />

            <span
              className="
                absolute
                bottom-0
                right-0
                h-2.5
                w-2.5
                rounded-full
                border-2
                border-white
                bg-emerald-500
                dark:border-slate-900
              "
            />

          </div>

          <div className="min-w-0 flex-1">

            <p
              className="
                truncate
                text-sm
                font-semibold
                text-slate-900
                dark:text-white
              "
            >
              {user?.user_metadata?.full_name || "User"}
            </p>

            <p
              className="
                truncate
                text-[11px]
                text-slate-500
                dark:text-slate-400
              "
            >
              {user?.email || "No email"}
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={logout}
          disabled={loggingOut}
          className="
            flex
            min-h-10
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-red-100
            bg-red-50
            px-3
            py-2
            text-sm
            font-medium
            text-red-500
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:bg-red-100
            hover:shadow-md
            active:translate-y-0
            disabled:cursor-not-allowed
            disabled:opacity-60

            dark:border-red-500/10
            dark:bg-red-500/10
            dark:text-red-400
            dark:hover:bg-red-500/15
          "
        >
          <LogOut
            size={16}
            className={loggingOut ? "animate-pulse" : ""}
          />

          {loggingOut ? "Logging out..." : t("logout")}
        </button>
      </div>
    </aside>
  );
}
