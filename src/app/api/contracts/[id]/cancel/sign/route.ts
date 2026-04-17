import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { client_signed_name } = await request.json();

    if (!client_signed_name) {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    const { error: updateError } = await ((supabaseAdmin as any).from('contracts') as any)
      .update({
        cancellation_client_name: client_signed_name,
        cancellation_signed_at: new Date().toISOString()
      })
      .eq('id', id);

    if (updateError) {
      console.error("Error signing cancellation:", updateError);
      return NextResponse.json({ error: 'No se pudo firmar el aviso de cancelación' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: 'Ocurrió un error en el servidor.' }, { status: 500 });
  }
}
