import { useRef } from "react";
import Icon from "@/components/ui/icon";
import { generateWorkOrderDoc } from "@/lib/generateWorkOrderDoc";
import type { WorkOrderFormData } from "@/components/WorkOrderForm";

interface Props {
  data: WorkOrderFormData;
  onClose: () => void;
  onEdit?: () => void;
}

const fmt = (dt: string, withTime = true) => {
  if (!dt) return "___.___.2026";
  const d = new Date(dt);
  const date = `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
  if (!withTime) return date;
  return `${date}  ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const Blank = ({ w = 80 }: { w?: number }) => (
  <span className="inline-block border-b border-gray-600" style={{ minWidth: w, display: "inline-block" }}>&nbsp;</span>
);

const Row = ({ label, value, hint }: { label?: string; value?: string; hint?: string }) => (
  <div className="mb-1">
    {label && <span className="font-bold text-[11px]">{label} </span>}
    <span className="border-b border-gray-700 text-[11px] px-1">{value || <Blank />}</span>
    {hint && <div className="text-[9px] text-gray-500 italic text-center">{hint}</div>}
  </div>
);

const SectionNum = ({ n, title }: { n: string | number; title: string }) => (
  <div className="mt-3 mb-1 flex gap-1">
    <span className="font-bold text-[11px]">{n}.</span>
    <span className="font-bold text-[11px]">{title}</span>
  </div>
);

const Hint = ({ text }: { text: string }) => (
  <div className="text-[9px] text-gray-500 italic text-center">{text}</div>
);

const WORK_TYPE_LABELS: Record<string, string> = {
  gas: "газоопасных",
  fire: "огневых",
  elevated: "работ повышенной опасности",
  combined: "газоопасных, огневых работ и работ повышенной опасности",
};

export default function WorkOrderPreview({ data, onClose, onEdit }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML ?? "";
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Наряд-допуск № ${data.orderNumber}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400&display=swap');
            * { box-sizing: border-box; }
            body { font-family: 'PT Serif', 'Times New Roman', serif; font-size: 11px; color: #000; margin: 0; padding: 16mm 20mm; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
            td, th { border: 1px solid #000; padding: 2px 4px; font-size: 10px; vertical-align: top; }
            th { background: #f0f0f0; font-weight: bold; text-align: center; }
            .no-border td, .no-border th { border: none; }
            .hint { font-size: 8px; color: #444; font-style: italic; text-align: center; }
            .bold { font-weight: bold; }
            .underline { text-decoration: underline; }
            .center { text-align: center; }
            .section { margin-top: 8px; margin-bottom: 4px; }
            .blank { display: inline-block; border-bottom: 1px solid #000; min-width: 40px; }
            h1 { font-size: 14px; text-align: center; margin: 0; }
            h2 { font-size: 11px; text-align: center; margin: 2px 0; }
            @media print {
              body { padding: 10mm 15mm; }
            }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);
    win.document.close();
    setTimeout(() => { win.print(); }, 500);
  };

  const handleDownload = async () => {
    await generateWorkOrderDoc(data);
  };

  const workTypeLabel = WORK_TYPE_LABELS[data.workType] || data.workType;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-6 px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl animate-fade-in">

        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b bg-gray-50 rounded-t-xl sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--primary))" }}>
              <Icon name="FileText" size={14} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>
                Предпросмотр: Наряд-допуск № {data.orderNumber || "—"}
              </p>
              <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                {data.workDescription || "Без названия"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors hover:bg-gray-100"
                style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
              >
                <Icon name="Pencil" size={13} />
                Редактировать
              </button>
            )}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors hover:bg-gray-100"
              style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
            >
              <Icon name="Printer" size={13} />
              Печать
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white rounded-lg transition-colors"
              style={{ background: "hsl(var(--primary))" }}
            >
              <Icon name="Download" size={13} />
              Скачать .docx
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors ml-1">
              <Icon name="X" size={16} style={{ color: "hsl(var(--muted-foreground))" }} />
            </button>
          </div>
        </div>

        {/* Preview body */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(100vh - 120px)", background: "#f5f5f5" }}>
          <div
            ref={printRef}
            className="bg-white mx-auto shadow-sm"
            style={{
              fontFamily: "'PT Serif', 'Times New Roman', serif",
              fontSize: 11,
              color: "#000",
              maxWidth: 820,
              padding: "20mm 22mm",
              lineHeight: 1.4,
            }}
          >
            {/* Шапка */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 8 }}>
              <tbody>
                <tr>
                  <td style={{ border: "none", verticalAlign: "top", width: "55%" }}>
                    <div style={{ fontSize: 11 }}>
                      <div><b>ОСТ</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ borderBottom: "1px solid #000" }}>{data.ost}</span></div>
                      <div><b>Филиал</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ borderBottom: "1px solid #000" }}>{data.branch}</span></div>
                      <div><b>Структурное подразделение</b> <span style={{ borderBottom: "1px solid #000" }}>{data.subdivision}</span></div>
                    </div>
                  </td>
                  <td style={{ border: "none", verticalAlign: "top", textAlign: "center", width: "45%" }}>
                    <div style={{ fontSize: 11 }}>
                      <div style={{ fontWeight: "bold" }}>«УТВЕРЖДАЮ»</div>
                      <div>Главный инженер</div>
                      <div>{data.branch}</div>
                      <div>{data.chiefEngineer}</div>
                      <div style={{ border: "1px solid #000", padding: "12px 8px", marginTop: 6, marginBottom: 6, fontSize: 10 }}>
                        <b>МЕСТО ДЛЯ ШТАМПА<br />ЭЛЕКТРОННОЙ ПОДПИСИ</b>
                      </div>
                      <div>«___» _____________ {data.approveDate ? new Date(data.approveDate).getFullYear() : 2026} г.</div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Заголовок */}
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <div style={{ fontWeight: "bold", fontSize: 14 }}>НАРЯД-ДОПУСК № {data.orderNumber}</div>
              <div style={{ fontSize: 11 }}>на проведение</div>
              <div style={{ fontWeight: "bold", textDecoration: "underline", fontSize: 12 }}>{workTypeLabel}</div>
              <div style={{ fontSize: 9, color: "#555", fontStyle: "italic" }}>(нужное подчеркнуть)</div>
            </div>

            {/* 1 */}
            <div style={{ marginBottom: 6 }}>
              <b>1. Выдан (кому)</b> <span style={{ borderBottom: "1px solid #000", display: "inline-block", minWidth: 300 }}>{data.issuedTo}</span>
              <div style={{ fontSize: 9, color: "#555", fontStyle: "italic", textAlign: "center" }}>(организация, должность, Фамилия И.О. ответственного за проведение работ)</div>
            </div>

            {/* 2 */}
            <div style={{ marginBottom: 6 }}>
              <b>2. На проведение работ</b> <span style={{ borderBottom: "1px solid #000", display: "inline-block", minWidth: 280 }}>{data.workDescription}</span>
              <div style={{ fontSize: 9, color: "#555", fontStyle: "italic", textAlign: "center" }}>(указывается характер и содержание работы)</div>
            </div>

            {/* 2.1 */}
            <div style={{ marginBottom: 6, border: "1px solid #ccc", padding: "4px 8px" }}>
              <b style={{ fontSize: 11 }}>2.1 Идентифицированные опасности, возникающие при её проведении</b>
              <div style={{ minHeight: 40, fontSize: 11 }}>{data.hazards || <span style={{ color: "#999" }}>—</span>}</div>
            </div>

            {/* 3 */}
            <div style={{ marginBottom: 6 }}>
              <b>3. Место проведения работ</b> <span style={{ borderBottom: "1px solid #000", display: "inline-block", minWidth: 260 }}>{data.workLocation}</span>
              <div style={{ fontSize: 9, color: "#555", fontStyle: "italic", textAlign: "center" }}>(участок, установка, ёмкость, резервуар, коммуникация, помещение)</div>
            </div>

            {/* 4. Бригада */}
            <div style={{ marginBottom: 4 }}><b>4. Состав бригады:</b></div>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 8, fontSize: 10 }}>
              <thead>
                <tr style={{ background: "#f0f0f0" }}>
                  <th style={{ border: "1px solid #000", padding: "2px 4px", textAlign: "center", width: "5%" }}>№</th>
                  <th style={{ border: "1px solid #000", padding: "2px 4px", textAlign: "center", width: "25%" }}>Фамилия И.О.</th>
                  <th style={{ border: "1px solid #000", padding: "2px 4px", textAlign: "center", width: "25%" }}>Профессия (должность)</th>
                  <th style={{ border: "1px solid #000", padding: "2px 4px", textAlign: "center", width: "20%" }}>Выполняемая функция</th>
                  <th style={{ border: "1px solid #000", padding: "2px 4px", textAlign: "center", width: "15%" }}>Подпись / Дата</th>
                  <th style={{ border: "1px solid #000", padding: "2px 4px", textAlign: "center", width: "10%" }}>Подпись инструктора</th>
                </tr>
              </thead>
              <tbody>
                {data.brigade.map((m, i) => (
                  <tr key={m.id}>
                    <td style={{ border: "1px solid #000", padding: "2px 4px", textAlign: "center" }}>{i + 1}</td>
                    <td style={{ border: "1px solid #000", padding: "2px 4px" }}>{m.name}</td>
                    <td style={{ border: "1px solid #000", padding: "2px 4px" }}>{m.profession}</td>
                    <td style={{ border: "1px solid #000", padding: "2px 4px" }}>{m.function}</td>
                    <td style={{ border: "1px solid #000", padding: "2px 4px", textAlign: "center" }}>{m.signDate ? fmt(m.signDate, false) : ""}</td>
                    <td style={{ border: "1px solid #000", padding: "2px 4px" }}></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 5. Время */}
            <div style={{ marginBottom: 6 }}>
              <b>5. Планируемое время проведения работ:</b>
              <div>Начало &nbsp;&nbsp;&nbsp;&nbsp; <span style={{ borderBottom: "1px solid #000", display: "inline-block", minWidth: 120 }}>{data.planStart ? fmt(data.planStart) : ""}</span>&nbsp;&nbsp;
                <span style={{ fontSize: 9, color: "#555", fontStyle: "italic" }}>(время, дата)</span>
              </div>
              <div>Окончание &nbsp;<span style={{ borderBottom: "1px solid #000", display: "inline-block", minWidth: 120 }}>{data.planEnd ? fmt(data.planEnd) : ""}</span>&nbsp;&nbsp;
                <span style={{ fontSize: 9, color: "#555", fontStyle: "italic" }}>(время, дата)</span>
              </div>
            </div>

            {/* 6 */}
            <div style={{ marginBottom: 6 }}>
              <b>6. Организационные и технические мероприятия по обеспечению безопасности</b>
              <div><b>6.1 Мероприятия по подготовке объекта к проведению работ и последовательности их проведения</b></div>
              <div style={{ borderBottom: "1px solid #000" }}>{data.preparationMeasures}</div>
            </div>

            {/* 7 */}
            <div style={{ marginBottom: 6 }}>
              <div><b>7. Схемы расстановки</b> <span style={{ borderBottom: "1px solid #000", display: "inline-block", minWidth: 200 }}>{data.schemes}</span></div>
              <div style={{ fontSize: 9, color: "#555", fontStyle: "italic", textAlign: "center" }}>(указываются оси установки, оборудования, трубопроводов с указанием расстояний до границ опасных зон, схемы промывки, продувки, точки отбора проб воздушной среды, установки заглушек, создания разъёмов фланцевых соединений и т.д.)</div>
            </div>

            {/* 8 */}
            <div style={{ marginBottom: 6 }}>
              <b>8. Особые условия:</b>
              <div style={{ borderBottom: "1px solid #000", minHeight: 30 }}>{data.specialConditions}</div>
              <div style={{ fontSize: 9, color: "#555", fontStyle: "italic", textAlign: "center" }}>(в т.ч. присутствие лиц, ответственных за контроль (наблюдающего) при производстве работ, периодичность контроля)</div>
            </div>

            {/* 9 */}
            <div style={{ marginBottom: 6 }}>
              <b>9. Наряд-допуск выдал</b>
              <div><span style={{ borderBottom: "1px solid #000", display: "inline-block", minWidth: 260 }}>{data.issuedByPerson}</span> &nbsp; {fmt(data.issuedByDate, false)}</div>
              <div style={{ fontSize: 9, color: "#555", fontStyle: "italic", textAlign: "center" }}>(должность, Фамилия И.О., подпись лица, выдавшего наряд-допуск, дата)</div>
            </div>

            {/* 10 */}
            <div style={{ marginBottom: 6 }}>
              <b>10. Согласовано:</b>
              {[
                { label: "10.1. Со службой охраны труда", person: data.agreementOT, date: data.agreementOTDate },
                { label: "10.2. С пожарной охраной", person: data.agreementFire, date: data.agreementFireDate },
                { label: "10.3. ПАСФ", person: data.agreementPASF, date: data.agreementPASFDate },
                { label: "УЭСАиТМ", person: data.agreementUESAiTM, date: data.agreementUESAiTMDate },
                { label: "УОЗО", person: data.agreementUOZO, date: data.agreementUOZODate },
                { label: "10.4. С оператором", person: data.agreementOperator, date: data.agreementOperatorDate },
              ].map((ag) => (
                <div key={ag.label} style={{ marginBottom: 3, borderBottom: "1px solid #eee", paddingBottom: 2 }}>
                  <b>{ag.label}</b> &nbsp;
                  <span style={{ borderBottom: "1px solid #000", display: "inline-block", minWidth: 180 }}>{ag.person}</span>
                  &nbsp; <span style={{ fontSize: 10 }}>{ag.date ? fmt(ag.date) : "___.___.2026  ___ч. ___мин."}</span>
                  <div style={{ fontSize: 9, color: "#555", fontStyle: "italic", textAlign: "center" }}>(должность, Фамилия И.О., подпись, дата, время)</div>
                </div>
              ))}
            </div>

            {/* 11. Анализ газовоздушной среды */}
            <div style={{ marginBottom: 4 }}><b>11. Анализ газовоздушной среды на месте проведения работ</b></div>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 8, fontSize: 10 }}>
              <thead>
                <tr style={{ background: "#f0f0f0" }}>
                  <th style={{ border: "1px solid #000", padding: "2px 3px", textAlign: "center" }}>№</th>
                  <th style={{ border: "1px solid #000", padding: "2px 3px", textAlign: "center" }}>Дата и время отбора</th>
                  <th style={{ border: "1px solid #000", padding: "2px 3px", textAlign: "center" }}>Место отбора проб</th>
                  <th style={{ border: "1px solid #000", padding: "2px 3px", textAlign: "center" }}>Определяемые компоненты</th>
                  <th style={{ border: "1px solid #000", padding: "2px 3px", textAlign: "center" }}>Допустимая конц., мг/м³</th>
                  <th style={{ border: "1px solid #000", padding: "2px 3px", textAlign: "center" }}>Результаты анализа, мг/м³</th>
                  <th style={{ border: "1px solid #000", padding: "2px 3px", textAlign: "center" }}>Подпись проводившего</th>
                  <th style={{ border: "1px solid #000", padding: "2px 3px", textAlign: "center" }}>Подпись отв. за работы</th>
                </tr>
              </thead>
              <tbody>
                {data.gasAnalysis.map((g, i) => (
                  <tr key={g.id}>
                    <td style={{ border: "1px solid #000", padding: "2px 3px", textAlign: "center" }}>{i + 1}</td>
                    <td style={{ border: "1px solid #000", padding: "2px 3px" }}>{g.datetime ? fmt(g.datetime) : ""}</td>
                    <td style={{ border: "1px solid #000", padding: "2px 3px" }}>{g.location}</td>
                    <td style={{ border: "1px solid #000", padding: "2px 3px" }}>{g.components}</td>
                    <td style={{ border: "1px solid #000", padding: "2px 3px", textAlign: "center" }}>{g.allowedConc}</td>
                    <td style={{ border: "1px solid #000", padding: "2px 3px", textAlign: "center" }}>{g.result}</td>
                    <td style={{ border: "1px solid #000", padding: "2px 3px" }}></td>
                    <td style={{ border: "1px solid #000", padding: "2px 3px" }}></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 12 */}
            <div style={{ marginBottom: 6 }}>
              <b>12. Мероприятия по подготовке к безопасному проведению работ согласно наряду-допуску выполнены:</b>
              <div>12.1 <span style={{ borderBottom: "1px solid #000", display: "inline-block", minWidth: 200 }}>{data.prepDoneBy}</span> &nbsp; {fmt(data.prepDoneDate)}</div>
              <div style={{ fontSize: 9, color: "#555", fontStyle: "italic", textAlign: "center" }}>(Фамилия И.О., подпись лица, ответственного за подготовку работ, дата, время)</div>
              <div>12.2 <span style={{ borderBottom: "1px solid #000", display: "inline-block", minWidth: 200 }}>{data.prepDoneBy2}</span> &nbsp; {fmt(data.prepDoneDate2)}</div>
              <div style={{ fontSize: 9, color: "#555", fontStyle: "italic", textAlign: "center" }}>(Фамилия И.О., подпись лица, ответственного за проведение работ, дата, время)</div>
            </div>

            {/* 13 */}
            <div style={{ marginBottom: 6 }}>
              <b>13. К выполнению работ допускаю:</b>
              <div><span style={{ borderBottom: "1px solid #000", display: "inline-block", minWidth: 240 }}>{data.admittedBy}</span> &nbsp; {fmt(data.admittedDate)}</div>
              <div style={{ fontSize: 9, color: "#555", fontStyle: "italic", textAlign: "center" }}>(должность допускающего, Фамилия И.О., подпись, дата, время)</div>
            </div>

            {/* 14. Ежедневный допуск */}
            <div style={{ marginBottom: 4 }}><b>14. Ежедневный допуск к работе</b> <span style={{ fontSize: 9, fontStyle: "italic" }}>(в т.ч. в первый день) и время её окончания</span></div>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 8, fontSize: 10 }}>
              <thead>
                <tr style={{ background: "#f0f0f0" }}>
                  <th style={{ border: "1px solid #000", padding: "2px 3px", textAlign: "center" }}>№</th>
                  <th style={{ border: "1px solid #000", padding: "2px 3px", textAlign: "center" }}>Дата</th>
                  <th style={{ border: "1px solid #000", padding: "2px 3px", textAlign: "center" }}>Начало (чч:мм)</th>
                  <th style={{ border: "1px solid #000", padding: "2px 3px", textAlign: "center" }}>Подпись допускающего</th>
                  <th style={{ border: "1px solid #000", padding: "2px 3px", textAlign: "center" }}>Подпись отв. за проведение работ</th>
                  <th style={{ border: "1px solid #000", padding: "2px 3px", textAlign: "center" }}>Окончание (чч:мм)</th>
                  <th style={{ border: "1px solid #000", padding: "2px 3px", textAlign: "center" }}>Подпись отв. за проведение работ</th>
                </tr>
              </thead>
              <tbody>
                {data.dailyAccess.map((d, i) => (
                  <tr key={d.id}>
                    <td style={{ border: "1px solid #000", padding: "2px 3px", textAlign: "center" }}>{i + 1}</td>
                    <td style={{ border: "1px solid #000", padding: "2px 3px", textAlign: "center" }}>{d.date ? fmt(d.date, false) : ""}</td>
                    <td style={{ border: "1px solid #000", padding: "2px 3px", textAlign: "center" }}>{d.startTime}</td>
                    <td style={{ border: "1px solid #000", padding: "2px 3px" }}></td>
                    <td style={{ border: "1px solid #000", padding: "2px 3px" }}></td>
                    <td style={{ border: "1px solid #000", padding: "2px 3px", textAlign: "center" }}>{d.endTime}</td>
                    <td style={{ border: "1px solid #000", padding: "2px 3px" }}></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 15 */}
            {data.extendedTo && (
              <div style={{ marginBottom: 6 }}>
                <b>15. Продление наряда-допуска до:</b> {fmt(data.extendedTo)}
                <div><span style={{ borderBottom: "1px solid #000", display: "inline-block", minWidth: 240 }}>{data.extendedByPerson}</span></div>
                <div style={{ fontSize: 9, color: "#555", fontStyle: "italic", textAlign: "center" }}>(должность, Фамилия И.О., подпись лица, выдавшего наряд-допуск, дата, время)</div>
              </div>
            )}

            {/* 18. Изменения */}
            <div style={{ marginBottom: 4 }}><b>18. Изменения в составе бригады</b></div>
            <div style={{ marginBottom: 2 }}><b>18.1. Выведение работников:</b></div>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 8, fontSize: 10 }}>
              <thead>
                <tr style={{ background: "#f0f0f0" }}>
                  <th style={{ border: "1px solid #000", padding: "2px 4px" }}>Фамилия И.О.</th>
                  <th style={{ border: "1px solid #000", padding: "2px 4px" }}>Дата, время выведения</th>
                  <th style={{ border: "1px solid #000", padding: "2px 4px" }}>Профессия (должность)</th>
                  <th style={{ border: "1px solid #000", padding: "2px 4px" }}>Подпись</th>
                </tr>
              </thead>
              <tbody>
                {data.removedMembers.map((m, i) => (
                  <tr key={i}>
                    <td style={{ border: "1px solid #000", padding: "2px 4px" }}>{m.name}</td>
                    <td style={{ border: "1px solid #000", padding: "2px 4px" }}>{m.dateTime ? fmt(m.dateTime) : ""}</td>
                    <td style={{ border: "1px solid #000", padding: "2px 4px" }}>{m.profession}</td>
                    <td style={{ border: "1px solid #000", padding: "2px 4px" }}></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginBottom: 2 }}><b>18.2. Введение работников:</b></div>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 8, fontSize: 10 }}>
              <thead>
                <tr style={{ background: "#f0f0f0" }}>
                  <th style={{ border: "1px solid #000", padding: "2px 4px" }}>Фамилия И.О.</th>
                  <th style={{ border: "1px solid #000", padding: "2px 4px" }}>Дата, время введения</th>
                  <th style={{ border: "1px solid #000", padding: "2px 4px" }}>Профессия</th>
                  <th style={{ border: "1px solid #000", padding: "2px 4px" }}>Функция</th>
                  <th style={{ border: "1px solid #000", padding: "2px 4px" }}>Подпись инструктора</th>
                  <th style={{ border: "1px solid #000", padding: "2px 4px" }}>Подпись отв. за работы</th>
                </tr>
              </thead>
              <tbody>
                {data.addedMembers.map((m, i) => (
                  <tr key={i}>
                    <td style={{ border: "1px solid #000", padding: "2px 4px" }}>{m.name}</td>
                    <td style={{ border: "1px solid #000", padding: "2px 4px" }}>{m.dateTime ? fmt(m.dateTime) : ""}</td>
                    <td style={{ border: "1px solid #000", padding: "2px 4px" }}>{m.profession}</td>
                    <td style={{ border: "1px solid #000", padding: "2px 4px" }}>{m.function}</td>
                    <td style={{ border: "1px solid #000", padding: "2px 4px" }}></td>
                    <td style={{ border: "1px solid #000", padding: "2px 4px" }}></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 19-22. Закрытие */}
            <div style={{ marginBottom: 6 }}>
              <b>19. Работы приостановлены/остановлены/наряд-допуск аннулирован</b> <span style={{ fontSize: 9, fontStyle: "italic" }}>(нужное подчеркнуть)</span>
              <div><span style={{ borderBottom: "1px solid #000", display: "inline-block", minWidth: 200 }}>{data.suspendedDate ? fmt(data.suspendedDate) : ""}</span></div>
              <div><span style={{ borderBottom: "1px solid #000", display: "inline-block", minWidth: 300 }}>{data.suspendedBy}</span></div>
              <div style={{ fontSize: 9, color: "#555", fontStyle: "italic", textAlign: "center" }}>(Фамилия И.О., подпись лица, приостановившего/остановившего работы, дата, время)</div>
              <div><span style={{ borderBottom: "1px solid #000", display: "inline-block", minWidth: 300 }}>{data.suspendReason}</span></div>
              <div style={{ fontSize: 9, color: "#555", fontStyle: "italic", textAlign: "center" }}>(причины приостановки/остановки, номер акта-предписания)</div>
            </div>

            <div style={{ marginBottom: 6 }}>
              <b>20. Нарушения устранены, разрешаю возобновить работы</b>
              <div><span style={{ borderBottom: "1px solid #000", display: "inline-block", minWidth: 300 }}>{data.resumedBy}</span></div>
              <div style={{ fontSize: 9, color: "#555", fontStyle: "italic", textAlign: "center" }}>(Фамилия И.О., должность, подпись, дата, время)</div>
            </div>

            <div style={{ marginBottom: 6 }}>
              <b>21. Работы выполнены, рабочие места приведены в порядок, инструмент и материалы убраны, люди выведены</b>
              <div><span style={{ borderBottom: "1px solid #000", display: "inline-block", minWidth: 220 }}>{data.workCompletedBy}</span> &nbsp; {fmt(data.workCompletedDate)}</div>
              <div style={{ fontSize: 9, color: "#555", fontStyle: "italic", textAlign: "center" }}>(организация, должность, Фамилия И.О., подпись ответственного за проведение работ, дата, время)</div>
              <div><span style={{ borderBottom: "1px solid #000", display: "inline-block", minWidth: 200 }}>{data.operatorName}</span> &nbsp; {fmt(data.operatorDate)}</div>
              <div style={{ fontSize: 9, color: "#555", fontStyle: "italic", textAlign: "center" }}>(Фамилия И.О., подпись оператора, время, дата)</div>
            </div>

            <div style={{ marginBottom: 6 }}>
              <b>22. Работы приняты, наряд-допуск закрыт</b>
              <div><span style={{ borderBottom: "1px solid #000", display: "inline-block", minWidth: 240 }}>{data.closedBy}</span> &nbsp; {fmt(data.closedDate)}</div>
              <div style={{ fontSize: 9, color: "#555", fontStyle: "italic", textAlign: "center" }}>(Фамилия И.О., должность, подпись допускающего лица, дата, время)</div>
            </div>

            {/* ─── ПРИЛОЖЕНИЯ ─── */}
            <div style={{ borderTop: "2px solid #000", marginTop: 24, paddingTop: 16 }}>
              <div style={{ fontWeight: "bold", fontSize: 14, textAlign: "center", marginBottom: 16 }}>
                ПРИЛОЖЕНИЯ К НАРЯДУ-ДОПУСКУ № {data.orderNumber}
              </div>

              {/* Приложение 1 */}
              <div style={{ marginBottom: 20, padding: "12px 0", borderBottom: "1px solid #ddd" }}>
                <div style={{ fontWeight: "bold", fontSize: 12, textAlign: "center", marginBottom: 6 }}>Приложение № 1</div>
                <div style={{ fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>Меры по обеспечению безопасного проведения работ</div>
                <div style={{ marginBottom: 6 }}><b>6.1. Мероприятия по подготовке объекта:</b></div>
                <div style={{ borderBottom: "1px solid #000", minHeight: 20, marginBottom: 8 }}>{data.preparationMeasures}</div>
                <div style={{ marginBottom: 6 }}><b>6.2. Средства индивидуальной защиты и режим работы:</b></div>
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} style={{ borderBottom: "1px solid #ccc", minHeight: 18, marginBottom: 6 }}></div>
                ))}
                <div style={{ marginTop: 10 }}>
                  <b>Требуемые приложения:</b>
                  <div style={{ fontSize: 10, fontStyle: "italic", marginTop: 4 }}>
                    Приложение №1 Меры по обеспечению безопасности. Приложение №2 Таблица анализ воздушной среды на месте проведения работ. Приложение №3 Схема проведения анализа ГВС на месте проведения работ. Приложение №4 Схема расстановки оборудования на месте производства работ. Приложение №5 Технологическая схема отключённого участка.
                  </div>
                </div>
              </div>

              {/* Приложение 2 */}
              <div style={{ marginBottom: 20, padding: "12px 0", borderBottom: "1px solid #ddd" }}>
                <div style={{ fontWeight: "bold", fontSize: 12, textAlign: "center", marginBottom: 6 }}>Приложение № 2</div>
                <div style={{ fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>Таблица анализа воздушной среды на месте проведения работ</div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                  <thead>
                    <tr style={{ background: "#f0f0f0" }}>
                      <th style={{ border: "1px solid #000", padding: "2px 3px", textAlign: "center" }}>№</th>
                      <th style={{ border: "1px solid #000", padding: "2px 3px" }}>Дата и время отбора</th>
                      <th style={{ border: "1px solid #000", padding: "2px 3px" }}>Место отбора проб</th>
                      <th style={{ border: "1px solid #000", padding: "2px 3px" }}>Определяемые компоненты</th>
                      <th style={{ border: "1px solid #000", padding: "2px 3px" }}>Допустимая конц., мг/м³</th>
                      <th style={{ border: "1px solid #000", padding: "2px 3px" }}>Результаты анализа, мг/м³</th>
                      <th style={{ border: "1px solid #000", padding: "2px 3px" }}>Подпись проводившего</th>
                      <th style={{ border: "1px solid #000", padding: "2px 3px" }}>Подпись отв. за работы</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.gasAnalysis.map((g, i) => (
                      <tr key={g.id}>
                        <td style={{ border: "1px solid #000", padding: "2px 3px", textAlign: "center" }}>{i + 1}</td>
                        <td style={{ border: "1px solid #000", padding: "2px 3px" }}>{g.datetime ? fmt(g.datetime) : ""}</td>
                        <td style={{ border: "1px solid #000", padding: "2px 3px" }}>{g.location}</td>
                        <td style={{ border: "1px solid #000", padding: "2px 3px" }}>{g.components}</td>
                        <td style={{ border: "1px solid #000", padding: "2px 3px", textAlign: "center" }}>{g.allowedConc}</td>
                        <td style={{ border: "1px solid #000", padding: "2px 3px", textAlign: "center" }}>{g.result}</td>
                        <td style={{ border: "1px solid #000", padding: "2px 3px" }}></td>
                        <td style={{ border: "1px solid #000", padding: "2px 3px" }}></td>
                      </tr>
                    ))}
                    {Array.from({ length: 5 }, (_, i) => (
                      <tr key={`empty-${i}`}>
                        <td style={{ border: "1px solid #000", padding: "2px 3px", textAlign: "center" }}>{data.gasAnalysis.length + i + 1}</td>
                        <td style={{ border: "1px solid #000", padding: "12px 3px" }}></td>
                        <td style={{ border: "1px solid #000", padding: "12px 3px" }}></td>
                        <td style={{ border: "1px solid #000", padding: "12px 3px" }}></td>
                        <td style={{ border: "1px solid #000", padding: "12px 3px" }}></td>
                        <td style={{ border: "1px solid #000", padding: "12px 3px" }}></td>
                        <td style={{ border: "1px solid #000", padding: "12px 3px" }}></td>
                        <td style={{ border: "1px solid #000", padding: "12px 3px" }}></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Приложение 3 */}
              <div style={{ marginBottom: 20, padding: "12px 0", borderBottom: "1px solid #ddd" }}>
                <div style={{ fontWeight: "bold", fontSize: 12, textAlign: "center", marginBottom: 6 }}>Приложение № 3</div>
                <div style={{ fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>Схема проведения анализа ГВС на месте проведения работ</div>
                <div style={{ marginBottom: 6, fontSize: 10, fontStyle: "italic", textAlign: "center" }}>(указываются оси установки, оборудования, трубопроводов, точки отбора проб воздушной среды)</div>
                <div style={{ border: "1px dashed #aaa", minHeight: 200, padding: 8, color: "#aaa", textAlign: "center", lineHeight: "200px", fontSize: 12 }}>
                  {data.schemes || "Место для схемы"}
                </div>
              </div>

              {/* Приложение 4 */}
              <div style={{ marginBottom: 20, padding: "12px 0", borderBottom: "1px solid #ddd" }}>
                <div style={{ fontWeight: "bold", fontSize: 12, textAlign: "center", marginBottom: 6 }}>Приложение № 4</div>
                <div style={{ fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>Схема расстановки оборудования на месте производства работ</div>
                <div style={{ marginBottom: 6, fontSize: 10, fontStyle: "italic", textAlign: "center" }}>(указываются оси установки, оборудования, трубопроводов с указанием расстояний до границ опасных зон, схемы промывки, продувки, установки заглушек, создания разъёмов фланцевых соединений и т.д.)</div>
                <div style={{ border: "1px dashed #aaa", minHeight: 200, padding: 8, color: "#aaa", textAlign: "center", lineHeight: "200px", fontSize: 12 }}>
                  Место для схемы
                </div>
              </div>

              {/* Приложение 5 */}
              <div style={{ marginBottom: 8, padding: "12px 0" }}>
                <div style={{ fontWeight: "bold", fontSize: 12, textAlign: "center", marginBottom: 6 }}>Приложение № 5</div>
                <div style={{ fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>Технологическая схема отключённого участка</div>
                <div style={{ marginBottom: 6, fontSize: 10, fontStyle: "italic", textAlign: "center" }}>(указываются оси установки, оборудования, трубопроводов с указанием расстояний до границ опасных зон, точки отбора проб воздушной среды и т.д.)</div>
                <div style={{ border: "1px dashed #aaa", minHeight: 200, padding: 8, color: "#aaa", textAlign: "center", lineHeight: "200px", fontSize: 12 }}>
                  Место для схемы
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}