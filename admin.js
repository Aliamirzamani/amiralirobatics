const loginView = document.querySelector('#loginView');
const panelView = document.querySelector('#panelView');
const loginForm = document.querySelector('#adminLogin');
const loginError = document.querySelector('#loginError');
const loginButton = document.querySelector('#loginButton');

async function checkSession() {
  try {
    const response = await fetch('/api/admin/session', { credentials: 'same-origin', cache: 'no-store' });
    const result = await response.json();
    if (result.authenticated) showPanel();
  } catch {
    loginError.textContent = 'اتصال پنل برقرار نشد. پنل باید روی Cloudflare Pages منتشر شود.';
  }
}

function showPanel() {
  loginView.hidden = true;
  panelView.hidden = false;
}

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
