import { dbService } from '../firebase.js';
import { showToast } from '../components/toast.js';
import { showModal } from '../components/modal.js';

export async function renderAdminUserPage(userId) {
  const container = document.createElement('div');
  container.className = 'container page-fade-in';

  // Fetch intern details
  const profile = await dbService.getInternProfile(userId);
  if (!profile) {
    container.innerHTML = `
      <div class="text-center" style="margin: 80px 0;">
        <h2>Intern Not Found</h2>
        <p class="mb-3">The user with ID <strong>${userId}</strong> could not be located.</p>
        <a href="#admin" class="btn-capsule btn-primary">Back to Panel</a>
      </div>
    `;
    return container;
  }

  const logs = await dbService.getPointsLogs(userId);
  const threshold = profile.type === 'head' ? 200 : 150;
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
    <div style="margin: 40px 0 32px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
      <div>
        <a href="#admin" style="font-size: 14px; color: var(--color-text-muted); display: block; margin-bottom: 8px;">← Back to Database</a>
        <h2>Intern Details: ${profile.name}</h2>
        <p style="color: var(--color-text-muted);">${profile.email || '<span style="color:var(--color-accent-terracotta); font-style:italic;">No Email Registered</span>'} &bull; ${profile.department}</p>
      </div>
      <div style="display: flex; align-items: center; gap: 12px;">
        <span class="badge ${profile.type === 'head' ? 'badge-head' : 'badge-member'}">${profile.type}</span>
        <button id="edit-intern-btn" class="btn-capsule btn-secondary btn-sm" style="display: inline-flex; align-items: center; gap: 6px;">✏️ Edit Details</button>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="admin-user-grid">
      <!-- Left Column: Log and Stats -->
      <div>
        <div class="card mb-3">
          <h3 class="mb-2" style="font-size: 20px;">Progress towards Certificate</h3>
          <div class="progress-bar-wrapper" style="height: 12px;">
            <div class="progress-bar-fill" style="width: ${progressPercent}%; background-color: ${barColor};"></div>
          </div>
          <div class="progress-text" style="margin-top: 12px;">
            <span>Total Points: <strong>${profile.points_total}</strong> / ${threshold} pts</span>
            <span>Available Balance: <strong>${profile.points_available} pts</strong></span>
            <span>Spent Balance: <strong>${profile.points_redeemed} pts</strong></span>
          </div>
        </div>

        <h3 class="mb-2">Point History</h3>
        ${logsHtml}
      </div>

      <!-- Right Column: Single / Bulk Point Entry Form -->
      <div>
        <div class="card" style="margin-bottom: 24px;">
          <!-- Tabs Navigation -->
          <div style="display: flex; gap: 8px; border-bottom: 1px solid var(--color-card-border); padding-bottom: 12px; margin-bottom: 20px;">
            <button id="tab-single-btn" class="btn-capsule btn-primary btn-sm" style="flex: 1;">Single Award</button>
            <button id="tab-bulk-btn" class="btn-capsule btn-secondary btn-sm" style="flex: 1;">Bulk Categories</button>
          </div>

          <!-- TAB 1: SINGLE ENTRY FORM -->
          <div id="tab-single-content">
            <h3 class="mb-2" style="font-size: 20px;">Award Single Activity</h3>
            <p class="mb-3" style="font-size: 13px; color: var(--color-text-muted);">Manually add an activity record to this intern's history.</p>

            <form id="add-points-form">
              <div class="form-group">
                <label class="form-label" for="manual-activity">Activity Name</label>
                <select id="manual-activity" class="select-field" required>
                  <option value="" data-points="0">-- Select Activity --</option>
                  <option value="Attending a weekly meeting" data-points="3">Attending a weekly meeting (+3)</option>
                  <option value="Engaging in a group activity" data-points="3">Engaging in a group activity (+3)</option>
                  <option value="Social Media Engagement" data-points="2">Social Media Engagement (+2)</option>
                  <option value="Taking initiative" data-points="2">Taking initiative (+2)</option>
                  <option value="Attending an offline meeting" data-points="20">Attending an offline meeting (+20)</option>
                  <option value="Completing tasks" data-points="50">Completing tasks (+Varies)</option>
                  <optgroup label="All-of-YWP Meeting Variants">
                    <option value="Attending an All-of-YWP Meeting" data-points="5" data-note="Present throughout + camera on + interactive">All-of-YWP Meeting (5 pts: Camera on, interactive)</option>
                    <option value="Attending an All-of-YWP Meeting" data-points="4" data-note="Present throughout + interactive, camera off">All-of-YWP Meeting (4 pts: Camera off, interactive)</option>
                    <option value="Attending an All-of-YWP Meeting" data-points="3" data-note="Present throughout + camera on, less interactive">All-of-YWP Meeting (3 pts: Camera on, less interactive)</option>
                    <option value="Attending an All-of-YWP Meeting" data-points="2" data-note="Present throughout, camera off, not interactive">All-of-YWP Meeting (2 pts: Camera off, not interactive)</option>
                    <option value="Attending an All-of-YWP Meeting" data-points="1" data-note="Present for at least half the meeting, camera off, not interactive">All-of-YWP Meeting (1 pt: Half meeting attendance)</option>
                  </optgroup>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="manual-points">Points to Award</label>
                <input type="number" id="manual-points" class="input-field" value="0" min="-1000" max="1000" required>
              </div>

              <div class="form-group">
                <label class="form-label" for="manual-note">Optional Note / Task Description</label>
                <textarea id="manual-note" class="input-field" rows="2" placeholder="Describe the task complexity or sync details..."></textarea>
              </div>

              <button type="submit" class="btn-capsule btn-primary" style="width: 100%;">Add Log Entry</button>
            </form>
          </div>

          <!-- TAB 2: BULK ENTRY FORM -->
          <div id="tab-bulk-content" style="display: none;">
            <h3 class="mb-2" style="font-size: 20px;">Bulk Award Categories</h3>
            <p class="mb-3" style="font-size: 13px; color: var(--color-text-muted);">Enter counts or points for multiple activities to add them all at once.</p>

            <form id="bulk-points-form">
              <!-- Weekly Meeting Multiplier -->
              <div class="form-group" style="border-bottom: 1px solid var(--color-card-border); padding-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <label class="form-label" style="margin: 0;">Weekly Meetings</label>
                    <span style="font-size: 12px; color: var(--color-text-muted);">3 pts each</span>
                  </div>
                  <input type="number" id="bulk-weekly-meetings" class="input-field" value="0" min="0" max="50" style="width: 80px; padding: 6px 12px;">
                </div>
              </div>

              <!-- Group Activity Multiplier -->
              <div class="form-group" style="border-bottom: 1px solid var(--color-card-border); padding-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <label class="form-label" style="margin: 0;">Group Activities</label>
                    <span style="font-size: 12px; color: var(--color-text-muted);">3 pts each</span>
                  </div>
                  <input type="number" id="bulk-group-activities" class="input-field" value="0" min="0" max="50" style="width: 80px; padding: 6px 12px;">
                </div>
              </div>

              <!-- Social Media Engagement Multiplier -->
              <div class="form-group" style="border-bottom: 1px solid var(--color-card-border); padding-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <label class="form-label" style="margin: 0;">Social Media Engagements</label>
                    <span style="font-size: 12px; color: var(--color-text-muted);">2 pts each</span>
                  </div>
                  <input type="number" id="bulk-social-media" class="input-field" value="0" min="0" max="50" style="width: 80px; padding: 6px 12px;">
                </div>
              </div>

              <!-- Initiative Multiplier -->
              <div class="form-group" style="border-bottom: 1px solid var(--color-card-border); padding-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <label class="form-label" style="margin: 0;">Initiatives Taken</label>
                    <span style="font-size: 12px; color: var(--color-text-muted);">2 pts each</span>
                  </div>
                  <input type="number" id="bulk-initiatives" class="input-field" value="0" min="0" max="50" style="width: 80px; padding: 6px 12px;">
                </div>
              </div>

              <!-- Offline Meetings Multiplier -->
              <div class="form-group" style="border-bottom: 1px solid var(--color-card-border); padding-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <label class="form-label" style="margin: 0;">Offline Meetings</label>
                    <span style="font-size: 12px; color: var(--color-text-muted);">20 pts each</span>
                  </div>
                  <input type="number" id="bulk-offline-meetings" class="input-field" value="0" min="0" max="50" style="width: 80px; padding: 6px 12px;">
                </div>
              </div>

              <!-- All-of-YWP Meeting -->
              <div class="form-group" style="border-bottom: 1px solid var(--color-card-border); padding-bottom: 12px;">
                <div style="display: flex; justify-content: flex-start; align-items: flex-start; flex-direction: column; gap: 8px;">
                  <div>
                    <label class="form-label" style="margin: 0;">All-of-YWP Meeting Attendance</label>
                    <span style="font-size: 12px; color: var(--color-text-muted);">Select participation variant</span>
                  </div>
                  <select id="bulk-all-ywp" class="select-field" style="width: 100%; padding: 8px 12px; font-size: 13px;">
                    <option value="0">None (0 pts)</option>
                    <option value="5">5 pts - Present throughout + camera on + interactive</option>
                    <option value="4">4 pts - Present throughout + interactive, camera off</option>
                    <option value="3">3 pts - Present throughout + camera on, less interactive</option>
                    <option value="2">2 pts - Present throughout, camera off, not interactive</option>
                    <option value="1">1 pt - Present for at least half the meeting, camera off, not interactive</option>
                  </select>
                </div>
              </div>

              <!-- Custom Task Section -->
              <div class="form-group" style="margin-top: 16px;">
                <label class="form-label">Add Dynamic Task Points</label>
                <div style="display: flex; gap: 12px; margin-bottom: 8px;">
                  <input type="number" id="bulk-custom-points" class="input-field" placeholder="Pts (e.g. 45)" min="-500" max="1000" style="flex: 1;">
                  <input type="text" id="bulk-custom-note" class="input-field" placeholder="Task details/note..." style="flex: 2;">
                </div>
              </div>

              <!-- Live Total Counter Card -->
              <div class="card" style="background-color: var(--color-bg); padding: 14px 16px; margin: 20px 0 16px; text-align: center; border-color: var(--color-accent-terracotta);">
                <span style="font-size: 13px; font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Total Points To Be Awarded</span>
                <div id="bulk-total-counter" style="font-family: var(--font-heading); font-size: 32px; font-weight: 700; color: var(--color-accent-terracotta); margin-top: 4px;">
                  0 pts
                </div>
              </div>

              <button type="submit" class="btn-capsule btn-primary" style="width: 100%; margin-top: 8px;">Bulk Award Points</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;

  // Tabs Logic
  const tabSingleBtn = container.querySelector('#tab-single-btn');
  const tabBulkBtn = container.querySelector('#tab-bulk-btn');
  const tabSingleContent = container.querySelector('#tab-single-content');
  const tabBulkContent = container.querySelector('#tab-bulk-content');

  tabSingleBtn.addEventListener('click', () => {
    tabSingleBtn.className = 'btn-capsule btn-primary btn-sm';
    tabBulkBtn.className = 'btn-capsule btn-secondary btn-sm';
    tabSingleContent.style.display = 'block';
    tabBulkContent.style.display = 'none';
  });

  tabBulkBtn.addEventListener('click', () => {
    tabBulkBtn.className = 'btn-capsule btn-primary btn-sm';
    tabSingleBtn.className = 'btn-capsule btn-secondary btn-sm';
    tabBulkContent.style.display = 'block';
    tabSingleContent.style.display = 'none';
  });

  // Pre-fill points when activity changes in Single Award
  const actSelect = container.querySelector('#manual-activity');
  const ptsInput = container.querySelector('#manual-points');
  actSelect.addEventListener('change', () => {
    const selectedOption = actSelect.options[actSelect.selectedIndex];
    const points = selectedOption.getAttribute('data-points') || 0;
    ptsInput.value = points;
  });

  // Submit Single points form
  const form = container.querySelector('#add-points-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const activity = actSelect.value;
    const points = Number(ptsInput.value);
    const note = container.querySelector('#manual-note').value;

    if (!activity) {
      showToast('Please select an activity.', 'error');
      return;
    }

    try {
      showToast('Adding log entry...', 'info');
      await dbService.addPointEntry(userId, activity, points, note);
      showToast('Points log updated successfully!', 'success');
      window.location.reload();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  // Submit Bulk points form
  const bulkForm = container.querySelector('#bulk-points-form');
  const bulkTotalCounter = container.querySelector('#bulk-total-counter');

  const updateBulkTotal = () => {
    const weeklyCount = Number(container.querySelector('#bulk-weekly-meetings').value) || 0;
    const groupCount = Number(container.querySelector('#bulk-group-activities').value) || 0;
    const socialCount = Number(container.querySelector('#bulk-social-media').value) || 0;
    const initiativeCount = Number(container.querySelector('#bulk-initiatives').value) || 0;
    const offlineCount = Number(container.querySelector('#bulk-offline-meetings').value) || 0;
    const allYwpPts = Number(container.querySelector('#bulk-all-ywp').value) || 0;
    const customPts = Number(container.querySelector('#bulk-custom-points').value) || 0;

    const total = (weeklyCount * 3) + (groupCount * 3) + (socialCount * 2) + (initiativeCount * 2) + (offlineCount * 20) + allYwpPts + customPts;
    
    if (bulkTotalCounter) {
      bulkTotalCounter.textContent = `${total > 0 ? '+' : ''}${total} pts`;
      bulkTotalCounter.style.color = total > 0 ? 'var(--color-accent-green)' : (total < 0 ? '#D32F2F' : 'var(--color-accent-terracotta)');
    }
  };

  bulkForm.addEventListener('input', updateBulkTotal);
  bulkForm.addEventListener('change', updateBulkTotal);

  bulkForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Gather inputs
    const weeklyCount = Number(container.querySelector('#bulk-weekly-meetings').value);
    const groupCount = Number(container.querySelector('#bulk-group-activities').value);
    const socialCount = Number(container.querySelector('#bulk-social-media').value);
    const initiativeCount = Number(container.querySelector('#bulk-initiatives').value);
    const offlineCount = Number(container.querySelector('#bulk-offline-meetings').value);
    const allYwpPts = Number(container.querySelector('#bulk-all-ywp').value);
    const customPts = container.querySelector('#bulk-custom-points').value;
    const customNote = container.querySelector('#bulk-custom-note').value;

    const entriesToAward = [];

    if (weeklyCount > 0) {
      entriesToAward.push({
        activity: 'Attending weekly meetings (Bulk)',
        points: weeklyCount * 3,
        note: `Attended ${weeklyCount} weekly meeting(s)`
      });
    }

    if (groupCount > 0) {
      entriesToAward.push({
        activity: 'Engaging in group activities (Bulk)',
        points: groupCount * 3,
        note: `Participated in ${groupCount} group activity(ies)`
      });
    }

    if (socialCount > 0) {
      entriesToAward.push({
        activity: 'Social Media Engagement (Bulk)',
        points: socialCount * 2,
        note: `Completed ${socialCount} comment/repost engagement(s)`
      });
    }

    if (initiativeCount > 0) {
      entriesToAward.push({
        activity: 'Taking initiative (Bulk)',
        points: initiativeCount * 2,
        note: `Demonstrated initiative on ${initiativeCount} occasion(s)`
      });
    }

    if (offlineCount > 0) {
      entriesToAward.push({
        activity: 'Attending offline meetings (Bulk)',
        points: offlineCount * 20,
        note: `Attended ${offlineCount} offline meeting(s)`
      });
    }

    if (allYwpPts > 0) {
      entriesToAward.push({
        activity: 'Attending an All-of-YWP meeting',
        points: allYwpPts,
        note: `Bulk updated All-YWP participation grade`
      });
    }

    if (customPts) {
      entriesToAward.push({
        activity: 'Completing tasks',
        points: Number(customPts),
        note: customNote || 'Dynamic task points awarded'
      });
    }

    if (entriesToAward.length === 0) {
      showToast('No point categories selected to award.', 'error');
      return;
    }

    try {
      showToast(`Awarding ${entriesToAward.length} entries...`, 'info');
      // Award each entry sequentially
      for (const entry of entriesToAward) {
        await dbService.addPointEntry(userId, entry.activity, entry.points, entry.note);
      }
      showToast('All point categories updated successfully!', 'success');
      window.location.reload();
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  // Handle Edit Details modal opening
  const editBtn = container.querySelector('#edit-intern-btn');
  editBtn.addEventListener('click', () => {
    showModal({
      title: '✏️ Edit Intern Details',
      content: `
        <form id="modal-edit-form" style="display: flex; flex-direction: column; gap: 12px; margin-top: 8px;">
          <div>
            <label class="form-label">Full Name</label>
            <input type="text" id="edit-name" class="input-field" value="${profile.name || ''}" required>
          </div>
          <div>
            <label class="form-label">Email Address</label>
            <input type="email" id="edit-email" class="input-field" value="${profile.email || ''}" placeholder="e.g. name@ywp.org">
          </div>
          <div>
            <label class="form-label">Department</label>
            <select id="edit-dept" class="select-field" required>
              <option value="HR Department" ${profile.department === 'HR Department' ? 'selected' : ''}>HR Department</option>
              <option value="Research & Development" ${profile.department === 'Research & Development' ? 'selected' : ''}>Research & Development</option>
              <option value="Corporate Wellbeing" ${profile.department === 'Corporate Wellbeing' ? 'selected' : ''}>Corporate Wellbeing</option>
              <option value="Help Team (Peer Support)" ${profile.department === 'Help Team (Peer Support)' ? 'selected' : ''}>Help Team (Peer Support)</option>
              <option value="Communications Team" ${profile.department === 'Communications Team' ? 'selected' : ''}>Communications Team</option>
              <option value="Heads" ${profile.department === 'Heads' ? 'selected' : ''}>Heads</option>
              <option value="Psychologist" ${profile.department === 'Psychologist' ? 'selected' : ''}>Psychologist</option>
            </select>
          </div>
          <div>
            <label class="form-label">Tenure Role Type</label>
            <select id="edit-type" class="select-field" required>
              <option value="member" ${profile.type === 'member' ? 'selected' : ''}>General Member (150 pt threshold)</option>
              <option value="head" ${profile.type === 'head' ? 'selected' : ''}>Department Head (200 pt threshold)</option>
            </select>
          </div>
          <div style="display: flex; gap: 12px;">
            <div style="flex: 1;">
              <label class="form-label">Tenure Start Date</label>
              <input type="date" id="edit-start" class="input-field" value="${profile.tenure_start || '2026-07-01'}" required>
            </div>
            <div style="flex: 1;">
              <label class="form-label">Tenure End Date</label>
              <input type="date" id="edit-end" class="input-field" value="${profile.tenure_end || '2026-12-31'}" required>
            </div>
          </div>
        </form>
      `,
      confirmText: 'Save Changes',
      onConfirm: async () => {
        const name = document.querySelector('#edit-name').value.trim();
        const email = document.querySelector('#edit-email').value.trim();
        const department = document.querySelector('#edit-dept').value;
        const type = document.querySelector('#edit-type').value;
        const tenure_start = document.querySelector('#edit-start').value;
        const tenure_end = document.querySelector('#edit-end').value;

        if (!name) {
          showToast('Name is required.', 'error');
          return;
        }

        try {
          showToast('Saving changes...', 'info');
          await dbService.updateIntern(userId, {
            name,
            email,
            department,
            type,
            tenure_start,
            tenure_end
          });
          showToast('Intern details updated successfully!', 'success');
          window.location.reload();
        } catch (err) {
          showToast(err.message, 'error');
        }
      }
    });
  });

  return container;
}
