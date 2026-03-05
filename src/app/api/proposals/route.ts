import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    // 1. Authenticate regular user first to ensure they are logged in to the dashboard
    const supabaseUser = await createClient();
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();

    // 2. Insert using the admin client (which bypasses RLS so we can write)
    const supabaseAdmin = createAdminClient();

    const { data: proposal, error: insertError } = await supabaseAdmin
      .from('proposals')
      .insert([payload])
      .select('id, slug')
      .single();

    if (insertError || !proposal) {
      console.error("Error creating proposal:", insertError);
      return NextResponse.json({ error: 'Error al crear la propuesta.' }, { status: 500 });
    }

    // 3. Register history
    await supabaseAdmin
      .from('proposal_history')
      .insert([{
        proposal_id: proposal.id,
        action: 'Propuesta creada',
        description: `Propuesta base generada por ${user.email}`,
      }]);

    return NextResponse.json(proposal);
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: 'Ocurrió un error en el servidor.' }, { status: 500 });
  }
}