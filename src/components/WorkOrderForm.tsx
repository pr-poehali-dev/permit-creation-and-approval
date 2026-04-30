import { useState } from "react";
import Icon from "@/components/ui/icon";

interface BrigadeMember {
  id: string;
  name: string;
  profession: string;
  function: string;
  signDate: string;
}

interface GasAnalysis {
  id: string;
  datetime: string;
  location: string;
  components: string;
  allowedConc: string;
  result: string;
}

interface DailyAccess {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface RemovedMember {
  id: string;
  name: string;
  dateTime: string;
  profession: string;
}

interface AddedMember {
  id: string;
  name: string;
  dateTime: string;
  profession: string;
  function: string;
}

interface WorkOrderFormData {
  // Шапка
  ost: string;
  branch: string;
  subdivision: string;
  chiefEngineer: string;
  approveDate: string;
  orderNumber: string;
  workType: string; // gas | fire | elevated | combined

  // 1. Выдан кому
  issuedTo: string;

  // 2. На проведение работ
  workDescription: string;

  // 2.1 Идентифицированные опасности
  hazards: string;

  // 3. Место проведения работ
  workLocation: string;

  // 4. Состав бригады
  brigade: BrigadeMember[];

  // 5. Время проведения работ
  planStart: string;
  planEnd: string;

  // 6. Мероприятия
  preparationMeasures: string;

  // 7. Схемы
  schemes: string;

  // 8. Особые условия
  specialConditions: string;

  // 9. Наряд выдал
  issuedByPerson: string;
  issuedByDate: string;

  // 10. Согласовано
  agreementOT: string;
  agreementOTDate: string;
  agreementFire: string;
  agreementFireDate: string;
  agreementPASF: string;
  agreementPASFDate: string;
  agreementUESAiTM: string;
  agreementUESAiTMDate: string;
  agreementUOZO: string;
  agreementUOZODate: string;
  agreementOperator: string;
  agreementOperatorDate: string;

  // 11. Анализ газовоздушной среды
  gasAnalysis: GasAnalysis[];

  // 12. Мероприятия выполнены
  prepDoneBy: string;
  prepDoneDate: string;
  prepDoneBy2: string;
  prepDoneDate2: string;

  // 13. Допуск к работе
  admittedBy: string;
  admittedDate: string;

  // 14. Ежедневный допуск
  dailyAccess: DailyAccess[];

  // 15. Продление
  extendedTo: string;
  extendedByPerson: string;

  // 18. Изменения в составе
  removedMembers: RemovedMember[];
  addedMembers: AddedMember[];

  // 19-22
  suspendedDate: string;
  suspendedBy: string;
  suspendReason: string;
  resumedBy: string;
  workCompletedBy: string;
  workCompletedDate: string;
  operatorName: string;
  operatorDate: string;
  closedBy: string;
  closedDate: string;
}

const emptyForm = (): WorkOrderFormData => ({
  ost: "АО «Транснефть-Сибирь»",
  branch: "Нижневартовское УМН",
  subdivision: "НПС «Раскино»",
  chiefEngineer: "С.А. Подковырин",
  approveDate: "",
  orderNumber: "",
  workType: "gas",
  issuedTo: "",
  workDescription: "",
  hazards: "",
  workLocation: "",
  brigade: [
    { id: "1", name: "", profession: "", function: "Исполнитель", signDate: "" },
  ],
  planStart: "",
  planEnd: "",
  preparationMeasures: "См. приложение № 1",
  schemes: "",
  specialConditions: "",
  issuedByPerson: "",
  issuedByDate: "",
  agreementOT: "",
  agreementOTDate: "",
  agreementFire: "",
  agreementFireDate: "",
  agreementPASF: "",
  agreementPASFDate: "",
  agreementUESAiTM: "",
  agreementUESAiTMDate: "",
  agreementUOZO: "",
  agreementUOZODate: "",
  agreementOperator: "",
  agreementOperatorDate: "",
  gasAnalysis: [{ id: "1", datetime: "", location: "", components: "", allowedConc: "", result: "" }],
  prepDoneBy: "",
  prepDoneDate: "",
  prepDoneBy2: "",
  prepDoneDate2: "",
  admittedBy: "",
  admittedDate: "",
  dailyAccess: [
    { id: "1", date: "", startTime: "", endTime: "" },
    { id: "2", date: "", startTime: "", endTime: "" },
    { id: "3", date: "", startTime: "", endTime: "" },
    { id: "4", date: "", startTime: "", endTime: "" },
  ],
  extendedTo: "",
  extendedByPerson: "",
  removedMembers: [{ id: "1", name: "", dateTime: "", profession: "" }],
  addedMembers: [{ id: "1", name: "", dateTime: "", profession: "", function: "" }],
  suspendedDate: "",
  suspendedBy: "",
  suspendReason: "",
  resumedBy: "",
  workCompletedBy: "",
  workCompletedDate: "",
  operatorName: "",
  operatorDate: "",
  closedBy: "",
  closedDate: "",
});

const WORK_TYPES = [
  { value: "gas", label: "Газоопасных" },
  { value: "fire", label: "Огневых" },
  { value: "elevated", label: "Работ повышенной опасности" },
  { value: "combined", label: "Газоопасных, огневых и работ повышенной опасности" },
];

interface Props {
  onClose: () => void;
  onSave: (data: WorkOrderFormData) => void;
  nextNumber?: string;
}

const Field = ({
  label,
  children,
  hint,
  className = "",
}: {
  label?: string;
  children: React.ReactNode;
  hint?: string;
  className?: string;
}) => (
  <div className={`space-y-1 ${className}`}>
    {label && <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</label>}
    {children}
    {hint && <p className="text-[10px] text-gray-400 italic">{hint}</p>}
  </div>
);

const inp =
  "w-full border-b border-gray-300 bg-transparent px-0 py-1 text-sm focus:outline-none focus:border-blue-600 transition-colors text-gray-800 placeholder-gray-300";

const SectionTitle = ({ num, children }: { num?: string | number; children: React.ReactNode }) => (
  <div className="flex items-baseline gap-2 mt-6 mb-3">
    {num && (
      <span className="text-xs font-bold text-blue-700 bg-blue-50 rounded px-1.5 py-0.5 flex-shrink-0">
        {num}
      </span>
    )}
    <h3 className="text-sm font-semibold text-gray-700">{children}</h3>
  </div>
);

export default function WorkOrderForm({ onClose, onSave, nextNumber = "" }: Props) {
  const [form, setForm] = useState<WorkOrderFormData>(() => ({
    ...emptyForm(),
    orderNumber: nextNumber,
  }));
  const [activeTab, setActiveTab] = useState(0);

  const set = (key: keyof WorkOrderFormData, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const updateBrigade = (idx: number, key: keyof BrigadeMember, val: string) =>
    setForm((f) => {
      const brigade = [...f.brigade];
      brigade[idx] = { ...brigade[idx], [key]: val };
      return { ...f, brigade };
    });

  const addBrigadeMember = () =>
    setForm((f) => ({
      ...f,
      brigade: [...f.brigade, { id: String(Date.now()), name: "", profession: "", function: "Исполнитель", signDate: "" }],
    }));

  const removeBrigadeMember = (idx: number) =>
    setForm((f) => ({ ...f, brigade: f.brigade.filter((_, i) => i !== idx) }));

  const updateGas = (idx: number, key: keyof GasAnalysis, val: string) =>
    setForm((f) => {
      const gas = [...f.gasAnalysis];
      gas[idx] = { ...gas[idx], [key]: val };
      return { ...f, gasAnalysis: gas };
    });

  const updateDaily = (idx: number, key: keyof DailyAccess, val: string) =>
    setForm((f) => {
      const da = [...f.dailyAccess];
      da[idx] = { ...da[idx], [key]: val };
      return { ...f, dailyAccess: da };
    });

  const updateRemoved = (idx: number, key: keyof RemovedMember, val: string) =>
    setForm((f) => {
      const arr = [...f.removedMembers];
      arr[idx] = { ...arr[idx], [key]: val };
      return { ...f, removedMembers: arr };
    });

  const updateAdded = (idx: number, key: keyof AddedMember, val: string) =>
    setForm((f) => {
      const arr = [...f.addedMembers];
      arr[idx] = { ...arr[idx], [key]: val };
      return { ...f, addedMembers: arr };
    });

  const TABS = [
    { label: "Общие сведения", icon: "FileText" },
    { label: "Состав бригады", icon: "Users" },
    { label: "Согласование", icon: "CheckSquare" },
    { label: "Анализ среды", icon: "Activity" },
    { label: "Ежедневный допуск", icon: "Calendar" },
    { label: "Закрытие", icon: "Lock" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-6 px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl animate-fade-in">
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b rounded-t-xl"
          style={{ background: "hsl(var(--primary))" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Icon name="ClipboardList" size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-base">
                Наряд-допуск № {form.orderNumber || "—"}
              </h2>
              <p className="text-white/70 text-xs">на проведение газоопасных, огневых работ и работ повышенной опасности</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b overflow-x-auto">
          {TABS.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === i
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon name={tab.icon} size={13} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(100vh - 280px)" }}>

          {/* TAB 0: Общие сведения */}
          {activeTab === 0 && (
            <div className="space-y-5">
              {/* Шапка */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <Field label="ОСТ">
                  <input className={inp} value={form.ost} onChange={(e) => set("ost", e.target.value)} />
                </Field>
                <Field label="№ Наряда-допуска">
                  <input className={inp} value={form.orderNumber} onChange={(e) => set("orderNumber", e.target.value)} placeholder="Например: 6150" />
                </Field>
                <Field label="Филиал">
                  <input className={inp} value={form.branch} onChange={(e) => set("branch", e.target.value)} />
                </Field>
                <Field label="Структурное подразделение">
                  <input className={inp} value={form.subdivision} onChange={(e) => set("subdivision", e.target.value)} />
                </Field>
                <Field label="Главный инженер (УТВЕРЖДАЮ)">
                  <input className={inp} value={form.chiefEngineer} onChange={(e) => set("chiefEngineer", e.target.value)} placeholder="Фамилия И.О." />
                </Field>
                <Field label="Дата утверждения">
                  <input type="date" className={inp} value={form.approveDate} onChange={(e) => set("approveDate", e.target.value)} />
                </Field>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Вид работ (нужное подчеркнуть)</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {WORK_TYPES.map((wt) => (
                    <button
                      key={wt.value}
                      onClick={() => set("workType", wt.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        form.workType === wt.value
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-300 text-gray-600 hover:border-blue-400"
                      }`}
                    >
                      {wt.label}
                    </button>
                  ))}
                </div>
              </div>

              <SectionTitle num={1}>Выдан (кому)</SectionTitle>
              <Field hint="организация, должность, Фамилия И.О. ответственного за проведение работ">
                <input className={inp} value={form.issuedTo} onChange={(e) => set("issuedTo", e.target.value)}
                  placeholder="Нижневартовское УМН, НПС «Раскино» Начальнику УОМТО..." />
              </Field>

              <SectionTitle num={2}>На проведение работ</SectionTitle>
              <Field hint="указывается характер и содержание работы">
                <input className={inp} value={form.workDescription} onChange={(e) => set("workDescription", e.target.value)}
                  placeholder="ТО ПНА №1" />
              </Field>

              <SectionTitle num="2.1">Идентифицированные опасности, возникающие при её проведении</SectionTitle>
              <textarea
                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 resize-none text-gray-800 bg-gray-50"
                rows={4}
                value={form.hazards}
                onChange={(e) => set("hazards", e.target.value)}
                placeholder="1.1 Травма или заболевание вследствие отсутствия защиты от вредных факторов..."
              />

              <SectionTitle num={3}>Место проведения работ</SectionTitle>
              <Field hint="участок, установка, ёмкость, резервуар, коммуникация, помещение">
                <input className={inp} value={form.workLocation} onChange={(e) => set("workLocation", e.target.value)}
                  placeholder='км 206 МН "Александровское — Анжеро-Судженск", НПС "Раскино", ПНС' />
              </Field>

              <SectionTitle num={5}>Планируемое время проведения работ</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Начало (время и дата)">
                  <input type="datetime-local" className={inp} value={form.planStart} onChange={(e) => set("planStart", e.target.value)} />
                </Field>
                <Field label="Окончание (время и дата)">
                  <input type="datetime-local" className={inp} value={form.planEnd} onChange={(e) => set("planEnd", e.target.value)} />
                </Field>
              </div>

              <SectionTitle num="6.1">Мероприятия по подготовке объекта</SectionTitle>
              <Field hint="мероприятия по подготовке и последовательности их проведения">
                <input className={inp} value={form.preparationMeasures} onChange={(e) => set("preparationMeasures", e.target.value)} />
              </Field>

              <SectionTitle num={7}>Схемы расстановки оборудования и коммуникаций</SectionTitle>
              <Field hint="указываются оси установки, оборудования, трубопроводов с расстояниями до границ опасных зон">
                <input className={inp} value={form.schemes} onChange={(e) => set("schemes", e.target.value)}
                  placeholder="Схема промывки, продувки, точки отбора проб..." />
              </Field>

              <SectionTitle num={8}>Особые условия</SectionTitle>
              <textarea
                className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 resize-none text-gray-800 bg-gray-50"
                rows={3}
                value={form.specialConditions}
                onChange={(e) => set("specialConditions", e.target.value)}
                placeholder="Ответственный по наблюдению за местом проведения работ в течение не менее 1 часа после их окончания..."
              />

              <SectionTitle num={9}>Наряд-допуск выдал</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                <Field hint="должность, Фамилия И.О., подпись лица, выдавшего наряд-допуск">
                  <input className={inp} value={form.issuedByPerson} onChange={(e) => set("issuedByPerson", e.target.value)}
                    placeholder='Начальник НПС "Раскино" Бурликов В.И.' />
                </Field>
                <Field label="Дата">
                  <input type="date" className={inp} value={form.issuedByDate} onChange={(e) => set("issuedByDate", e.target.value)} />
                </Field>
              </div>
            </div>
          )}

          {/* TAB 1: Состав бригады */}
          {activeTab === 1 && (
            <div>
              <SectionTitle num={4}>Состав бригады</SectionTitle>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-3 py-2 text-xs text-gray-500 font-medium w-8">№</th>
                      <th className="text-left px-3 py-2 text-xs text-gray-500 font-medium">Фамилия И.О.</th>
                      <th className="text-left px-3 py-2 text-xs text-gray-500 font-medium">Профессия (должность)</th>
                      <th className="text-left px-3 py-2 text-xs text-gray-500 font-medium">Выполняемая функция</th>
                      <th className="text-left px-3 py-2 text-xs text-gray-500 font-medium">Дата инструктажа</th>
                      <th className="w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.brigade.map((member, idx) => (
                      <tr key={member.id} className="border-b border-gray-100">
                        <td className="px-3 py-2 text-xs text-gray-400">{idx + 1}</td>
                        <td className="px-3 py-2">
                          <input className={inp} value={member.name} onChange={(e) => updateBrigade(idx, "name", e.target.value)} placeholder="Казаков А.И." />
                        </td>
                        <td className="px-3 py-2">
                          <input className={inp} value={member.profession} onChange={(e) => updateBrigade(idx, "profession", e.target.value)} placeholder="Слесарь по РТУ" />
                        </td>
                        <td className="px-3 py-2">
                          <input className={inp} value={member.function} onChange={(e) => updateBrigade(idx, "function", e.target.value)} placeholder="Исполнитель" />
                        </td>
                        <td className="px-3 py-2">
                          <input type="date" className={inp} value={member.signDate} onChange={(e) => updateBrigade(idx, "signDate", e.target.value)} />
                        </td>
                        <td className="px-3 py-2">
                          {form.brigade.length > 1 && (
                            <button onClick={() => removeBrigadeMember(idx)} className="text-red-400 hover:text-red-600 p-0.5">
                              <Icon name="Trash2" size={13} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={addBrigadeMember}
                className="mt-3 flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                <Icon name="PlusCircle" size={14} />
                Добавить участника
              </button>
            </div>
          )}

          {/* TAB 2: Согласование */}
          {activeTab === 2 && (
            <div className="space-y-4">
              <SectionTitle num={10}>Согласовано</SectionTitle>
              {[
                { label: "10.1. Со службой охраны труда", key: "agreementOT" as const, dateKey: "agreementOTDate" as const, placeholder: 'Специалист по ОТ НПС "Раскино" Шандаров Д.В.' },
                { label: "10.2. С пожарной охраной", key: "agreementFire" as const, dateKey: "agreementFireDate" as const, placeholder: "Зам. Начальника 141 ПЧ Шалагинов И.А." },
                { label: "10.3. ПАСФ", key: "agreementPASF" as const, dateKey: "agreementPASFDate" as const, placeholder: "Инспектор ПАСФ Шандаров Д.В." },
                { label: "10.3. УЭСАиТМ", key: "agreementUESAiTM" as const, dateKey: "agreementUESAiTMDate" as const, placeholder: "Начальник участка Измайлов В.В." },
                { label: "10.3. УОЗО", key: "agreementUOZO" as const, dateKey: "agreementUOZODate" as const, placeholder: "Начальник участка Веселов А.Р." },
                { label: "10.4. С оператором", key: "agreementOperator" as const, dateKey: "agreementOperatorDate" as const, placeholder: "Должность, Фамилия И.О." },
              ].map((ag) => (
                <div key={ag.key} className="grid grid-cols-3 gap-4 items-end pb-3 border-b border-gray-100">
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-gray-500">{ag.label}</label>
                    <input className={`${inp} mt-1`} value={form[ag.key]} onChange={(e) => set(ag.key, e.target.value)} placeholder={ag.placeholder} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Дата и время</label>
                    <input type="datetime-local" className={`${inp} mt-1`} value={form[ag.dateKey]} onChange={(e) => set(ag.dateKey, e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Анализ воздушной среды */}
          {activeTab === 3 && (
            <div>
              <SectionTitle num={11}>Анализ газовоздушной среды на месте проведения работ</SectionTitle>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-2 py-2 text-xs text-gray-500 font-medium w-6">№</th>
                      <th className="text-left px-2 py-2 text-xs text-gray-500 font-medium">Дата и время отбора проб</th>
                      <th className="text-left px-2 py-2 text-xs text-gray-500 font-medium">Место отбора проб</th>
                      <th className="text-left px-2 py-2 text-xs text-gray-500 font-medium">Определяемые компоненты</th>
                      <th className="text-left px-2 py-2 text-xs text-gray-500 font-medium">Допустимая конц., мг/м³</th>
                      <th className="text-left px-2 py-2 text-xs text-gray-500 font-medium">Результаты анализа, мг/м³</th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.gasAnalysis.map((row, idx) => (
                      <tr key={row.id} className="border-b border-gray-100">
                        <td className="px-2 py-2 text-xs text-gray-400">{idx + 1}</td>
                        <td className="px-2 py-2"><input type="datetime-local" className={inp} value={row.datetime} onChange={(e) => updateGas(idx, "datetime", e.target.value)} /></td>
                        <td className="px-2 py-2"><input className={inp} value={row.location} onChange={(e) => updateGas(idx, "location", e.target.value)} /></td>
                        <td className="px-2 py-2"><input className={inp} value={row.components} onChange={(e) => updateGas(idx, "components", e.target.value)} /></td>
                        <td className="px-2 py-2"><input className={inp} value={row.allowedConc} onChange={(e) => updateGas(idx, "allowedConc", e.target.value)} /></td>
                        <td className="px-2 py-2"><input className={inp} value={row.result} onChange={(e) => updateGas(idx, "result", e.target.value)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={() => setForm((f) => ({ ...f, gasAnalysis: [...f.gasAnalysis, { id: String(Date.now()), datetime: "", location: "", components: "", allowedConc: "", result: "" }] }))}
                className="mt-3 flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                <Icon name="PlusCircle" size={14} />
                Добавить строку
              </button>

              <SectionTitle num={12}>Мероприятия по подготовке к безопасному проведению работ выполнены</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                <Field label="12.1 Ответственный за подготовку" hint="Начальник УОМТО НПС «Раскино»">
                  <input className={inp} value={form.prepDoneBy} onChange={(e) => set("prepDoneBy", e.target.value)} placeholder="Шпаде А.В." />
                </Field>
                <Field label="Дата и время">
                  <input type="datetime-local" className={inp} value={form.prepDoneDate} onChange={(e) => set("prepDoneDate", e.target.value)} />
                </Field>
                <Field label="12.2 Ответственный за проведение работ" hint="Начальник УОМТО НПС «Раскино»">
                  <input className={inp} value={form.prepDoneBy2} onChange={(e) => set("prepDoneBy2", e.target.value)} placeholder="Шпаде А.В." />
                </Field>
                <Field label="Дата и время">
                  <input type="datetime-local" className={inp} value={form.prepDoneDate2} onChange={(e) => set("prepDoneDate2", e.target.value)} />
                </Field>
              </div>

              <SectionTitle num={13}>К выполнению работ допускаю</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                <Field hint="должность допускающего, Фамилия И.О.">
                  <input className={inp} value={form.admittedBy} onChange={(e) => set("admittedBy", e.target.value)} placeholder='Начальник НПС "Раскино" Бурликов В.И.' />
                </Field>
                <Field label="Дата и время">
                  <input type="datetime-local" className={inp} value={form.admittedDate} onChange={(e) => set("admittedDate", e.target.value)} />
                </Field>
              </div>
            </div>
          )}

          {/* TAB 4: Ежедневный допуск */}
          {activeTab === 4 && (
            <div>
              <SectionTitle num={14}>Ежедневный допуск к работе</SectionTitle>
              <p className="text-xs text-gray-500 mb-3">(в т.ч. в первый день) и время её окончания</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-3 py-2 text-xs text-gray-500 font-medium w-8">№</th>
                      <th className="text-left px-3 py-2 text-xs text-gray-500 font-medium">Дата</th>
                      <th className="text-left px-3 py-2 text-xs text-gray-500 font-medium">Начало работы (чч:мм)</th>
                      <th className="text-left px-3 py-2 text-xs text-gray-500 font-medium">Окончание работы (чч:мм)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.dailyAccess.map((row, idx) => (
                      <tr key={row.id} className="border-b border-gray-100">
                        <td className="px-3 py-2 text-xs text-gray-400">{idx + 1}</td>
                        <td className="px-3 py-2"><input type="date" className={inp} value={row.date} onChange={(e) => updateDaily(idx, "date", e.target.value)} /></td>
                        <td className="px-3 py-2"><input type="time" className={inp} value={row.startTime} onChange={(e) => updateDaily(idx, "startTime", e.target.value)} /></td>
                        <td className="px-3 py-2"><input type="time" className={inp} value={row.endTime} onChange={(e) => updateDaily(idx, "endTime", e.target.value)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <SectionTitle num={15}>Продление наряда-допуска</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Наряд-допуск продлён до">
                  <input type="datetime-local" className={inp} value={form.extendedTo} onChange={(e) => set("extendedTo", e.target.value)} />
                </Field>
                <Field label="Кем продлён" hint="должность, Фамилия И.О., подпись">
                  <input className={inp} value={form.extendedByPerson} onChange={(e) => set("extendedByPerson", e.target.value)} />
                </Field>
              </div>

              <SectionTitle num={18}>Изменения в составе бригады</SectionTitle>
              <p className="text-xs font-semibold text-gray-600 mt-3 mb-2">18.1. Выведение работников из состава бригады</p>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-2 py-2 text-xs text-gray-500 font-medium">Фамилия И.О.</th>
                      <th className="text-left px-2 py-2 text-xs text-gray-500 font-medium">Дата, время выведения</th>
                      <th className="text-left px-2 py-2 text-xs text-gray-500 font-medium">Профессия (должность)</th>
                      <th className="w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.removedMembers.map((m, idx) => (
                      <tr key={m.id} className="border-b border-gray-100">
                        <td className="px-2 py-2"><input className={inp} value={m.name} onChange={(e) => updateRemoved(idx, "name", e.target.value)} /></td>
                        <td className="px-2 py-2"><input type="datetime-local" className={inp} value={m.dateTime} onChange={(e) => updateRemoved(idx, "dateTime", e.target.value)} /></td>
                        <td className="px-2 py-2"><input className={inp} value={m.profession} onChange={(e) => updateRemoved(idx, "profession", e.target.value)} /></td>
                        <td className="px-2 py-2">
                          {form.removedMembers.length > 1 && (
                            <button onClick={() => setForm((f) => ({ ...f, removedMembers: f.removedMembers.filter((_, i) => i !== idx) }))} className="text-red-400 hover:text-red-600">
                              <Icon name="Trash2" size={13} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button onClick={() => setForm((f) => ({ ...f, removedMembers: [...f.removedMembers, { id: String(Date.now()), name: "", dateTime: "", profession: "" }] }))} className="mt-2 flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium">
                  <Icon name="PlusCircle" size={14} /> Добавить
                </button>
              </div>

              <p className="text-xs font-semibold text-gray-600 mb-2">18.2. Введение работников в состав бригады</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-2 py-2 text-xs text-gray-500 font-medium">Фамилия И.О.</th>
                      <th className="text-left px-2 py-2 text-xs text-gray-500 font-medium">Дата, время введения</th>
                      <th className="text-left px-2 py-2 text-xs text-gray-500 font-medium">Профессия</th>
                      <th className="text-left px-2 py-2 text-xs text-gray-500 font-medium">Функция</th>
                      <th className="w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.addedMembers.map((m, idx) => (
                      <tr key={m.id} className="border-b border-gray-100">
                        <td className="px-2 py-2"><input className={inp} value={m.name} onChange={(e) => updateAdded(idx, "name", e.target.value)} /></td>
                        <td className="px-2 py-2"><input type="datetime-local" className={inp} value={m.dateTime} onChange={(e) => updateAdded(idx, "dateTime", e.target.value)} /></td>
                        <td className="px-2 py-2"><input className={inp} value={m.profession} onChange={(e) => updateAdded(idx, "profession", e.target.value)} /></td>
                        <td className="px-2 py-2"><input className={inp} value={m.function} onChange={(e) => updateAdded(idx, "function", e.target.value)} /></td>
                        <td className="px-2 py-2">
                          {form.addedMembers.length > 1 && (
                            <button onClick={() => setForm((f) => ({ ...f, addedMembers: f.addedMembers.filter((_, i) => i !== idx) }))} className="text-red-400 hover:text-red-600">
                              <Icon name="Trash2" size={13} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button onClick={() => setForm((f) => ({ ...f, addedMembers: [...f.addedMembers, { id: String(Date.now()), name: "", dateTime: "", profession: "", function: "" }] }))} className="mt-2 flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium">
                  <Icon name="PlusCircle" size={14} /> Добавить
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: Закрытие */}
          {activeTab === 5 && (
            <div className="space-y-5">
              <SectionTitle num={19}>Работы приостановлены / остановлены / наряд-допуск аннулирован</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Дата и время">
                  <input type="datetime-local" className={inp} value={form.suspendedDate} onChange={(e) => set("suspendedDate", e.target.value)} />
                </Field>
                <Field label="Приостановил (Фамилия И.О., должность)">
                  <input className={inp} value={form.suspendedBy} onChange={(e) => set("suspendedBy", e.target.value)} />
                </Field>
              </div>
              <Field label="Причина приостановки / остановки / номер акта-предписания">
                <input className={inp} value={form.suspendReason} onChange={(e) => set("suspendReason", e.target.value)} />
              </Field>

              <SectionTitle num={20}>Нарушения устранены, разрешаю возобновить работы</SectionTitle>
              <Field hint="Фамилия И.О., должность, подпись">
                <input className={inp} value={form.resumedBy} onChange={(e) => set("resumedBy", e.target.value)} />
              </Field>

              <SectionTitle num={21}>Работы выполнены, рабочие места приведены в порядок</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Ответственный за проведение работ" hint="организация, должность, Фамилия И.О.">
                  <input className={inp} value={form.workCompletedBy} onChange={(e) => set("workCompletedBy", e.target.value)} placeholder="Начальник УОМТО НПС «Раскино» Шпаде А.В." />
                </Field>
                <Field label="Дата и время">
                  <input type="datetime-local" className={inp} value={form.workCompletedDate} onChange={(e) => set("workCompletedDate", e.target.value)} />
                </Field>
                <Field label="Оператор (Фамилия И.О.)" hint="подпись оператора, время, дата">
                  <input className={inp} value={form.operatorName} onChange={(e) => set("operatorName", e.target.value)} placeholder='Оператор НППС "Раскино" Лонгас А.В.' />
                </Field>
                <Field label="Дата и время">
                  <input type="datetime-local" className={inp} value={form.operatorDate} onChange={(e) => set("operatorDate", e.target.value)} />
                </Field>
              </div>

              <SectionTitle num={22}>Работы приняты, наряд-допуск закрыт</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                <Field hint="Фамилия И.О., должность, подпись допускающего лица">
                  <input className={inp} value={form.closedBy} onChange={(e) => set("closedBy", e.target.value)} placeholder='Бурликов В.И. Начальник НПС "Раскино"' />
                </Field>
                <Field label="Дата и время">
                  <input type="datetime-local" className={inp} value={form.closedDate} onChange={(e) => set("closedDate", e.target.value)} />
                </Field>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <div className="flex gap-1">
            {TABS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`w-2 h-2 rounded-full transition-colors ${activeTab === i ? "bg-blue-600" : "bg-gray-300 hover:bg-gray-400"}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">
              Раздел {activeTab + 1} из {TABS.length}
            </span>
            {activeTab > 0 && (
              <button
                onClick={() => setActiveTab((t) => t - 1)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                ← Назад
              </button>
            )}
            {activeTab < TABS.length - 1 ? (
              <button
                onClick={() => setActiveTab((t) => t + 1)}
                className="px-4 py-2 text-sm rounded-lg text-white font-medium transition-colors"
                style={{ background: "hsl(var(--primary))" }}
              >
                Далее →
              </button>
            ) : (
              <button
                onClick={() => onSave(form)}
                className="px-5 py-2 text-sm rounded-lg text-white font-medium flex items-center gap-2 transition-colors"
                style={{ background: "hsl(142 70% 35%)" }}
              >
                <Icon name="Check" size={14} />
                Сохранить наряд
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
