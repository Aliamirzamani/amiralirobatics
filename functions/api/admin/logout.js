import { json, originAllowed, sessionCookie } from './_auth.js';

async function logout({ request }) {
  if (!originAllowed(request)) return json({ error: 'درخواست نامعتبر است.' }, 403);
  return json({ authenticated: false }, 200, { 'set-cookie': sessionCookie('', 0) });
}

export async function onRequest(context) {
  if (context.request.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } });
  return logout(context);
}
