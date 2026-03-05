import { Hexagon, FileText, FileSignature } from "lucide-react";
import Link from "next/link";
import { LogoutButton } from "@/components/ui/LogoutButton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[var(--color-background)]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-2">
          <Hexagon
            className="w-8 h-8 text-[var(--color-accent)]"
            strokeWidth={1.5}
          />
          <span className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">
            Noctra
          </span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-[var(--color-text-primary)] bg-[var(--color-surface-elevated)] transition-colors">
            <FileText className="w-5 h-5 text-[var(--color-accent)]" />
            <span className="font-medium text-sm">Propuestas</span>
          </Link>
          {/* Future feature:
           <Link href="/contracts" className="flex items-center gap-3 px-3 py-2 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)] transition-colors">
              <FileSignature className="w-5 h-5" />
              <span className="font-medium text-sm">Contratos</span>
           </Link>
           */}
        </nav>

        <div className="p-4 border-t border-[var(--color-border)]">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[var(--color-background)]">
        <div className="h-full p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
