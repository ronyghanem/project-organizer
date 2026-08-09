"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  enableNotifications,
  disableNotifications,
} from "@/lib/notifications";
import {
  Bell,
  CheckCircle2,
} from "lucide-react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] =
    useState(true);

  const [
    notificationsLoading,
    setNotificationsLoading,
  ] = useState(false);

  const [
    notificationsEnabled,
    setNotificationsEnabled,
  ] = useState(false);

  const [
    notificationMessage,
    setNotificationMessage,
  ] = useState("");

  const {
    language,
    setLanguage,
    t,
  } = useLanguage();

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("theme");

    const savedLanguage =
      localStorage.getItem("language");

    // Dark mode by default
    if (
      savedTheme === null ||
      savedTheme === "dark"
    ) {
      setDarkMode(true);

      document.documentElement.classList.add(
        "dark"
      );

      if (savedTheme === null) {
        localStorage.setItem(
          "theme",
          "dark"
        );
      }
    } else {
      setDarkMode(false);

      document.documentElement.classList.remove(
        "dark"
      );
    }

    // Restore language
    if (
      savedLanguage === "English" ||
      savedLanguage === "Arabic" ||
      savedLanguage === "French"
    ) {
      setLanguage(savedLanguage);
    }

    // Check browser notification permission
    if (
      typeof window !== "undefined" &&
      "Notification" in window
    ) {
      if (
        Notification.permission ===
        "granted"
      ) {
        checkPushSubscription();
      }
    }
  }, [setLanguage]);

  async function checkPushSubscription() {
    try {
      if (
        !("serviceWorker" in navigator)
      ) {
        return;
      }

      const registration =
        await navigator.serviceWorker.ready;

      const subscription =
        await registration.pushManager.getSubscription();

      setNotificationsEnabled(
        !!subscription
      );
    } catch (error) {
      console.error(
        "Notification check error:",
        error
      );
    }
  }

  function toggleTheme() {
    const value = !darkMode;

    setDarkMode(value);

    if (value) {
      document.documentElement.classList.add(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "dark"
      );
    } else {
      document.documentElement.classList.remove(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "light"
      );
    }
  }

  function changeLanguage(
    value:
      | "English"
      | "Arabic"
      | "French"
  ) {
    setLanguage(value);

    localStorage.setItem(
      "language",
      value
    );
  }

  async function handleEnableNotifications() {
    try {
      setNotificationsLoading(true);
      setNotificationMessage("");

      await enableNotifications();

      setNotificationsEnabled(true);

      setNotificationMessage(
        "Notifications enabled successfully!"
      );
    } catch (error) {
      console.error(
        "Enable notifications error:",
        error
      );

      setNotificationMessage(
        error instanceof Error
          ? error.message
          : "Unable to enable notifications."
      );
    } finally {
      setNotificationsLoading(false);
    }
  }

  async function handleDisableNotifications() {
    try {
      setNotificationsLoading(true);
      setNotificationMessage("");

      await disableNotifications();

      setNotificationsEnabled(false);

      setNotificationMessage(
        "Notifications disabled successfully."
      );
    } catch (error) {
      console.error(
        "Disable notifications error:",
        error
      );

      setNotificationMessage(
        error instanceof Error
          ? error.message
          : "Unable to disable notifications."
      );
    } finally {
      setNotificationsLoading(false);
    }
  }

  return (
    <main
      className="
        relative
        min-h-screen
        space-y-6
        overflow-hidden
        bg-slate-50
        transition-colors
        duration-500
        dark:bg-slate-950
      "
    >
      {/* Background glow */}
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
          -right-32
          top-1/3
          h-80
          w-80
          rounded-full
          bg-purple-300/20
          blur-3xl
          dark:bg-purple-500/10
        "
      />

      <div className="relative z-10 space-y-6">

        {/* Header */}
        <div
          className="
            rounded-3xl
            border
            border-slate-200/70
            bg-white/70
            p-5
            shadow-sm
            backdrop-blur-xl
            sm:p-6
            dark:border-white/10
            dark:bg-slate-900/70
            dark:shadow-black/20
          "
        >
          <h1
            className="
              text-2xl
              font-semibold
              text-slate-900
              dark:text-white
            "
          >
            ⚙️ {t("settings")}
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            {t("managePreferences")}
          </p>
        </div>

        {/* Notifications */}
        <div
          className="
            rounded-3xl
            border
            border-slate-200/70
            bg-white/70
            p-5
            shadow-sm
            backdrop-blur-xl
            transition-all
            duration-300
            hover:shadow-lg
            sm:p-6
            dark:border-white/10
            dark:bg-slate-900/70
            dark:shadow-black/20
          "
        >
          <div
            className="
              flex
              items-start
              gap-4
            "
          >
            <div
              className="
                flex
                h-12
                w-12
                shrink-0
                items-center
                justify-center
                rounded-2xl
                bg-indigo-100
                text-indigo-600
                dark:bg-indigo-500/10
                dark:text-indigo-400
              "
            >
              {notificationsEnabled ? (
                <CheckCircle2 size={22} />
              ) : (
                <Bell size={22} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2
                className="
                  text-lg
                  font-semibold
                  text-slate-900
                  dark:text-white
                "
              >
                Notifications
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  leading-6
                  text-slate-500
                  dark:text-slate-400
                "
              >
                Receive reminders before your
                interviews, even when the
                Organizer tab is closed.
              </p>
            </div>
          </div>

          {/* Notification button */}
          <button
            onClick={
              notificationsEnabled
                ? handleDisableNotifications
                : handleEnableNotifications
            }
            disabled={
              notificationsLoading
            }
            className="
              mt-5
              flex
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
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-slate-800
              hover:shadow-lg
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-60
              sm:w-auto
              dark:bg-white
              dark:text-slate-900
              dark:hover:bg-slate-200
            "
          >
            {notificationsLoading ? (
              <>
                <span
                  className="
                    h-4
                    w-4
                    animate-spin
                    rounded-full
                    border-2
                    border-white/30
                    border-t-white
                    dark:border-slate-900/30
                    dark:border-t-slate-900
                  "
                />

                Processing...
              </>
            ) : notificationsEnabled ? (
              <>
                <Bell size={18} />

                Disable Notifications
              </>
            ) : (
              <>
                <Bell size={18} />

                Enable Notifications
              </>
            )}
          </button>

          {/* Notification message */}
          {notificationMessage && (
            <div
              className="
                mt-4
                rounded-xl
                border
                border-slate-200
                bg-slate-100
                px-4
                py-3
                text-sm
                text-slate-600
                dark:border-white/10
                dark:bg-slate-800
                dark:text-slate-300
              "
            >
              {notificationMessage}
            </div>
          )}
        </div>

        {/* Appearance */}
        <div
          className="
            rounded-3xl
            border
            border-slate-200/70
            bg-white/70
            p-5
            shadow-sm
            backdrop-blur-xl
            transition-all
            duration-300
            hover:shadow-lg
            sm:p-6
            dark:border-white/10
            dark:bg-slate-900/70
            dark:shadow-black/20
          "
        >
          <h2
            className="
              text-lg
              font-semibold
              text-slate-900
              dark:text-white
            "
          >
            {t("appearance")}
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            {t("chooseTheme")}
          </p>

          <div
            className="
              mt-5
              flex
              flex-col
              gap-4
              rounded-2xl
              bg-slate-50/80
              p-4
              sm:flex-row
              sm:items-center
              sm:justify-between
              dark:bg-slate-800/70
            "
          >
            <div>
              <p
                className="
                  font-medium
                  text-slate-900
                  dark:text-white
                "
              >
                {t("theme")}
              </p>

              <p
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {darkMode
                  ? t("nightMode")
                  : t("dayMode")}
              </p>
            </div>

            <button
              onClick={toggleTheme}
              className="
                rounded-xl
                bg-slate-900
                px-5
                py-2.5
                text-sm
                font-medium
                text-white
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-slate-800
                hover:shadow-lg
                active:scale-95
                dark:bg-white
                dark:text-slate-900
                dark:hover:bg-slate-200
              "
            >
              {darkMode
                ? `🌙 ${t("night")}`
                : `☀️ ${t("day")}`}
            </button>
          </div>
        </div>

        {/* Language */}
        <div
          className="
            rounded-3xl
            border
            border-slate-200/70
            bg-white/70
            p-5
            shadow-sm
            backdrop-blur-xl
            transition-all
            duration-300
            hover:shadow-lg
            sm:p-6
            dark:border-white/10
            dark:bg-slate-900/70
            dark:shadow-black/20
          "
        >
          <h2
            className="
              text-lg
              font-semibold
              text-slate-900
              dark:text-white
            "
          >
            {t("language")} 🌍
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-slate-500
              dark:text-slate-400
            "
          >
            {t("selectLanguage")}
          </p>

          <select
            value={language}
            onChange={(e) =>
              changeLanguage(
                e.target.value as
                  | "English"
                  | "Arabic"
                  | "French"
              )
            }
            className="
              mt-5
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              text-slate-900
              outline-none
              transition
              focus:border-indigo-500
              focus:ring-2
              focus:ring-indigo-500/20
              dark:border-white/10
              dark:bg-slate-800
              dark:text-white
            "
          >
            <option value="English">
              🇬🇧 English
            </option>

            <option value="Arabic">
              🇱🇧 العربية
            </option>

            <option value="French">
              🇫🇷 Français
            </option>
          </select>
        </div>

      </div>
    </main>
  );
}