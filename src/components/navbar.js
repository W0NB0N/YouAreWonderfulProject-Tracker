import { dbService } from '../firebase.js';
import { showToast } from './toast.js';

export function renderNavbar(currentUser, activeRoute) {
  const navContainer = document.querySelector('#navbar-container');
  if (!navContainer) return;

  let navLinksHtml = '';

  if (!currentUser) {
    // Guest Links
    navLinksHtml = `
      <li><a href="#" class="nav-link ${activeRoute === '' ? 'active' : ''}">Home</a></li>
      <li><a href="#login" class="btn-capsule btn-primary btn-sm">Sign In</a></li>
    `;
  } else if (currentUser.role === 'intern') {
    // Intern Links
    navLinksHtml = `
      <li><a href="#dashboard" class="nav-link ${activeRoute === 'dashboard' ? 'active' : ''}">Dashboard</a></li>
      <li><a href="#store" class="nav-link ${activeRoute === 'store' ? 'active' : ''}">Merch Store</a></li>
      <li style="display: flex; align-items: center; gap: 8px;">
        <span class="badge badge-member" style="font-size: 11px;">Intern</span>
        <button id="logout-btn" class="btn-capsule btn-secondary btn-sm">Sign Out</button>
      </li>
    `;
  } else {
    // Admin Links (HR or Head)
    navLinksHtml = `
      <li><a href="#admin" class="nav-link ${activeRoute === 'admin' ? 'active' : ''}">Manage Interns</a></li>
      <li style="display: flex; align-items: center; gap: 8px;">
        <span class="badge ${currentUser.role === 'hr' ? 'badge-hr' : 'badge-head'}" style="font-size: 11px;">
          ${currentUser.role === 'hr' ? 'HR Admin' : 'Dept Head'}
        </span>
        <button id="logout-btn" class="btn-capsule btn-secondary btn-sm">Sign Out</button>
      </li>
    `;
  }

  navContainer.innerHTML = `
    <nav class="navbar">
      <div class="container">
        <a href="#" class="logo">
          You're Wonderful Project<span class="logo-semicolon">;</span>
        </a>
        <button class="mobile-nav-toggle" id="mobile-toggle" aria-label="Toggle Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul class="nav-links" id="nav-menu">
          ${navLinksHtml}
        </ul>
      </div>
    </nav>
  `;

  // Attach event handlers
  const logoutBtn = navContainer.querySelector('#logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await dbService.logout();
        showToast('Signed out successfully.', 'success');
        window.location.hash = ''; // Route to landing
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  // Mobile menu toggle logic
  const mobileToggle = navContainer.querySelector('#mobile-toggle');
  const navMenu = navContainer.querySelector('#nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isVisible = navMenu.style.display === 'flex';
      navMenu.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.backgroundColor = 'var(--color-bg)';
        navMenu.style.borderBottom = '1px solid var(--color-card-border)';
        navMenu.style.padding = '20px';
        navMenu.style.gap = '16px';
        navMenu.style.boxShadow = 'var(--shadow-md)';
      }
    });
  }
}
