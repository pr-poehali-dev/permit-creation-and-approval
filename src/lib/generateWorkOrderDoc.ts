import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  AlignmentType,
  WidthType,
  BorderStyle,
  HeadingLevel,
  UnderlineType,
  VerticalAlign,
  ShadingType,
} from "docx";
import { saveAs } from "file-saver";
import type { WorkOrderFormData } from "@/components/WorkOrderForm";

const FONT = "Times New Roman";
const SZ = 22; // 11pt
const SZ_SM = 18; // 9pt
const SZ_TITLE = 26; // 13pt

const noBorder = {
  top: { style: BorderStyle.NONE, size: 0 },
  bottom: { style: BorderStyle.NONE, size: 0 },
  left: { style: BorderStyle.NONE, size: 0 },
  right: { style: BorderStyle.NONE, size: 0 },
};

const thinBorder = {
  top: { style: BorderStyle.SINGLE, size: 4 },
  bottom: { style: BorderStyle.SINGLE, size: 4 },
  left: { style: BorderStyle.SINGLE, size: 4 },
  right: { style: BorderStyle.SINGLE, size: 4 },
};

const txt = (text: string, opts: { bold?: boolean; size?: number; underline?: boolean; italic?: boolean; color?: string } = {}) =>
  new TextRun({
    text,
    font: FONT,
    size: opts.size ?? SZ,
    bold: opts.bold,
    underline: opts.underline ? { type: UnderlineType.SINGLE } : undefined,
    italics: opts.italic,
    color: opts.color,
  });

const para = (runs: TextRun[], align: AlignmentType = AlignmentType.LEFT, spacing = 0) =>
  new Paragraph({
    children: runs,
    alignment: align,
    spacing: { after: spacing, before: 0 },
  });

const line = (label: string, value: string, bold = false) =>
  para([txt(`${label} `, { bold }), txt(value || "_______________________________", { underline: !!value })]);

const sectionTitle = (num: string | number, title: string) =>
  new Paragraph({
    children: [txt(`${num}.  ${title}`, { bold: true })],
    spacing: { before: 120, after: 60 },
  });

const hintPara = (text: string) =>
  new Paragraph({
    children: [txt(text, { italic: true, size: SZ_SM, color: "666666" })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 60 },
  });

const emptyLine = (n = 1) => Array.from({ length: n }, () => new Paragraph({ children: [txt("")], spacing: { after: 40 } }));

const tableCell = (
  content: Paragraph | string,
  opts: { bold?: boolean; center?: boolean; shade?: boolean; colSpan?: number; width?: number } = {}
) =>
  new TableCell({
    children: [
      typeof content === "string"
        ? new Paragraph({
            children: [txt(content, { bold: opts.bold, size: SZ_SM })],
            alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
          })
        : content,
    ],
    columnSpan: opts.colSpan,
    width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
    borders: thinBorder,
    verticalAlign: VerticalAlign.CENTER,
    shading: opts.shade ? { type: ShadingType.CLEAR, color: "auto", fill: "D9D9D9" } : undefined,
    margins: { top: 40, bottom: 40, left: 60, right: 60 },
  });

const formatDateTime = (dt: string) => {
  if (!dt) return "___.___.2026 г.  ___ч. ___мин.";
  const d = new Date(dt);
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()} г.  ${String(d.getHours()).padStart(2, "0")}ч. ${String(d.getMinutes()).padStart(2, "0")}мин.`;
};

const formatDate = (dt: string) => {
  if (!dt) return "___.___.2026 г.";
  const d = new Date(dt);
  return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()} г.`;
};

export async function generateWorkOrderDoc(data: WorkOrderFormData) {
  const children: (Paragraph | Table)[] = [];

  // ─── ШАПКА ───
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: { top: { style: BorderStyle.NONE, size: 0 }, bottom: { style: BorderStyle.NONE, size: 0 }, left: { style: BorderStyle.NONE, size: 0 }, right: { style: BorderStyle.NONE, size: 0 }, insideH: { style: BorderStyle.NONE, size: 0 }, insideV: { style: BorderStyle.NONE, size: 0 } },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                para([txt("ОСТ", { bold: true }), txt(`  ${data.ost}`)]),
                para([txt("Филиал", { bold: true }), txt(`  ${data.branch}`)]),
                para([txt("Структурное подразделение", { bold: true }), txt(`  ${data.subdivision}`)]),
              ],
              borders: noBorder,
              width: { size: 55, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [
                para([txt("«УТВЕРЖДАЮ»", { bold: true })], AlignmentType.CENTER),
                para([txt("Главный инженер")], AlignmentType.CENTER),
                para([txt(data.branch || "Нижневартовского УМН")], AlignmentType.CENTER),
                para([txt(data.chiefEngineer || "_____________")], AlignmentType.CENTER),
                new Paragraph({
                  children: [txt("МЕСТО ДЛЯ ШТАМПА", { bold: true, size: SZ_SM }), txt("  ", { size: SZ_SM })],
                  alignment: AlignmentType.CENTER,
                  border: { top: { style: BorderStyle.SINGLE, size: 4 }, bottom: { style: BorderStyle.SINGLE, size: 4 }, left: { style: BorderStyle.SINGLE, size: 4 }, right: { style: BorderStyle.SINGLE, size: 4 } },
                  spacing: { before: 80, after: 80 },
                }),
                para([txt("ЭЛЕКТРОННОЙ ПОДПИСИ", { bold: true, size: SZ_SM })], AlignmentType.CENTER),
                para([txt(`«___» _____________ ${data.approveDate ? new Date(data.approveDate).getFullYear() : 2026} г.`)], AlignmentType.CENTER),
              ],
              borders: noBorder,
              width: { size: 45, type: WidthType.PERCENTAGE },
            }),
          ],
        }),
      ],
    })
  );

  children.push(...emptyLine(1));

  // ─── ЗАГОЛОВОК ───
  const workTypeLabel = data.workType === "combined"
    ? "газоопасных, огневых работ и работ повышенной опасности"
    : data.workType === "gas" ? "газоопасных работ"
    : data.workType === "fire" ? "огневых работ"
    : "работ повышенной опасности";

  children.push(
    new Paragraph({
      children: [txt(`НАРЯД-ДОПУСК № ${data.orderNumber}`, { bold: true, size: SZ_TITLE })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
    }),
    new Paragraph({
      children: [txt("на проведение", { size: SZ })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
    }),
    new Paragraph({
      children: [txt(workTypeLabel, { bold: true, underline: true, size: SZ })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
    }),
    hintPara("(нужное подчеркнуть)")
  );

  // ─── 1. Выдан кому ───
  children.push(
    sectionTitle(1, "Выдан (кому)"),
    para([txt(data.issuedTo || "_".repeat(80))]),
    hintPara("(организация, должность, Фамилия И.О. ответственного за проведение работ)")
  );

  // ─── 2. На проведение работ ───
  children.push(
    sectionTitle(2, "На проведение работ"),
    para([txt(data.workDescription || "_".repeat(80))]),
    hintPara("(указывается характер и содержание работы)")
  );

  // ─── 2.1 Опасности ───
  children.push(
    new Paragraph({ children: [txt("2.1 Идентифицированные опасности, возникающие при её проведении:", { bold: true })], spacing: { before: 100, after: 60 } }),
    para([txt(data.hazards || "_".repeat(80))]),
    ...emptyLine(1)
  );

  // ─── 3. Место проведения ───
  children.push(
    sectionTitle(3, "Место проведения работ"),
    para([txt(data.workLocation || "_".repeat(80))]),
    hintPara("(участок, установка, ёмкость, резервуар, коммуникация, помещение)")
  );

  // ─── 4. Состав бригады ───
  children.push(sectionTitle(4, "Состав бригады:"));

  const brigadeHeaderRow = new TableRow({
    children: [
      tableCell("№ п/п", { bold: true, center: true, shade: true, width: 500 }),
      tableCell("Фамилия И.О.", { bold: true, center: true, shade: true, width: 1800 }),
      tableCell("Профессия (должность)", { bold: true, center: true, shade: true, width: 2200 }),
      tableCell("Выполняемая функция", { bold: true, center: true, shade: true, width: 2200 }),
      tableCell("С условиями работы ознакомлен, целевой инструктаж получил\nПодпись / Дата", { bold: true, center: true, shade: true, width: 2000 }),
      tableCell("Подпись проводившего инструктаж", { bold: true, center: true, shade: true, width: 1800 }),
    ],
    tableHeader: true,
  });

  const brigadeDataRows = data.brigade.map((m, i) =>
    new TableRow({
      children: [
        tableCell(String(i + 1), { center: true }),
        tableCell(m.name),
        tableCell(m.profession),
        tableCell(m.function),
        tableCell(m.signDate ? formatDate(m.signDate) : ""),
        tableCell(""),
      ],
    })
  );

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [brigadeHeaderRow, ...brigadeDataRows],
    })
  );

  // ─── 5. Время проведения ───
  children.push(
    sectionTitle(5, "Планируемое время проведения работ:"),
    para([txt("Начало     "), txt(data.planStart ? formatDateTime(data.planStart) : "____  ч. ____  мин.    ___.___.2026 г.", { underline: true })]),
    hintPara("(время, дата)"),
    para([txt("Окончание  "), txt(data.planEnd ? formatDateTime(data.planEnd) : "____  ч. ____  мин.    ___.___.2026 г.", { underline: true })]),
    hintPara("(время, дата)")
  );

  // ─── 6. Мероприятия ───
  children.push(
    sectionTitle(6, "Организационные и технические мероприятия по обеспечению безопасности"),
    new Paragraph({ children: [txt("6.1 Мероприятия по подготовке объекта к проведению работ и последовательности их проведения", { bold: true })], spacing: { after: 60 } }),
    para([txt(data.preparationMeasures || "См. приложение № 1")])
  );

  // ─── 7. Схемы ───
  children.push(
    sectionTitle(7, "Схемы расстановки оборудования"),
    para([txt(data.schemes || "_".repeat(80))]),
    hintPara("(указываются оси установки, оборудования, трубопроводов с указанием расстояний до границ опасных зон)")
  );

  // ─── 8. Особые условия ───
  children.push(
    sectionTitle(8, "Особые условия:"),
    para([txt(data.specialConditions || "_".repeat(80))]),
    hintPara("(в т.ч. присутствие лиц, ответственных за контроль (наблюдающего) при производстве работ, периодичность контроля)")
  );

  // ─── 9. Наряд выдал ───
  children.push(
    sectionTitle(9, "Наряд-допуск выдал"),
    para([txt(data.issuedByPerson || "_".repeat(60)), txt("  "), txt(formatDate(data.issuedByDate))]),
    hintPara("(должность, Фамилия И.О., подпись лица, выдавшего наряд-допуск, дата)")
  );

  // ─── 10. Согласовано ───
  children.push(sectionTitle(10, "Согласовано:"));

  const agreements = [
    { label: "10.1. Со службой охраны труда", person: data.agreementOT, date: data.agreementOTDate },
    { label: "10.2. С пожарной охраной", person: data.agreementFire, date: data.agreementFireDate },
    { label: "10.3. ПАСФ", person: data.agreementPASF, date: data.agreementPASFDate },
    { label: "УЭСАиТМ", person: data.agreementUESAiTM, date: data.agreementUESAiTMDate },
    { label: "УОЗО", person: data.agreementUOZO, date: data.agreementUOZODate },
    { label: "10.4. С оператором", person: data.agreementOperator, date: data.agreementOperatorDate },
  ];

  for (const ag of agreements) {
    children.push(
      para([
        txt(`${ag.label}  `, { bold: true }),
        txt(ag.person || "_".repeat(40)),
        txt("  "),
        txt(ag.date ? formatDateTime(ag.date) : "___.___.2026 г.  ___ч. ___мин."),
      ]),
      hintPara("(должность, Фамилия И.О., подпись, дата, время)")
    );
  }

  // ─── 11. Анализ газовоздушной среды ───
  children.push(sectionTitle(11, "Анализ газовоздушной среды на месте проведения работ"));

  const gasHeaderRow = new TableRow({
    children: [
      tableCell("№ п/п", { bold: true, center: true, shade: true, width: 400 }),
      tableCell("Дата и время отбора проб", { bold: true, center: true, shade: true, width: 1400 }),
      tableCell("Место отбора проб", { bold: true, center: true, shade: true, width: 1600 }),
      tableCell("Определяемые компоненты", { bold: true, center: true, shade: true, width: 1600 }),
      tableCell("Допустимая конц., мг/м³ (% для кислорода)", { bold: true, center: true, shade: true, width: 1400 }),
      tableCell("Результаты анализа, мг/м³ (% для кислорода)", { bold: true, center: true, shade: true, width: 1400 }),
      tableCell("Подпись лица, проводившего анализ", { bold: true, center: true, shade: true, width: 1300 }),
      tableCell("Подпись ответственного за проведение работ", { bold: true, center: true, shade: true, width: 1400 }),
    ],
    tableHeader: true,
  });

  const gasDataRows = data.gasAnalysis.map((g, i) =>
    new TableRow({
      children: [
        tableCell(String(i + 1), { center: true }),
        tableCell(g.datetime ? formatDateTime(g.datetime) : ""),
        tableCell(g.location),
        tableCell(g.components),
        tableCell(g.allowedConc),
        tableCell(g.result),
        tableCell(""),
        tableCell(""),
      ],
    })
  );

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [gasHeaderRow, ...gasDataRows],
    })
  );

  // ─── 12. Мероприятия выполнены ───
  children.push(
    sectionTitle(12, "Мероприятия по подготовке к безопасному проведению работ согласно наряду-допуску выполнены:"),
    para([txt("12.1 "), txt(data.prepDoneBy || "_".repeat(50)), txt("  "), txt(formatDateTime(data.prepDoneDate))]),
    hintPara("(Фамилия И.О., подпись лица, ответственного за подготовку работ, дата, время)"),
    para([txt("12.2 "), txt(data.prepDoneBy2 || "_".repeat(50)), txt("  "), txt(formatDateTime(data.prepDoneDate2))]),
    hintPara("(Фамилия И.О., подпись лица, ответственного за проведение работ, дата, время)")
  );

  // ─── 13. Допуск ───
  children.push(
    sectionTitle(13, "К выполнению работ допускаю"),
    para([txt(data.admittedBy || "_".repeat(60)), txt("  "), txt(formatDateTime(data.admittedDate))]),
    hintPara("(должность допускающего, Фамилия И.О., подпись, дата, время)")
  );

  // ─── 14. Ежедневный допуск ───
  children.push(sectionTitle(14, "Ежедневный допуск к работе (в т.ч. в первый день) и время её окончания"));

  const dailyHeaderRow = new TableRow({
    children: [
      tableCell("№ п/п", { bold: true, center: true, shade: true, width: 400 }),
      tableCell("Дата", { bold: true, center: true, shade: true, width: 1200 }),
      tableCell("Начало работы (чч:мм)", { bold: true, center: true, shade: true, width: 1400 }),
      tableCell("Подпись допускающего к работе", { bold: true, center: true, shade: true, width: 2000 }),
      tableCell("Подпись ответственного за проведение работ", { bold: true, center: true, shade: true, width: 2000 }),
      tableCell("Окончание (чч:мм)", { bold: true, center: true, shade: true, width: 1400 }),
      tableCell("Подпись ответственного за проведение работ", { bold: true, center: true, shade: true, width: 2000 }),
    ],
    tableHeader: true,
  });

  const dailyDataRows = data.dailyAccess.map((d, i) =>
    new TableRow({
      children: [
        tableCell(String(i + 1), { center: true }),
        tableCell(d.date ? formatDate(d.date) : ""),
        tableCell(d.startTime || ""),
        tableCell(""),
        tableCell(""),
        tableCell(d.endTime || ""),
        tableCell(""),
      ],
    })
  );

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [dailyHeaderRow, ...dailyDataRows],
    })
  );

  // ─── 15. Продление ───
  children.push(
    sectionTitle(15, "Продление наряда-допуска"),
    para([txt("Наряд-допуск продлён до:  "), txt(data.extendedTo ? formatDateTime(data.extendedTo) : "_".repeat(40), { underline: !!data.extendedTo })]),
    para([txt(data.extendedByPerson || "_".repeat(60))]),
    hintPara("(должность, Фамилия И.О., подпись лица, выдавшего наряд-допуск, дата, время)")
  );

  // ─── 18. Изменения в составе ───
  children.push(
    sectionTitle(18, "Изменения в составе бригады"),
    new Paragraph({ children: [txt("18.1. Выведение работников из состава бригады", { bold: true })], spacing: { after: 60 } })
  );

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            tableCell("Фамилия И.О.", { bold: true, center: true, shade: true }),
            tableCell("Дата, время выведения", { bold: true, center: true, shade: true }),
            tableCell("Профессия (должность), выполняемая функция", { bold: true, center: true, shade: true }),
            tableCell("Подпись лица, ответственного за проведение работ", { bold: true, center: true, shade: true }),
          ],
        }),
        ...data.removedMembers.map((m) =>
          new TableRow({
            children: [
              tableCell(m.name),
              tableCell(m.dateTime ? formatDateTime(m.dateTime) : ""),
              tableCell(m.profession),
              tableCell(""),
            ],
          })
        ),
      ],
    })
  );

  children.push(
    new Paragraph({ children: [txt("18.2. Введение работников в состав бригады", { bold: true })], spacing: { before: 120, after: 60 } }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            tableCell("Фамилия И.О.", { bold: true, center: true, shade: true }),
            tableCell("Дата, время введения", { bold: true, center: true, shade: true }),
            tableCell("Профессия (должность)", { bold: true, center: true, shade: true }),
            tableCell("Выполняемая функция", { bold: true, center: true, shade: true }),
            tableCell("Подпись лица, получившего инструктаж", { bold: true, center: true, shade: true }),
            tableCell("Подпись лица, ответственного за проведение работ", { bold: true, center: true, shade: true }),
          ],
        }),
        ...data.addedMembers.map((m) =>
          new TableRow({
            children: [
              tableCell(m.name),
              tableCell(m.dateTime ? formatDateTime(m.dateTime) : ""),
              tableCell(m.profession),
              tableCell(m.function),
              tableCell(""),
              tableCell(""),
            ],
          })
        ),
      ],
    })
  );

  // ─── 19-22. Закрытие ───
  children.push(
    sectionTitle(19, "Работы приостановлены/остановлены/наряд-допуск аннулирован"),
    para([txt(data.suspendedDate ? formatDateTime(data.suspendedDate) : "_".repeat(40))]),
    hintPara("(нужное подчеркнуть)  (дата, время)"),
    para([txt(data.suspendedBy || "_".repeat(60))]),
    hintPara("(Фамилия И.О., подпись лица, приостановившего/остановившего работы, дата, время)"),
    para([txt(data.suspendReason || "_".repeat(60))]),
    hintPara("(причины приостановки/остановки, номер акта-предписания (при наличии))")
  );

  children.push(
    sectionTitle(20, "Нарушения устранены, разрешаю возобновить работы"),
    para([txt(data.resumedBy || "_".repeat(60))]),
    hintPara("(Фамилия И.О., должность, подпись лица, ответственного за допуск к проведению работ, дата, время)")
  );

  children.push(
    sectionTitle(21, "Работы выполнены, рабочие места приведены в порядок, инструмент и материалы убраны, люди выведены"),
    para([txt(data.workCompletedBy || "_".repeat(60)), txt("  "), txt(formatDateTime(data.workCompletedDate))]),
    hintPara("(организация, должность, Фамилия И.О., подпись ответственного за проведение работ, дата, время)"),
    para([txt(data.operatorName || "_".repeat(60)), txt("  "), txt(formatDateTime(data.operatorDate))]),
    hintPara("(Фамилия И.О., подпись оператора, время, дата)")
  );

  children.push(
    sectionTitle(22, "Работы приняты, наряд-допуск закрыт"),
    para([txt(data.closedBy || "_".repeat(60)), txt("  "), txt(formatDateTime(data.closedDate))]),
    hintPara("(Фамилия И.О., должность, подпись допускающего лица, дата, время)")
  );

  // ─── Генерация документа ───
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 1080, right: 720 },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Наряд-допуск_${data.orderNumber || "новый"}.docx`);
}
