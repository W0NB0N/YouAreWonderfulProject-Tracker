import { dbService } from '../firebase.js';
import { showToast } from '../components/toast.js';
import { showModal } from '../components/modal.js';

export async function renderAdminPage() {
  const container = document.createElement('div');
  container.className = 'container page-fade-in';

  // Fetch interns list and merch orders list
  let interns = await dbService.getInterns();
  let orders = await dbService.getAllOrders();

  const renderTable = (filteredInterns) => {
    if (filteredInterns.length === 0) {
      return `<tr><td colspan="6" class="text-center" style="color: var(--color-text-muted);">No interns match search filters.</td></tr>`;
    }

    return filteredInterns.map(intern => {
      const threshold = intern.type === 'head' ? 200 : 150;
      const pct = Math.min(100, Math.round((intern.points_total / threshold) * 100));
      return `
        <tr class="intern-row" data-uid="${intern.uid}" style="cursor: pointer;">
          <td style="font-weight: 600; color: var(--color-text-heading);">${intern.name}</td>
          <td>${intern.department}</td>
          <td><span class="badge ${intern.type === 'head' ? 'badge-head' : 'badge-member'}">${intern.type}</span></td>
          <td style="font-weight: 700; color: var(--color-accent-blue);">${intern.points_total}</td>
          <td style="font-weight: 700; color: var(--color-accent-terracotta);">${intern.points_available}</td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <div class="progress-bar-wrapper" style="width: 80px; margin: 0; height: 6px;">
                <div class="progress-bar-fill" style="width: ${pct}%; background-color: ${pct >= 100 ? 'var(--color-accent-green)' : 'var(--color-accent-mauve)'};"></div>
              </div>
              <span style="font-size: 12px; font-weight: 600;">${pct}%</span>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  };

  const renderOrdersList = (ordersList) => {
    if (!ordersList || ordersList.length === 0) {
      return `<p style="color: var(--color-text-muted); font-size: 13px; padding: 16px 0;">No merch redemptions placed yet.</p>`;
    }

    return ordersList.map(order => {
      const itemNames = (order.items || []).map(i => i.name).join(', ') || 'Merch Item';
      const dateStr = order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Recent';
      const isFulfilled = order.status === 'fulfilled';

      return `
        <div style="padding: 12px 0; border-bottom: 1px solid var(--color-card-border); display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
          <div>
            <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 2px; color: var(--color-text-heading);">${itemNames}</h4>
            <p style="font-size: 12px; color: var(--color-text-muted); margin: 0;">
              Ordered by <strong>${order.userName}</strong> &bull; ${dateStr}
            </p>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 700; font-size: 13px; color: var(--color-accent-terracotta); margin-bottom: 4px;">
              -${order.total_points} pts
            </div>
            <span class="badge ${isFulfilled ? 'badge-member' : 'badge-head'}" style="font-size: 10px; padding: 2px 6px;">
              ${isFulfilled ? 'Fulfilled' : 'Pending'}
            </span>
          </div>
        </div>
      `;
    }).join('');
  };

  const departments = [...new Set(interns.map(i => i.department))];

  container.innerHTML = `
    <div class="admin-header-block">
      <div>
        <h2>Organization Database</h2>
        <p style="color: var(--color-text-muted);">Track performance logs, record attendance, and manage volunteer points.</p>
      </div>
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <button id="add-event-btn" class="btn-capsule btn-primary">+ Add Batch Attendance</button>
        <button id="create-intern-btn" class="btn-capsule btn-primary">+ Create Intern Account</button>
      </div>
    </div>

    <!-- Filters & Action Bar -->
    <div class="card mb-3" style="padding: 20px;">
      <div class="admin-actions">
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input type="text" id="admin-search" class="input-field" placeholder="Search interns by name/email...">
        </div>

        <select id="admin-dept-filter" class="select-field" style="max-width: 220px;">
          <option value="">All Departments</option>
          ${departments.map(d => `<option value="${d}">${d}</option>`).join('')}
        </select>

        <select id="admin-sort" class="select-field" style="max-width: 220px;">
          <option value="points-desc">Points: High to Low</option>
          <option value="points-asc">Points: Low to High</option>
          <option value="name-asc">Alphabetical: A to Z</option>
        </select>
      </div>
    </div>

    <!-- Main Layout: Table + Orders List Card -->
    <div style="display: grid; grid-template-columns: 2.2fr 1fr; gap: 32px; align-items: start;">
      <div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Department</th>
                <th>Tenure Role</th>
                <th>Total Pts</th>
                <th>Available Pts</th>
                <th>Cert Progress</th>
              </tr>
            </thead>
            <tbody id="interns-table-body">
              ${renderTable(interns)}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right Column: Merch Store Orders List Card -->
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <h3 style="font-size: 18px; margin: 0;">🛍️ Merch Redemptions</h3>
          <span style="font-size: 12px; color: var(--color-text-muted); font-weight: 600;">Total: ${orders.length}</span>
        </div>
        <p style="font-size: 13px; color: var(--color-text-muted); margin-bottom: 16px;">
          Live feed of merchandise orders placed by interns using earned points.
        </p>

        <div id="orders-list-container" style="max-height: 480px; overflow-y: auto; padding-right: 4px;">
          ${renderOrdersList(orders)}
        </div>
      </div>
    </div>
  `;

  // Attach search/filter logic
  const searchInput = container.querySelector('#admin-search');
  const deptFilter = container.querySelector('#admin-dept-filter');
  const sortSelect = container.querySelector('#admin-sort');
  const tableBody = container.querySelector('#interns-table-body');

  const updateTableData = () => {
    let filtered = [...interns];
    const searchVal = searchInput.value.toLowerCase().trim();
    const deptVal = deptFilter.value;
    const sortVal = sortSelect.value;

    if (searchVal) {
      filtered = filtered.filter(i => 
        i.name.toLowerCase().includes(searchVal) || 
        i.email.toLowerCase().includes(searchVal)
      );
    }

    if (deptVal) {
      filtered = filtered.filter(i => i.department === deptVal);
    }

    if (sortVal === 'points-desc') {
      filtered.sort((a, b) => b.points_total - a.points_total);
    } else if (sortVal === 'points-asc') {
      filtered.sort((a, b) => a.points_total - b.points_total);
    } else if (sortVal === 'name-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    tableBody.innerHTML = renderTable(filtered);
  };

  searchInput.addEventListener('input', updateTableData);
  deptFilter.addEventListener('change', updateTableData);
  sortSelect.addEventListener('change', updateTableData);

  // Click row to navigate to details
  container.addEventListener('click', (e) => {
    const row = e.target.closest('.intern-row');
    if (row && !e.target.closest('button') && !e.target.closest('input')) {
      const uid = row.getAttribute('data-uid');
      window.location.hash = `admin/user/${uid}`;
    }
  });

  // Top Header "+ Add Batch Attendance" Button
  const addEventTopBtn = container.querySelector('#add-event-btn');
  addEventTopBtn.addEventListener('click', () => {
    showEventModal(interns, async () => {
      interns = await dbService.getInterns();
      orders = await dbService.getAllOrders();
      updateTableData();
      container.querySelector('#orders-list-container').innerHTML = renderOrdersList(orders);
    });
  });

  // Create Intern Modal Dialog
  const createBtn = container.querySelector('#create-intern-btn');
  createBtn.addEventListener('click', () => {
    showModal({
      title: 'Create Intern Account',
      content: `
        <form id="modal-create-form" style="display: flex; flex-direction: column; gap: 12px; margin-top: 8px;">
          <div>
            <label class="form-label">Full Name</label>
            <input type="text" id="new-name" class="input-field" placeholder="e.g. Tanya Sen" required>
          </div>
          <div>
            <label class="form-label">Email Address</label>
            <input type="email" id="new-email" class="input-field" placeholder="e.g. tanya@ywp.org" required>
          </div>
          <div>
            <label class="form-label">Department</label>
            <select id="new-dept" class="select-field" required>
              <option value="Content Team">Content Team</option>
              <option value="Design Team">Design Team</option>
              <option value="Help Team (Peer Support)">Help Team (Peer Support)</option>
              <option value="Creative Team">Creative Team</option>
              <option value="Communications Team">Communications Team</option>
              <option value="Research & Development">Research & Development</option>
            </select>
          </div>
          <div>
            <label class="form-label">Tenure Role Type</label>
            <select id="new-type" class="select-field" required>
              <option value="member">General Member (150 pt threshold)</option>
              <option value="head">Department Head (200 pt threshold)</option>
            </select>
          </div>
          <div style="display: flex; gap: 12px;">
            <div style="flex: 1;">
              <label class="form-label">Tenure Start Date</label>
              <input type="date" id="new-start" class="input-field" value="2026-07-01" required>
            </div>
            <div style="flex: 1;">
              <label class="form-label">Tenure End Date</label>
              <input type="date" id="new-end" class="input-field" value="2026-12-31" required>
            </div>
          </div>
        </form>
      `,
      confirmText: 'Create Account',
      onConfirm: async () => {
        const name = document.querySelector('#new-name').value;
        const email = document.querySelector('#new-email').value;
        const department = document.querySelector('#new-dept').value;
        const type = document.querySelector('#new-type').value;
        const tenure_start = document.querySelector('#new-start').value;
        const tenure_end = document.querySelector('#new-end').value;

        try {
          showToast('Creating intern account...', 'info');
          await dbService.createIntern({
            name,
            email,
            department,
            type,
            tenure_start,
            tenure_end
          });
          showToast(`Intern account created successfully!`, 'success');
          interns = await dbService.getInterns();
          updateTableData();
        } catch (err) {
          showToast(err.message, 'error');
        }
      }
    });
  });

  return container;
}

// Dedicated Event Attendance Modal Helper
function showEventModal(internsList, onDone) {
  const departments = [...new Set(internsList.map(i => i.department))];

  const renderModalCheckboxes = (list) => {
    return list.map(intern => `
      <label style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; background-color: var(--color-bg); border: 1px solid var(--color-card-border); border-radius: var(--radius-sm); margin-bottom: 6px; cursor: pointer;">
        <input type="checkbox" class="modal-event-checkbox" value="${intern.uid}" style="width: 16px; height: 16px; accent-color: var(--color-accent-terracotta);">
        <div style="flex: 1; font-size: 13px;">
          <span style="font-weight: 600; color: var(--color-text-heading);">${intern.name}</span>
          <span style="color: var(--color-text-muted); font-size: 12px; margin-left: 6px;">(${intern.department})</span>
        </div>
        <span class="badge ${intern.type === 'head' ? 'badge-head' : 'badge-member'}" style="font-size: 10px;">${intern.type}</span>
      </label>
    `).join('');
  };

  showModal({
    title: '📅 Add Batch Attendance & Event',
    content: `
      <form id="modal-event-form" style="display: flex; flex-direction: column; gap: 12px; margin-top: 8px;">
        <div>
          <label class="form-label">Event / Meeting Title</label>
          <input type="text" id="modal-event-title" class="input-field" placeholder="e.g. All-Hands Delhi Offline Meet / Weekly Sync" required>
        </div>

        <div style="display: flex; gap: 12px;">
          <div style="flex: 1.5;">
            <label class="form-label">Activity Metric</label>
            <select id="modal-event-activity" class="select-field" required>
              <option value="Attending an offline meeting" data-points="20" selected>Attending an offline meeting (+20)</option>
              <option value="Attending a weekly meeting" data-points="3">Attending a weekly meeting (+3)</option>
              <option value="Engaging in a group activity" data-points="3">Engaging in a group activity (+3)</option>
              <option value="Social Media Engagement" data-points="2">Social Media Engagement (+2)</option>
              <option value="Taking initiative" data-points="2">Taking initiative (+2)</option>
              <option value="Completing tasks" data-points="15">Completing tasks (+Varies)</option>
              <optgroup label="All-of-YWP Meeting Variants">
                <option value="Attending an All-of-YWP Meeting" data-points="5" data-note="Present throughout + camera on + interactive">All-of-YWP Meeting (5 pts: Camera on, interactive)</option>
                <option value="Attending an All-of-YWP Meeting" data-points="4" data-note="Present throughout + interactive, camera off">All-of-YWP Meeting (4 pts: Camera off, interactive)</option>
                <option value="Attending an All-of-YWP Meeting" data-points="3" data-note="Present throughout + camera on, less interactive">All-of-YWP Meeting (3 pts: Camera on, less interactive)</option>
                <option value="Attending an All-of-YWP Meeting" data-points="2" data-note="Present throughout, camera off, not interactive">All-of-YWP Meeting (2 pts: Camera off, not interactive)</option>
                <option value="Attending an All-of-YWP Meeting" data-points="1" data-note="Present for at least half the meeting, camera off, not interactive">All-of-YWP Meeting (1 pt: Half meeting attendance)</option>
              </optgroup>
            </select>
          </div>
          <div style="flex: 1;">
            <label class="form-label">Points per Attendee</label>
            <input type="number" id="modal-event-points" class="input-field" value="20" required>
          </div>
        </div>

        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <label class="form-label" style="margin: 0;">Mark Attending Interns</label>
            <div style="display: flex; gap: 6px;">
              <button type="button" id="modal-select-all" class="btn-capsule btn-secondary btn-sm" style="font-size: 11px; padding: 2px 8px;">Select All</button>
              <button type="button" id="modal-clear-all" class="btn-capsule btn-secondary btn-sm" style="font-size: 11px; padding: 2px 8px;">Clear</button>
            </div>
          </div>

          <div style="display: flex; gap: 8px; margin-bottom: 8px;">
            <input type="text" id="modal-filter-search" class="input-field" placeholder="Filter interns..." style="padding: 6px 12px; font-size: 12px;">
            <select id="modal-filter-dept" class="select-field" style="padding: 6px 12px; font-size: 12px; width: 160px;">
              <option value="">All Depts</option>
              ${departments.map(d => `<option value="${d}">${d}</option>`).join('')}
            </select>
          </div>

          <div id="modal-checkbox-list" style="max-height: 200px; overflow-y: auto; padding-right: 4px;">
            ${renderModalCheckboxes(internsList)}
          </div>
        </div>

        <div style="background-color: var(--color-bg); padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--color-card-border); text-align: center; font-size: 13px;">
          Selected: <strong id="modal-sel-cnt" style="color: var(--color-accent-blue);">0</strong> interns &bull; 
          Total: <strong id="modal-tot-pts" style="color: var(--color-accent-terracotta);">0</strong> pts
        </div>
      </form>
    `,
    confirmText: 'Record Event & Award Points',
    onConfirm: async () => {
      const title = document.querySelector('#modal-event-title').value.trim();
      const activity = document.querySelector('#modal-event-activity').value;
      const points = Number(document.querySelector('#modal-event-points').value);
      const checkedBoxes = Array.from(document.querySelectorAll('.modal-event-checkbox:checked')).map(cb => cb.value);

      if (!title) {
        showToast('Please enter an event title.', 'error');
        return;
      }
      if (checkedBoxes.length === 0) {
        showToast('Please select at least one intern who attended.', 'error');
        return;
      }

      try {
        showToast(`Awarding ${points} pts to ${checkedBoxes.length} interns...`, 'info');
        await dbService.addEventPoints(checkedBoxes, activity, points, title);
        showToast(`Event "${title}" recorded! ${points} pts awarded to ${checkedBoxes.length} interns.`, 'success');
        if (onDone) onDone();
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  });

  // Attach dynamic calculation listeners inside modal
  setTimeout(() => {
    const actSelect = document.querySelector('#modal-event-activity');
    const ptsInput = document.querySelector('#modal-event-points');
    const selCnt = document.querySelector('#modal-sel-cnt');
    const totPts = document.querySelector('#modal-tot-pts');
    const listContainer = document.querySelector('#modal-checkbox-list');
    const filterSearch = document.querySelector('#modal-filter-search');
    const filterDept = document.querySelector('#modal-filter-dept');

    const updateCalc = () => {
      const checked = document.querySelectorAll('.modal-event-checkbox:checked').length;
      const pts = Number(ptsInput.value) || 0;
      if (selCnt) selCnt.textContent = checked;
      if (totPts) totPts.textContent = checked * pts;
    };

    if (actSelect) {
      actSelect.addEventListener('change', () => {
        const selected = actSelect.options[actSelect.selectedIndex];
        ptsInput.value = selected.getAttribute('data-points') || 3;
        updateCalc();
      });
    }

    if (ptsInput) ptsInput.addEventListener('input', updateCalc);

    if (listContainer) {
      listContainer.addEventListener('change', updateCalc);
    }

    document.querySelector('#modal-select-all')?.addEventListener('click', () => {
      document.querySelectorAll('.modal-event-checkbox').forEach(cb => cb.checked = true);
      updateCalc();
    });

    document.querySelector('#modal-clear-all')?.addEventListener('click', () => {
      document.querySelectorAll('.modal-event-checkbox').forEach(cb => cb.checked = false);
      updateCalc();
    });

    const applyFilter = () => {
      const search = (filterSearch.value || "").toLowerCase();
      const dept = filterDept.value;
      const filtered = internsList.filter(i => {
        const matchSearch = i.name.toLowerCase().includes(search) || i.email.toLowerCase().includes(search);
        const matchDept = !dept || i.department === dept;
        return matchSearch && matchDept;
      });
      listContainer.innerHTML = renderModalCheckboxes(filtered);
      updateCalc();
    };

    filterSearch?.addEventListener('input', applyFilter);
    filterDept?.addEventListener('change', applyFilter);
  }, 50);
}
