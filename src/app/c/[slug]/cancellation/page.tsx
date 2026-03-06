import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  CheckCircle2,
  ShieldCheck,
  Download,
  AlertTriangle,
} from "lucide-react";
import CancellationActions from "@/components/public/CancellationActions";
import { legalTexts } from "@/lib/legal-texts";

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

export default async function PublicCancellationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const contract = await getContractBySlug(slug);

  if (!contract || contract.status !== "cancelled") notFound();

  const isSigned = !!contract.cancellation_signed_at;
  const lang = contract.language || "es";
  const t = legalTexts[lang as "es" | "en"].cancellation;
  const tContract = legalTexts[lang as "es" | "en"].contract;
  const dateLocale = lang === "en" ? require("date-fns/locale").enUS : es;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] selection:bg-red-500 selection:text-white pb-20">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-24">
        {/* Success Banner */}
        {isSigned && (
          <div className="mb-12 p-8 rounded-2xl bg-green-50 border border-green-100 flex gap-4 items-center shadow-sm animate-in fade-in slide-in-from-top-4">
            <div className="bg-green-500 p-2 rounded-full">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-green-900">{t.signed_success}</h3>
              <p className="text-green-700 text-sm">
                {tContract.signed_by_info
                  .replace("{name}", contract.cancellation_client_name || "")
                  .replace(
                    "{date}",
                    format(
                      new Date(contract.cancellation_signed_at!),
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
              <div className="bg-red-50 text-red-600 px-4 py-1 rounded-lg text-xs font-bold tracking-widest uppercase flex items-center gap-2 border border-red-100">
                <AlertTriangle className="w-3 h-3" />
                {isSigned ? t.signed_badge : t.badge}
              </div>
              <div className="text-right text-xs text-gray-400 font-bold uppercase tracking-widest">
                {tContract.contract_number.replace(
                  "{slug}",
                  contract.slug.split("-").pop()?.toUpperCase() || "",
                )}
              </div>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl font-medium leading-[1.1] text-gray-900 mb-8 uppercase">
              {t.type_label}
            </h1>

            <div className="grid md:grid-cols-2 gap-12 text-sm">
              <div>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-3">
                  {tContract.provider}
                </p>
                <div className="space-y-1">
                  <p className="font-bold text-lg">Noctra Studio</p>
                  <p className="text-gray-500">hello@noctra.studio</p>
                </div>
              </div>
              <div className="md:text-right">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-3">
                  {tContract.client}
                </p>
                <div className="space-y-1">
                  <p className="font-bold text-lg">
                    {contract.client_company || contract.client_name}
                  </p>
                  {contract.client_rfc && (
                    <p className="text-gray-500">
                      {tContract.tax_id}: {contract.client_rfc}
                    </p>
                  )}
                  <p className="text-gray-500">
                    {contract.client_address || tContract.not_specified}
                  </p>
                </div>
              </div>
            </div>
          </header>

          <div className="prose prose-lg prose-gray max-w-none text-gray-700 leading-relaxed font-sans space-y-12">
            <section>
              <h2 className="text-black font-serif text-2xl mb-6">
                {t.sections.agreement.title}
              </h2>
              <p>
                {t.sections.agreement.content
                  .replace("{project_name}", contract.project_name)
                  .replace(
                    "{slug}",
                    contract.slug.split("-").pop()?.toUpperCase() || "",
                  )}
              </p>
            </section>

            <section>
              <h2 className="text-black font-serif text-2xl mb-6">
                {t.sections.financial.title}
              </h2>
              <p>{t.sections.financial.content}</p>
              <div className="bg-red-50 rounded-2xl p-8 space-y-6 not-prose mt-8 border border-red-100">
                <div className="flex justify-between gap-4 items-center">
                  <div>
                    <h4 className="font-bold text-red-900">
                      {t.sections.financial.fee_amount}
                    </h4>
                    <p className="text-sm text-red-700 mt-1">
                      {t.sections.financial.fee_terms.replace(
                        "{terms}",
                        contract.cancellation_terms || "",
                      )}
                    </p>
                  </div>
                  <div>
                    <span className="text-2xl font-bold font-serif text-red-600">
                      {formatCurrency(contract.cancellation_fee || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="text-sm border-t border-gray-100 pt-12 space-y-6">
              <h2 className="text-black font-serif text-2xl mb-6">
                {t.sections.financial.mutual_release}
              </h2>
              <p>{t.sections.financial.mutual_release_text}</p>
            </section>

            {isSigned && (
              <div className="p-12 border-2 border-red-500 rounded-3xl mt-20 text-center relative overflow-hidden bg-red-50/30">
                <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
                <h3 className="font-serif text-2xl mb-2 italic">
                  {tContract.signature.digitally_signed}
                </h3>
                <p
                  className="font-bold text-4xl mt-4 opacity-80"
                  style={{ fontFamily: "Dancing Script, cursive" }}>
                  {contract.cancellation_client_name}
                </p>
                <div className="mt-8 pt-8 border-t border-red-100 flex flex-col md:flex-row justify-center gap-8 text-xs font-bold uppercase tracking-widest text-red-400">
                  <div className="flex items-center gap-2 justify-center">
                    <ShieldCheck className="w-4 h-4 text-red-500" />{" "}
                    {tContract.signature.identity_verified}
                  </div>
                  <div>IP: [Registro en DB]</div>
                  <div>
                    {tContract.signature.fingerprint}:{" "}
                    {contract.id.substring(0, 8)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </article>

        {!isSigned && <CancellationActions contract={contract} lang={lang} />}

        {isSigned && (
          <button className="fixed bottom-8 right-8 bg-black text-white flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all z-40 font-medium">
            <Download className="w-5 h-5" />
            {tContract.actions.download_btn}
          </button>
        )}
      </div>
    </div>
  );
}
