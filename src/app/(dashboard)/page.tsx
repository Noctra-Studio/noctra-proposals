import { createClient } from "@/lib/supabase/server";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  FileText,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Proposal } from "@/types";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    sent: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    accepted: "bg-green-500/10 text-green-400 border-green-500/20",
    changes_requested: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
    cancelled: "bg-gray-800 text-gray-400 border-gray-700",
  };

  const labels: Record<string, string> = {
    draft: "Borrador",
    sent: "Enviada",
    accepted: "Aceptada",
    changes_requested: "Cambios solicitados",
    rejected: "Rechazada",
    cancelled: "Cancelada",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {labels[status] || status}
    </span>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: string;
  icon: any;
  description?: string;
}) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-[var(--color-surface-elevated)] rounded-lg">
          <Icon className="w-6 h-6 text-[var(--color-accent)]" />
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
            {value}
          </h3>
        </div>
      </div>
      {description && (
        <p className="text-sm text-[var(--color-text-secondary)] mt-auto">
          {description}
        </p>
      )}
    </div>
  );
}

// Ensure dynamic rendering to fetch fresh data on each page load
export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();

  // Base query
  let query = supabase
    .from("proposals")
    .select("*")
    .order("created_at", { ascending: false });

  // Apply filter if status exists
  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data: rawProposals, error } = await query;
  const proposals = (rawProposals as Proposal[]) || [];

  // Calculate statistics (fetch all to get accurate stats regardless of filter)
  const { data: allProposalsRaw } = await supabase
    .from("proposals")
    .select("*");
  const allProposals = (allProposalsRaw as Proposal[]) || [];

  const totalCount = allProposals.length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const acceptedThisMonth = allProposals.filter((p) => {
    if (p.status !== "accepted" || !p.created_at) return false;
    const date = new Date(p.created_at);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  }).length;

  const totalValueAccepted = allProposals
    .filter((p) => p.status === "accepted")
    .reduce((acc, p) => acc + (Number(p.total) || 0), 0);

  const formatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Propuestas
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1 text-sm">
            Gestiona y haz seguimiento a tus propuestas comerciales.
          </p>
        </div>
        <Link
          href="/proposals/new"
          className="flex items-center gap-2 bg-[var(--color-accent)] text-black px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-[#d4eb3d] transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
          Nueva propuesta
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Propuestas"
          value={totalCount.toString()}
          icon={FileText}
          description="Histórico completo"
        />
        <StatCard
          title="Aceptadas este Mes"
          value={acceptedThisMonth.toString()}
          icon={CheckCircle2}
          description="Rendimiento del mes actual"
        />
        <StatCard
          title="Valor Aceptado"
          value={formatter.format(totalValueAccepted)}
          icon={TrendingUp}
          description="Ingresos proyectados totales"
        />
      </div>

      {/* Table Section */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden flex flex-col">
        {/* Filters bar */}
        <div className="p-4 border-b border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
            <input
              type="text"
              placeholder="Buscar proyecto o cliente..."
              className="w-full pl-9 pr-4 py-2 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-[var(--color-text-secondary)]" />
            <select
              className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text-primary)] py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] w-full sm:w-auto"
              defaultValue={status || "all"}>
              <option value="all">Todos los estados</option>
              <option value="draft">Borrador</option>
              <option value="sent">Enviadas</option>
              <option value="accepted">Aceptadas</option>
              <option value="changes_requested">Cambios solicitados</option>
              <option value="rejected">Rechazadas</option>
            </select>
          </div>
        </div>

        {/* Table items */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-[var(--color-text-secondary)] uppercase bg-[var(--color-surface-elevated)]/50 border-b border-[var(--color-border)]">
              <tr>
                <th className="px-6 py-4 font-medium">Proyecto</th>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium">Fecha</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {proposals.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-[var(--color-text-secondary)]">
                    No hay propuestas encontradas.
                  </td>
                </tr>
              ) : (
                proposals.map((proposal) => (
                  <tr
                    key={proposal.id}
                    className="hover:bg-[var(--color-surface-elevated)]/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-[var(--color-text-primary)]">
                      {proposal.project_name}
                    </td>
                    <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                      {proposal.client_name}
                    </td>
                    <td className="px-6 py-4 font-medium text-[var(--color-text-primary)]">
                      {formatter.format(proposal.total)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={proposal.status} />
                    </td>
                    <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                      {proposal.created_at
                        ? format(
                            new Date(proposal.created_at),
                            "dd MMM, yyyy",
                            { locale: es },
                          )
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/p/${proposal.slug}`}
                          target="_blank"
                          className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                          Ver
                        </Link>
                        <Link
                          href={`/proposals/${proposal.id}`}
                          className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
                          Editar
                        </Link>
                        <button className="text-sm text-[var(--color-accent)] hover:text-[#d4eb3d] font-medium">
                          Enviar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
