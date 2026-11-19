import { hasValidSession, json } from './_auth.js';

async function getSession({ request, env }) {
  if (!env.ADMIN_SESSION_SECRET || env.ADMIN_SESSION_SECRET.length < 32) return json({ authenticated: false }, 503);
  return json({ authenticated: await hasValidSession(request, env.ADMIN_SESSION_SECRET) });
}

export async function onRequest(context) {
  if (context.request.method !== 'GET') return new Response(null, { status: 405, headers: { Allow: 'GET' } });
  return getSession(context);
}
