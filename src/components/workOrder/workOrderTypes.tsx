export interface BrigadeMember {
  id: string;
  name: string;
  profession: string;
  function: string;
  signDate: string;
}

export interface GasAnalysis {
  id: string;
  datetime: string;
  location: string;
  components: string;
  allowedConc: string;
  result: string;
}

export interface DailyAccess {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface RemovedMember {
  id: string;
  name: string;
  dateTime: string;
  profession: string;
}

export interface AddedMember {
  id: string;
  name: string;
  dateTime: string;
  profession: string;
  function: string;
}

export interface WorkOrderFormData {
  ost: string;
  branch: string;
  subdivision: string;
  chiefEngineer: string;
  approveDate: string;
  orderNumber: string;
  workType: string;
  issuedTo: string;
  workDescription: string;
  hazards: string;
  workLocation: string;
  brigade: BrigadeMember[];
  planStart: string;
  planEnd: string;
  preparationMeasures: string;
  schemes: string;
  specialConditions: string;
  issuedByPerson: string;
  issuedByDate: string;
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
  gasAnalysis: GasAnalysis[];
  prepDoneBy: string;
  prepDoneDate: string;
  prepDoneBy2: string;
  prepDoneDate2: string;
  admittedBy: string;
  admittedDate: string;
  dailyAccess: DailyAccess[];
  extendedTo: string;
  extendedByPerson: string;
  removedMembers: RemovedMember[];
  addedMembers: AddedMember[];
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

export const emptyForm = (): WorkOrderFormData => ({
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
  brigade: [{ id: "1", name: "", profession: "", function: "Исполнитель", signDate: "" }],
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

export const WORK_TYPES = [
  { value: "gas", label: "Газоопасных" },
  { value: "fire", label: "Огневых" },
  { value: "elevated", label: "Работ повышенной опасности" },
  { value: "combined", label: "Газоопасных, огневых и работ повышенной опасности" },
];

export const inp =
  "w-full border-b border-gray-300 bg-transparent px-0 py-1 text-sm focus:outline-none focus:border-blue-600 transition-colors text-gray-800 placeholder-gray-300";

export const Field = ({
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

export const SectionTitle = ({ num, children }: { num?: string | number; children: React.ReactNode }) => (
  <div className="flex items-baseline gap-2 mt-6 mb-3">
    {num && (
      <span className="text-xs font-bold text-blue-700 bg-blue-50 rounded px-1.5 py-0.5 flex-shrink-0">
        {num}
      </span>
    )}
    <h3 className="text-sm font-semibold text-gray-700">{children}</h3>
  </div>
);
