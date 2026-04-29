import { useState } from "react";
import Icon from "@/components/ui/icon";

type Role = "executor" | "approver" | "authorizer" | "analyst";

interface WorkOrder {
  id: string;
  number: string;
  title: string;
  object: string;
  responsible: string;
  executor: string;
  dateStart: string;
  dateEnd: string;
  status: "active" | "pending" | "closed" | "danger";
  risk: "high" | "medium" | "low";
}

const ORDERS: WorkOrder[] = [
  { id: "1", number: "НД-2026-0142", title: "Ремонт электрощита №12", object: "Цех №3", responsible: "Петров А.С.", executor: "Смирнов К.Д.", dateStart: "28.04.2026", dateEnd: "30.04.2026", status: "active", risk: "high" },
  { id: "2", number: "НД-2026-0141", title: "Технический осмотр котельной", object: "Котельная №2", responsible: "Иванов В.П.", executor: "Кузнецов Р.Н.", dateStart: "27.04.2026", dateEnd: "29.04.2026", status: "active", risk: "medium" },
  { id: "3", number: "НД-2026-0140", title: "Покраска металлоконструкций", object: "Склад А", responsible: "Сидоров Л.М.", executor: "Попов В.А.", dateStart: "25.04.2026", dateEnd: "27.04.2026", status: "closed", risk: "low" },
  { id: "4", number: "НД-2026-0139", title: "Сварочные работы — трубопровод ГВС", object: "Корпус 5", responsible: "Иванов В.П.", executor: "Фёдоров Д.К.", dateStart: "24.04.2026", dateEnd: "25.04.2026", status: "closed", risk: "high" },
  { id: "5", number: "НД-2026-0138", title: "Чистка вентиляции производственного зала", object: "Цех №1", responsible: "Громов Т.В.", executor: "Никитин С.А.", dateStart: "29.04.2026", dateEnd: "01.05.2026", status: "pending", risk: "low" },
  { id: "6", number: "НД-2026-0137", title: "Демонтаж аварийного перекрытия", object: "Корпус 2", responsible: "Петров А.С.", executor: "Орлов Б.Н.", dateStart: "29.04.2026", dateEnd: "02.05.2026", status: "danger", risk: "high" },
];

const STATUS_MAP = {
  active: { label: "Активный", cls: "status-active", icon: "Play" },
  pending: { label: "Ожидает", cls: "status-pending", icon: "Clock" },
  closed: { label: "Закрыт", cls: "status-closed", icon: "CheckCircle" },
  danger: { label: "Нарушение", cls: "status-danger", icon: "AlertTriangle" },
};

const RISK_MAP = {
  high: { label: "Высокий", cls: "status-danger" },
  medium: { label: "Средний", cls: "status-pending" },
  low: { label: "Низкий", cls: "status-active" },
};

export default function JournalPage({ role }: { role: Role }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = ORDERS.filter((o) => {
    const matchSearch =
      o.number.toLowerCase().includes(search.toLowerCase()) ||
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.object.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5 page-enter">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Всего нарядов", value: "142", icon: "FileText", color: "hsl(var(--primary))" },
          { label: "Активных", value: "12", icon: "Play", color: "hsl(142 70% 35%)" },
          { label: "На согласовании", value: "5", icon: "Clock", color: "hsl(38 72% 38%)" },
          { label: "Нарушений", value: "2", icon: "AlertTriangle", color: "hsl(0 72% 45%)" },
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

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Icon name="Search" size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
          <input
            type="text"
            placeholder="Поиск по номеру, объекту..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border rounded-md bg-white"
            style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-sm border rounded-md px-3 py-2 bg-white"
          style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
        >
          <option value="all">Все статусы</option>
          <option value="active">Активные</option>
          <option value="pending">Ожидают</option>
          <option value="closed">Закрытые</option>
          <option value="danger">Нарушения</option>
        </select>
        {(role === "authorizer" || role === "approver") && (
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white transition-colors"
            style={{ background: "hsl(var(--primary))" }}
          >
            <Icon name="Plus" size={14} />
            Новый наряд
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border rounded-lg overflow-hidden" style={{ borderColor: "hsl(var(--border))" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "hsl(var(--muted))", borderBottom: "1px solid hsl(var(--border))" }}>
              {["№ Наряда", "Наименование работ", "Объект", "Ответственный", "Срок", "Риск", "Статус", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => {
              const st = STATUS_MAP[order.status];
              const risk = RISK_MAP[order.risk];
              return (
                <tr key={order.id} className="data-row">
                  <td className="px-4 py-3">
                    <span className="font-mono-data text-xs font-medium" style={{ color: "hsl(var(--primary))" }}>
                      {order.number}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <p className="font-medium truncate" style={{ color: "hsl(var(--foreground))" }}>{order.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>Исп.: {order.executor}</p>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "hsl(var(--foreground))" }}>{order.object}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "hsl(var(--foreground))" }}>{order.responsible}</td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-mono-data" style={{ color: "hsl(var(--foreground))" }}>{order.dateStart}</p>
                    <p className="text-xs font-mono-data" style={{ color: "hsl(var(--muted-foreground))" }}>→ {order.dateEnd}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`status-badge ${risk.cls}`}>{risk.label}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`status-badge ${st.cls}`}>
                      <Icon name={st.icon} size={10} />
                      {st.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1 rounded hover:bg-muted transition-colors">
                      <Icon name="ChevronRight" size={14} style={{ color: "hsl(var(--muted-foreground))" }} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center" style={{ color: "hsl(var(--muted-foreground))" }}>
            <Icon name="SearchX" size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Нарядов не найдено</p>
          </div>
        )}
        <div className="px-4 py-3 border-t flex items-center justify-between" style={{ borderColor: "hsl(var(--border))" }}>
          <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
            Показано {filtered.length} из {ORDERS.length}
          </p>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded hover:bg-muted transition-colors">
              <Icon name="ChevronLeft" size={14} style={{ color: "hsl(var(--muted-foreground))" }} />
            </button>
            <span className="text-xs px-2" style={{ color: "hsl(var(--foreground))" }}>1 / 1</span>
            <button className="p-1 rounded hover:bg-muted transition-colors">
              <Icon name="ChevronRight" size={14} style={{ color: "hsl(var(--muted-foreground))" }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
