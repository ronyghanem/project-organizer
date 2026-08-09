"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type Interview = {
  id: number;
  company: string;
  position: string;
  status: string;
  date: string;
  time?: string;
  notes: string;
};

export default function InterviewsPage() {
  const { t } = useLanguage();

  const [interviews, setInterviews] = useState<Interview[]>([]);

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Applied");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadInterviews();
  }, []);

  async function loadInterviews() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("interviews")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    setInterviews(data || []);
    setLoading(false);
  }

  async function addInterview() {
    if (!company.trim() || !position.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setAdding(true);

    const { error } = await supabase
      .from("interviews")
      .insert({
        company: company.trim(),
        position: position.trim(),
        status,
        date: date || null,
        time: time || null,
        notes: notes.trim(),
        user_id: user.id,
      });

    if (error) {
      console.log(error);
      setAdding(false);
      return;
    }

    setCompany("");
    setPosition("");
    setStatus("Applied");
    setDate("");
    setTime("");
    setNotes("");

    await loadInterviews();

    setAdding(false);
  }

  async function deleteInterview(id: number) {
    const { error } = await supabase
      .from("interviews")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error);
      return;
    }

    loadInterviews();
  }

  function isPastInterview(date: string, time?: string) {
    if (!date) return false;

    const interviewDateTime = new Date(
      `${date}T${time || "23:59"}`
    );

    return interviewDateTime < new Date();
  }

  return (
    <main className="w-full min-w-0 space-y-5 sm:space-y-6">

      {/* Header */}
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
          {t("interviews")}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Keep track of your job applications and interviews.
        </p>
      </div>

      {/* Add Interview */}
      <div
        className="
          w-full
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-4
          shadow-sm
          sm:p-6
          dark:border-slate-700
          dark:bg-slate-900
        "
      >
        <div className="space-y-4">

          {/* Company */}
          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-300
              "
            >
              {t("company")}
            </label>

            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder={t("company")}
              className="
                min-h-12
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-3
                text-slate-900
                outline-none
                placeholder:text-slate-400
                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-50
                dark:border-slate-700
                dark:bg-slate-800
                dark:text-white
              "
            />
          </div>

          {/* Position */}
          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-300
              "
            >
              {t("position")}
            </label>

            <input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder={t("position")}
              className="
                min-h-12
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-3
                text-slate-900
                outline-none
                placeholder:text-slate-400
                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-50
                dark:border-slate-700
                dark:bg-slate-800
                dark:text-white
              "
            />
          </div>

          {/* Status */}
          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-300
              "
            >
              Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="
                min-h-12
                w-full
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-3
                text-slate-900
                outline-none
                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-50
                dark:border-slate-700
                dark:bg-slate-800
                dark:text-white
              "
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Technical">Technical Interview</option>
              <option value="Final">Final Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div>
              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-700
                  dark:text-slate-300
                "
              >
                Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="
                  min-h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-3
                  text-slate-900
                  outline-none
                  focus:border-indigo-500
                  focus:ring-4
                  focus:ring-indigo-50
                  dark:border-slate-700
                  dark:bg-slate-800
                  dark:text-white
                "
              />
            </div>

            <div>
              <label
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-slate-700
                  dark:text-slate-300
                "
              >
                Time
              </label>

              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="
                  min-h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-3
                  text-slate-900
                  outline-none
                  focus:border-indigo-500
                  focus:ring-4
                  focus:ring-indigo-50
                  dark:border-slate-700
                  dark:bg-slate-800
                  dark:text-white
                "
              />
            </div>

          </div>

          {/* Notes */}
          <div>
            <label
              className="
                mb-2
                block
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-300
              "
            >
              Notes
            </label>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Interview notes..."
              rows={4}
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-3
                text-slate-900
                outline-none
                placeholder:text-slate-400
                focus:border-indigo-500
                focus:ring-4
                focus:ring-indigo-50
                dark:border-slate-700
                dark:bg-slate-800
                dark:text-white
              "
            />
          </div>

          {/* Add button */}
          <button
            type="button"
            onClick={addInterview}
            disabled={adding}
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
              font-medium
              text-white
              transition
              hover:bg-slate-800
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <Plus size={18} />

            {adding ? "Adding..." : t("add")}
          </button>

        </div>
      </div>

      {/* Interviews */}
      <div className="space-y-3">

        {/* Loading */}
        {loading && (
          <div
            className="
              rounded-xl
              border
              border-slate-200
              bg-white
              p-5
              dark:border-slate-700
              dark:bg-slate-900
            "
          >
            <p className="text-sm text-slate-500">
              {t("loading")}
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && interviews.length === 0 && (
          <div
            className="
              rounded-xl
              border
              border-dashed
              border-slate-300
              bg-white
              px-4
              py-10
              text-center
              dark:border-slate-700
              dark:bg-slate-900
            "
          >
            <p className="text-sm text-slate-500">
              No interviews yet.
            </p>
          </div>
        )}

        {/* Interview cards */}
        {interviews.map((interview) => {
          const passed = isPastInterview(
            interview.date,
            interview.time
          );

          return (
            <div
              key={interview.id}
              className={`
                flex
                w-full
                min-w-0
                items-start
                justify-between
                gap-3
                rounded-xl
                border
                p-4
                shadow-sm
                transition
                sm:p-5

                ${
                  passed
                    ? `
                      border-red-200
                      bg-red-50
                      dark:border-red-900/50
                      dark:bg-red-950/20
                    `
                    : `
                      border-slate-200
                      bg-white
                      dark:border-slate-700
                      dark:bg-slate-900
                    `
                }
              `}
            >

              {/* Information */}
              <div className="min-w-0 flex-1">

                {/* Company */}
                <h2
                  className={`
                    break-words
                    font-semibold
                    ${
                      passed
                        ? "text-red-600 line-through dark:text-red-400"
                        : "text-slate-900 dark:text-white"
                    }
                  `}
                >
                  {interview.company}
                </h2>

                {/* Position */}
                <p
                  className={`
                    mt-1
                    break-words
                    text-sm
                    ${
                      passed
                        ? "text-red-500 line-through"
                        : "text-slate-500"
                    }
                  `}
                >
                  {interview.position}
                </p>

                {/* Status */}
                <p
                  className={`
                    mt-1
                    text-xs
                    font-medium
                    ${
                      passed
                        ? "text-red-500 line-through"
                        : "text-slate-400"
                    }
                  `}
                >
                  {interview.status}
                </p>

                {/* Date + Time */}
                {(interview.date || interview.time) && (
                  <p
                    className={`
                      mt-2
                      break-words
                      text-sm
                      ${
                        passed
                          ? "text-red-500 line-through"
                          : "text-slate-500"
                      }
                    `}
                  >
                    📅 {interview.date || "No date"}

                    {interview.time && (
                      <> • 🕐 {interview.time}</>
                    )}
                  </p>
                )}

                {/* Notes */}
                {interview.notes && (
                  <p
                    className={`
                      mt-2
                      break-words
                      text-sm
                      ${
                        passed
                          ? "text-red-400 line-through"
                          : "text-slate-500 dark:text-slate-400"
                      }
                    `}
                  >
                    {interview.notes}
                  </p>
                )}

                {/* Passed badge */}
                {passed && (
                  <span
                    className="
                      mt-3
                      inline-flex
                      rounded-full
                      bg-red-100
                      px-3
                      py-1
                      text-xs
                      font-semibold
                      text-red-600
                      dark:bg-red-950
                      dark:text-red-400
                    "
                  >
                    Passed
                  </span>
                )}

              </div>

              {/* Delete */}
              <button
                type="button"
                onClick={() =>
                  deleteInterview(interview.id)
                }
                aria-label="Delete interview"
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
                  hover:bg-red-100
                  hover:text-red-600
                  active:scale-95
                  dark:hover:bg-red-950/40
                "
              >
                <Trash2 size={18} />
              </button>

            </div>
          );
        })}

      </div>
    </main>
  );
}
