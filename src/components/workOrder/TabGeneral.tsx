import { Field, SectionTitle, inp, WORK_TYPES } from "./workOrderTypes";
import type { WorkOrderFormData } from "./workOrderTypes";

interface Props {
  form: WorkOrderFormData;
  set: (key: keyof WorkOrderFormData, value: unknown) => void;
}

export default function TabGeneral({ form, set }: Props) {
  return (
    <div className="space-y-5">
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
  );
}
