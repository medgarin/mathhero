import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
    try {
        const {
            userId,
            level,
            score,
            accuracy,
            livesRemaining,
            totalQuestions,
            correctAnswers,
            failedQuestions,
        } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('game_scores')
            .insert([
                {
                    user_id: userId,
                    level,
                    score,
                    accuracy,
                    lives_remaining: livesRemaining,
                    total_questions: totalQuestions,
                    correct_answers: correctAnswers,
                    failed_questions: failedQuestions,
                },
            ])
            .select()
            .single();

        if (error) {
            console.error('Error saving game score via API:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Exception in save-score API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
