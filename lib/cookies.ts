export const USER_ID_COOKIE = 'easymaths_user_id';

/**
 * Client-side cookie helpers
 * Note: These should be used sparingly if httpOnly cookies are preferred.
 */
export function getCookieClient(name: string) {
    if (typeof document === 'undefined') return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
}

export function setCookieClient(name: string, value: string, days: number = 7) {
    if (typeof document === 'undefined') return;
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `; expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Lax; Secure`;
}

export function deleteCookieClient(name: string) {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax; Secure`;
}
