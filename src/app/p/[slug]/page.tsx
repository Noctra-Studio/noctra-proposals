import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProposalView from "@/components/public/ProposalView";
import type { Proposal } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: proposal } = await supabase
    .from("proposals")
    .select("project_name")
    .eq("slug", slug)
    .single();

  if (!proposal) return { title: "Propuesta no encontrada | Noctra Studio" };

  return {
    title: `Propuesta: ${proposal.project_name} | Noctra Studio`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function PublicProposalPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: proposal } = await supabase
    .from("proposals")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!proposal) {
    notFound();
  }

  return <ProposalView proposal={proposal as unknown as Proposal} />;
}
