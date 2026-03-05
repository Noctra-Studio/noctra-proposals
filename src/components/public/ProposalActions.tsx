"use client";

import { useState } from "react";
import { Proposal } from "@/types";
import { Check, Edit3, X, Loader2 } from "lucide-react";

interface ProposalActionsProps {
  proposal: Proposal;
}

export default function ProposalActions({ proposal }: ProposalActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (
    action: "accepted" | "changes_requested" | "rejected",
  ) => {
    // Note: Modal and API logic for Prompt 5 will be implemented here.
    // For Prompt 4, we just show the structure of the CTAs.
    setLoading(action);
    console.log(`Action: ${action} for proposal ${proposal.id}`);

    // Simulate thinking for now to show visual balance
    setTimeout(() => setLoading(null), 1000);
  };

  return (
    <div className="mt-32 pt-20 border-t-2 border-dashed border-gray-200">
      <h2 className="font-serif text-3xl font-medium mb-12 text-center">
        ¿Cómo te gustaría proceder?
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        <button
          onClick={() => handleAction("accepted")}
          disabled={!!loading}
          className="flex flex-col items-center justify-center p-10 bg-[#E8FF47] text-black rounded-3xl group hover:shadow-xl hover:-translate-y-1 transition-all">
          <div className="w-16 h-16 bg-black/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-[#E8FF47] transition-colors">
            {loading === "accepted" ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <Check className="w-8 h-8" />
            )}
          </div>
          <span className="font-bold text-xl">Aceptar propuesta</span>
          <p className="text-sm opacity-60 mt-2 text-center">
            A confirmar para iniciar pronto.
          </p>
        </button>

        <button
          onClick={() => handleAction("changes_requested")}
          disabled={!!loading}
          className="flex flex-col items-center justify-center p-10 border-2 border-gray-200 rounded-3xl hover:border-black transition-all group hover:shadow-xl hover:-translate-y-1">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
            {loading === "changes_requested" ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <Edit3 className="w-8 h-8" />
            )}
          </div>
          <span className="font-bold text-xl">Solicitar cambios</span>
          <p className="text-sm text-gray-400 mt-2 text-center">
            Ajustar alcances o presupuesto.
          </p>
        </button>

        <button
          onClick={() => handleAction("rejected")}
          disabled={!!loading}
          className="flex flex-col items-center justify-center p-10 border-2 border-gray-200 rounded-3xl hover:border-red-500 hover:bg-red-50 transition-all group hover:shadow-xl hover:-translate-y-1">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-red-500 group-hover:text-white transition-colors">
            {loading === "rejected" ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <X className="w-8 h-8" />
            )}
          </div>
          <span className="font-bold text-xl">Rechazar propuesta</span>
          <p className="text-sm text-gray-400 mt-2 text-center">
            No deseo continuar ahora.
          </p>
        </button>
      </div>
    </div>
  );
}
