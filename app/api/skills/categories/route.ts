
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/auth';

export async function GET() {
    try {
        const supabase = await createClient();

        // Fetch categories with display_order check
        const { data, error } = await supabase
            .from('skill_categories')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Error fetching skill categories:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        // Check authentication
        const user = await getCurrentUser();
        if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const json = await request.json();
        const { title, slug } = json;

        // Validate input
        if (!title || !slug) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const supabase = await createClient();

        // Get max display_order
        const { data: maxOrderData } = await (supabase
            .from('skill_categories') as any)
            .select('display_order')
            .order('display_order', { ascending: false })
            .limit(1);

        const nextOrder = maxOrderData && maxOrderData.length > 0 ? maxOrderData[0].display_order + 1 : 0;

        // Create category
        const { data, error } = await (supabase
            .from('skill_categories') as any)
            .insert({
                title,
                slug,
                display_order: nextOrder,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating skill category:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Unexpected error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
