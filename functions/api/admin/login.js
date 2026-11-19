import { createSession, json, originAllowed, sessionCookie } from './_auth.js';

async function login({ request, env }) {
  if (!originAllowed(request)) return json({ error: 'درخواست نامعتبر است.' }, 403);
  if (!env.ADMIN_PHONE || !env.ADMIN_PASSWORD || !env.ADMIN_SESSION_SECRET || env.ADMIN_SESSION_SECRET.length < 32 || env.ADMIN_PASSWORD.length < 16) {
    return json({ error: 'تنظیم امن پنل کامل نیست؛ مدیر باید تنظیمات محرمانه را بررسی کند.' }, 503);
  }

  let credentials;
  try {
    credentials = await request.json();
  } catch {
    return json({ error: 'اطلاعات ورود معتبر نیست.' }, 400);
  }

  const phone = typeof credentials.phone === 'string' ? credentials.phone.trim() : '';
  const password = typeof credentials.password === 'string' ? credentials.password : '';
  if (phone !== env.ADMIN_PHONE || password !== env.ADMIN_PASSWORD) return json({ error: 'شماره تلفن یا رمز عبور نادرست است.' }, 401);

  const token = await createSession(env.ADMIN_SESSION_SECRET);
  return json({ authenticated: true }, 200, { 'set-cookie': sessionCookie(token) });
}

export async function onRequest(context) {
  if (context.request.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } });
  return login(context);
}
