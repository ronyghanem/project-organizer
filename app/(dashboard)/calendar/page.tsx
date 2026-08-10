"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
};

export default function CalendarPage() {
  const { t } = useLanguage();

  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("user_id", user.id)
      .order("date", {
        ascending: true,
      });

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    setEvents(data || []);
    setLoading(false);
  }

  async function addEvent() {
    if (!title || !date || !time) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("events")
      .insert({
        title,
        date,
        time,
        user_id: user.id,
      });

    if (error) {
      console.log(error);
      return;
    }

    setTitle("");
    setDate("");
    setTime("");

    loadEvents();
  }

  async function deleteEvent(id: number) {
    await supabase
      .from("events")
      .delete()
      .eq("id", id);

    loadEvents();
  }

  return (
    <main className="w-full min-w-0 space-y-5 sm:space-y-6">

      {/* Page title */}
      <div>
        <h1
          className="
            text-2xl
            font-bold
            tracking-tight
            text-slate-900
            dark:text-white
            sm:text-3xl
          "
        >
          {t("calendar")}
        </h1>
      </div>

      {/* Add event card */}
      <div
        className="
          w-full
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-4
          shadow-sm
          sm:p-5
          dark:border-white/10
          dark:bg-[#0b0b1f]
        "
      >
        <div className="space-y-3">

          {/* Event title */}
          <input
            placeholder={t("eventTitle")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="
              min-h-12
              w-full
              rounded-xl
              border
              border-slate-200
              bg-white
              px-4
              py-3
              text-base
              text-slate-900
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-indigo-500
              focus:ring-4
              focus:ring-indigo-50
              dark:border-white/10
              dark:bg-slate-800
              dark:text-white
              dark:placeholder:text-slate-400
            "
          />

          {/* Date and time */}
          <div
            className="
              grid
              grid-cols-1
              gap-3
              sm:grid-cols-2
            "
          >
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="
                min-h-12
                w-full
                min-w-0
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-3
                text-base
                text-slate-900
                outline-none
                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-50
                dark:border-white/10
                dark:bg-slate-800
                dark:text-white
              "
            />

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="
                min-h-12
                w-full
                min-w-0
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-3
                text-base
                text-slate-900
                outline-none
                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-50
                dark:border-white/10
                dark:bg-slate-800
                dark:text-white
              "
            />
          </div>

          {/* Add button */}
          <button
            type="button"
            onClick={addEvent}
            className="
              flex
              min-h-12
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
              transition
              hover:bg-slate-800
              active:scale-[0.99]
              sm:w-auto
            "
          >
            <Plus size={18} />

            <span>
              {t("addEvent")}
            </span>
          </button>

        </div>
      </div>

      {/* Events */}
      <div className="w-full min-w-0 space-y-3">

        {loading && (
          <div
            className="
              rounded-xl
              border
              border-slate-200
              bg-white
              p-4
              dark:border-white/10
              dark:bg-[#0b0b1f]
            "
          >
            <p className="text-sm text-slate-500">
              {t("loading")}
            </p>
          </div>
        )}

        {!loading && events.length === 0 && (
          <div
            className="
              rounded-xl
              border
              border-dashed
              border-slate-300
              bg-white
              px-4
              py-8
              text-center
              dark:border-white/10
              dark:bg-[#0b0b1f]
            "
          >
            <p className="text-sm text-slate-500">
              No events yet.
            </p>
          </div>
        )}

        {events.map((event) => (
          <div
            key={event.id}
            className="
              flex
              w-full
              min-w-0
              items-center
              justify-between
              gap-3
              rounded-xl
              border
              border-slate-200
              bg-white
              p-4
              shadow-sm
              dark:border-white/10
              dark:bg-[#0b0b1f]
            "
          >

            {/* Event information */}
            <div className="min-w-0 flex-1">

              <h2
                className="
                  truncate
                  text-sm
                  font-semibold
                  text-slate-900
                  sm:text-base
                  dark:text-white
                "
              >
                {event.title}
              </h2>

              <p
                className="
                  mt-1
                  break-words
                  text-xs
                  text-slate-500
                  sm:text-sm
                "
              >
                {event.date} · {event.time}
              </p>

            </div>

            {/* Delete */}
            <button
              type="button"
              onClick={() => deleteEvent(event.id)}
              aria-label="Delete event"
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-lg
                text-red-500
                transition
                hover:bg-red-50
                hover:text-red-600
                active:scale-95
                dark:hover:bg-red-950/30
              "
            >
              <Trash2 size={18} />
            </button>

          </div>
        ))}

      </div>

    </main>
  );
}
