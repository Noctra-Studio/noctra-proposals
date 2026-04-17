import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { ServiceItem, Proposal, Contract, ProposalHistory } from "@/types";
import {
  CheckCircle2,
  Clock,
  FileText,
  History,
  ArrowLeft,
  Send,
  Download,
  PlusCircle,
  ExternalLink,
} from "lucide-react";

async function getProposalData(id: string) {
  const supabase = createAdminClient();

  const { data: proposal, error: proposalError } = await supabase
    .from("proposals")
    .select("*")
    .eq("id", id)
    .single();

  if (proposalError || !proposal) return null;

  const { data: history } = await supabase
    .from("proposal_history" as any)
    .select("*")
    .eq("proposal_id", id)
    .order("created_at", { ascending: false });

  const { data: contract } = await supabase
    .from('contracts')
    .select("*")
    .eq("proposal_id", id)
    .maybeSingle();

  return {
    proposal: proposal as unknown as Proposal,
    history: history as unknown as ProposalHistory[],
    contract: contract ? (contract as unknown as Contract) : null,
  };
}

export default async function ProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getProposalData(id);

  if (!data) notFound();

  const { proposal, history, contract } = data;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "sent":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "accepted":
        return "bg-green-50 text-green-700 border-green-100";
      case "changes_requested":
        return "bg-yellow-50 text-yellow-700 border-yellow-100";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-100";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <Link
          href="/proposals"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver a propuestas
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {proposal.project_name}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(proposal.status)}`}>
              {proposal.status.toUpperCase()}
            </span>
          </div>
          <p className="text-gray-500">
            {proposal.client_name} ·{" "}
            {proposal.client_company || "Persona Física"}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/api/proposals/${proposal.id}/pdf`}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            <Download className="w-4 h-4" />
            Descargar PDF
          </Link>
          <Link
            href={`/p/${proposal.slug}`}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:opacity-90 transition-colors text-sm font-medium shadow-sm">
            <ExternalLink className="w-4 h-4" />
            Vista pública
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Contracts Section */}
          {proposal.status === "accepted" && !contract && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex gap-4">
                <div className="bg-green-100 p-3 rounded-full self-start">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-900 mb-1">
                    ¡Propuesta aceptada por el cliente!
                  </h3>
                  <p className="text-green-700 text-sm">
                    El siguiente paso es formalizar el proyecto mediante un
                    contrato legal.
                  </p>
                </div>
              </div>
              <Link
                href={`/proposals/${proposal.id}/contract`}
                className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all font-bold shadow-lg shadow-green-200 flex items-center gap-2 whitespace-nowrap">
                <PlusCircle className="w-5 h-5" />
                Generar contrato
              </Link>
            </div>
          )}

          {contract && (
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-3 rounded-xl">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Contrato de servicios</h3>
                    <p className="text-sm text-gray-500">#{contract.slug}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    contract.status === "signed"
                      ? "bg-green-50 text-green-700 border-green-100"
                      : "bg-blue-50 text-blue-700 border-blue-100"
                  }`}>
                  {contract.status === "signed"
                    ? "FIRMADO"
                    : contract.status.toUpperCase()}
                </span>
              </div>

              <div className="flex gap-4">
                <Link
                  href={`/c/${contract.slug}`}
                  target="_blank"
                  className="flex-1 text-center py-2 px-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors text-sm font-medium">
                  Ver vista pública
                </Link>
                {contract.status === "signed" ? (
                  <button className="flex-1 bg-black text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium">
                    Descargar PDF
                  </button>
                ) : (
                  <button className="flex-1 bg-black text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity text-sm font-medium flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Enviar para firma
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Proposal Details */}
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                Detalle de la propuesta
              </h3>
              <p className="text-xl font-bold font-serif">
                {formatCurrency(proposal.total)}
              </p>
            </div>
            <div className="p-8 space-y-6">
              {proposal.services.map((service: ServiceItem, idx: number) => (
                <div
                  key={idx}
                  className="flex justify-between items-start gap-4">
                  <div>
                    <p className="font-bold text-sm">{service.name}</p>
                    <p className="text-xs text-gray-500">
                      {service.description}
                    </p>
                  </div>
                  <p className="font-medium text-sm whitespace-nowrap">
                    {formatCurrency(service.total)}
                  </p>
                </div>
              ))}

              <div className="pt-6 border-t border-gray-50 space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatCurrency(proposal.subtotal)}</span>
                </div>
                {proposal.discount_amount !== undefined && proposal.discount_amount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Descuento</span>
                    <span>-{formatCurrency(proposal.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-gray-500">
                  <span>IVA ({proposal.iva_percentage}%)</span>
                  <span>{formatCurrency(proposal.iva_amount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* History */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm overflow-hidden">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <History className="w-4 h-4 text-gray-400" />
              Historial
            </h3>
            <div className="relative space-y-6 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-0 before:w-0.5 before:bg-gray-100">
              {history?.map((item, idx) => (
                <div key={idx} className="relative pl-8">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{item.action}</p>
                    {item.description && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.description}
                      </p>
                    )}
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">
                      {item.created_at
                        ? format(new Date(item.created_at), "dd MMM · HH:mm", {
                            locale: es,
                          })
                        : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-black text-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-white" />
              Resumen de Tiempos
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                  Entrega estimada
                </p>
                <p className="text-2xl font-serif">
                  {proposal.delivery_weeks} semanas
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                  Válida hasta
                </p>
                <p className="text-lg">
                  {proposal.valid_until
                    ? format(new Date(proposal.valid_until), "dd 'de' MMMM", {
                        locale: es,
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
