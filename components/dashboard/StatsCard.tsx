import { type LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  accent: string;
}

export default function StatsCard({
  title,
  value,
  detail,
  icon: Icon,
  accent,
}: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`inline-flex rounded-xl p-2 ${accent}`}>
        <Icon size={18} />
      </div>

      <div className="mt-4">
        <p className="text-sm text-slate-500">{title}</p>
        <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
        <p className="mt-1 text-sm text-slate-500">{detail}</p>
      </div>
    </div>
  );
}
