export function renderLandingPage() {
  return `
    <div class="page-fade-in">
      <!-- HERO SECTION -->
      <section class="landing-hero container" style="padding: 80px 0 60px;">
        <div class="hero-tagline">Volunteer & Intern Portal<span class="logo-semicolon">;</span></div>
        <h1 style="font-size: 52px; max-width: 860px; margin: 0 auto 20px; line-height: 1.15;">
          You're Wonderful Project<br><span style="font-style: italic; color: var(--color-accent-terracotta);">Wonder Points System;</span>
        </h1>
        <p class="hero-subtitle" style="font-size: 18px; max-width: 680px; margin-bottom: 32px;">
          Track your contributions, earn rewards, check certificate eligibility, and view performance logs in our unified volunteer point system.
        </p>
        <div class="hero-ctas">
          <a href="#login" class="btn-capsule btn-primary">Volunteer Portal Sign-In</a>
        </div>
      </section>

      <!-- FULL WONDER POINTS SYSTEM SECTION -->
      <section id="wonder-points" class="section-padding" style="background-color: #FFFDFB; border-top: 1px solid var(--color-card-border); border-bottom: 1px solid var(--color-card-border); padding: 60px 0;">
        <div class="container">
          <!-- 1. What is the Wonder Points System? -->
          <div style="text-align: center; margin-bottom: 48px;">
            <span class="badge badge-head mb-1">Volunteer Evaluation & Recognition</span>
            <h2 style="font-size: 40px; font-family: var(--font-heading); margin-bottom: 16px;">The Wonder Points System</h2>
            <p style="color: var(--color-text-muted); max-width: 760px; margin: 0 auto; font-size: 16px; line-height: 1.6;">
              Wonder Points is YWP's way of recognizing and rewarding the effort you put in. Every time you show up, engage, complete tasks, or go above and beyond, you earn points. Real contribution should be visible.
            </p>
          </div>

          <!-- 2. Why Does This Matter For You? (Benefits Grid) -->
          <div style="margin-bottom: 60px;">
            <h3 style="font-size: 26px; text-align: center; margin-bottom: 32px;">Why Does This Matter For You?</h3>
            
            <div class="programs-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
              <div class="card">
                <span class="badge badge-member mb-1">Tenure Milestone</span>
                <h4 style="font-size: 18px; margin-bottom: 8px;">📜 Certificate of Completion</h4>
                <p style="font-size: 13px; color: var(--color-text-muted); line-height: 1.6;">
                  Reach the minimum point threshold during your 6-month tenure to earn your official Certificate of Completion signed by co-founders.
                </p>
              </div>

              <div class="card">
                <span class="badge badge-head mb-1">1 Point = ₹1</span>
                <h4 style="font-size: 18px; margin-bottom: 8px;">🎁 Merch Rewards</h4>
                <p style="font-size: 13px; color: var(--color-text-muted); line-height: 1.6;">
                  Every point earned above your minimum threshold can be redeemed for official YWP merchandise at the rate of <strong>1 Wonder Point = ₹1</strong>.
                </p>
              </div>

              <div class="card">
                <span class="badge badge-hr mb-1">Performance Review</span>
                <h4 style="font-size: 18px; margin-bottom: 8px;">📊 Quantitative Evaluation</h4>
                <p style="font-size: 13px; color: var(--color-text-muted); line-height: 1.6;">
                  Points are used as a transparent metric during internal performance assessments, feedback sessions, and reviews.
                </p>
              </div>

              <div class="card">
                <span class="badge badge-member mb-1">Role Advancement</span>
                <h4 style="font-size: 18px; margin-bottom: 8px;">💼 Role & Compensation</h4>
                <p style="font-size: 13px; color: var(--color-text-muted); line-height: 1.6;">
                  When applying for Department Head positions, core team roles, or paid stipend compensations, your points record is considered.
                </p>
              </div>

              <div class="card">
                <span class="badge badge-head mb-1">Alumni Network</span>
                <h4 style="font-size: 18px; margin-bottom: 8px;">⚡ Recruitment Advantage</h4>
                <p style="font-size: 13px; color: var(--color-text-muted); line-height: 1.6;">
                  When internal or alumni candidates apply for future YWP roles, your points history proves your work ethic and reliability.
                </p>
              </div>

              <div class="card">
                <span class="badge badge-hr mb-1">Official LOR</span>
                <h4 style="font-size: 18px; margin-bottom: 8px;">📝 Letter of Recommendation</h4>
                <p style="font-size: 13px; color: var(--color-text-muted); line-height: 1.6;">
                  When department heads write LORs, your points record provides concrete data on your engagement, initiative, and consistency.
                </p>
              </div>
            </div>
          </div>

          <!-- 3. How Are Points Earned & All-YWP Meeting Breakdown -->
          <div class="info-split-grid" style="margin-bottom: 60px; align-items: start;">
            <div class="card" style="background-color: var(--color-bg);">
              <h3 class="mb-2" style="font-size: 22px;">How Are Points Earned?</h3>
              <p class="mb-3" style="font-size: 13px; color: var(--color-text-muted);">
                Points are tracked by your Department Head and the HR team. Full metric breakdown:
              </p>

              <div class="metric-table-wrapper" style="margin: 0; background: var(--color-card-bg);">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Activity Metric</th>
                      <th style="text-align: right;">Points Awarded</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Attending a weekly meeting</td>
                      <td style="text-align: right; font-weight: 700; color: var(--color-accent-blue);">+3 pts</td>
                    </tr>
                    <tr>
                      <td>Engaging in a group activity</td>
                      <td style="text-align: right; font-weight: 700; color: var(--color-accent-blue);">+3 pts</td>
                    </tr>
                    <tr>
                      <td>Social Media Engagement (commenting & reposting)</td>
                      <td style="text-align: right; font-weight: 700; color: var(--color-accent-blue);">+2 pts</td>
                    </tr>
                    <tr>
                      <td>Taking initiative</td>
                      <td style="text-align: right; font-weight: 700; color: var(--color-accent-blue);">+2 pts</td>
                    </tr>
                    <tr>
                      <td>Attending an offline meeting</td>
                      <td style="text-align: right; font-weight: 700; color: var(--color-accent-terracotta);">+20 pts</td>
                    </tr>
                    <tr>
                      <td>Completing tasks</td>
                      <td style="text-align: right; font-weight: 700; color: var(--color-accent-mauve);">Varies*</td>
                    </tr>
                    <tr>
                      <td>Attending an All-of-YWP Meeting</td>
                      <td style="text-align: right; font-weight: 700; color: var(--color-accent-green);">5/4/3/2/1 pts**</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p style="font-size: 12px; color: var(--color-text-muted); margin-top: 12px;">
                * Task points are decided by your Department Head based on task complexity.
              </p>
            </div>

            <!-- All-of-YWP Participation Scale & Thresholds -->
            <div>
              <div class="card mb-3">
                <h3 class="mb-2" style="font-size: 20px;">** All-of-YWP Meeting Scale</h3>
                <p style="font-size: 13px; color: var(--color-text-muted); margin-bottom: 12px;">
                  All-of-YWP meeting points depend on how actively you participate:
                </p>
                <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; font-size: 13px;">
                  <li style="padding: 6px 10px; background: var(--color-bg); border-radius: var(--radius-sm);">
                    <strong style="color: var(--color-accent-green);">5 pts:</strong> Present throughout + camera on + interactive
                  </li>
                  <li style="padding: 6px 10px; background: var(--color-bg); border-radius: var(--radius-sm);">
                    <strong style="color: var(--color-accent-blue);">4 pts:</strong> Present throughout + interactive, camera off
                  </li>
                  <li style="padding: 6px 10px; background: var(--color-bg); border-radius: var(--radius-sm);">
                    <strong style="color: var(--color-accent-mauve);">3 pts:</strong> Present throughout + camera on, less interactive
                  </li>
                  <li style="padding: 6px 10px; background: var(--color-bg); border-radius: var(--radius-sm);">
                    <strong style="color: var(--color-text-muted);">2 pts:</strong> Present throughout, camera off, not interactive
                  </li>
                  <li style="padding: 6px 10px; background: var(--color-bg); border-radius: var(--radius-sm);">
                    <strong style="color: var(--color-text-muted);">1 pt:</strong> Present for at least half the meeting, camera off, not interactive
                  </li>
                </ul>
              </div>

              <!-- 4. Certificate Eligibility -->
              <div class="card">
                <h3 class="mb-2" style="font-size: 20px;">Certificate Eligibility</h3>
                <p style="font-size: 13px; color: var(--color-text-muted); margin-bottom: 12px;">
                  Earn minimum required points within your 6-month tenure:
                </p>
                <div style="display: flex; gap: 12px;">
                  <div style="flex: 1; padding: 12px; background-color: var(--color-bg); border-radius: var(--radius-sm); text-align: center;">
                    <span style="font-size: 12px; color: var(--color-text-muted); display: block;">Team Members</span>
                    <strong style="font-size: 22px; color: var(--color-accent-terracotta);">150 pts</strong>
                  </div>
                  <div style="flex: 1; padding: 12px; background-color: var(--color-bg); border-radius: var(--radius-sm); text-align: center;">
                    <span style="font-size: 12px; color: var(--color-text-muted); display: block;">Department Heads</span>
                    <strong style="font-size: 22px; color: var(--color-accent-mauve);">200 pts</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 5. Merch Catalogue Section -->
          <div class="card mb-3" style="padding: 32px; background-color: var(--color-bg);">
            <div style="text-align: center; max-width: 600px; margin: 0 auto 28px;">
              <span class="badge badge-head mb-1">Merchandise Catalogue</span>
              <h3 style="font-size: 28px; margin-bottom: 8px;">Redeem Your Extra Points</h3>
              <p style="font-size: 14px; color: var(--color-text-muted);">
                Points earned above your certificate threshold can be spent on custom YWP merchandise:
              </p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;">
              <div style="padding: 16px; background: var(--color-card-bg); border: 1px solid var(--color-card-border); border-radius: var(--radius-sm); text-align: center;">
                <h4 style="font-size: 15px; margin-bottom: 4px;">YWP Stickers</h4>
                <span style="font-weight: 700; color: var(--color-accent-terracotta);">19 pts</span>
              </div>
              <div style="padding: 16px; background: var(--color-card-bg); border: 1px solid var(--color-card-border); border-radius: var(--radius-sm); text-align: center;">
                <h4 style="font-size: 15px; margin-bottom: 4px;">YWP Bookmarks</h4>
                <span style="font-weight: 700; color: var(--color-accent-mauve);">49 pts</span>
              </div>
              <div style="padding: 16px; background: var(--color-card-bg); border: 1px solid var(--color-card-border); border-radius: var(--radius-sm); text-align: center;">
                <h4 style="font-size: 15px; margin-bottom: 4px;">YWP Posters</h4>
                <span style="font-weight: 700; color: var(--color-accent-blue);">99 pts</span>
              </div>
              <div style="padding: 16px; background: var(--color-card-bg); border: 1px solid var(--color-card-border); border-radius: var(--radius-sm); text-align: center;">
                <h4 style="font-size: 15px; margin-bottom: 4px;">Pocket Notebook</h4>
                <span style="font-weight: 700; color: var(--color-accent-green);">249 pts</span>
              </div>
              <div style="padding: 16px; background: var(--color-card-bg); border: 1px solid var(--color-card-border); border-radius: var(--radius-sm); text-align: center;">
                <h4 style="font-size: 15px; margin-bottom: 4px;">Hardcover Journal</h4>
                <span style="font-weight: 700; color: var(--color-accent-terracotta);">499 pts</span>
              </div>
              <div style="padding: 16px; background: var(--color-card-bg); border: 1px solid var(--color-card-border); border-radius: var(--radius-sm); text-align: center;">
                <h4 style="font-size: 15px; margin-bottom: 4px;">Ceramic Mug</h4>
                <span style="font-weight: 700; color: var(--color-accent-mauve);">499 pts</span>
              </div>
              <div style="padding: 16px; background: var(--color-card-bg); border: 1px solid var(--color-card-border); border-radius: var(--radius-sm); text-align: center;">
                <h4 style="font-size: 15px; margin-bottom: 4px;">Desk Calendar</h4>
                <span style="font-weight: 700; color: var(--color-accent-blue);">449 pts</span>
              </div>
              <div style="padding: 16px; background: var(--color-card-bg); border: 1px solid var(--color-card-border); border-radius: var(--radius-sm); text-align: center;">
                <h4 style="font-size: 15px; margin-bottom: 4px;">Signature T-shirt</h4>
                <span style="font-weight: 700; color: var(--color-accent-green);">799 pts</span>
              </div>
              <div style="padding: 16px; background: var(--color-card-bg); border: 1px solid var(--color-card-border); border-radius: var(--radius-sm); text-align: center;">
                <h4 style="font-size: 15px; margin-bottom: 4px;">Ultra-Soft Hoodie</h4>
                <span style="font-weight: 700; color: var(--color-accent-terracotta);">1499 pts</span>
              </div>
            </div>
          </div>

          <!-- 6. How Is Tracking Done? -->
          <div style="background-color: var(--color-bg); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--color-card-border); font-size: 14px; color: var(--color-text-muted); line-height: 1.7;">
            <strong style="color: var(--color-text-heading); font-size: 16px; display: block; margin-bottom: 8px;">📌 How Is Tracking Done?</strong>
            <ul style="margin-left: 20px;">
              <li>Points are updated weekly by your Department Head and assigned HR team member.</li>
              <li>You do not need to enter points yourself — simply view your point history anytime on your dashboard.</li>
              <li>All-YWP meeting attendance is tracked live during the meeting.</li>
              <li><em>This system is not about pressure; it is about giving everyone an honest, transparent picture of your work and recognizing your growth!</em></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  `;
}
