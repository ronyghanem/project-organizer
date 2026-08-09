import { CalendarDays } from "lucide-react";

const events = [
  { day: "Mon", title: "Morning planning" },
  { day: "Wed", title: "Gym session" },
  { day: "Fri", title: "Dinner with Maya" },
];

export default function CalendarPreview() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays size={18} className="text-indigo-500" />
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Calendar preview</h2>
          <p className="text-sm text-slate-500">Upcoming plans at a glance.</p>
        </div>
      </div>

      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.title} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white font-semibold text-slate-700">
              {event.day}
            </div>
            <p className="text-sm font-medium text-slate-700">{event.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
