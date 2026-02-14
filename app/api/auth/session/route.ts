import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { USER_ID_COOKIE } from '@/lib/cookies';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get(USER_ID_COOKIE)?.value;

        if (!userId) {
            return NextResponse.json({ userId: null });
        }

        return NextResponse.json({ userId });
    } catch (error) {
        console.error('Exception in session API (GET):', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        const cookieStore = await cookies();
        cookieStore.set(USER_ID_COOKIE, userId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Exception in session API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete(USER_ID_COOKIE);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Exception in session API (DELETE):', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
