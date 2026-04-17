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
import { legalTexts } from "@/lib/legal-texts";

async function getContractBySlug(slug: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('contracts')
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
  const lang = contract.language || "es";
  const t = legalTexts[lang as "es" | "en"].contract;
  const dateLocale = lang === "en" ? require("date-fns/locale").enUS : es;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] selection:bg-black selection:text-white">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-24">
        {/* Success Banner */}
        {isSigned && (
          <div className="mb-12 p-8 rounded-2xl bg-green-50 border border-green-100 flex gap-4 items-center shadow-sm">
            <div className="bg-green-500 p-2 rounded-full">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-green-900">{t.signed_success}</h3>
              <p className="text-green-700 text-sm">
                {t.signed_by_info
                  .replace("{name}", contract.client_signed_name ?? "")
                  .replace(
                    "{date}",
                    format(
                      new Date(contract.signed_at!),
                      "dd 'de' MMMM, yyyy 'a las' HH:mm",
                      { locale: dateLocale },
                    ),
                  )}
              </p>
            </div>
          </div>
        )}

        <article className="bg-white border border-gray-100 rounded-[3rem] p-10 md:p-20 shadow-2xl shadow-gray-200/50">
          <header className="mb-20 pb-16 border-b border-gray-100 relative">
            <div className="flex justify-between items-start mb-12">
              <div className="bg-black text-white px-4 py-1 rounded-lg text-xs font-bold tracking-widest uppercase">
                {isSigned ? t.signed_badge : t.draft_badge}
              </div>
              <div className="text-right text-xs text-gray-400 font-bold uppercase tracking-widest">
                {t.contract_number.replace(
                  "{slug}",
                  (contract.slug ?? "").split("-").pop()?.toUpperCase() || "",
                )}
              </div>
            </div>

            <h1 className="font-serif text-4xl md:text-6xl font-medium leading-[1.1] text-gray-900 mb-8 uppercase">
              {t.type_label}
            </h1>

            <div className="grid md:grid-cols-2 gap-12 text-sm">
              <div>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-3">
                  {t.provider}
                </p>
                <div className="space-y-1">
                  <p className="font-bold text-lg">Noctra Studio</p>
                  <p className="text-gray-500">hello@noctra.studio</p>
                  <p className="text-gray-500">México</p>
                </div>
              </div>
              <div className="md:text-right">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-3">
                  {t.client}
                </p>
                <div className="space-y-1">
                  <p className="font-bold text-lg">
                    {contract.client_company || contract.client_name}
                  </p>
                  {contract.client_rfc && (
                    <p className="text-gray-500">
                      {t.tax_id}: {contract.client_rfc}
                    </p>
                  )}
                  <p className="text-gray-500">
                    {contract.client_address || t.not_specified}
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className="prose prose-lg prose-gray max-w-none text-gray-700 leading-relaxed font-sans space-y-12">
            <section>
              <h2 className="text-black font-serif text-2xl mb-6">
                {t.sections.project.title}
              </h2>
              <p>
                {t.sections.project.content.replace(
                  "{project_name}",
                  contract.project_name ?? "",
                )}
              </p>
              <div className="bg-gray-50 rounded-2xl p-8 space-y-6 not-prose mt-8">
                {(contract.services as any[])?.map((service: any, i: number) => (
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
                {t.sections.financial.title}
              </h2>
              <p>
                {t.sections.financial.content.replace(
                  "{total}",
                  formatCurrency(contract.total ?? 0),
                )}
              </p>
              <div className="mt-8 space-y-3 not-prose">
                {(contract.payment_schedule as any[])?.map((p: any, i: number) => (
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
                {t.sections.timeline.title}
              </h2>
              <p>
                {t.sections.timeline.content.replace(
                  "{total_weeks}",
                  (contract.total_weeks ?? 0).toString(),
                )}
              </p>
              <div className="grid md:grid-cols-2 gap-4 not-prose mt-8">
                <div className="p-6 bg-black text-white rounded-2xl">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">
                    {t.sections.timeline.start_date}
                  </p>
                  <p className="text-2xl font-serif text-white">
                    {format(
                      new Date(contract.start_date!),
                      "dd 'de' MMMM, yyyy",
                      { locale: dateLocale },
                    )}
                  </p>
                </div>
                <div className="p-6 bg-gray-100 rounded-2xl border border-gray-200">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">
                    {t.sections.timeline.end_date}
                  </p>
                  <p className="text-2xl font-serif text-black">
                    {format(
                      new Date(contract.estimated_end_date!),
                      "dd 'de' MMMM, yyyy",
                      { locale: dateLocale },
                    )}
                  </p>
                </div>
              </div>
            </section>

            <section className="text-sm border-t border-gray-100 pt-12 space-y-6">
              <h2 className="text-black font-serif text-2xl mb-6">
                {t.sections.legal_terms.title}
              </h2>
              <p>
                <strong>{t.sections.legal_terms.confidentiality}:</strong>{" "}
                {t.sections.legal_terms.confidentiality_text}
              </p>
              <p>
                <strong>{t.sections.legal_terms.intellectual_property}:</strong>{" "}
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

            {isSigned && (
              <div className="p-12 border-2 border-black rounded-3xl mt-20 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-white" />
                <h3 className="font-serif text-2xl mb-2 italic">
                  {t.signature.digitally_signed}
                </h3>
                <p
                  className="font-bold text-4xl mt-4 opacity-80"
                  style={{ fontFamily: "Dancing Script, cursive" }}>
                  {contract.client_signed_name}
                </p>
                <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-center gap-8 text-xs font-bold uppercase tracking-widest text-gray-400">
                  <div className="flex items-center gap-2 justify-center">
                    <ShieldCheck className="w-4 h-4 text-green-500" />{" "}
                    {t.signature.identity_verified}
                  </div>
                  <div>IP: [Registro en DB]</div>
                  <div>
                    {t.signature.fingerprint}: {contract.id.substring(0, 8)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </article>

        {!isSigned && <ContractActions contract={contract} lang={lang} />}

        {/* Floating Download Button (if signed) */}
        {isSigned && (
          <button className="fixed bottom-8 right-8 bg-black text-white flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all z-40 font-medium">
            <Download className="w-5 h-5" />
            {t.actions.download_btn}
          </button>
        )}
      </div>
    </div>
  );
}
