import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Icon from "@/components/ui/icon";
import JournalPage from "@/pages/Journal";
import PersonnelPage from "@/pages/Personnel";
import ApprovalsPage from "@/pages/Approvals";
import AttachmentsPage from "@/pages/Attachments";
import AnalyticsPage from "@/pages/Analytics";

type Page = "journal" | "personnel" | "approvals" | "attachments" | "analytics";
type Role = "executor" | "approver" | "authorizer" | "analyst";

const ROLES: { id: Role; label: string; color: string }[] = [
  { id: "executor", label: "Исполнитель", color: "bg-blue-100 text-blue-700" },
  { id: "approver", label: "Согласующий", color: "bg-amber-100 text-amber-700" },
  { id: "authorizer", label: "Утверждающий", color: "bg-red-100 text-red-700" },
  { id: "analyst", label: "Аналитик", color: "bg-green-100 text-green-700" },
];

const NAV_ITEMS: {
  id: Page;
  label: string;
  icon: string;
  roles: Role[];
}[] = [
  { id: "journal", label: "Журнал нарядов", icon: "ClipboardList", roles: ["executor", "approver", "authorizer", "analyst"] },
  { id: "personnel", label: "Реестр персонала", icon: "Users", roles: ["executor", "approver", "authorizer", "analyst"] },
  { id: "approvals", label: "Согласование", icon: "CheckSquare", roles: ["approver", "authorizer"] },
  { id: "attachments", label: "Приложения", icon: "Paperclip", roles: ["executor", "approver", "authorizer"] },
  { id: "analytics", label: "Аналитика", icon: "BarChart3", roles: ["analyst", "authorizer"] },
];

export default function App() {
  const [page, setPage] = useState<Page>("journal");
  const [role, setRole] = useState<Role>("authorizer");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentRole = ROLES.find((r) => r.id === role)!;
  const visibleNav = NAV_ITEMS.filter((n) => n.roles.includes(role));

  const renderPage = () => {
    switch (page) {
      case "journal": return <JournalPage role={role} />;
      case "personnel": return <PersonnelPage role={role} />;
      case "approvals": return <ApprovalsPage role={role} />;
      case "attachments": return <AttachmentsPage role={role} />;
      case "analytics": return <AnalyticsPage role={role} />;
    }
  };

  return (
    <TooltipProvider>
      <Toaster />
      <div className="flex h-screen bg-background overflow-hidden">
        {/* Sidebar */}
        <aside
          className="flex flex-col transition-all duration-200"
          style={{
            width: sidebarOpen ? 240 : 64,
            background: "hsl(var(--sidebar-background))",
            borderRight: "1px solid hsl(var(--sidebar-border))",
            flexShrink: 0,
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 px-4 h-14 border-b" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
            <div
              className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0"
              style={{ background: "hsl(var(--sidebar-primary))" }}
            >
              <Icon name="Shield" size={15} className="text-white" />
            </div>
            {sidebarOpen && (
              <span className="text-white font-semibold text-sm tracking-tight leading-tight">
                НарядДок
              </span>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="ml-auto opacity-50 hover:opacity-100 transition-opacity"
              style={{ color: "hsl(var(--sidebar-foreground))" }}
            >
              <Icon name={sidebarOpen ? "PanelLeftClose" : "PanelLeftOpen"} size={16} />
            </button>
          </div>

          {/* Role selector */}
          {sidebarOpen && (
            <div className="px-3 py-3 border-b" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
              <p className="text-xs mb-2" style={{ color: "hsl(var(--sidebar-foreground) / 0.5)" }}>
                Текущая роль
              </p>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value as Role);
                  setPage("journal");
                }}
                className="w-full text-xs rounded px-2 py-1.5 font-medium border-0 cursor-pointer"
                style={{
                  background: "hsl(var(--sidebar-accent))",
                  color: "hsl(var(--sidebar-accent-foreground))",
                }}
              >
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Nav */}
          <nav className="flex-1 p-2 space-y-0.5">
            {visibleNav.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`sidebar-item w-full text-left ${page === item.id ? "active" : ""}`}
              >
                <Icon name={item.icon} size={17} className="flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* User */}
          <div
            className="px-3 py-3 border-t flex items-center gap-3"
            style={{ borderColor: "hsl(var(--sidebar-border))" }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
              style={{ background: "hsl(var(--sidebar-primary))" }}
            >
              ИВ
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <p className="text-xs font-medium truncate" style={{ color: "hsl(var(--sidebar-foreground))" }}>
                  Иванов В.П.
                </p>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${currentRole.color}`}>
                  {currentRole.label}
                </span>
              </div>
            )}
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Topbar */}
          <header
            className="h-14 flex items-center justify-between px-6 border-b bg-white"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <div>
              <h1 className="text-sm font-semibold" style={{ color: "hsl(var(--foreground))" }}>
                {NAV_ITEMS.find((n) => n.id === page)?.label}
              </h1>
              <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                29 апреля 2026
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative p-2 rounded-md hover:bg-muted transition-colors">
                <Icon name="Bell" size={17} style={{ color: "hsl(var(--muted-foreground))" }} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
              </button>
              <button className="p-2 rounded-md hover:bg-muted transition-colors">
                <Icon name="Settings" size={17} style={{ color: "hsl(var(--muted-foreground))" }} />
              </button>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-auto p-6 page-enter">
            {renderPage()}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}