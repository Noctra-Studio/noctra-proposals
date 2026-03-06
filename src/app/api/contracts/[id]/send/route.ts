import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend } from "@/lib/resend";
import ContractSentEmail from "@/components/emails/ContractSentEmail";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    // 1. Get contract data
    const { data: contract, error: fetchError } = await supabase
      .from("contracts")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    // 2. Send email via Resend
    const { error: mailError } = await resend.emails.send({
      from: "Noctra Studio <hello@noctra.studio>",
      to: [contract.client_email],
      subject: `Contrato de servicios: ${contract.project_name} | Noctra Studio`,
      react: ContractSentEmail({
        clientName: contract.client_name,
        projectName: contract.project_name,
        slug: contract.slug,
      }),
    });

    if (mailError) {
      console.error("Resend error:", mailError);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    // 3. Update contract status
    const { error: updateError } = await supabase
      .from("contracts")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) throw updateError;

    // 4. Log to proposal history
    if (contract.proposal_id) {
        await supabase.from("proposal_history").insert({
          proposal_id: contract.proposal_id,
          action: "Contrato enviado",
          description: `Contrato enviado a ${contract.client_email} para firma.`,
        });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in send contract API:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}