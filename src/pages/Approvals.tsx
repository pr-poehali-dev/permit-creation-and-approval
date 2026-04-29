import { useState } from "react";
import Icon from "@/components/ui/icon";

type Role = "executor" | "approver" | "authorizer" | "analyst";

interface ApprovalItem {
  id: string;
  number: string;
  title: string;
  object: string;
  submittedBy: string;
  submittedAt: string;
  risk: "high" | "medium" | "low";
  stage: "review" | "approved" | "rejected" | "signed";
  approvers: { name: string; role: string; status: "pending" | "approved" | "rejected" }[];
}

const APPROVALS: ApprovalItem[] = [
  {
    id: "1",
    number: "НД-2026-0143",
    title: "Высотные работы — монтаж кровли",
    object: "Корпус 7",
    submittedBy: "Петров А.С.",
    submittedAt: "29.04.2026 08:42",
    risk: "high",
    stage: "review",
    approvers: [
      { name: "Громов Т.В.", role: "Инженер ОТ", status: "approved" },
      { name: "Сидоров Л.М.", role: "Нач. цеха", status: "pending" },
      { name: "Иванов В.П.", role: "Гл. инженер", status: "pending" },
    ],
  },
  {
    id: "2",
    number: "НД-2026-0144",
    title: "Газоопасные работы — продувка трубопровода",
    object: "Котельная №1",
    submittedBy: "Громов Т.В.",
    submittedAt: "28.04.2026 15:10",
    risk: "high",
    stage: "review",
    approvers: [
      { name: "Иванов В.П.", role: "Гл. инженер", status: "pending" },
      { name: "Петров А.С.", role: "Нач. электроучастка", status: "pending" },
    ],
  },
  {
    id: "3",
    number: "НД-2026-0138",
    title: "Чистка вентиляции производственного зала",
    object: "Цех №1",
    submittedBy: "Громов Т.В.",
    submittedAt: "28.04.2026 09:00",
    risk: "low",
    stage: "approved",
    approvers: [
      { name: "Громов Т.В.", role: "Инженер ОТ", status: "approved" },
      { name: "Иванов В.П.", role: "Гл. инженер", status: "approved" },
    ],
  },
  {
    id: "4",
    number: "НД-2026-0135",
    title: "Сварочные работы в насосной станции",
    object: "Насосная №3",
    submittedBy: "Петров А.С.",
    submittedAt: "25.04.2026 11:30",
    risk: "medium",
    stage: "rejected",
    approvers: [
      { name: "Громов Т.В.", role: "Инженер ОТ", status: "rejected" },
      { name: "Иванов В.П.", role: "Гл. инженер", status: "rejected" },
    ],
  },
];

const RISK_MAP = {
  high: { label: "Высокий", cls: "status-danger" },
  medium: { label: "Средний", cls: "status-pending" },
  low: { label: "Низкий", cls: "status-active" },
};

const STAGE_MAP = {
  review: { label: "На согласовании", cls: "status-pending" },
  approved: { label: "Согласовано", cls: "status-active" },
  rejected: { label: "Отклонено", cls: "status-danger" },
  signed: { label: "Подписано", cls: "status-active" },
};

export default function ApprovalsPage({ role }: { role: Role }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [signModal, setSignModal] = useState(false);
  const [signCode, setSignCode] = useState("");

  const selectedItem = APPROVALS.find((a) => a.id === selected);
  const pending = APPROVALS.filter((a) => a.stage === "review");

  return (
    <div className="space-y-5 page-enter">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Ожидают решения", value: String(pending.length), icon: "Clock", color: "hsl(38 72% 38%)" },
          { label: "Согласовано", value: "23", icon: "CheckCircle", color: "hsl(142 70% 35%)" },
          { label: "Отклонено", value: "4", icon: "XCircle", color: "hsl(0 72% 45%)" },
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

      <div className="flex gap-5">
        {/* List */}
        <div className="flex-1 space-y-3">
          {APPROVALS.map((item) => {
            const risk = RISK_MAP[item.risk];
            const stage = STAGE_MAP[item.stage];
            const isActive = selected === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelected(isActive ? null : item.id)}
                className="bg-white border rounded-lg p-4 cursor-pointer transition-all duration-150"
                style={{
                  borderColor: isActive ? "hsl(var(--primary))" : "hsl(var(--border))",
                  boxShadow: isActive ? "0 0 0 1px hsl(var(--primary))" : "none",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono-data text-xs font-medium" style={{ color: "hsl(var(--primary))" }}>
                        {item.number}
                      </span>
                      <span className={`status-badge ${risk.cls}`}>{risk.label} риск</span>
                    </div>
                    <p className="font-medium text-sm" style={{ color: "hsl(var(--foreground))" }}>{item.title}</p>
                    <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {item.object} · Подал: {item.submittedBy} · {item.submittedAt}
                    </p>
                  </div>
                  <span className={`status-badge flex-shrink-0 ${stage.cls}`}>{stage.label}</span>
                </div>

                {/* Approvers chain */}
                <div className="flex items-center gap-1.5 mt-3 pt-3 border-t" style={{ borderColor: "hsl(var(--border))" }}>
                  {item.approvers.map((a, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      {i > 0 && <Icon name="ChevronRight" size={12} style={{ color: "hsl(var(--muted-foreground))" }} />}
                      <div className="flex items-center gap-1">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center"
                          style={{
                            background: a.status === "approved" ? "hsl(142 70% 35% / 0.15)" : a.status === "rejected" ? "hsl(0 72% 51% / 0.15)" : "hsl(var(--muted))",
                          }}
                        >
                          <Icon
                            name={a.status === "approved" ? "Check" : a.status === "rejected" ? "X" : "Minus"}
                            size={10}
                            style={{ color: a.status === "approved" ? "hsl(142 70% 35%)" : a.status === "rejected" ? "hsl(0 72% 45%)" : "hsl(var(--muted-foreground))" }}
                          />
                        </div>
                        <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{a.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail panel */}
        {selectedItem && (
          <div
            className="w-72 bg-white border rounded-lg p-5 space-y-4 flex-shrink-0 self-start"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>Наряд-допуск</p>
              <p className="font-mono-data text-sm font-medium" style={{ color: "hsl(var(--primary))" }}>{selectedItem.number}</p>
              <p className="text-sm font-medium mt-1" style={{ color: "hsl(var(--foreground))" }}>{selectedItem.title}</p>
            </div>

            <div className="space-y-2">
              {[
                { label: "Объект", value: selectedItem.object },
                { label: "Представил", value: selectedItem.submittedBy },
                { label: "Подано", value: selectedItem.submittedAt },
              ].map((f) => (
                <div key={f.label}>
                  <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{f.label}</p>
                  <p className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>{f.value}</p>
                </div>
              ))}
            </div>

            {selectedItem.stage === "review" && (
              <div className="space-y-2 pt-2 border-t" style={{ borderColor: "hsl(var(--border))" }}>
                <button
                  onClick={() => setSignModal(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium text-white transition-colors"
                  style={{ background: "hsl(var(--primary))" }}
                >
                  <Icon name="PenLine" size={14} />
                  Подписать ЭЦП
                </button>
                <button
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium border transition-colors"
                  style={{ borderColor: "hsl(0 72% 51% / 0.4)", color: "hsl(0 72% 40%)" }}
                >
                  <Icon name="X" size={14} />
                  Отклонить
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sign modal */}
      {signModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="bg-white rounded-xl p-6 w-96 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--primary) / 0.1)" }}>
                <Icon name="ShieldCheck" size={20} style={{ color: "hsl(var(--primary))" }} />
              </div>
              <div>
                <h3 className="font-semibold text-sm" style={{ color: "hsl(var(--foreground))" }}>Электронная подпись</h3>
                <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>Иванов В.П. · Гл. инженер</p>
              </div>
            </div>
            <p className="text-sm mb-4" style={{ color: "hsl(var(--muted-foreground))" }}>
              Введите PIN-код ЭЦП для подтверждения согласования наряда <strong style={{ color: "hsl(var(--foreground))" }}>{selectedItem?.number}</strong>
            </p>
            <input
              type="password"
              placeholder="PIN-код ЭЦП"
              value={signCode}
              onChange={(e) => setSignCode(e.target.value)}
              maxLength={6}
              className="w-full px-3 py-2.5 text-center text-lg font-mono-data border rounded-md mb-4 tracking-[0.5em]"
              style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setSignModal(false); setSignCode(""); }}
                className="flex-1 py-2.5 rounded-md text-sm font-medium border"
                style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
              >
                Отмена
              </button>
              <button
                onClick={() => { setSignModal(false); setSignCode(""); }}
                className="flex-1 py-2.5 rounded-md text-sm font-medium text-white"
                style={{ background: "hsl(var(--primary))" }}
              >
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
