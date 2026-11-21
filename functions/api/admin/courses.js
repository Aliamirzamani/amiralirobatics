import { hasValidSession, json, originAllowed } from './_auth.js';

function validCourse(course) {
  return course && typeof course.title === 'string' && course.title.trim().length >= 2 && course.title.trim().length <= 120 &&
    typeof (course.description ?? '') === 'string' && (course.description ?? '').length <= 1000 &&
    typeof (course.level ?? 'مقدماتی') === 'string' && (course.level ?? 'مقدماتی').length <= 40 &&
    (course.published === undefined || typeof course.published === 'boolean');
}

async function authorized(request, env, write = false) {
  if (write && !originAllowed(request)) return false;
  return Boolean(env.ADMIN_SESSION_SECRET && await hasValidSession(request, env.ADMIN_SESSION_SECRET));
}

async function listCourses({ request, env }) {
  if (!await authorized(request, env)) return json({ error: 'ابتدا وارد پنل مدیریت شو.' }, 401);
  if (!env.DB) return json({ error: 'پایگاه دادهٔ D1 متصل نیست؛ binding را با نام DB تنظیم کن.' }, 503);
  const { results } = await env.DB.prepare('SELECT id, title, description, level, published, created_at, updated_at FROM courses ORDER BY id DESC').all();
  return json({ courses: results });
}

async function createCourse({ request, env }) {
  if (!await authorized(request, env, true)) return json({ error: 'نشست معتبر نیست؛ دوباره وارد شو.' }, 401);
  if (!env.DB) return json({ error: 'پایگاه دادهٔ D1 متصل نیست؛ binding را با نام DB تنظیم کن.' }, 503);
  let course;
  try { course = await request.json(); } catch { return json({ error: 'اطلاعات دوره قابل‌خواندن نیست.' }, 400); }
  if (!validCourse(course)) return json({ error: 'عنوان دوره و اطلاعات واردشده را بررسی کن.' }, 400);
  const result = await env.DB.prepare('INSERT INTO courses (title, description, level, published) VALUES (?, ?, ?, ?)')
    .bind(course.title.trim(), course.description ?? '', course.level ?? 'مقدماتی', course.published ? 1 : 0).run();
  return json({ id: result.meta.last_row_id }, 201);
}

async function updateCourse({ request, env }) {
  if (!await authorized(request, env, true)) return json({ error: 'نشست معتبر نیست؛ دوباره وارد شو.' }, 401);
  if (!env.DB) return json({ error: 'پایگاه دادهٔ D1 متصل نیست؛ binding را با نام DB تنظیم کن.' }, 503);
  const id = Number(new URL(request.url).searchParams.get('id'));
  let course;
  try { course = await request.json(); } catch { return json({ error: 'اطلاعات دوره قابل‌خواندن نیست.' }, 400); }
  if (!Number.isSafeInteger(id) || id < 1 || !validCourse(course)) return json({ error: 'شناسه یا اطلاعات دوره معتبر نیست.' }, 400);
  const result = await env.DB.prepare('UPDATE courses SET title = ?, description = ?, level = ?, published = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .bind(course.title.trim(), course.description ?? '', course.level ?? 'مقدماتی', course.published ? 1 : 0, id).run();
  if (!result.meta.changes) return json({ error: 'این دوره پیدا نشد.' }, 404);
  return json({ updated: true });
}

async function deleteCourse({ request, env }) {
  if (!await authorized(request, env, true)) return json({ error: 'نشست معتبر نیست؛ دوباره وارد شو.' }, 401);
  if (!env.DB) return json({ error: 'پایگاه دادهٔ D1 متصل نیست؛ binding را با نام DB تنظیم کن.' }, 503);
  const id = Number(new URL(request.url).searchParams.get('id'));
  if (!Number.isSafeInteger(id) || id < 1) return json({ error: 'شناسهٔ دوره معتبر نیست.' }, 400);
  const result = await env.DB.prepare('DELETE FROM courses WHERE id = ?').bind(id).run();
  if (!result.meta.changes) return json({ error: 'این دوره پیدا نشد.' }, 404);
  return json({ deleted: true });
}

export async function onRequest({ request, env }) {
  try {
    if (request.method === 'GET') return await listCourses({ request, env });
    if (request.method === 'POST') return await createCourse({ request, env });
    if (request.method === 'PUT') return await updateCourse({ request, env });
    if (request.method === 'DELETE') return await deleteCourse({ request, env });
    return json({ error: 'روش درخواست پشتیبانی نمی‌شود.' }, 405, { allow: 'GET, POST, PUT, DELETE' });
  } catch {
    return json({ error: 'خطای سرور هنگام دسترسی به دوره‌ها.' }, 500);
  }
}
