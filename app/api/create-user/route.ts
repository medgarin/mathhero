import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
    try {
        const { name, avatar } = await request.json();

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('users')
            .insert([{ name, avatar: avatar || 'astronaut' }])
            .select()
            .single();

        if (error) {
            console.error('Error creating user via API:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Exception in create-user API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
