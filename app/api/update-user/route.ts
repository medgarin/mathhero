import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
    try {
        const { userId, type, data } = await request.json();

        if (!userId || !type) {
            return NextResponse.json({ error: 'userId and type are required' }, { status: 400 });
        }

        let result;

        switch (type) {
            case 'achievements':
                const achievements = data.achievementIds.map((id: string) => ({
                    user_id: userId,
                    achievement_id: id,
                }));
                result = await supabaseAdmin.from('user_achievements').insert(achievements);
                break;

            case 'daysPlayed':
                result = await supabaseAdmin
                    .from('users')
                    .update({ days_played: data.daysPlayed })
                    .eq('id', userId);
                break;

            case 'bestStreak':
                result = await supabaseAdmin
                    .from('users')
                    .update({ best_streak: data.streak })
                    .eq('id', userId);
                break;

            default:
                return NextResponse.json({ error: 'Invalid update type' }, { status: 400 });
        }

        if (result.error) {
            console.error(`Error updating user ${type} via API:`, result.error);
            return NextResponse.json({ error: result.error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Exception in update-user API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
