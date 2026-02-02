import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { region, category, description, sentiment, source = 'n8n' } = body;

        if (!description) {
            return NextResponse.json({ error: 'Description required' }, { status: 400 });
        }

        // Get the first workspace as default for this demo
        const { data: ws } = await supabase.from('workspaces').select('id').limit(1).single();

        if (!ws) {
            return NextResponse.json({ error: 'No workspace found' }, { status: 500 });
        }

        const { data, error } = await supabase
            .from('feedbacks')
            .insert([{
                workspace_id: ws.id,
                region_id: region, // Expected to be an ID
                category_id: category, // Expected to be an ID
                description: description,
                sentiment: sentiment || 'neutral',
                source: source
            }])
            .select()
            .single();

        if (error) throw error;

        console.log('Feedback saved to Supabase:', data);

        return NextResponse.json({
            success: true,
            id: data.id
        });

    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: error.message || 'Invalid request' }, { status: 500 });
    }
}
