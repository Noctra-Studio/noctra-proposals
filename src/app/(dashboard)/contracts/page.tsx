import { createClient } from "@/lib/supabase/server";
import {
  Search,
  Filter,
  FileSignature,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Contract } from "@/types";
import { ContractRowActions } from "@/components/dashboard/ContractRowActions";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    sent: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    signed: "bg-green-500/10 text-green-400 border-green-500/20",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const labels: Record<string, string> = {
    draft: "Borrador",
    sent: "Enviado",
    signed: "Firmado",
    cancelled: "Cancelado",
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

export default async function ContractsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();

  // Base query
  let query = supabase
    .from("contracts")
    .select("*")
    .order("created_at", { ascending: false });

  // Apply filter if status exists
  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data: rawContracts, error } = await query;
  const contracts = (rawContracts as Contract[]) || [];

  // Calculate statistics (fetch all to get accurate stats regardless of filter)
  const { data: allContractsRaw } = await supabase
    .from("contracts")
    .select("*");
  const allContracts = (allContractsRaw as Contract[]) || [];

  const totalCount = allContracts.length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const signedThisMonth = allContracts.filter((c) => {
    if (c.status !== "signed" || !c.signed_at) return false;
    const date = new Date(c.signed_at);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  }).length;

  const totalValueSigned = allContracts
    .filter((c) => c.status === "signed")
    .reduce((acc, c) => acc + (Number(c.total) || 0), 0);

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
            Contratos
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1 text-sm">
            Gestiona todos los contratos emitidos a tus clientes.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Contratos"
          value={totalCount.toString()}
          icon={FileSignature}
          description="Contratos emitidos históricamente"
        />
        <StatCard
          title="Firmados este Mes"
          value={signedThisMonth.toString()}
          icon={CheckCircle2}
          description="Rendimiento del mes actual"
        />
        <StatCard
          title="Valor Firmado"
          value={formatter.format(totalValueSigned)}
          icon={TrendingUp}
          description="Ingresos asegurados totales"
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
              <option value="sent">Enviados</option>
              <option value="signed">Firmados</option>
              <option value="cancelled">Cancelados</option>
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
              {contracts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-[var(--color-text-secondary)]">
                    No hay contratos encontrados.
                  </td>
                </tr>
              ) : (
                contracts.map((contract) => (
                  <tr
                    key={contract.id}
                    className="hover:bg-[var(--color-surface-elevated)]/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-[var(--color-text-primary)]">
                      {contract.project_name}
                    </td>
                    <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                      {contract.client_name}
                    </td>
                    <td className="px-6 py-4 font-medium text-[var(--color-text-primary)]">
                      {formatter.format(contract.total)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={contract.status} />
                    </td>
                    <td className="px-6 py-4 text-[var(--color-text-secondary)]">
                      {contract.created_at
                        ? format(
                            new Date(contract.created_at),
                            "dd MMM, yyyy",
                            { locale: es },
                          )
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ContractRowActions
                        contractId={contract.id}
                        proposalId={contract.proposal_id ?? null}
                        slug={contract.slug}
                        status={contract.status}
                      />
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
