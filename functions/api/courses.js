import { json } from './admin/_auth.js';

export async function onRequestGet({ env }) {
  if (!env.DB) return json({ courses: [] });
  try {
    const { results } = await env.DB.prepare('SELECT id, title, description, level FROM courses WHERE published = 1 ORDER BY id DESC').all();
    return json({ courses: results });
  } catch {
    return json({ error: 'فهرست دوره‌ها موقتاً در دسترس نیست.' }, 500);
  }
}

export async function onRequest(context) {
  if (context.request.method !== 'GET') return new Response(null, { status: 405, headers: { Allow: 'GET' } });
  return onRequestGet(context);
}
