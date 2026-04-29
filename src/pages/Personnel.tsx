import { useState } from "react";
import Icon from "@/components/ui/icon";

type Role = "executor" | "approver" | "authorizer" | "analyst";

interface Person {
  id: string;
  name: string;
  position: string;
  department: string;
  briefingDate: string;
  briefingNext: string;
  medDate: string;
  medNext: string;
  role: string;
  status: "ok" | "warning" | "expired";
}

const PERSONNEL: Person[] = [
  { id: "1", name: "Смирнов К.Д.", position: "Электромонтёр IV разряда", department: "Цех №3", briefingDate: "10.03.2026", briefingNext: "10.09.2026", medDate: "15.01.2026", medNext: "15.01.2027", role: "Исполнитель", status: "ok" },
  { id: "2", name: "Кузнецов Р.Н.", position: "Слесарь-ремонтник", department: "Котельная №2", briefingDate: "05.01.2026", briefingNext: "05.07.2026", medDate: "20.02.2026", medNext: "20.02.2027", role: "Исполнитель", status: "warning" },
  { id: "3", name: "Попов В.А.", position: "Маляр III разряда", department: "Склад А", briefingDate: "12.02.2026", briefingNext: "12.08.2026", medDate: "10.04.2026", medNext: "10.04.2027", role: "Исполнитель", status: "ok" },
  { id: "4", name: "Фёдоров Д.К.", position: "Газосварщик", department: "Корпус 5", briefingDate: "20.10.2025", briefingNext: "20.04.2026", medDate: "01.03.2026", medNext: "01.03.2027", role: "Исполнитель", status: "expired" },
  { id: "5", name: "Никитин С.А.", position: "Монтажник вентсистем", department: "Цех №1", briefingDate: "18.04.2026", briefingNext: "18.10.2026", medDate: "05.04.2026", medNext: "05.04.2027", role: "Исполнитель", status: "ok" },
  { id: "6", name: "Петров А.С.", position: "Начальник электроучастка", department: "Технический отдел", briefingDate: "01.04.2026", briefingNext: "01.10.2026", medDate: "10.03.2026", medNext: "10.03.2027", role: "Ответственный", status: "ok" },
  { id: "7", name: "Иванов В.П.", position: "Главный инженер", department: "Администрация", briefingDate: "15.03.2026", briefingNext: "15.09.2026", medDate: "12.02.2026", medNext: "12.02.2027", role: "Утверждающий", status: "ok" },
  { id: "8", name: "Громов Т.В.", position: "Инженер по охране труда", department: "ОТ и ПБ", briefingDate: "01.01.2026", briefingNext: "01.07.2026", medDate: "20.01.2026", medNext: "20.01.2027", role: "Согласующий", status: "warning" },
];

const STATUS_CFG = {
  ok: { label: "В норме", cls: "status-active" },
  warning: { label: "Скоро истекает", cls: "status-pending" },
  expired: { label: "Просрочен", cls: "status-danger" },
};

function daysBetween(dateStr: string) {
  const [d, m, y] = dateStr.split(".").map(Number);
  const target = new Date(y, m - 1, d);
  const today = new Date(2026, 3, 29);
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

export default function PersonnelPage({ role }: { role: Role }) {
  const [search, setSearch] = useState("");

  const filtered = PERSONNEL.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.department.toLowerCase().includes(search.toLowerCase()) ||
      p.position.toLowerCase().includes(search.toLowerCase())
  );

  const expiredCount = PERSONNEL.filter((p) => p.status === "expired").length;
  const warningCount = PERSONNEL.filter((p) => p.status === "warning").length;

  return (
    <div className="space-y-5 page-enter">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Всего сотрудников", value: String(PERSONNEL.length), icon: "Users", color: "hsl(var(--primary))" },
          { label: "Допущены", value: String(PERSONNEL.filter((p) => p.status === "ok").length), icon: "UserCheck", color: "hsl(142 70% 35%)" },
          { label: "Истекает скоро", value: String(warningCount), icon: "AlertCircle", color: "hsl(38 72% 38%)" },
          { label: "Просрочено", value: String(expiredCount), icon: "UserX", color: "hsl(0 72% 45%)" },
        ].map((s) => (
          <div key={s.label} className="metric-card">
            <div className="flex items-center justify-between">
              <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</p>
              <Icon name={s.icon} size={14} style={{ color: s.color }} />
            </div>
            <p className="text-2xl font-semibold font-mono-data" style={{ color: "hsl(var(--foreground))" }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Warning banner */}
      {expiredCount > 0 && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm"
          style={{ background: "hsl(0 72% 51% / 0.08)", border: "1px solid hsl(0 72% 51% / 0.25)" }}
        >
          <Icon name="AlertTriangle" size={16} style={{ color: "hsl(0 72% 45%)", flexShrink: 0 }} />
          <span style={{ color: "hsl(0 72% 35%)" }}>
            <strong>{expiredCount} сотрудника</strong> с просроченными инструктажами. Требуется переаттестация перед допуском к работам.
          </span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Icon name="Search" size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
          <input
            type="text"
            placeholder="Поиск по имени, должности..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border rounded-md bg-white"
            style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
          />
        </div>
        {role === "authorizer" && (
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white"
            style={{ background: "hsl(var(--primary))" }}
          >
            <Icon name="UserPlus" size={14} />
            Добавить сотрудника
          </button>
        )}
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border"
          style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
        >
          <Icon name="Download" size={14} />
          Экспорт
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-lg overflow-hidden" style={{ borderColor: "hsl(var(--border))" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "hsl(var(--muted))", borderBottom: "1px solid hsl(var(--border))" }}>
              {["ФИО", "Должность / Подразделение", "Роль", "Инструктаж", "До следующего", "Мед. осмотр", "Статус"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const st = STATUS_CFG[p.status];
              const days = daysBetween(p.briefingNext);
              return (
                <tr key={p.id} className="data-row">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 text-white"
                        style={{ background: "hsl(var(--primary))" }}
                      >
                        {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="font-medium" style={{ color: "hsl(var(--foreground))" }}>{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm" style={{ color: "hsl(var(--foreground))" }}>{p.position}</p>
                    <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{p.department}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded bg-muted" style={{ color: "hsl(var(--foreground))" }}>{p.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-mono-data text-xs" style={{ color: "hsl(var(--foreground))" }}>{p.briefingDate}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-mono-data text-xs" style={{ color: days < 30 ? "hsl(38 72% 35%)" : days < 0 ? "hsl(0 72% 45%)" : "hsl(var(--foreground))" }}>
                      {p.briefingNext}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {days > 0 ? `через ${days} дн.` : `просрочено ${-days} дн.`}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-mono-data text-xs" style={{ color: "hsl(var(--foreground))" }}>{p.medDate}</p>
                    <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>→ {p.medNext}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`status-badge ${st.cls}`}>{st.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
