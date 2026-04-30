import Icon from "@/components/ui/icon";
import { Field, SectionTitle, inp } from "./workOrderTypes";
import type { WorkOrderFormData, GasAnalysis, DailyAccess, RemovedMember, AddedMember } from "./workOrderTypes";

interface Props {
  form: WorkOrderFormData;
  set: (key: keyof WorkOrderFormData, value: unknown) => void;
  setForm: React.Dispatch<React.SetStateAction<WorkOrderFormData>>;
  updateGas: (idx: number, key: keyof GasAnalysis, val: string) => void;
  updateDaily: (idx: number, key: keyof DailyAccess, val: string) => void;
  updateRemoved: (idx: number, key: keyof RemovedMember, val: string) => void;
  updateAdded: (idx: number, key: keyof AddedMember, val: string) => void;
  activeSubTab: number; // 0 = анализ среды, 1 = ежедневный допуск
}

export default function TabAnalysisDailyAccess({
  form,
  set,
  setForm,
  updateGas,
  updateDaily,
  updateRemoved,
  updateAdded,
  activeSubTab,
}: Props) {
  if (activeSubTab === 0) {
    return (
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
    );
  }

  return (
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
  );
}
