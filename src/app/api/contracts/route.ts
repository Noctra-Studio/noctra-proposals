import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { generateSlug } from '@/lib/utils'

export async function POST(req: Request) {
  try {
    const supabaseUser = await createClient();
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await req.json();
    const { proposal_id, project_name, ...contractData } = payload;

    if (!proposal_id) {
      return NextResponse.json({ error: 'Missing proposal_id' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // 1. Generate slug
    const slug = generateSlug(project_name, 'cont');

    // 2. Insert Contract
    const { data: contract, error: contractError } = await supabaseAdmin
      .from('contracts')
      .insert([{
        ...contractData,
        proposal_id,
        project_name,
        slug,
        status: 'draft'
      }])
      .select('*')
      .single();

    if (contractError || !contract) {
      console.error("Error creating contract:", contractError);
      return NextResponse.json({ error: 'Error al crear el contrato.' }, { status: 500 });
    }

    // 3. Update Proposal Status (ensure it's accepted)
    await supabaseAdmin
      .from('proposals')
      .update({ status: 'accepted' })
      .eq('id', proposal_id);

    // 4. Log History
    await supabaseAdmin
      .from('proposal_history')
      .insert([{
        proposal_id,
        action: 'Contrato generado',
        description: `Borrador de contrato creado por ${user.email}`,
      }]);

    return NextResponse.json(contract);
  } catch (error) {
    console.error("Internal Server Error:", error);
    return NextResponse.json({ error: 'Ocurrió un error en el servidor.' }, { status: 500 });
  }
}