"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PenTool, ShieldCheck, X, Loader2 } from "lucide-react";
import { legalTexts } from "@/lib/legal-texts";

interface CancellationActionsProps {
  contract: any;
  lang?: string;
}

export default function CancellationActions({
  contract,
  lang = "es",
}: CancellationActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || name.trim().length < 5) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/contracts/${contract.id}/cancel/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_signed_name: name }),
      });

      if (!res.ok) throw new Error("Error signing cancellation");

      setIsModalOpen(false);
      router.refresh();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      alert("Error al firmar. Por favor intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const tContract =
    legalTexts[lang as "en" | "es"]?.contract?.actions ||
    legalTexts["es"].contract.actions;
  const tCancel =
    legalTexts[lang as "en" | "es"]?.cancellation?.actions ||
    legalTexts["es"].cancellation.actions;

  return (
    <div className="mt-12">
      <div className="bg-black text-white p-12 rounded-[3rem] text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 rounded-full blur-[120px] opacity-10 -mr-32 -mt-32" />
        <h3 className="text-2xl font-serif mb-4 font-medium">
          {tCancel.ready}
        </h3>
        <p className="text-gray-400 mb-10 max-w-md mx-auto">
          {tCancel.ready_desc}
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-red-500 text-white px-10 py-5 rounded-2xl font-bold hover:bg-red-600 active:scale-95 transition-all shadow-xl shadow-red-500/20 flex items-center gap-3 mx-auto">
          <PenTool className="w-5 h-5" />
          {tCancel.sign_btn}
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 text-gray-400 hover:text-black transition-colors">
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-10">
              <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">
                {tContract.modal_title}
              </h2>
              <p className="text-gray-500 text-sm">{tContract.modal_desc}</p>
            </div>

            <form onSubmit={handleSign} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                  Tu nombre completo
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={tContract.name_placeholder}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-black outline-none font-medium transition-all"
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-xl flex gap-3 text-blue-800 text-xs leading-relaxed">
                <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0" />
                <p>{tContract.legal_warning}</p>
              </div>

              <button
                type="submit"
                disabled={loading || name.trim().length < 5}
                className="w-full bg-white text-black border border-gray-200 py-5 rounded-2xl font-bold hover:bg-gray-50 active:scale-[0.98] transition-all shadow-xl shadow-gray-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  tContract.confirm_btn
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
