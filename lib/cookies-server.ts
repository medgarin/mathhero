import { cookies } from 'next/headers';
import { USER_ID_COOKIE } from './cookies';

/**
 * Server-side cookie helpers
 */
export async function getCookieServer(name: string) {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value;
}

export async function getUserIdFromServer(): Promise<string | null> {
    return (await getCookieServer(USER_ID_COOKIE)) || null;
}
