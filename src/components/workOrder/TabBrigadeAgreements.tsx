import Icon from "@/components/ui/icon";
import { Field, SectionTitle, inp } from "./workOrderTypes";
import type { WorkOrderFormData, BrigadeMember } from "./workOrderTypes";

interface Props {
  form: WorkOrderFormData;
  set: (key: keyof WorkOrderFormData, value: unknown) => void;
  updateBrigade: (idx: number, key: keyof BrigadeMember, val: string) => void;
  addBrigadeMember: () => void;
  removeBrigadeMember: (idx: number) => void;
  activeSubTab: number; // 0 = бригада, 1 = согласование
}

export default function TabBrigadeAgreements({
  form,
  set,
  updateBrigade,
  addBrigadeMember,
  removeBrigadeMember,
  activeSubTab,
}: Props) {
  if (activeSubTab === 0) {
    return (
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
    );
  }

  return (
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
  );
}
