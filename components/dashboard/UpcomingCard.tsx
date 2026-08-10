"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";

type Interview = {
  id: string;
  user_id: string;
  company?: string;
  position?: string;
  interview_date?: string;
  date?: string;
  title?: string;
  created_at?: string;
};

export default function UpcomingCard() {
  const { t } = useLanguage();

  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadInterviews() {
    setLoading(true);

    try {
      // Check for an active session first.
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      // No session = user is not logged in.
      if (sessionError) {
        console.error("Error getting session:", sessionError);
        setInterviews([]);
        return;
      }

      if (!session?.user) {
        setInterviews([]);
        return;
      }

      const user = session.user;

      const { data, error } = await supabase
        .from("interviews")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error loading interviews:", error);
        console.error("Supabase error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });

        setInterviews([]);
        return;
      }

      const now = new Date();

      const upcomingInterviews = (data ?? [])
        .filter((interview) => {
          const dateValue =
            interview.interview_date || interview.date;

          if (!dateValue) {
            return false;
          }

          const interviewDate = new Date(dateValue);

          // Only future interviews
          return (
            !Number.isNaN(interviewDate.getTime()) &&
            interviewDate > now
          );
        })
        .sort((a, b) => {
          const dateA = new Date(
            a.interview_date || a.date || ""
          ).getTime();

          const dateB = new Date(
            b.interview_date || b.date || ""
          ).getTime();

          return dateA - dateB;
        })
        .slice(0, 3);

      setInterviews(upcomingInterviews);
    } catch (error) {
      // Prevent AuthSessionMissingError and other errors
      // from crashing the dashboard.
      console.error("Error loading upcoming interviews:", error);
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInterviews();

    const handleFocus = () => {
      loadInterviews();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return (
    <section>
      <div className="mb-4">
        <h2
          className="
            text-lg
            font-semibold
            text-slate-900
            dark:text-white
          "
        >
          {t("upcoming")}
        </h2>

        <p
          className="
            text-sm
            text-slate-500
            dark:text-slate-400
          "
        >
          {t("yourNextItems")}
        </p>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div
            className="
              rounded-lg
              bg-transparent
              p-3
              text-sm
              text-slate-500
              dark:bg-slate-800
              dark:text-slate-400
            "
          >
            Loading...
          </div>
        ) : interviews.length === 0 ? (
          <div
            className="
              rounded-lg
              bg-transparent
              p-3
              text-sm
              text-slate-500
              dark:bg-slate-800
              dark:text-slate-400
            "
          >
            No upcoming interviews.
          </div>
        ) : (
          interviews.map((interview) => {
            const dateValue =
              interview.interview_date ||
              interview.date ||
              "";

            const formattedDate = new Date(
              dateValue
            ).toLocaleDateString();

            return (
              <div
                key={interview.id}
                className="
                  rounded-lg
                  bg-transparent
                  p-3
                  dark:bg-slate-800
                "
              >
                <p
                  className="
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  {formattedDate}
                </p>

                <p
                  className="
                    font-medium
                    text-slate-900
                    dark:text-white
                  "
                >
                  {interview.position ||
                    interview.title ||
                    t("interview")}
                </p>

                {interview.company && (
                  <p
                    className="
                      text-sm
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    {interview.company}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
