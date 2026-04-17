import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabaseAdmin = createAdminClient();

    const { data: contract, error } = await (supabaseAdmin as any).from('contracts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !contract) {
      return NextResponse.json({ error: 'Contrato no encontrado' }, { status: 404 });
    }

    return NextResponse.json(contract);
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: 'Ocurrió un error en el servidor.' }, { status: 500 });
  }
}