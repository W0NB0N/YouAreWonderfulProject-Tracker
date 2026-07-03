import { dbService } from '../firebase.js';

export async function renderDashboardPage(currentUser) {
  const container = document.createElement('div');
  container.className = 'container page-fade-in';

  // Fetch latest data for this user
  const profile = await dbService.getInternProfile(currentUser.uid);
  const logs = await dbService.getPointsLogs(currentUser.uid);

  const threshold = profile.type === 'head' ? 200 : 150;
  const isEligible = profile.points_total >= threshold;
  const progressPercent = Math.min(100, Math.round((profile.points_total / threshold) * 100));

  // Determine progress bar color
  let barColor = 'var(--color-accent-terracotta)';
  if (progressPercent >= 50 && progressPercent < 100) {
    barColor = 'var(--color-accent-mauve)';
  } else if (progressPercent >= 100) {
    barColor = 'var(--color-accent-green)';
  }

  // Create list of point logs
  let logsHtml = '';
  if (logs.length === 0) {
    logsHtml = `<p style="color: var(--color-text-muted); padding: 16px 0;">No activities logged yet.</p>`;
  } else {
    logsHtml = `
      <div class="activity-list">
        ${logs.map(log => `
          <div class="activity-item">
            <div class="activity-meta">
              <h4>${log.activity}</h4>
              <p>${log.note ? `“${log.note}” &bull; ` : ''}Awarded by ${log.awarded_by}</p>
            </div>
            <div style="text-align: right;">
              <div class="activity-pts ${log.points < 0 ? 'deducted' : ''}">
                ${log.points > 0 ? `+${log.points}` : log.points}
              </div>
              <p style="font-size: 11px; color: var(--color-text-muted); margin-top: 4px;">${log.date}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  container.innerHTML = `
    <!-- Header Block -->
    <div class="dashboard-header-block">
      <div class="dashboard-user-info">
        <h2>Hey, ${profile.name} 👋</h2>
        <p>Department: <strong>${profile.department}</strong> &bull; Tenure: ${profile.tenure_start} to ${profile.tenure_end}</p>
      </div>
      <a href="#store" class="btn-capsule btn-primary">Browse Merch Store</a>
    </div>

    <!-- Stats Grid -->
    <div class="dashboard-stats-grid">
      <div class="card" style="${isEligible ? 'border-color: var(--color-accent-green); background-color: rgba(91, 140, 90, 0.04);' : ''}">
        <div class="stat-card-title">Total Points Earned</div>
        <div class="stat-card-value" style="color: var(--color-accent-blue);">${profile.points_total}</div>
        <div class="progress-text" style="margin-top: 20px;">
          <span>Tenure Progress</span>
          <span>Target: ${threshold} pts (${profile.type === 'head' ? 'Dept Head' : 'Member'})</span>
        </div>
        <div class="progress-bar-wrapper">
          <div class="progress-bar-fill" style="width: ${progressPercent}%; background-color: ${barColor};"></div>
        </div>
        <div class="progress-text" style="margin-bottom: 12px;">
          <span>${progressPercent}% Complete</span>
          <span>${isEligible ? 'Eligible for Certificate!' : `Needs ${threshold - profile.points_total} more`}</span>
        </div>

        ${isEligible ? `
          <button id="view-certificate-btn" class="btn-capsule btn-success" style="width: 100%; margin-top: 8px;">
            📜 View & Download Certificate
          </button>
        ` : ''}
      </div>

      <div class="card">
        <div class="stat-card-title">Available Points (Merch)</div>
        <div class="stat-card-value" style="color: var(--color-accent-terracotta);">${profile.points_available}</div>
        <p style="font-size: 13px; color: var(--color-text-muted); margin-top: 24px; line-height: 1.5;">
          Redeem these points for custom YWP merchandise. Redeeming points does not decrease your Certificate eligibility.
        </p>
      </div>

      <div class="card">
        <div class="stat-card-title">Points Spent</div>
        <div class="stat-card-value" style="color: var(--color-text-muted);">${profile.points_redeemed}</div>
        <p style="font-size: 13px; color: var(--color-text-muted); margin-top: 24px; line-height: 1.5;">
          You have spent a total of <strong>${profile.points_redeemed}</strong> points (equivalent to <strong>₹${profile.points_redeemed}</strong>) on the merch store during this term.
        </p>
      </div>
    </div>

    <!-- Main Layout -->
    <div class="dashboard-layout">
      <div>
        <h3 class="mb-2">Your Point History</h3>
        ${logsHtml}
      </div>

      <div>
        <div class="card">
          <h3 class="mb-2" style="font-size: 20px;">Wonder Points Guideline</h3>
          <p class="mb-2" style="font-size: 13px; color: var(--color-text-muted); line-height: 1.6;">
            Your points are evaluated weekly. Attending weekly syncs awards 3 points, offline meetings award 20 points, and tasks are rewarded dynamically.
          </p>
          <hr style="border: 0; border-top: 1px solid var(--color-card-border); margin: 16px 0;" />
          <h4 class="mb-1" style="font-size: 15px;">Need Clarification?</h4>
          <p style="font-size: 13px; color: var(--color-text-muted); line-height: 1.6;">
            If you feel some points were missed, feel free to reach out to the HR team at <code>humanresources.ywp@gmail.com</code>.
          </p>
        </div>
      </div>
    </div>
  `;

  // Attach Certificate View listener
  const certBtn = container.querySelector('#view-certificate-btn');
  if (certBtn) {
    certBtn.addEventListener('click', () => {
      showCertificateModal(profile);
    });
  }

  return container;
}

function showCertificateModal(profile) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';

  const certHtml = `
    <div id="certificate-print-content" style="
      background-color: #FAF6F1;
      border: 8px double #C65D3E;
      padding: 36px 28px;
      border-radius: 12px;
      text-align: center;
      box-shadow: inset 0 0 0 2px #D4A843;
      font-family: 'Inter', sans-serif;
      position: relative;
    ">
      <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 28px; font-weight: 700; color: #121224; letter-spacing: 0.5px;">
        You're Wonderful Project<span style="color: #C65D3E;">;</span>
      </div>
      <div style="font-size: 11px; font-weight: 700; letter-spacing: 2px; color: #5A5A6A; text-transform: uppercase; margin-top: 4px;">
        Registered Trust • Est. 2017 • New Delhi
      </div>

      <div style="margin: 24px 0 16px;">
        <span style="font-family: 'Playfair Display', Georgia, serif; font-size: 32px; font-weight: 600; color: #C65D3E; font-style: italic;">
          Certificate of Completion
        </span>
      </div>

      <div style="font-size: 14px; color: #4A4A5A; margin-bottom: 8px;">
        This certificate is proudly presented to
      </div>

      <div style="
        font-family: 'Playfair Display', Georgia, serif;
        font-size: 32px;
        font-weight: 700;
        color: #121224;
        margin: 12px 0 16px;
        border-bottom: 2px solid #C65D3E;
        display: inline-block;
        padding: 0 32px 4px;
      ">
        ${profile.name}
      </div>

      <div style="font-size: 14px; color: #4A4A5A; max-width: 540px; margin: 0 auto 20px; line-height: 1.6;">
        in recognition of outstanding contribution, engagement, and successfully achieving the Wonder Points milestone of <strong>${profile.points_total} Points</strong> as a <strong>${profile.type === 'head' ? 'Department Head' : 'General Member'}</strong> in the <strong>${profile.department}</strong> during the tenure (${profile.tenure_start} to ${profile.tenure_end}).
      </div>

      <div style="display: flex; justify-content: space-around; align-items: flex-end; margin-top: 32px; padding-top: 20px; border-top: 1px dashed #EFE9DF;">
        <div style="text-align: center;">
          <div style="font-family: 'Playfair Display', serif; font-style: italic; font-weight: 700; font-size: 15px; color: #121224;">Akhilesh Nair & Akash Saxena</div>
          <div style="font-size: 11px; color: #5A5A6A; margin-top: 2px; border-top: 1px solid #2A2A3A; padding-top: 4px; width: 160px; margin: 4px auto 0;">Co-Founders, YWP</div>
        </div>

        <div style="
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 2px solid #D4A843;
          background-color: #FFFDFB;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          box-shadow: 0 2px 8px rgba(212, 168, 67, 0.3);
        " title="Seal of Achievement">
          🎖️
        </div>

        <div style="text-align: center;">
          <div style="font-family: 'Playfair Display', serif; font-style: italic; font-weight: 700; font-size: 15px; color: #121224;">HR Department</div>
          <div style="font-size: 11px; color: #5A5A6A; margin-top: 2px; border-top: 1px solid #2A2A3A; padding-top: 4px; width: 160px; margin: 4px auto 0;">humanresources.ywp@gmail.com</div>
        </div>
      </div>
    </div>
  `;

  backdrop.innerHTML = `
    <div class="modal-content" style="max-width: 680px; padding: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h3 style="font-size: 20px;">Your Certificate of Completion</h3>
        <button class="modal-close-x btn-capsule btn-secondary btn-sm" style="padding: 4px 10px;">✕</button>
      </div>

      ${certHtml}

      <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px;">
        <button class="btn-capsule btn-secondary modal-close-btn">Close</button>
        <button class="btn-capsule btn-primary download-cert-btn">📥 Download / Print Certificate</button>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);

  const close = () => backdrop.remove();
  backdrop.querySelector('.modal-close-x').addEventListener('click', close);
  backdrop.querySelector('.modal-close-btn').addEventListener('click', close);

  backdrop.querySelector('.download-cert-btn').addEventListener('click', () => {
    const printWin = window.open('', '_blank');
    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Certificate — ${profile.name}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
        <style>
          body {
            margin: 0;
            padding: 40px;
            background-color: #FAF6F1;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            box-sizing: border-box;
          }
          @media print {
            body { padding: 0; background: none; }
            @page { size: landscape; margin: 10mm; }
          }
        </style>
      </head>
      <body>
        <div style="width: 100%; max-width: 800px;">
          ${certHtml}
        </div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `);
    printWin.document.close();
  });
}
