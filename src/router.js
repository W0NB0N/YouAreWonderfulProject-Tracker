import { dbService } from './firebase.js';
import { renderNavbar } from './components/navbar.js';
import { renderLandingPage } from './pages/landing.js';
import { renderLoginPage } from './pages/login.js';
import { renderDashboardPage } from './pages/dashboard.js';
import { renderStorePage } from './pages/store.js';
import { renderAdminPage } from './pages/admin.js';
import { renderAdminUserPage } from './pages/admin-user.js';
import { showToast } from './components/toast.js';

export async function handleRouting() {
  const appContainer = document.querySelector('#app');
  if (!appContainer) return;

  // 1. Get current path hash
  const hash = window.location.hash.replace('#', '');
  const pathParts = hash.split('/');
  
  // 2. Fetch authenticated user (if any)
  let currentUser = null;
  try {
    currentUser = await dbService.getCurrentUser();
  } catch (err) {
    console.error("Error checking auth state", err);
  }

  // 3. Page layout initialization (Header navbar + Main section + Footer)
  if (!document.querySelector('#navbar-container')) {
    appContainer.innerHTML = `
      <div id="navbar-container"></div>
      <main id="main-content"></main>
      <footer id="footer-container"></footer>
    `;
  }

  const mainContent = document.querySelector('#main-content');
  const footerContainer = document.querySelector('#footer-container');

  // 4. Set active route in navbar
  const activeRoute = pathParts[0];
  renderNavbar(currentUser, activeRoute);

  // 5. Render Footer (standard look for landing, minimal for dashboard)
  renderFooter(footerContainer, activeRoute === '' || activeRoute === 'about' || activeRoute === 'programs');

  // 6. Router logic & Role protection
  if (hash === '' || hash === 'about' || hash === 'programs') {
    // PUBLIC LANDING PAGE
    mainContent.innerHTML = renderLandingPage();
  } 
  else if (hash === 'login') {
    // LOGIN PAGE
    if (currentUser) {
      // If already logged in, redirect
      window.location.hash = currentUser.role === 'intern' ? 'dashboard' : 'admin';
      return;
    }
    mainContent.innerHTML = '';
    mainContent.appendChild(renderLoginPage());
  } 
  else if (hash === 'dashboard') {
    // INTERN DASHBOARD (PROTECTED)
    if (!currentUser) {
      window.location.hash = 'login';
      showToast('Please sign in to access your dashboard.', 'error');
      return;
    }
    if (currentUser.role !== 'intern') {
      window.location.hash = 'admin';
      return;
    }
    mainContent.innerHTML = '<div class="text-center" style="margin-top: 80px;">Loading dashboard...</div>';
    const view = await renderDashboardPage(currentUser);
    mainContent.innerHTML = '';
    mainContent.appendChild(view);
  } 
  else if (hash === 'store') {
    // MERCH STORE (PROTECTED FOR INTERNS)
    if (!currentUser) {
      window.location.hash = 'login';
      return;
    }
    if (currentUser.role !== 'intern') {
      window.location.hash = 'admin';
      return;
    }
    mainContent.innerHTML = '<div class="text-center" style="margin-top: 80px;">Opening store...</div>';
    const view = await renderStorePage(currentUser);
    mainContent.innerHTML = '';
    mainContent.appendChild(view);
  } 
  else if (hash === 'admin') {
    // ADMIN PANEL (PROTECTED FOR HEAD/HR)
    if (!currentUser) {
      window.location.hash = 'login';
      return;
    }
    if (currentUser.role === 'intern') {
      window.location.hash = 'dashboard';
      showToast('Access denied. Administrator privileges required.', 'error');
      return;
    }
    mainContent.innerHTML = '<div class="text-center" style="margin-top: 80px;">Loading admin panel...</div>';
    const view = await renderAdminPage();
    mainContent.innerHTML = '';
    mainContent.appendChild(view);
  } 
  else if (pathParts[0] === 'admin' && pathParts[1] === 'user' && pathParts[2]) {
    // ADMIN USER DETAIL (PROTECTED FOR HEAD/HR)
    const targetUserId = pathParts[2];
    if (!currentUser) {
      window.location.hash = 'login';
      return;
    }
    if (currentUser.role === 'intern') {
      window.location.hash = 'dashboard';
      showToast('Access denied.', 'error');
      return;
    }
    mainContent.innerHTML = '<div class="text-center" style="margin-top: 80px;">Loading details...</div>';
    const view = await renderAdminUserPage(targetUserId);
    mainContent.innerHTML = '';
    mainContent.appendChild(view);
  } 
  else {
    // FALLBACK 404
    mainContent.innerHTML = `
      <div class="container text-center" style="padding: 100px 0;">
        <h2 style="font-size: 36px;">Page Not Found</h2>
        <p class="mb-3" style="color: var(--color-text-muted);">The requested page does not exist or has been moved.</p>
        <a href="#" class="btn-capsule btn-primary">Return Home</a>
      </div>
    `;
  }

  // Smooth scroll to top on routing
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function renderFooter(footerContainer, isFullFooter) {
  if (!isFullFooter) {
    // Simple footer for dashboards
    footerContainer.innerHTML = `
      <div class="container text-center" style="padding: 30px 0; border-top: 1px solid var(--color-card-border); font-size: 13px; color: var(--color-text-muted);">
        <p>You're Wonderful Project; &bull; Wonder Points tracking system.</p>
      </div>
    `;
    return;
  }

  // Full rich footer for public pages
  footerContainer.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col">
            <h4 class="logo" style="font-size: 20px; margin-bottom: 12px;">
              You're Wonderful Project<span class="logo-semicolon">;</span>
            </h4>
            <p style="line-height: 1.6; margin-bottom: 16px;">
              We are a registered Indian mental health non-profit dedicated to creating stigma-free safe spaces and accessible resources for youth.
            </p>
            <p><strong>Address:</strong> 1, 22, Asaf Ali Rd, Delhi 110002</p>
          </div>
          <div class="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#about">About Pillars</a></li>
              <li><a href="#programs">Active Initiatives</a></li>
              <li><a href="#login">Volunteer Login</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Connect with Us</h4>
            <p style="margin-bottom: 8px;">Email: <a href="mailto:info@yourewonderfulproject.org" style="color: var(--color-accent-terracotta);">info@yourewonderfulproject.org</a></p>
            <p style="margin-bottom: 16px;">Phone: +91 7982718997</p>
            <div style="display: flex; gap: 12px; font-size: 18px;">
              <a href="https://instagram.com/yourewonderfulproject" target="_blank" rel="noopener noreferrer" title="Instagram">📸</a>
              <a href="https://facebook.com/yourewonderfulproject" target="_blank" rel="noopener noreferrer" title="Facebook">👥</a>
              <a href="#" title="LinkedIn">💼</a>
              <a href="#" title="Twitter/X">🐦</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2026 You're Wonderful Project; All rights reserved.</p>
          <p style="font-style: italic;">Your story isn't over yet.</p>
        </div>
      </div>
    </footer>
  `;
}
