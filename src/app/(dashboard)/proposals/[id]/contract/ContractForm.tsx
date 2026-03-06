"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Proposal, ServiceItem, PaymentScheduleItem } from "@/types";
import {
  Save,
  Send,
  Plus,
  Trash2,
  Calendar,
  Clock,
  ShieldCheck,
  Building2,
  User,
  Hash,
  MapPin,
  Briefcase,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { format, addWeeks } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";
import { legalTexts } from "@/lib/legal-texts";

interface ContractFormProps {
  proposal: Proposal;
}

export default function ContractForm({ proposal }: ContractFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const lang = proposal.language || "es";
  const t = legalTexts[lang].contract;
  const tGeneral = legalTexts[lang];
  const dateLocale = lang === "en" ? enUS : es;

  // Section 1: Parties
  const [clientInfo, setClientInfo] = useState({
    name: proposal.client_name,
    company: proposal.client_company || "",
    rfc: "",
    address: "",
    email: proposal.client_email,
  });

  // Section 2: Project
  const [services, setServices] = useState<ServiceItem[]>(proposal.services);
  const [total, setTotal] = useState(proposal.total);

  // Section 3: Payment Schedule
  const [payments, setPayments] = useState<PaymentScheduleItem[]>([
    {
      description: "Anticipo — 50% al firmar el contrato",
      percentage: 50,
      amount: proposal.total * 0.5,
      trigger: "Al firmar",
    } as any,
    {
      description: "Pago final — 50% al entregar el proyecto",
      percentage: 50,
      amount: proposal.total * 0.5,
      trigger: "A la entrega",
    } as any,
  ]);

  // Section 4: Timeline
  const [estimatedWeeks, setEstimatedWeeks] = useState(
    proposal.delivery_weeks || 4,
  );
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const bufferWeeks = 1;
  const totalWeeks = estimatedWeeks + bufferWeeks;
  const endDate = format(
    addWeeks(new Date(startDate), totalWeeks),
    "yyyy-MM-dd",
  );

  // Recalculate total when services change
  const calculateTotal = (items: ServiceItem[]) => {
    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    // Applying same tax logic from proposal for consistency
    const iva = subtotal * (proposal.iva_percentage / 100);
    return subtotal + iva;
  };

  const handleAddPayment = () => {
    setPayments([
      ...payments,
      {
        description: "",
        percentage: 0,
        amount: 0,
        trigger: "Fecha específica",
      } as any,
    ]);
  };

  const handleRemovePayment = (index: number) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (shouldSend: boolean = false) => {
    setLoading(true);
    try {
      const contractPayload = {
        proposal_id: proposal.id,
        language: proposal.language || "es",
        client_name: clientInfo.name,
        client_company: clientInfo.company,
        client_rfc: clientInfo.rfc,
        client_address: clientInfo.address,
        client_email: clientInfo.email,
        project_name: proposal.project_name,
        services,
        total,
        payment_schedule: payments,
        estimated_weeks: estimatedWeeks,
        buffer_weeks: bufferWeeks,
        total_weeks: totalWeeks,
        start_date: startDate,
        estimated_end_date: endDate,
        status: shouldSend ? "sent" : "draft",
      };

      const res = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contractPayload),
      });

      if (!res.ok) throw new Error("Error saving contract");

      const contract = await res.json();

      if (shouldSend) {
        await fetch(`/api/contracts/${contract.id}/send`, { method: "POST" });
      }

      router.push(`/proposals/${proposal.id}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error al procesar el contrato.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      <div className="space-y-8 pb-20">
        {/* Section 1: Parties */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-gray-900">
            <User className="w-5 h-5 text-gray-400" />
            Partes del Contrato
          </h2>
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Nombre del cliente
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-300" />
                  <input
                    type="text"
                    value={clientInfo.name}
                    onChange={(e) =>
                      setClientInfo({ ...clientInfo, name: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Empresa (Opcional)
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 w-4 h-4 text-gray-300" />
                  <input
                    type="text"
                    value={clientInfo.company}
                    onChange={(e) =>
                      setClientInfo({ ...clientInfo, company: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  RFC (Opcional)
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 w-4 h-4 text-gray-300" />
                  <input
                    type="text"
                    value={clientInfo.rfc}
                    onChange={(e) =>
                      setClientInfo({ ...clientInfo, rfc: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    placeholder="XAXX010101000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Dirección Fiscal / Domicilio
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-300" />
                  <input
                    type="text"
                    value={clientInfo.address}
                    onChange={(e) =>
                      setClientInfo({ ...clientInfo, address: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                    placeholder="Ciudad, Estado, C.P."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Project */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-gray-900">
            <Briefcase className="w-5 h-5 text-gray-400" />
            Proyecto y Servicios
          </h2>
          <div className="space-y-4">
            {services.map((service: ServiceItem, idx: number) => (
              <div
                key={idx}
                className="p-4 bg-gray-50 rounded-xl flex justify-between items-center group">
                <div>
                  <p className="font-bold text-sm">{service.name}</p>
                  <p className="text-xs text-gray-500">
                    Total: {formatCurrency(service.total)}
                  </p>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-400 uppercase">
                Inversión Final (con IVA)
              </span>
              <span className="text-2xl font-serif font-bold">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Payment Schedule */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
              <Calendar className="w-5 h-5 text-gray-400" />
              Calendario de Pagos
            </h2>
            <button
              type="button"
              onClick={handleAddPayment}
              className="text-black hover:bg-gray-100 p-2 rounded-lg transition-colors"
              title="Agregar pago">
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {payments.map((payment, idx) => (
              <div
                key={idx}
                className="p-4 border border-gray-100 rounded-xl space-y-3 relative group">
                <button
                  onClick={() => handleRemovePayment(idx)}
                  className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={payment.description}
                    onChange={(e) => {
                      const newPayments = [...payments];
                      newPayments[idx].description = e.target.value;
                      setPayments(newPayments);
                    }}
                    className="text-sm font-medium border-b border-transparent focus:border-black outline-none bg-transparent"
                    placeholder="Concepto del pago"
                  />
                  <div className="flex items-center gap-2 justify-end">
                    <input
                      type="number"
                      value={payment.amount}
                      onChange={(e) => {
                        const newPayments = [...payments];
                        newPayments[idx].amount = Number(e.target.value);
                        setPayments(newPayments);
                      }}
                      className="text-sm font-bold text-right outline-none bg-transparent w-24"
                    />
                    <span className="text-xs text-gray-400 font-bold uppercase">
                      MXN
                    </span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <select
                    value={(payment as any).trigger}
                    onChange={(e) => {
                      const newPayments = [...payments];
                      (newPayments[idx] as any).trigger = e.target.value;
                      setPayments(newPayments);
                    }}
                    className="text-xs bg-gray-50 px-2 py-1 rounded border-none focus:ring-0 cursor-pointer">
                    <option>Al firmar</option>
                    <option>A la entrega</option>
                    <option>Fecha específica</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Timeline */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-gray-900">
            <Clock className="w-5 h-5 text-gray-400" />
            Tiempos y Entregas
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Semanas de ejecución
                </label>
                <input
                  type="number"
                  value={estimatedWeeks}
                  onChange={(e) => setEstimatedWeeks(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black outline-none"
                />
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-800 text-sm">
                <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0" />
                <p>
                  Se agrega <strong>1 semana adicional</strong> para garantizar
                  la calidad de entrega.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">
                  Fecha de inicio
                </p>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-xl font-serif font-bold outline-none border-b-2 border-transparent focus:border-black py-1"
                />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">
                  Entrega estimada
                </p>
                <p className="text-xl font-serif font-bold text-gray-900">
                  {format(new Date(endDate), "dd 'de' MMMM, yyyy")}
                </p>
                <p className="text-xs text-gray-500 italic mt-1">
                  {totalWeeks} semanas totales
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-10">
          <button
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-8 py-4 border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all font-bold disabled:opacity-50">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Guardar Borrador
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-black text-white rounded-2xl hover:opacity-90 transition-all font-bold shadow-xl shadow-gray-200 disabled:opacity-50">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            Guardar y Enviar para Firma
          </button>
        </div>
      </div>

      {/* Real-time Preview */}
      <div className="sticky top-10 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 px-4">
          Vista previa en tiempo real
        </h3>
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 md:p-14 shadow-2xl min-h-[800px] overflow-y-auto">
          <div className="max-w-prose mx-auto">
            <header className="mb-14 pb-14 border-b border-gray-100">
              <p className="text-xs font-bold uppercase tracking-widest text-white bg-black px-3 py-1 inline-block rounded mb-8">
                {t.type_label}
              </p>
              <h1 className="text-4xl font-serif font-medium leading-tight mb-4 uppercase">
                {t.type_label}
              </h1>
              <p className="text-gray-400 text-sm">
                #{proposal.slug.split("-").pop()?.toUpperCase()}
              </p>
            </header>

            <div className="prose prose-sm prose-gray space-y-10 leading-relaxed text-gray-700">
              <section>
                <p>
                  {lang === "en" ? "This " : "Este "}{" "}
                  <strong>{t.type_label}</strong>{" "}
                  {lang === "en" ? "is celebrated between" : "se celebra entre"}{" "}
                  <strong>Noctra Studio</strong> ({t.provider})
                  {lang === "en" ? " and " : " y "}
                  {clientInfo.company ? (
                    <strong>{clientInfo.company}</strong>
                  ) : (
                    <strong>{clientInfo.name}</strong>
                  )}{" "}
                  ({t.client}).
                </p>
              </section>

              <section>
                <h4 className="font-bold text-black uppercase tracking-wider text-xs border-b border-gray-50 pb-2 mb-4">
                  {t.sections.project.title.toUpperCase()}
                </h4>
                <p>
                  {t.sections.project.content.replace(
                    "{project_name}",
                    proposal.project_name,
                  )}
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {services.map((s: ServiceItem, i: number) => (
                    <li key={i}>
                      <strong>{s.name}:</strong> {s.description}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h4 className="font-bold text-black uppercase tracking-wider text-xs border-b border-gray-50 pb-2 mb-4">
                  {t.sections.financial.title.toUpperCase()}
                </h4>
                <p>
                  {t.sections.financial.content.replace(
                    "{total}",
                    formatCurrency(total),
                  )}
                </p>
                <div className="space-y-2 mt-4">
                  {payments.map((p: PaymentScheduleItem, i: number) => (
                    <div
                      key={i}
                      className="flex justify-between border-b border-gray-50 pb-1 italic">
                      <span>{p.description}</span>
                      <strong>{formatCurrency(p.amount)}</strong>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="font-bold text-black uppercase tracking-wider text-xs border-b border-gray-50 pb-2 mb-4">
                  {t.sections.timeline.title.toUpperCase()}
                </h4>
                <p>
                  {t.sections.timeline.content.replace(
                    "{total_weeks}",
                    totalWeeks.toString(),
                  )}
                </p>
                <p className="mt-2">
                  <strong>{t.sections.timeline.start_date}:</strong>{" "}
                  {format(new Date(startDate), "dd 'de' MMMM, yyyy", {
                    locale: dateLocale,
                  })}
                  <br />
                  <strong>{t.sections.timeline.end_date}:</strong>{" "}
                  {format(new Date(endDate), "dd 'de' MMMM, yyyy", {
                    locale: dateLocale,
                  })}
                </p>
              </section>

              <section className="text-sm border-t border-gray-100 pt-10 space-y-6">
                <h4 className="font-bold text-black uppercase tracking-wider text-xs border-b border-gray-50 pb-2 mb-4">
                  {t.sections.legal_terms.title.toUpperCase()}
                </h4>
                <p>
                  <strong>{t.sections.legal_terms.confidentiality}:</strong>{" "}
                  {t.sections.legal_terms.confidentiality_text}
                </p>
                <p>
                  <strong>
                    {t.sections.legal_terms.intellectual_property}:
                  </strong>{" "}
                  {t.sections.legal_terms.intellectual_property_text}
                </p>
                <p>
                  <strong>{t.sections.legal_terms.late_payments}:</strong>{" "}
                  {t.sections.legal_terms.late_payments_text}
                </p>
                <p>
                  <strong>{t.sections.legal_terms.scope_changes}:</strong>{" "}
                  {t.sections.legal_terms.scope_changes_text}
                </p>
                <p>
                  <strong>{t.sections.legal_terms.liability}:</strong>{" "}
                  {t.sections.legal_terms.liability_text}
                </p>
              </section>

              <section className="text-[10px] text-gray-400 pt-10 border-t border-gray-50 italic">
                * Este es un preview interactivo. Al enviar al cliente, se
                generará el documento oficial para firma digital.
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
