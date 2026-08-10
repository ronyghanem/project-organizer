"use client";

import { useEffect, useState } from "react";
import {
  X,
  CheckCircle2,
  CalendarDays,
  BriefcaseBusiness,
  Clock,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
};

type Interview = {
  id: number;
  company: string;
  position: string;
  status: string;
  date: string;
  notes: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function PlanTodayModal({
  open,
  onClose,
}: Props) {
  const [events, setEvents] = useState<Event[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    loadToday();
  }, [open]);

  // Get today's date as YYYY-MM-DD
  function getToday() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // Convert 24-hour time to 12-hour time
  // 20:00 -> 8 PM
  // 21:00 -> 9 PM
  // 22:00 -> 10 PM
  // 21:30 -> 9:30 PM
  function formatTime(time: string) {
    if (!time) return "";

    const [hours, minutes] = time.split(":").map(Number);

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: minutes === 0 ? undefined : "2-digit",
    });
  }

  async function loadToday() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setEvents([]);
      setInterviews([]);
      setLoading(false);
      return;
    }

    const today = getToday();

    /*
     * EVENTS
     *
     * Only events scheduled for today.
     *
     * Events from yesterday or earlier
     * will not appear.
     */
    const {
      data: eventsData,
      error: eventsError,
    } = await supabase
      .from("events")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", today)
      .order("time", {
        ascending: true,
      });

    /*
     * INTERVIEWS
     *
     * Only interviews scheduled for today.
     *
     * Interviews from previous dates
     * will not appear.
     */
    const {
      data: interviewsData,
      error: interviewsError,
    } = await supabase
      .from("interviews")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", today)
      .order("created_at", {
        ascending: true,
      });

    if (eventsError) {
      console.error(
        "Error loading today's events:",
        eventsError
      );
    }

    if (interviewsError) {
      console.error(
        "Error loading today's interviews:",
        interviewsError
      );
    }

    setEvents(eventsData || []);
    setInterviews(interviewsData || []);

    setLoading(false);
  }

  if (!open) return null;

  const totalPlans =
    events.length + interviews.length;

  const today = new Date();

  const formattedDate = today.toLocaleDateString(
    undefined,
    {
      weekday: "long",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div
      className="
        fixed
        inset-0
        z-[99999]
        flex
        items-start
        justify-center
        overflow-y-auto
        bg-black/50
        p-3
        pt-4
        backdrop-blur-sm
        sm:items-center
        sm:p-6
      "
      onClick={onClose}
    >
      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative
          flex
          w-full
          max-w-2xl
          flex-col
          overflow-hidden
          rounded-3xl
          border
          border-white/30
          bg-white
          shadow-2xl
          dark:border-white/10
          dark:bg-slate-900
          sm:max-h-[90vh]
        "
      >
        {/* Header */}
        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-slate-200
            px-5
            py-4
            dark:border-white/10
            sm:px-6
            sm:py-5
          "
        >
          <div>
            <h2
              className="
                text-xl
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              Plan Today
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              {formattedDate}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              text-slate-500
              transition
              hover:bg-slate-100
              hover:text-slate-900
              dark:hover:bg-slate-800
              dark:hover:text-white
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div
          className="
            overflow-y-auto
            px-5
            py-5
            sm:px-6
            sm:py-6
          "
        >
          {loading ? (
            <div className="space-y-3">
              <div
                className="
                  h-20
                  animate-pulse
                  rounded-2xl
                  bg-slate-200
                  dark:bg-slate-800
                "
              />

              <div
                className="
                  h-20
                  animate-pulse
                  rounded-2xl
                  bg-slate-200
                  dark:bg-slate-800
                "
              />
            </div>
          ) : totalPlans === 0 ? (
            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                rounded-3xl
                border
                border-dashed
                border-slate-300
                px-6
                py-14
                text-center
                dark:border-white/10
              "
            >
              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-emerald-50
                  text-emerald-600
                  dark:bg-emerald-500/10
                  dark:text-emerald-400
                "
              >
                <CheckCircle2 size={28} />
              </div>

              <h3
                className="
                  mt-4
                  font-semibold
                  text-slate-900
                  dark:text-white
                "
              >
                Nothing planned for today
              </h3>

              <p
                className="
                  mt-1
                  max-w-sm
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                You have no events or interviews
                scheduled for today.
              </p>
            </div>
          ) : (
            <div className="space-y-6">

              {/* Interviews */}
              {interviews.length > 0 && (
                <section>
                  <div
                    className="
                      mb-3
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <BriefcaseBusiness
                      size={18}
                      className="
                        text-green-600
                        dark:text-green-400
                      "
                    />

                    <h3
                      className="
                        font-semibold
                        text-slate-900
                        dark:text-white
                      "
                    >
                      Interviews Today
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {interviews.map((interview) => (
                      <div
                        key={interview.id}
                        className="
                          rounded-2xl
                          border
                          border-green-200
                          bg-green-50/70
                          p-4
                          transition-all
                          hover:-translate-y-0.5
                          hover:shadow-md
                          dark:border-green-500/20
                          dark:bg-green-500/10
                        "
                      >
                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-3
                          "
                        >
                          <div className="min-w-0">
                            <h4
                              className="
                                font-semibold
                                text-slate-900
                                dark:text-white
                              "
                            >
                              {interview.company}
                            </h4>

                            <p
                              className="
                                mt-1
                                text-sm
                                text-slate-600
                                dark:text-slate-300
                              "
                            >
                              {interview.position}
                            </p>
                          </div>

                          {interview.status && (
                            <span
                              className="
                                shrink-0
                                rounded-full
                                bg-green-100
                                px-2.5
                                py-1
                                text-xs
                                font-medium
                                text-green-700
                                dark:bg-green-500/20
                                dark:text-green-300
                              "
                            >
                              {interview.status}
                            </span>
                          )}
                        </div>

                        {interview.notes && (
                          <p
                            className="
                              mt-3
                              text-sm
                              text-slate-500
                              dark:text-slate-400
                            "
                          >
                            {interview.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Calendar Events */}
              {events.length > 0 && (
                <section>
                  <div
                    className="
                      mb-3
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <CalendarDays
                      size={18}
                      className="
                        text-indigo-600
                        dark:text-indigo-400
                      "
                    />

                    <h3
                      className="
                        font-semibold
                        text-slate-900
                        dark:text-white
                      "
                    >
                      Calendar Today
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="
                          flex
                          items-center
                          gap-4
                          rounded-2xl
                          border
                          border-indigo-100
                          bg-indigo-50/60
                          p-4
                          transition-all
                          hover:-translate-y-0.5
                          hover:shadow-md
                          dark:border-indigo-500/20
                          dark:bg-indigo-500/10
                        "
                      >
                        {/* Time */}
                        <div
                          className="
                            flex
                            min-w-[76px]
                            shrink-0
                            items-center
                            justify-center
                            gap-1.5
                            rounded-xl
                            bg-white
                            px-3
                            py-2
                            text-sm
                            font-medium
                            text-indigo-600
                            shadow-sm
                            dark:bg-slate-800
                            dark:text-indigo-400
                          "
                        >
                          <Clock size={15} />

                          {formatTime(event.time)}
                        </div>

                        {/* Event title */}
                        <div className="min-w-0">
                          <h4
                            className="
                              truncate
                              font-semibold
                              text-slate-900
                              dark:text-white
                            "
                          >
                            {event.title}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="
            shrink-0
            border-t
            border-slate-200
            p-4
            dark:border-white/10
          "
        >
          <button
            onClick={onClose}
            className="
              w-full
              rounded-xl
              bg-slate-900
              px-4
              py-3
              text-sm
              font-medium
              text-white
              transition-all
              hover:bg-slate-800
              active:scale-[0.98]
              dark:bg-white
              dark:text-slate-900
              dark:hover:bg-slate-200
            "
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
