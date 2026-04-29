import { useState } from "react";
import Icon from "@/components/ui/icon";

type Role = "executor" | "approver" | "authorizer" | "analyst";

interface Attachment {
  id: string;
  orderNumber: string;
  type: string;
  name: string;
  addedBy: string;
  addedAt: string;
  size: string;
  format: string;
  required: boolean;
  status: "attached" | "missing" | "expired";
}

const ATTACHMENTS: Attachment[] = [
  { id: "1", orderNumber: "НД-2026-0142", type: "Наряд-допуск", name: "Наряд-допуск НД-0142.pdf", addedBy: "Петров А.С.", addedAt: "28.04.2026 09:15", size: "1.2 МБ", format: "PDF", required: true, status: "attached" },
  { id: "2", orderNumber: "НД-2026-0142", type: "Схема работ", name: "Схема-электрощит-12.pdf", addedBy: "Смирнов К.Д.", addedAt: "28.04.2026 10:00", size: "3.8 МБ", format: "PDF", required: true, status: "attached" },
  { id: "3", orderNumber: "НД-2026-0142", type: "Инструктаж", name: "Протокол инструктажа.docx", addedBy: "Громов Т.В.", addedAt: "28.04.2026 11:30", size: "456 КБ", format: "DOCX", required: true, status: "attached" },
  { id: "4", orderNumber: "НД-2026-0142", type: "Фото до работ", name: "Фото_до_работ.zip", addedBy: "Смирнов К.Д.", addedAt: "28.04.2026 12:00", size: "18.4 МБ", format: "ZIP", required: false, status: "attached" },
  { id: "5", orderNumber: "НД-2026-0143", type: "Наряд-допуск", name: "Наряд-допуск НД-0143.pdf", addedBy: "Петров А.С.", addedAt: "29.04.2026 08:30", size: "1.1 МБ", format: "PDF", required: true, status: "attached" },
  { id: "6", orderNumber: "НД-2026-0143", type: "Схема работ", name: "Схема монтажа кровли.pdf", addedBy: "", addedAt: "", size: "", format: "PDF", required: true, status: "missing" },
  { id: "7", orderNumber: "НД-2026-0143", type: "Допуск на высоту", name: "Удостоверение на высоту (Орлов)", addedBy: "Громов Т.В.", addedAt: "10.01.2026 09:00", size: "890 КБ", format: "PDF", required: true, status: "expired" },
  { id: "8", orderNumber: "НД-2026-0141", type: "Наряд-допуск", name: "Наряд-допуск НД-0141.pdf", addedBy: "Иванов В.П.", addedAt: "27.04.2026 08:00", size: "1.0 МБ", format: "PDF", required: true, status: "attached" },
];

const FORMAT_COLORS: Record<string, string> = {
  PDF: "bg-red-50 text-red-600",
  DOCX: "bg-blue-50 text-blue-600",
  ZIP: "bg-amber-50 text-amber-600",
  XLSX: "bg-green-50 text-green-600",
};

const STATUS_CFG = {
  attached: { label: "Прикреплён", cls: "status-active", icon: "Paperclip" },
  missing: { label: "Отсутствует", cls: "status-danger", icon: "AlertCircle" },
  expired: { label: "Истёк срок", cls: "status-pending", icon: "Clock" },
};

const ORDER_NUMBERS = [...new Set(ATTACHMENTS.map((a) => a.orderNumber))];

export default function AttachmentsPage({ role }: { role: Role }) {
  const [selectedOrder, setSelectedOrder] = useState(ORDER_NUMBERS[0]);

  const orderAttachments = ATTACHMENTS.filter((a) => a.orderNumber === selectedOrder);
  const missingCount = orderAttachments.filter((a) => a.status !== "attached").length;

  return (
    <div className="space-y-5 page-enter">
      {/* Order selector */}
      <div className="bg-white border rounded-lg p-4" style={{ borderColor: "hsl(var(--border))" }}>
        <p className="text-xs font-medium mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>Выберите наряд</p>
        <div className="flex flex-wrap gap-2">
          {ORDER_NUMBERS.map((num) => {
            const items = ATTACHMENTS.filter((a) => a.orderNumber === num);
            const hasMissing = items.some((a) => a.status !== "attached");
            return (
              <button
                key={num}
                onClick={() => setSelectedOrder(num)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border transition-all"
                style={{
                  borderColor: selectedOrder === num ? "hsl(var(--primary))" : "hsl(var(--border))",
                  background: selectedOrder === num ? "hsl(var(--primary) / 0.06)" : "hsl(var(--muted))",
                  color: selectedOrder === num ? "hsl(var(--primary))" : "hsl(var(--foreground))",
                }}
              >
                <Icon name="FileText" size={13} />
                <span className="font-mono-data">{num}</span>
                {hasMissing && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>
            Приложения к {selectedOrder}
          </h2>
          {missingCount > 0 && (
            <p className="text-xs mt-0.5" style={{ color: "hsl(0 72% 45%)" }}>
              {missingCount} документа требуют внимания
            </p>
          )}
        </div>
        {(role === "executor" || role === "approver" || role === "authorizer") && (
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white"
            style={{ background: "hsl(var(--primary))" }}
          >
            <Icon name="Upload" size={14} />
            Загрузить документ
          </button>
        )}
      </div>

      {/* Files list */}
      <div className="space-y-2">
        {orderAttachments.map((att) => {
          const st = STATUS_CFG[att.status];
          return (
            <div
              key={att.id}
              className="bg-white border rounded-lg p-4 flex items-center gap-4 transition-all"
              style={{
                borderColor: att.status === "missing" ? "hsl(0 72% 51% / 0.3)" : att.status === "expired" ? "hsl(38 92% 48% / 0.3)" : "hsl(var(--border))",
                background: att.status === "missing" ? "hsl(0 72% 51% / 0.03)" : "white",
              }}
            >
              {/* Format badge */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                style={{ background: "hsl(var(--muted))" }}
              >
                {att.status === "missing" ? (
                  <Icon name="FilePlus" size={18} style={{ color: "hsl(var(--muted-foreground))" }} />
                ) : (
                  <span className={`text-[10px] font-bold px-1 py-0.5 rounded ${FORMAT_COLORS[att.format] || "bg-muted text-muted-foreground"}`}>
                    {att.format}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-medium truncate" style={{ color: att.status === "missing" ? "hsl(var(--muted-foreground))" : "hsl(var(--foreground))" }}>
                    {att.status === "missing" ? `Требуется: ${att.type}` : att.name}
                  </p>
                  {att.required && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted font-medium flex-shrink-0" style={{ color: "hsl(var(--muted-foreground))" }}>
                      Обязательный
                    </span>
                  )}
                </div>
                <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {att.type}
                  {att.addedBy && ` · ${att.addedBy} · ${att.addedAt}`}
                  {att.size && ` · ${att.size}`}
                </p>
              </div>

              {/* Status + actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`status-badge ${st.cls}`}>
                  <Icon name={st.icon} size={10} />
                  {st.label}
                </span>
                {att.status === "attached" && (
                  <button className="p-1.5 rounded hover:bg-muted transition-colors">
                    <Icon name="Download" size={14} style={{ color: "hsl(var(--muted-foreground))" }} />
                  </button>
                )}
                {att.status === "missing" && (
                  <button
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium text-white"
                    style={{ background: "hsl(var(--primary))" }}
                  >
                    <Icon name="Upload" size={12} />
                    Загрузить
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion indicator */}
      <div className="bg-white border rounded-lg p-4" style={{ borderColor: "hsl(var(--border))" }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium" style={{ color: "hsl(var(--foreground))" }}>Комплектность пакета документов</p>
          <span className="font-mono-data text-xs font-semibold" style={{ color: missingCount === 0 ? "hsl(142 70% 35%)" : "hsl(38 72% 35%)" }}>
            {orderAttachments.filter((a) => a.status === "attached").length}/{orderAttachments.length}
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "hsl(var(--muted))" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(orderAttachments.filter((a) => a.status === "attached").length / orderAttachments.length) * 100}%`,
              background: missingCount === 0 ? "hsl(142 70% 35%)" : "hsl(var(--primary))",
            }}
          />
        </div>
      </div>
    </div>
  );
}
