import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const cancellation_fee = body.cancellation_fee ? Number(body.cancellation_fee) : 0;
    const cancellation_terms = body.cancellation_terms || "Cancelación estándar";
    
    // Validate authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const supabaseAdmin = createAdminClient();

    // Verify contract exists and is not already cancelled
    const { data: contract, error: fetchError } = await supabaseAdmin
      .from('contracts')
      .select('id, status, proposal_id')
      .eq('id', id)
      .single();

    if (fetchError || !contract) {
      return NextResponse.json({ error: 'Contrato no encontrado' }, { status: 404 });
    }

    if (contract.status === 'cancelled') {
        return NextResponse.json({ error: 'El contrato ya está cancelado' }, { status: 400 });
    }

    // Update contract status and save cancellation details
    const { error: updateError } = await supabaseAdmin
      .from('contracts')
      .update({ 
        status: 'cancelled',
        cancellation_fee,
        cancellation_terms,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) {
      console.error("Error cancelling contract:", updateError);
      return NextResponse.json({ error: 'No se pudo cancelar el contrato' }, { status: 500 });
    }

    // Optional: Log the action in proposal history if possible
    if (contract.proposal_id) {
      await supabaseAdmin
        .from('proposal_history')
        .insert({
          proposal_id: contract.proposal_id,
          action: 'contract_cancelled',
          description: `Contrato cancelado por el usuario.`
        });
    }

    return NextResponse.json({ success: true, message: 'Contrato cancelado exitosamente' });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: 'Ocurrió un error en el servidor.' }, { status: 500 });
  }
}
