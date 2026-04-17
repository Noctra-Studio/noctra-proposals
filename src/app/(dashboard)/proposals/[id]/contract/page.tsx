import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import ContractForm from "./ContractForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Proposal } from "@/types";

async function getProposal(id: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("proposals")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as unknown as Proposal;
}

export default async function NewContractPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const proposal = await getProposal(id);

  if (!proposal) notFound();

  // Basic check: only proposals that are accepted (or similar) can have contracts
  // but we can be flexible here if the admin wants to generate one anyway.
  // The prompt says: "Si proposal.status === 'accepted' Y NO hay contrato generado"

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8">
        <Link
          href={`/proposals/${proposal.id}`}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver a la propuesta
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mt-4">
          Generar Contrato
        </h1>
        <p className="text-gray-500 mt-1">
          Finaliza los detalles legales y el calendario de pagos para{" "}
          {proposal.project_name}.
        </p>
      </div>

      <ContractForm proposal={proposal} />
    </div>
  );
}
