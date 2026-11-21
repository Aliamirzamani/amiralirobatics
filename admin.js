const loginView = document.querySelector('#loginView');
const panelView = document.querySelector('#panelView');
const loginForm = document.querySelector('#adminLogin');
const loginError = document.querySelector('#loginError');
const loginButton = document.querySelector('#loginButton');
const courseForm = document.querySelector('#courseForm');
const courseError = document.querySelector('#courseError');
const listError = document.querySelector('#listError');
const courseList = document.querySelector('#adminCourses');
const saveCourseButton = document.querySelector('#saveCourse');
const cancelCourseEdit = document.querySelector('#cancelCourseEdit');

async function checkSession() {
  try {
    const response = await fetch('/api/admin/session', { credentials: 'same-origin', cache: 'no-store' });
    const result = await response.json();
    if (result.authenticated) {
      showPanel();
      await loadCourses();
    } else if (response.status === 503) loginError.textContent = result.error || 'ورود امن هنوز روی سرویس میزبانی پیکربندی نشده است.';
  } catch {
    loginError.textContent = 'اتصال پنل برقرار نشد. پنل باید روی Cloudflare Pages منتشر شود.';
  }
}

function showPanel() {
  loginView.hidden = true;
  panelView.hidden = false;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

async function loadCourses() {
  listError.textContent = '';
  courseList.innerHTML = '<div class="admin-empty">در حال بارگذاری دوره‌ها…</div>';
  try {
    const response = await fetch('/api/admin/courses', { credentials: 'same-origin', cache: 'no-store' });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'دریافت دوره‌ها انجام نشد.');
    const courses = result.courses || [];
    document.querySelector('#courseCount').textContent = `${courses.length} دوره`;
    courseList.innerHTML = courses.length ? courses.map(course => `<article class="admin-course"><div class="admin-section-heading"><h3>${escapeHtml(course.title)}</h3><span class="${course.published ? 'admin-published' : 'admin-draft'}">${course.published ? 'منتشرشده' : 'پیش‌نویس'}</span></div><p>${escapeHtml(course.description || 'بدون توضیحات')}</p><div class="admin-course-meta"><span>سطح: ${escapeHtml(course.level)}</span><span>شناسه: ${escapeHtml(course.id)}</span></div><div class="admin-course-actions"><button class="btn o" type="button" data-course-edit="${escapeHtml(course.id)}">ویرایش</button><button class="btn o" type="button" data-course-delete="${escapeHtml(course.id)}">حذف</button></div></article>`).join('') : '<div class="admin-empty">هنوز دوره‌ای ثبت نشده. از فرم کناری اولین دوره را اضافه کن.</div>';
  } catch (error) {
    courseList.innerHTML = '<div class="admin-empty">دریافت فهرست دوره‌ها ممکن نشد.</div>';
    listError.textContent = error.message || 'اتصال به پایگاه داده برقرار نشد.';
  }
}

function resetCourseForm() {
  courseForm.reset();
  document.querySelector('#courseId').value = '';
  document.querySelector('#courseFormTitle').textContent = 'افزودن دوره';
  saveCourseButton.textContent = 'ذخیرهٔ دوره';
  cancelCourseEdit.hidden = true;
  courseError.textContent = '';
}

courseForm.addEventListener('submit', async event => {
  event.preventDefault();
  courseError.textContent = '';
  saveCourseButton.disabled = true;
  const id = document.querySelector('#courseId').value;
  const payload = {
    title: document.querySelector('#courseTitle').value.trim(),
    description: document.querySelector('#courseDescription').value.trim(),
    level: document.querySelector('#courseLevel').value,
    published: document.querySelector('#coursePublished').checked
  };
  try {
    const response = await fetch(`/api/admin/courses${id ? `?id=${encodeURIComponent(id)}` : ''}`, {
      method: id ? 'PUT' : 'POST', credentials: 'same-origin',
      headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'ذخیرهٔ دوره ناموفق بود.');
    resetCourseForm();
    await loadCourses();
  } catch (error) {
    courseError.textContent = error.message || 'ذخیرهٔ دوره ممکن نشد.';
  } finally {
    saveCourseButton.disabled = false;
  }
});

cancelCourseEdit.addEventListener('click', resetCourseForm);
document.querySelector('#refreshCourses').addEventListener('click', loadCourses);

courseList.addEventListener('click', async event => {
  const editButton = event.target.closest('[data-course-edit]');
  const deleteButton = event.target.closest('[data-course-delete]');
  if (editButton) {
    try {
      const response = await fetch('/api/admin/courses', { credentials: 'same-origin', cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'دوره‌ها در دسترس نیستند.');
      const course = result.courses.find(item => String(item.id) === editButton.dataset.courseEdit);
      if (!course) throw new Error('دوره پیدا نشد؛ فهرست را تازه کن.');
      document.querySelector('#courseId').value = course.id;
      document.querySelector('#courseTitle').value = course.title;
      document.querySelector('#courseDescription').value = course.description || '';
      document.querySelector('#courseLevel').value = course.level;
      document.querySelector('#coursePublished').checked = Boolean(course.published);
      document.querySelector('#courseFormTitle').textContent = 'ویرایش دوره';
      saveCourseButton.textContent = 'ذخیرهٔ تغییرات';
      cancelCourseEdit.hidden = false;
      document.querySelector('#courseTitle').focus();
    } catch (error) {
      listError.textContent = error.message;
    }
  }
  if (deleteButton && window.confirm('این دوره برای همیشه حذف شود؟')) {
    listError.textContent = '';
    try {
      const response = await fetch(`/api/admin/courses?id=${encodeURIComponent(deleteButton.dataset.courseDelete)}`, { method: 'DELETE', credentials: 'same-origin' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'حذف دوره ناموفق بود.');
      resetCourseForm();
      await loadCourses();
    } catch (error) {
      listError.textContent = error.message || 'حذف دوره ممکن نشد.';
    }
  }
});

loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  loginError.textContent = '';
  loginButton.disabled = true;
  loginButton.textContent = 'در حال بررسی…';
  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ phone: document.querySelector('#adminPhone').value, password: document.querySelector('#adminPassword').value })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'ورود انجام نشد.');
    loginForm.reset();
    showPanel();
    await loadCourses();
  } catch (error) {
    loginError.textContent = error.message || 'ارتباط با سرور برقرار نشد.';
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = 'ورود امن';
  }
});

document.querySelector('#logoutButton').addEventListener('click', async () => {
  try {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' });
  } finally {
    panelView.hidden = true;
    loginView.hidden = false;
  }
});

checkSession();
