import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend } from "@/lib/resend";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { client_signed_name } = await request.json();

    if (!client_signed_name) {
      return NextResponse.json({ error: "Firma requerida" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Get contract data
    const { data: contract, error: fetchError } = await supabase
      .from("contracts")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !contract) {
      return NextResponse.json({ error: "Contrato no encontrado" }, { status: 404 });
    }

    // 2. Validate name (optional but good for UX)
    // if (client_signed_name.toLowerCase() !== contract.client_name.toLowerCase()) {
    //   return NextResponse.json({ error: "El nombre no coincide con el cliente" }, { status: 400 });
    // }

    // 3. Update contract status
    const signedAt = new Date().toISOString();
    const { error: updateError } = await supabase
      .from("contracts")
      .update({
        status: "signed",
        signed_at: signedAt,
        client_signed_name: client_signed_name,
      })
      .eq("id", id);

    if (updateError) throw updateError;

    // 4. Send notifications
    // Notification to Admin
    await resend.emails.send({
      from: "Noctra Studio <hello@noctra.studio>",
      to: ["hello@noctra.studio"],
      subject: `✅ Contrato firmado — ${contract.project_name}`,
      text: `El cliente ${client_signed_name} ha firmado el contrato para el proyecto "${contract.project_name}" el día ${format(new Date(signedAt), "PPPP", { locale: es })}.\n\nLink al contrato: https://proposals.noctra.studio/c/${contract.slug}`,
    });

    // Confirmation to Client (simple text for now or reuse a template if available)
    await resend.emails.send({
        from: "Noctra Studio <hello@noctra.studio>",
        to: [contract.client_email],
        subject: `Contrato firmado correctamente: ${contract.project_name}`,
        text: `Hola ${contract.client_name},\n\nGracias por firmar el contrato para ${contract.project_name}. Hemos recibido tu firma correctamente.\n\nPróximos pasos: Iniciaremos el proyecto según lo acordado. Puedes descargar una copia de tu contrato en este enlace:\nhttps://proposals.noctra.studio/c/${contract.slug}\n\nGracias,\nNoctra Studio`,
    });

    // 5. Log to proposal history
    if (contract.proposal_id) {
        await supabase.from("proposal_history").insert({
          proposal_id: contract.proposal_id,
          action: "Contrato firmado",
          description: `Contrato firmado digitalmente por ${client_signed_name}.`,
        });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in sign contract API:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

