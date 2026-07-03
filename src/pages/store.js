import { dbService } from '../firebase.js';
import { showToast } from '../components/toast.js';
import { showModal } from '../components/modal.js';

export async function renderStorePage(currentUser) {
  const container = document.createElement('div');
  container.className = 'container page-fade-in';

  // Fetch fresh profile & items
  const profile = await dbService.getInternProfile(currentUser.uid);
  const merchItems = await dbService.getMerchItems();

  // Header Section
  container.innerHTML = `
    <div class="store-header">
      <span class="badge badge-hr mb-1">Wonder Store Perks</span>
      <h2>Spend Your Points!</h2>
      <p style="color: var(--color-text-muted); max-width: 600px; margin: 0 auto;">
        Your available balance: <strong style="color: var(--color-accent-terracotta); font-size: 20px;">${profile.points_available} pts</strong> &bull; 1 Wonder Point = ₹1
      </p>
    </div>

    <!-- Carousel Container -->
    <div class="store-carousel-container">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding: 0 4px;">
        <span style="font-size: 14px; font-weight: 600; text-transform: uppercase; color: var(--color-text-muted); letter-spacing: 0.5px;">Available Catalogue</span>
        <div style="display: flex; gap: 8px;">
          <button id="carousel-prev" class="btn-capsule btn-secondary btn-sm" style="padding: 6px 12px;">←</button>
          <button id="carousel-next" class="btn-capsule btn-secondary btn-sm" style="padding: 6px 12px;">→</button>
        </div>
      </div>
      
      <div class="store-carousel" id="carousel-track">
        ${merchItems.map(item => {
          const canAfford = profile.points_available >= item.price;
          return `
            <div class="card merch-card">
              <div class="merch-image-placeholder" style="background-color: ${item.color || '#C65D3E'};">
                ${item.name}
              </div>
              <h3 class="merch-title">${item.name}</h3>
              <p class="merch-desc">${item.description}</p>
              <div class="merch-price-tag">${item.price} pts</div>
              <button 
                class="btn-capsule ${canAfford ? 'btn-primary' : 'btn-secondary'} redeem-btn" 
                data-id="${item.id}"
                data-name="${item.name}"
                data-price="${item.price}"
                ${canAfford ? '' : 'disabled style="cursor: not-allowed; opacity: 0.6;"'}
              >
                ${canAfford ? 'Redeem Item' : 'Insufficient Points'}
              </button>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Back link -->
    <div class="text-center">
      <a href="#dashboard" class="btn-capsule btn-secondary">← Back to Dashboard</a>
    </div>
  `;

  // Attach carousel scroll listeners
  const track = container.querySelector('#carousel-track');
  const prevBtn = container.querySelector('#carousel-prev');
  const nextBtn = container.querySelector('#carousel-next');

  if (track && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -300, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: 300, behavior: 'smooth' });
    });
  }

  // Attach redeem handlers
  const redeemButtons = container.querySelectorAll('.redeem-btn');
  redeemButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = Number(btn.getAttribute('data-price'));

      showModal({
        title: 'Redeem Merchandise',
        content: `
          <p>Are you sure you want to redeem <strong>${name}</strong> for <strong>${price} Wonder Points</strong>?</p>
          <p style="font-size: 13px; color: var(--color-text-muted); margin-top: 12px;">
            This will deduct ${price} points from your available balance. Your total points earned towards certificate evaluation will remain unchanged.
          </p>
        `,
        confirmText: 'Redeem Now',
        onConfirm: async () => {
          try {
            showToast('Processing order...', 'info');
            await dbService.redeemMerch(id);
            showToast(`Successfully ordered ${name}! Check your activity log.`, 'success');
            // Re-render
            window.location.reload();
          } catch (err) {
            showToast(err.message, 'error');
          }
        }
      });
    });
  });

  return container;
}
