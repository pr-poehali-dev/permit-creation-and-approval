import Icon from "@/components/ui/icon";

type Role = "executor" | "approver" | "authorizer" | "analyst";

const MONTHLY_DATA = [
  { month: "Ноя", total: 34, closed: 30, incidents: 0 },
  { month: "Дек", total: 28, closed: 25, incidents: 1 },
  { month: "Янв", total: 41, closed: 38, incidents: 0 },
  { month: "Фев", total: 37, closed: 35, incidents: 1 },
  { month: "Мар", total: 52, closed: 48, incidents: 2 },
  { month: "Апр", total: 45, closed: 38, incidents: 1 },
];

const RISK_DATA = [
  { label: "Высокий риск", value: 23, total: 142, color: "hsl(0 72% 45%)" },
  { label: "Средний риск", value: 58, total: 142, color: "hsl(38 72% 38%)" },
  { label: "Низкий риск", value: 61, total: 142, color: "hsl(142 70% 35%)" },
];

const DEPT_DATA = [
  { dept: "Цех №3", orders: 31, incidents: 2 },
  { dept: "Котельная №2", orders: 24, incidents: 1 },
  { dept: "Корпус 5", orders: 19, incidents: 0 },
  { dept: "Склад А", orders: 16, incidents: 1 },
  { dept: "Цех №1", orders: 28, incidents: 0 },
  { dept: "Корпус 2", orders: 14, incidents: 2 },
  { dept: "Корпус 7", orders: 10, incidents: 0 },
];

const MAX_ORDERS = Math.max(...DEPT_DATA.map((d) => d.orders));

const VIOLATIONS = [
  { number: "НД-2026-0137", type: "Просрочен инструктаж", date: "29.04.2026", severity: "high", person: "Орлов Б.Н." },
  { number: "НД-2026-0132", type: "Превышение срока наряда", date: "26.04.2026", severity: "medium", person: "Попов В.А." },
  { number: "НД-2026-0128", type: "Работа без ответственного", date: "22.04.2026", severity: "high", person: "Фёдоров Д.К." },
  { number: "НД-2026-0120", type: "Отсутствие СИЗ", date: "18.04.2026", severity: "high", person: "Кузнецов Р.Н." },
];

const SEV_MAP = {
  high: { label: "Критическое", cls: "status-danger" },
  medium: { label: "Значительное", cls: "status-pending" },
};

export default function AnalyticsPage({ role }: { role: Role }) {
  const maxTotal = Math.max(...MONTHLY_DATA.map((d) => d.total));

  return (
    <div className="space-y-5 page-enter">
      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: "Нарядов за апрель", value: "45", delta: "+9%", up: true, icon: "FileText" },
          { label: "Закрыто в срок", value: "84%", delta: "-3%", up: false, icon: "CheckCircle" },
          { label: "Ср. время согласования", value: "4.2ч", delta: "-1.1ч", up: true, icon: "Clock" },
          { label: "Нарушений в месяц", value: "4", delta: "+1", up: false, icon: "AlertTriangle" },
          { label: "Сотрудников с допуском", value: "87%", delta: "+2%", up: true, icon: "Users" },
        ].map((kpi) => (
          <div key={kpi.label} className="metric-card">
            <div className="flex items-center justify-between">
              <p className="text-xs leading-tight" style={{ color: "hsl(var(--muted-foreground))" }}>{kpi.label}</p>
              <Icon name={kpi.icon} size={13} style={{ color: "hsl(var(--muted-foreground))" }} />
            </div>
            <p className="text-2xl font-semibold font-mono-data mt-1" style={{ color: "hsl(var(--foreground))" }}>
              {kpi.value}
            </p>
            <div className="flex items-center gap-1">
              <Icon
                name={kpi.up ? "TrendingUp" : "TrendingDown"}
                size={11}
                style={{ color: kpi.up ? "hsl(142 70% 35%)" : "hsl(0 72% 45%)" }}
              />
              <span className="text-xs font-mono-data" style={{ color: kpi.up ? "hsl(142 70% 35%)" : "hsl(0 72% 45%)" }}>
                {kpi.delta} к пред. месяцу
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Bar chart — monthly */}
        <div className="col-span-2 bg-white border rounded-lg p-5" style={{ borderColor: "hsl(var(--border))" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>Нарядов по месяцам</h3>
            <div className="flex items-center gap-4 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "hsl(var(--primary))" }} />
                Выдано
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "hsl(142 70% 35%)" }} />
                Закрыто
              </span>
            </div>
          </div>
          <div className="flex items-end gap-3 h-40">
            {MONTHLY_DATA.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end gap-0.5" style={{ height: 128 }}>
                  <div
                    className="flex-1 rounded-t-sm transition-all duration-500"
                    style={{
                      height: `${(d.total / maxTotal) * 100}%`,
                      background: "hsl(var(--primary) / 0.25)",
                    }}
                  />
                  <div
                    className="flex-1 rounded-t-sm transition-all duration-500"
                    style={{
                      height: `${(d.closed / maxTotal) * 100}%`,
                      background: "hsl(142 70% 35%)",
                    }}
                  />
                </div>
                <p className="text-xs font-mono-data" style={{ color: "hsl(var(--muted-foreground))" }}>{d.month}</p>
                {d.incidents > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Risk distribution */}
        <div className="bg-white border rounded-lg p-5" style={{ borderColor: "hsl(var(--border))" }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: "hsl(var(--foreground))" }}>Распределение по рискам</h3>
          <div className="space-y-3">
            {RISK_DATA.map((r) => (
              <div key={r.label}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs" style={{ color: "hsl(var(--foreground))" }}>{r.label}</span>
                  <span className="text-xs font-mono-data font-medium" style={{ color: r.color }}>{r.value}</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(r.value / r.total) * 100}%`, background: r.color }}
                  />
                </div>
                <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {Math.round((r.value / r.total) * 100)}% от общего
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Dept activity */}
        <div className="bg-white border rounded-lg p-5" style={{ borderColor: "hsl(var(--border))" }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: "hsl(var(--foreground))" }}>Активность по объектам</h3>
          <div className="space-y-2.5">
            {DEPT_DATA.sort((a, b) => b.orders - a.orders).map((d) => (
              <div key={d.dept} className="flex items-center gap-3">
                <p className="text-xs w-28 flex-shrink-0" style={{ color: "hsl(var(--foreground))" }}>{d.dept}</p>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(d.orders / MAX_ORDERS) * 100}%`, background: "hsl(var(--primary))" }}
                  />
                </div>
                <span className="font-mono-data text-xs font-medium w-6 text-right" style={{ color: "hsl(var(--foreground))" }}>{d.orders}</span>
                {d.incidents > 0 && (
                  <span className="status-badge status-danger text-[10px]">
                    {d.incidents} наруш.
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Violations */}
        <div className="bg-white border rounded-lg p-5" style={{ borderColor: "hsl(var(--border))" }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: "hsl(var(--foreground))" }}>Нарушения за период</h3>
          <div className="space-y-3">
            {VIOLATIONS.map((v) => {
              const sev = SEV_MAP[v.severity as keyof typeof SEV_MAP];
              return (
                <div key={v.number} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0" style={{ borderColor: "hsl(var(--border))" }}>
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: v.severity === "high" ? "hsl(0 72% 51% / 0.1)" : "hsl(38 92% 48% / 0.1)" }}
                  >
                    <Icon name="AlertTriangle" size={13} style={{ color: v.severity === "high" ? "hsl(0 72% 45%)" : "hsl(38 72% 35%)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium" style={{ color: "hsl(var(--foreground))" }}>{v.type}</p>
                    <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {v.person} · <span className="font-mono-data">{v.number}</span>
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`status-badge ${sev.cls}`}>{sev.label}</span>
                    <p className="text-xs mt-1 font-mono-data" style={{ color: "hsl(var(--muted-foreground))" }}>{v.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            className="w-full mt-3 py-2 rounded-md text-xs font-medium border transition-colors hover:bg-muted"
            style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
          >
            Скачать отчёт PDF
          </button>
        </div>
      </div>
    </div>
  );
}
