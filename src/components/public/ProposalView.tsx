"use client";

import { Proposal } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Check, Edit3, X, Download, Loader2 } from "lucide-react";
import { useState } from "react";
import ProposalActions from "@/components/public/ProposalActions";

interface ProposalViewProps {
  proposal: Proposal;
}

export default function ProposalView({ proposal }: ProposalViewProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const isExpired =
    proposal.status === "sent" &&
    proposal.valid_until &&
    new Date(proposal.valid_until) < new Date();

  const isResponded = ["accepted", "changes_requested", "rejected"].includes(
    proposal.status,
  );

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/proposals/${proposal.id}/pdf`);
      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `propuesta-${proposal.slug}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      alert("Error al descargar el PDF. Por favor intenta de nuevo.");
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return format(new Date(dateStr), "dd 'de' MMMM, yyyy", { locale: es });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 relative font-sans">
      {/* Status Banners */}
      {isResponded && (
        <div
          className={`mb-12 p-6 rounded-xl border ${
            proposal.status === "accepted"
              ? "bg-green-50 border-green-200 text-green-800"
              : proposal.status === "changes_requested"
                ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                : "bg-red-50 border-red-200 text-red-800"
          }`}>
          <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
            {proposal.status === "accepted" && <Check className="w-5 h-5" />}
            {proposal.status === "changes_requested" && (
              <Edit3 className="w-5 h-5" />
            )}
            {proposal.status === "rejected" && <X className="w-5 h-5" />}
            Esta propuesta ha sido{" "}
            {proposal.status === "accepted"
              ? "aceptada"
              : proposal.status === "changes_requested"
                ? "observada (se solicitaron cambios)"
                : "rechazada"}
          </h3>
          {proposal.client_comments && (
            <p className="mt-2 text-sm italic opacity-90">
              "{proposal.client_comments}"
            </p>
          )}
        </div>
      )}

      {isExpired && !isResponded && (
        <div className="mb-12 p-6 rounded-xl border bg-orange-50 border-orange-200 text-orange-800">
          <h3 className="font-bold text-lg flex items-center gap-2 text-orange-950">
            Esta propuesta ha vencido
          </h3>
          <p className="text-sm mt-1">
            Por favor, contacta a Noctra Studio para solicitar una actualización
            de las fechas y costos.
          </p>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-20 border-b border-gray-200 pb-12">
        <div>
          <div className="mb-8">
            <svg
              width="140"
              height="40"
              viewBox="0 0 400 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-black">
              <path d="M20 20H50V80H20V20Z" fill="currentColor" />
              <path
                d="M65 20L105 80L145 20H115L105 35L95 20H65Z"
                fill="currentColor"
              />
              <text
                x="160"
                y="70"
                fontFamily="Inter"
                fontWeight="bold"
                fontSize="48"
                fill="currentColor">
                NOCTRA
              </text>
            </svg>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-2">
            Propuesta Comercial
          </h1>
          <p className="text-gray-500 font-medium">
            #{proposal.slug.split("-").pop()?.toUpperCase()}
          </p>
        </div>
        <div className="text-right md:pt-2">
          <div className="mb-4 text-sm font-medium uppercase tracking-widest text-black bg-white border border-gray-200 px-3 py-1 inline-block rounded">
            {proposal.status === "accepted"
              ? "Aceptada"
              : proposal.status === "rejected"
                ? "Rechazada"
                : proposal.status === "changes_requested"
                  ? "En revisión"
                  : "Enviada"}
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            <p>Creada: {formatDate(proposal.created_at)}</p>
            <p className="font-semibold text-black">
              Válida hasta: {formatDate(proposal.valid_until)}
            </p>
          </div>
        </div>
      </header>

      {/* Client Info */}
      <section className="mb-20 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-4">
            Preparada para:
          </h2>
          <div className="font-serif text-2xl">
            <p className="font-medium">{proposal.client_name}</p>
            {proposal.client_company && (
              <p className="text-gray-500 text-lg mt-1">
                {proposal.client_company}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Project Description */}
      <section className="mb-24">
        <h2 className="font-serif text-4xl md:text-6xl font-medium mb-8 leading-tight">
          {proposal.project_name}
        </h2>
        {proposal.project_description && (
          <div className="prose prose-lg text-gray-700 max-w-none leading-relaxed">
            {proposal.project_description.split("\n").map((para, i) => (
              <p key={i} className="mb-4">
                {para}
              </p>
            ))}
          </div>
        )}
      </section>

      {/* Services */}
      <section className="mb-24">
        <h2 className="font-serif text-3xl font-medium mb-10 pb-4 border-b border-gray-100">
          Servicios Incluidos
        </h2>
        <div className="space-y-8">
          {proposal.services.map((service, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <h3 className="text-xl font-bold tracking-tight">
                  {service.name}
                </h3>
                <p className="font-serif text-xl font-medium text-black">
                  {formatCurrency(service.total)}
                </p>
              </div>
              {service.description && (
                <div className="text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                  {service.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Financials */}
      <section className="mb-24 bg-black text-white p-10 md:p-16 rounded-[2rem]">
        <h2 className="font-serif text-3xl font-medium mb-12">
          Resumen Financiero
        </h2>
        <div className="space-y-6 max-w-md ml-auto">
          <div className="flex justify-between text-gray-400">
            <span>Subtotal</span>
            <span>{formatCurrency(proposal.subtotal)}</span>
          </div>

          {proposal.discount_amount && proposal.discount_amount > 0 && (
            <>
              <div className="flex justify-between text-white">
                <span>
                  Descuento (
                  {proposal.discount_type === "percentage"
                    ? `${proposal.discount_value}%`
                    : "Monto fijo"}
                  )
                </span>
                <span>-{formatCurrency(proposal.discount_amount)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Subtotal con desc.</span>
                <span>{formatCurrency(proposal.subtotal_after_discount)}</span>
              </div>
            </>
          )}

          {proposal.iva_amount > 0 && (
            <div className="flex justify-between text-gray-400 border-b border-white/10 pb-6">
              <span>IVA ({proposal.iva_percentage}%)</span>
              <span>+{formatCurrency(proposal.iva_amount)}</span>
            </div>
          )}

          <div className="flex justify-between items-baseline pt-6">
            <span className="text-xl font-medium">TOTAL</span>
            <span className="text-4xl md:text-5xl font-serif font-bold text-white">
              {formatCurrency(proposal.total)}
            </span>
          </div>
        </div>
      </section>

      {/* Conditions */}
      <section className="mb-24 grid md:grid-cols-2 gap-16 border-t border-gray-100 pt-16">
        <div>
          <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-6">
            Condiciones de Pago
          </h3>
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {proposal.payment_terms || "No especificadas."}
          </div>
        </div>
        <div className="space-y-8">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-4">
              Tiempo de Entrega
            </h3>
            <p className="text-2xl font-serif">
              {proposal.delivery_weeks} semanas estimadas
            </p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-4">
              Validez de la Propuesta
            </h3>
            <p className="text-xl font-serif">
              {formatDate(proposal.valid_until)}
            </p>
          </div>
        </div>
      </section>

      {/* Additional Notes */}
      {proposal.notes && (
        <section className="mb-24 bg-gray-50 p-10 rounded-2xl border border-gray-200">
          <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-6">
            Notas Adicionales
          </h3>
          <p className="text-gray-700 leading-relaxed">{proposal.notes}</p>
        </section>
      )}

      {/* CTAs */}
      {!isResponded && <ProposalActions proposal={proposal} />}

      {/* Floating Button */}
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="fixed bottom-8 right-8 bg-black text-white flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all z-40 font-medium disabled:opacity-50">
        {isDownloading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Download className="w-5 h-5" />
        )}
        {isDownloading ? "Generando..." : "Descargar PDF"}
      </button>
    </div>
  );
}
