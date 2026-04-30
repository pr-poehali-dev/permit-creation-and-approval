import { Field, SectionTitle, inp } from "./workOrderTypes";
import type { WorkOrderFormData } from "./workOrderTypes";

interface Props {
  form: WorkOrderFormData;
  set: (key: keyof WorkOrderFormData, value: unknown) => void;
}

export default function TabClosure({ form, set }: Props) {
  return (
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
  );
}
