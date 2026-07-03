export function showModal({ title, content, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm }) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';

  backdrop.innerHTML = `
    <div class="modal-content">
      <h3 class="mb-2" style="font-size: 24px;">${title}</h3>
      <div class="modal-body mb-3">${content}</div>
      <div style="display: flex; justify-content: flex-end; gap: 12px;">
        <button class="btn-capsule btn-secondary modal-cancel-btn">${cancelText}</button>
        <button class="btn-capsule btn-primary modal-confirm-btn">${confirmText}</button>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);

  const close = () => {
    backdrop.remove();
  };

  backdrop.querySelector('.modal-cancel-btn').addEventListener('click', close);
  backdrop.querySelector('.modal-confirm-btn').addEventListener('click', () => {
    onConfirm();
    close();
  });
  
  // Close on clicking backdrop out
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      close();
    }
  });
}
