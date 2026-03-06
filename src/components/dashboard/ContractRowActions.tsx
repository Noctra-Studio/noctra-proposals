"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface ContractRowActionsProps {
  contractId: string;
  proposalId: string | null;
  slug: string;
  status: string;
}

export function ContractRowActions({
  contractId,
  proposalId,
  slug,
  status,
}: ContractRowActionsProps) {
  const [cancelling, setCancelling] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cancellationFee, setCancellationFee] = useState<number>(0);
  const [cancellationTerms, setCancellationTerms] = useState<string>(
    "Términos estándar de cancelación.",
  );
  const router = useRouter();

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    setCancelling(true);
    try {
      const res = await fetch(`/api/contracts/${contractId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cancellation_fee: cancellationFee,
          cancellation_terms: cancellationTerms,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to cancel contract");
      }

      alert(
        "✅ Contrato cancelado con éxito y acuerdo de cancelación generado.",
      );
      setShowModal(false);
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(`❌ Error al crear acuerdo de cancelación: ${error.message}`);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
      <Link
        href={`/c/${slug}`}
        target="_blank"
        className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
        Ver Cliente
      </Link>
      {proposalId && (
        <Link
          href={`/proposals/${proposalId}/contract`}
          className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
          Editar
        </Link>
      )}

      {status !== "cancelled" && (
        <button
          onClick={() => setShowModal(true)}
          disabled={cancelling}
          className="text-sm text-red-500 hover:text-red-400 font-medium flex items-center gap-1 disabled:opacity-50">
          <XCircle className="w-3 h-3" />
          Cancelar
        </button>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--color-surface-elevated)] w-full max-w-md rounded-2xl p-6 shadow-xl relative animate-in fade-in zoom-in-95">
            <h2 className="text-xl font-bold mb-4 text-[var(--color-text-primary)]">
              Acuerdo de Cancelación
            </h2>
            <form onSubmit={handleCancel} className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  Cancellation Fee (MXN)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={cancellationFee}
                  onChange={(e) => setCancellationFee(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  Cargo a cobrar por cancelación anticipada.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  Términos de Cancelación
                </label>
                <textarea
                  required
                  rows={3}
                  value={cancellationTerms}
                  onChange={(e) => setCancellationTerms(e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  placeholder="Ej: Pago total del diseño completado."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                  Cerrar
                </button>
                <button
                  type="submit"
                  disabled={cancelling}
                  className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 flex items-center gap-2">
                  {cancelling ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  Confirmar y Generar Acuerdo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
