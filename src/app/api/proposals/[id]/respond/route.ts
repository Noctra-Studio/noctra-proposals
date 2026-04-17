import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend } from "@/lib/resend";
import ProposalResponseNotificationEmail from "@/components/emails/ProposalResponseNotificationEmail";
import ContractSentEmail from "@/components/emails/ContractSentEmail";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const { response, comments } = await request.json();

    if (!id || !response) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 1. Update proposal status — this is critical
    const { data: proposal, error: updateError } = await (supabase as any)
      .from("proposals")
      .update({
        status: response,
        client_response: response,
        client_comments: comments || null,
        client_responded_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("DB update error:", updateError);
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // 2. Log to history — non-critical
    const statusLabels: Record<string, string> = {
      accepted: "Aceptada",
      changes_requested: "Cambios solicitados",
      rejected: "Rechazada",
    };

    (supabase as any)
      .from("proposal_history")
      .insert({
        proposal_id: id,
        action: `Propuesta ${statusLabels[response] || response}`,
        description: comments ? `Comentarios: ${comments}` : null,
      })
      .then(({ error }: any) => {
        if (error) console.error("History log error:", error);
      });

    // 3. Send emails — non-critical, don't block the response
    const formatter = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    });

    resend.emails
      .send({
        from: "Noctra Notifications <hello@noctra.studio>",
        to: ["hello@noctra.studio"],
        subject: `${
          response === "accepted" ? "✅" : response === "rejected" ? "❌" : "📝"
        } ${statusLabels[response]} — ${proposal.project_name ?? ""}`,
        react: ProposalResponseNotificationEmail({
          clientName: proposal.client_name ?? "",
          projectName: proposal.project_name ?? "",
          status: response as "accepted" | "changes_requested" | "rejected",
          total: formatter.format(proposal.total ?? 0),
          comments: comments,
          proposalId: id,
          clientPhone: proposal.client_phone ?? undefined,
          respondedAt: format(new Date(), "dd/MM/yyyy HH:mm", { locale: es }),
        }),
      })
      .catch((err: any) => console.error("Notification email error:", err));

    if (response === "accepted" && proposal.client_email && proposal.slug) {
      resend.emails
        .send({
          from: "Noctra Studio <hello@noctra.studio>",
          to: [proposal.client_email],
          subject: `Contrato de servicios: ${proposal.project_name ?? ""} | Noctra Studio`,
          react: ContractSentEmail({
            clientName: proposal.client_name ?? "",
            projectName: proposal.project_name ?? "",
            slug: proposal.slug,
          }),
        })
        .catch((err: any) => console.error("Contract email error:", err));
    }

    return NextResponse.json({ success: true, proposal });
  } catch (error: any) {
    console.error("Error in proposal response API:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
