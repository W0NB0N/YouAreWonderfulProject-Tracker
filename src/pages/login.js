import { dbService } from '../firebase.js';
import { showToast } from '../components/toast.js';

export function renderLoginPage() {
  const container = document.createElement('div');
  container.className = 'login-container page-fade-in';

  container.innerHTML = `
    <div class="card login-card" style="max-width: 440px; text-align: center; padding: 40px 32px;">
      <div class="login-header">
        <h2 style="font-size: 30px;">Volunteer & HR Portal<span class="logo-semicolon">;</span></h2>
        <p style="color: var(--color-text-muted); font-size: 14px; margin-top: 8px;">
          Sign in with your Google account
        </p>
      </div>

      <div style="margin: 32px 0 24px;">
        <button id="google-signin-btn" class="btn-capsule btn-primary" style="width: 100%; padding: 14px 24px; font-size: 16px; display: flex; align-items: center; justify-content: center; gap: 10px;">
          <span style="font-size: 20px;">🌐</span> Sign In with Google
        </button>
      </div>

      <p style="font-size: 12px; color: var(--color-text-muted); line-height: 1.5; margin: 0;">
        Authorized YWP volunteers, interns, and HR administrators can access the portal using Google OAuth.
      </p>
    </div>
  `;

  // Handle Main Google Popup button click
  const googleBtn = container.querySelector('#google-signin-btn');
  googleBtn.addEventListener('click', async () => {
    try {
      showToast('Opening Google OAuth Popup...', 'info');
      const user = await dbService.loginWithGoogle();
      showToast(`Welcome back, ${user.name}!`, 'success');
      
      if (user.role === 'intern') {
        window.location.hash = 'dashboard';
      } else {
        window.location.hash = 'admin';
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  return container;
}
