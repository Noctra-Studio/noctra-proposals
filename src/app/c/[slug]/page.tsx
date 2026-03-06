import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  CheckCircle2,
  FileText,
  Download,
  ShieldCheck,
  Clock,
  Building2,
} from "lucide-react";
import ContractActions from "@/components/public/ContractActions";

async function getContractBySlug(slug: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("contracts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;
  return data;
}

export default async function PublicContractPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const contract = await getContractBySlug(slug);

  if (!contract) notFound();

  const isSigned = contract.status === "signed";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] selection:bg-[#E8FF47] selection:text-black">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-24">
        {/* Success Banner */}
        {isSigned && (
          <div className="mb-12 p-8 rounded-2xl bg-green-50 border border-green-100 flex gap-4 items-center shadow-sm">
            <div className="bg-green-500 p-2 rounded-full">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-green-900">
                Contrato Firmado Correctamente
              </h3>
              <p className="text-green-700 text-sm">
                Firmado por {contract.client_signed_name} el{" "}
                {format(
                  new Date(contract.signed_at),
                  "dd 'de' MMMM, yyyy 'a las' HH:mm",
                  { locale: es },
                )}
                .
              </p>
            </div>
          </div>
        )}

        <article className="bg-white border border-gray-100 rounded-[3rem] p-10 md:p-20 shadow-2xl shadow-gray-200/50">
          <header className="mb-20 pb-16 border-b border-gray-100 relative">
            <div className="flex justify-between items-start mb-12">
              <div className="bg-black text-[#E8FF47] px-4 py-1 rounded-lg text-xs font-bold tracking-widest uppercase">
                {isSigned ? "Documento Firmado" : "Borrador de Contrato"}
              </div>
              <div className="text-right text-xs text-gray-400 font-bold uppercase tracking-widest">
                Contrato #{contract.slug.split("-").pop()?.toUpperCase()}
              </div>
            </div>

            <h1 className="font-serif text-4xl md:text-6xl font-medium leading-[1.1] text-gray-900 mb-8">
              Contrato de Prestación de Servicios Profesionales
            </h1>

            <div className="grid md:grid-cols-2 gap-12 text-sm">
              <div>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-3">
                  Prestador
                </p>
                <div className="space-y-1">
                  <p className="font-bold text-lg">Noctra Studio</p>
                  <p className="text-gray-500">hello@noctra.studio</p>
                  <p className="text-gray-500">México</p>
                </div>
              </div>
              <div className="md:text-right">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-3">
                  Cliente
                </p>
                <div className="space-y-1">
                  <p className="font-bold text-lg">
                    {contract.client_company || contract.client_name}
                  </p>
                  {contract.client_rfc && (
                    <p className="text-gray-500">RFC: {contract.client_rfc}</p>
                  )}
                  <p className="text-gray-500">
                    {contract.client_address || "Dirección no especificada"}
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className="prose prose-lg prose-gray max-w-none text-gray-700 leading-relaxed font-sans space-y-12">
            <section>
              <h2 className="text-black font-serif text-2xl mb-6">
                1. El Proyecto
              </h2>
              <p>
                Este contrato vincula a las partes para la ejecución del
                proyecto: <strong>{contract.project_name}</strong>. Los
                servicios descritos a continuación serán realizados bajo los
                estándares de calidad de Noctra Studio:
              </p>
              <div className="bg-gray-50 rounded-2xl p-8 space-y-6 not-prose mt-8">
                {contract.services.map((service: any, i: number) => (
                  <div
                    key={i}
                    className="flex justify-between gap-4 border-b border-gray-200/50 pb-4 last:border-0 last:pb-0">
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {service.name}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {service.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-black font-serif text-2xl mb-6">
                2. Términos Económicos
              </h2>
              <p>
                La inversión total estipulada para este proyecto es de{" "}
                <strong>{formatCurrency(contract.total)}</strong>. El Cliente se
                compromete a realizar los pagos según el siguiente calendario:
              </p>
              <div className="mt-8 space-y-3 not-prose">
                {contract.payment_schedule.map((p: any, i: number) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-4 rounded-xl border border-gray-100 bg-white">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <Clock className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="font-medium">{p.description}</span>
                    </div>
                    <span className="font-bold text-black">
                      {formatCurrency(p.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-black font-serif text-2xl mb-6">
                3. Tiempos y Calendario
              </h2>
              <p>
                El proyecto tiene una duración estimada de{" "}
                <strong>{contract.total_weeks} semanas</strong>. Se ha incluido
                un periodo de 1 semana de buffer para garantizar la calidad
                final de los entregables.
              </p>
              <div className="grid md:grid-cols-2 gap-4 not-prose mt-8">
                <div className="p-6 bg-black text-white rounded-2xl">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">
                    Fecha de Inicio
                  </p>
                  <p className="text-2xl font-serif text-[#E8FF47]">
                    {format(
                      new Date(contract.start_date),
                      "dd 'de' MMMM, yyyy",
                      { locale: es },
                    )}
                  </p>
                </div>
                <div className="p-6 bg-gray-100 rounded-2xl border border-gray-200">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">
                    Entrega Estimada
                  </p>
                  <p className="text-2xl font-serif text-black">
                    {format(
                      new Date(contract.estimated_end_date),
                      "dd 'de' MMMM, yyyy",
                      { locale: es },
                    )}
                  </p>
                </div>
              </div>
            </section>

            <section className="text-sm text-gray-500 border-t border-gray-100 pt-12 space-y-4">
              <p>
                <strong>Confidencialidad:</strong> Ambas partes se comprometen a
                tratar como confidencial toda la información compartida durante
                el proyecto.
              </p>
              <p>
                <strong>Propiedad Intelectual:</strong> Al recibir el pago
                total, la propiedad intelectual de los entregables pasará a ser
                del Cliente.
              </p>
            </section>

            {isSigned && (
              <div className="p-12 border-2 border-black rounded-3xl mt-20 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#E8FF47]" />
                <h3 className="font-serif text-2xl mb-2 italic">
                  Documento Firmado Digitalmente
                </h3>
                <p
                  className="font-bold text-4xl mt-4 opacity-80"
                  style={{ fontFamily: "Dancing Script, cursive" }}>
                  {contract.client_signed_name}
                </p>
                <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-400">
                  <div className="flex items-center gap-2 justify-center">
                    <ShieldCheck className="w-4 h-4 text-green-500" /> Identidad
                    Verificada
                  </div>
                  <div>IP: [Registro en DB]</div>
                  <div>Huella Digital: {contract.id.substring(0, 8)}</div>
                </div>
              </div>
            )}
          </div>
        </article>

        {!isSigned && <ContractActions contract={contract} />}

        {/* Floating Download Button (if signed) */}
        {isSigned && (
          <button className="fixed bottom-8 right-8 bg-black text-white flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all z-40 font-medium">
            <Download className="w-5 h-5" />
            Descargar Copia PDF
          </button>
        )}
      </div>
    </div>
  );
}
