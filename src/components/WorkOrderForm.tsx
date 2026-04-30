import { useState } from "react";
import Icon from "@/components/ui/icon";
import {
  emptyForm,
  type WorkOrderFormData,
  type BrigadeMember,
  type GasAnalysis,
  type DailyAccess,
  type RemovedMember,
  type AddedMember,
} from "./workOrder/workOrderTypes";
import TabGeneral from "./workOrder/TabGeneral";
import TabBrigadeAgreements from "./workOrder/TabBrigadeAgreements";
import TabAnalysisDailyAccess from "./workOrder/TabAnalysisDailyAccess";
import TabClosure from "./workOrder/TabClosure";

export type { WorkOrderFormData };

interface Props {
  onClose: () => void;
  onSave: (data: WorkOrderFormData) => void;
  nextNumber?: string;
  initialData?: WorkOrderFormData;
  editId?: string;
}

const TABS = [
  { label: "Общие сведения", icon: "FileText" },
  { label: "Состав бригады", icon: "Users" },
  { label: "Согласование", icon: "CheckSquare" },
  { label: "Анализ среды", icon: "Activity" },
  { label: "Ежедневный допуск", icon: "Calendar" },
  { label: "Закрытие", icon: "Lock" },
];

export default function WorkOrderForm({ onClose, onSave, nextNumber = "", initialData, editId }: Props) {
  const [form, setForm] = useState<WorkOrderFormData>(() =>
    initialData ? { ...initialData } : { ...emptyForm(), orderNumber: nextNumber }
  );
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

  const renderTab = () => {
    switch (activeTab) {
      case 0:
        return <TabGeneral form={form} set={set} />;
      case 1:
        return (
          <TabBrigadeAgreements
            form={form}
            set={set}
            updateBrigade={updateBrigade}
            addBrigadeMember={addBrigadeMember}
            removeBrigadeMember={removeBrigadeMember}
            activeSubTab={0}
          />
        );
      case 2:
        return (
          <TabBrigadeAgreements
            form={form}
            set={set}
            updateBrigade={updateBrigade}
            addBrigadeMember={addBrigadeMember}
            removeBrigadeMember={removeBrigadeMember}
            activeSubTab={1}
          />
        );
      case 3:
        return (
          <TabAnalysisDailyAccess
            form={form}
            set={set}
            setForm={setForm}
            updateGas={updateGas}
            updateDaily={updateDaily}
            updateRemoved={updateRemoved}
            updateAdded={updateAdded}
            activeSubTab={0}
          />
        );
      case 4:
        return (
          <TabAnalysisDailyAccess
            form={form}
            set={set}
            setForm={setForm}
            updateGas={updateGas}
            updateDaily={updateDaily}
            updateRemoved={updateRemoved}
            updateAdded={updateAdded}
            activeSubTab={1}
          />
        );
      case 5:
        return <TabClosure form={form} set={set} />;
    }
  };

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
                {editId ? "Редактирование наряда-допуска" : "Новый наряд-допуск"} № {form.orderNumber || "—"}
              </h2>
              <p className="text-white/70 text-xs">на проведение газоопасных, огневых работ и работ повышенной опасности</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors p-1">
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
          {renderTab()}
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
