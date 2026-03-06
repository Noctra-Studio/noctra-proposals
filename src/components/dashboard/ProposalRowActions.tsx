"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProposalRowActionsProps {
  proposalId: string;
  slug: string;
  status: string;
}

export function ProposalRowActions({
  proposalId,
  slug,
  status,
}: ProposalRowActionsProps) {
  const [sending, setSending] = useState(false);
  const router = useRouter();

  const handleSend = async () => {
    if (
      !confirm(
        "¿Estás seguro de que quieres enviar esta propuesta al cliente por correo?",
      )
    ) {
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`/api/proposals/${proposalId}/send`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to send proposal");

      alert("✅ Propuesta enviada con éxito.");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("❌ Error al enviar la propuesta.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
      <Link
        href={`/p/${slug}`}
        target="_blank"
        className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
        Ver
      </Link>
      <Link
        href={`/proposals/${proposalId}`}
        className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">
        Editar
      </Link>

      {status === "draft" || status === "sent" ? (
        <button
          onClick={handleSend}
          disabled={sending}
          className="text-sm text-[var(--color-accent)] hover:text-[#e5e5e5] font-medium flex items-center gap-1 disabled:opacity-50">
          {sending ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Send className="w-3 h-3" />
          )}
          {sending ? "Enviando..." : "Enviar"}
        </button>
      ) : null}
    </div>
  );
}
