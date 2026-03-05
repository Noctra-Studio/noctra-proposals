import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend } from "@/lib/resend";
import ProposalSentEmail from "@/components/emails/ProposalSentEmail";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    // 1. Get proposal data
    const { data: proposal, error: fetchError } = await supabase
      .from("proposals")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    // 2. Send email via Resend
    const { error: mailError } = await resend.emails.send({
      from: "Noctra Studio <hello@noctra.studio>",
      to: [proposal.client_email],
      subject: `Propuesta comercial: ${proposal.project_name} | Noctra Studio`,
      react: ProposalSentEmail({
        clientName: proposal.client_name,
        projectName: proposal.project_name,
        slug: proposal.slug,
        validUntil: proposal.valid_until 
          ? format(new Date(proposal.valid_until), "dd 'de' MMMM, yyyy", { locale: es })
          : "-",
      }),
    });

    if (mailError) {
      console.error("Resend error:", mailError);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    // 3. Update proposal status
    const { error: updateError } = await supabase
      .from("proposals")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) throw updateError;

    // 4. Log to history
    await supabase.from("proposal_history").insert({
      proposal_id: id,
      action: "Propuesta enviada",
      details: `Propuesta enviada a ${proposal.client_email}`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in send proposal API:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}