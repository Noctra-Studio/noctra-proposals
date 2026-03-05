"use client";

import { useState } from "react";
import { Proposal } from "@/types";
import { Check, Edit3, X, Loader2 } from "lucide-react";
import { AcceptModal, FeedbackModal } from "./ResponseModals";
import { useRouter } from "next/navigation";

interface ProposalActionsProps {
  proposal: Proposal;
}

export default function ProposalActions({ proposal }: ProposalActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState<
    "accepted" | "changes_requested" | "rejected" | null
  >(null);
  const [successState, setSuccessState] = useState<string | null>(null);

  const handleRespond = async (data: any) => {
    if (!activeModal) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/proposals/${proposal.id}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          response: activeModal,
          ...data,
        }),
      });

      if (!res.ok) throw new Error("Failed to send response");

      setSuccessState(activeModal);
      setActiveModal(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(
        "Hubo un error al enviar tu respuesta. Por favor intenta de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (successState) {
    const messages = {
      accepted:
        "✅ ¡Propuesta aceptada! En breve recibirás el contrato en tu correo.",
      changes_requested:
        "📝 Hemos recibido tus comentarios. Manu los revisará y te enviará una propuesta actualizada.",
      rejected: "Tu respuesta ha sido enviada. Gracias por tu feedback.",
    };

    return (
      <div className="mt-20 p-10 bg-gray-50 rounded-[2rem] border border-gray-100 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <p className="text-xl font-medium text-gray-800">
          {messages[successState as keyof typeof messages]}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-32 pt-20 border-t-2 border-dashed border-gray-200">
      <h2 className="font-serif text-3xl font-medium mb-12 text-center">
        ¿Cómo te gustaría proceder?
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        <button
          onClick={() => setActiveModal("accepted")}
          className="flex flex-col items-center justify-center p-10 bg-[#E8FF47] text-black rounded-3xl group hover:shadow-xl hover:-translate-y-1 transition-all">
          <div className="w-16 h-16 bg-black/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-[#E8FF47] transition-colors">
            <Check className="w-8 h-8" />
          </div>
          <span className="font-bold text-xl text-center">
            Aceptar propuesta
          </span>
          <p className="text-sm opacity-60 mt-2 text-center">
            A confirmar para iniciar pronto.
          </p>
        </button>

        <button
          onClick={() => setActiveModal("changes_requested")}
          className="flex flex-col items-center justify-center p-10 border-2 border-gray-200 rounded-3xl hover:border-black transition-all group hover:shadow-xl hover:-translate-y-1">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
            <Edit3 className="w-8 h-8" />
          </div>
          <span className="font-bold text-xl text-center">
            Solicitar cambios
          </span>
          <p className="text-sm text-gray-400 mt-2 text-center">
            Ajustar alcances o presupuesto.
          </p>
        </button>

        <button
          onClick={() => setActiveModal("rejected")}
          className="flex flex-col items-center justify-center p-10 border-2 border-gray-200 rounded-3xl hover:border-red-500 hover:bg-red-50 transition-all group hover:shadow-xl hover:-translate-y-1">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-red-500 group-hover:text-white transition-colors">
            <X className="w-8 h-8" />
          </div>
          <span className="font-bold text-xl text-center">
            Rechazar propuesta
          </span>
          <p className="text-sm text-gray-400 mt-2 text-center">
            No deseo continuar ahora.
          </p>
        </button>
      </div>

      {/* Modals */}
      <AcceptModal
        isOpen={activeModal === "accepted"}
        onClose={() => setActiveModal(null)}
        onConfirm={handleRespond}
        loading={loading}
      />

      {(activeModal === "changes_requested" || activeModal === "rejected") && (
        <FeedbackModal
          isOpen={true}
          type={activeModal}
          onClose={() => setActiveModal(null)}
          onConfirm={handleRespond}
          loading={loading}
        />
      )}
    </div>
  );
}
