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
const assignmentCards = document.querySelector('#assignmentCards');
const assignmentPicker = document.querySelector('#assignmentPicker');
const assignmentDialog = document.querySelector('#assignmentDialog');
const assignmentContent = document.querySelector('#assignmentContent');
const assignmentDialogTitle = document.querySelector('#assignmentDialogTitle');
const assignmentFileList = document.querySelector('#assignmentFileList');
const addAssignmentFiles = document.querySelector('#addAssignmentFiles');
const backToAssignmentFiles = document.querySelector('#backToAssignmentFiles');
const assignmentNames = { marketing: 'مارکتینگ پلن', 'mini-course': 'طراحی مینی‌دوره', business: 'بیزینس پلن', 'business-model': 'بوم مدل کسب‌وکار · پاورپوینت' };
let pendingAssignmentId = '';
let activeAssignmentId = '';

function openAssignmentDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('amirali-admin-assignments', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('files');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getAssignmentFiles(assignmentId) {
  const database = await openAssignmentDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('files', 'readonly');
    const request = transaction.objectStore('files').get(assignmentId);
    transaction.oncomplete = () => { database.close(); resolve(request.result || []); };
    transaction.onerror = () => { database.close(); reject(transaction.error); };
  });
}

async function saveAssignmentFiles(assignmentId, files) {
  const database = await openAssignmentDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('files', 'readwrite');
    transaction.objectStore('files').put(files, assignmentId);
    transaction.oncomplete = () => { database.close(); resolve(); };
    transaction.onerror = () => { database.close(); reject(transaction.error); };
  });
}

async function updateAssignmentStatus(assignmentId) {
  const status = document.querySelector(`[data-assignment-status="${assignmentId}"]`);
  if (!status) return;
  try {
    const files = await getAssignmentFiles(assignmentId);
    status.textContent = files.length ? `${files.length} فایل آمادهٔ بازکردن` : 'هنوز فایلی اضافه نشده';
  } catch {
    status.textContent = 'ذخیره‌سازی این مرورگر در دسترس نیست';
  }
}

function showAssignment(assignmentId) {
  assignmentDialogTitle.textContent = assignmentNames[assignmentId];
  assignmentContent.hidden = true;
  assignmentFileList.hidden = false;
  backToAssignmentFiles.hidden = true;
  activeAssignmentId = assignmentId;
  renderAssignmentFiles(assignmentId);
  assignmentDialog.showModal();
}

async function renderAssignmentFiles(assignmentId) {
  assignmentFileList.replaceChildren();
  const files = await getAssignmentFiles(assignmentId);
  if (!files.length) {
    const empty = document.createElement('div');
    empty.className = 'assignment-empty';
    empty.textContent = 'هنوز فایلی برای این تکلیف اضافه نکرده‌ای.';
    assignmentFileList.append(empty);
    return;
  }
  files.forEach((file, index) => {
    const row = document.createElement('div');
    row.className = 'assignment-file-entry';
    const details = document.createElement('div');
    const name = document.createElement('strong');
    name.textContent = file.name;
    const meta = document.createElement('span');
    meta.textContent = `${(file.size / 1024).toFixed(0)} کیلوبایت · ${file.type || 'فایل'}`;
    const openButton = document.createElement('button');
    openButton.className = 'btn o';
    openButton.type = 'button';
    openButton.textContent = file.name.toLowerCase().endsWith('.txt') ? 'خواندن تکلیف' : 'دریافت / بازکردن';
    openButton.addEventListener('click', () => openAssignmentFile(assignmentId, index));
    details.append(name, document.createElement('br'), meta);
    row.append(details, openButton);
    assignmentFileList.append(row);
  });
}

assignmentCards.addEventListener('click', event => {
  const card = event.target.closest('[data-assignment]');
  if (!card) return;
  showAssignment(card.dataset.assignment);
});

assignmentPicker.addEventListener('change', async () => {
  if (!assignmentPicker.files.length || !pendingAssignmentId) return;
  try {
    const existingFiles = await getAssignmentFiles(pendingAssignmentId);
    await saveAssignmentFiles(pendingAssignmentId, [...existingFiles, ...Array.from(assignmentPicker.files)]);
    await updateAssignmentStatus(pendingAssignmentId);
    if (assignmentDialog.open) await renderAssignmentFiles(pendingAssignmentId);
  } catch {
    window.alert('ذخیرهٔ فایل در همین مرورگر انجام نشد. فضای ذخیره‌سازی را بررسی کن و دوباره تلاش کن.');
  }
  pendingAssignmentId = '';
  assignmentPicker.value = '';
});

document.querySelector('#closeAssignment').addEventListener('click', () => assignmentDialog.close());
addAssignmentFiles.addEventListener('click', () => {
  pendingAssignmentId = activeAssignmentId;
  assignmentPicker.value = '';
  assignmentPicker.click();
});
backToAssignmentFiles.addEventListener('click', () => {
  assignmentContent.hidden = true;
  assignmentFileList.hidden = false;
  backToAssignmentFiles.hidden = true;
});

async function openAssignmentFile(assignmentId, fileIndex) {
  const files = await getAssignmentFiles(assignmentId);
  const file = files[fileIndex];
  if (!file) return;
  if (file.name.toLowerCase().endsWith('.txt')) {
    assignmentContent.textContent = await file.text();
    assignmentContent.hidden = false;
    assignmentFileList.hidden = true;
    backToAssignmentFiles.hidden = false;
    return;
  }
  const url = URL.createObjectURL(file);
  const download = document.createElement('a');
  download.href = url;
  download.download = file.name;
  document.body.append(download);
  download.click();
  download.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
}

Object.keys(assignmentNames).forEach(assignmentId => updateAssignmentStatus(assignmentId));

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
