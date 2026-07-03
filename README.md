# 🎗️ YWP Wonder Points Tracker

A premium, custom volunteer point tracking and recognition dashboard built for **You're Wonderful Project;** (a youth-led mental health NGO registered under the Indian Trusts Act).

The portal serves as a transparent audit platform for volunteer contributions, certificate eligibility tracking, and merchandise redemption.

---

## 🎨 Design System & Aesthetics
The visual design aligns closely with YWP's identity:
* 🪵 **Color Palette**: Warm cream background (`#FAF6F1`), Terracotta, Soft Mauve, Slate Blue, Organic Green, and Warm Gold.
* 📄 **Organic Texture**: SGN grain/noise background filters mimicking hand-made paper.
* 🧸 **Tactile Layouts**: Soft-cornered cards, pill-shaped capsule buttons, clean high-contrast serif headers (`Playfair Display`), and micro-interactions.

---

## 🚀 Key Features

### 1. 📋 Admin Dashboard & HR Panel
* **Volunteer Directory**: Full database searchable by name/email, filterable by department, and sortable by point totals.
* **➕ Batch Attendance**: A batch-attendance modal allows HR to record sync meetings, awarding attendance points to multiple interns simultaneously.
* **🛍️ Merch Redemptions Feed**: Replaced mock widgets with a live order feed showing real-time merchandise requests from volunteers.
* **✏️ Edit Details Modal**: Admins can edit volunteer names, emails, departments, roles, and tenure dates directly.
* **Auto-Link Redirection**: When interns sign in with Google OAuth for the first time, their profile is securely migrated to their Google UID, and a self-healing `temp_id` fallback keeps existing links fully functional.

### 2. 📊 Intern Dashboard
* **Dynamic Certificate Progress**: Colored progress bar illustrating progress toward completion thresholds (150 pts for general Members, 200 pts for Department Heads).
* **Detailed Stats**: Visual summaries of total points earned, points available for redemption, and spent points.
* **Full Points History**: Interactive log displaying dates, activity metrics, custom descriptions, and awarding heads.

### 3. 🎁 Merchandise Catalogue
* **Interactive Carousel**: Volunteers browse catalogue items (Stickers, Bookmarks, Posters, Notebooks, Ceramic Mugs, Hardcover Journals, T-shirts, Hoodies).
* **1 Point = ₹1 Conversion**: Real-time balance validation checks for affordability and prompts a confirmation dialog before redemption.

---

## 🛠️ Technology Stack
* **Frontend**: Vite + Vanilla JS (Single Page Application with client-side hash router)
* **Backend**: Firebase 10+ (Auth + Firestore)
* **Fallback**: Fully-fledged LocalStorage mockup system for offline sandbox testing when Firebase config is absent.
* **Timezone**: Date generation is locked to **Indian Standard Time (IST)** (`Asia/Kolkata`) across all point mutations and redemptions.

---

## ⚡ Database Seeding & Reset

The project includes a standalone script to clean the Firestore database and load official volunteer logs:

### 1. Prerequisite Setup
1. Go to your **Firebase Console** $\rightarrow$ **Project Settings** $\rightarrow$ **Service Accounts** tab.
2. Click **Generate New Private Key** and download the credentials JSON file.
3. Save the file in the project root directory as **`serviceAccountKey.json`** (this is already ignored by Git).

### 2. Seeding execution
Install the Firebase Admin package and execute the seeding script:
```bash
pip install firebase-admin
python seed_firestore.py
```

### 3. What the Seeding Script Does:
* Clears all existing documents in `users`, `orders`, and `merch` Firestore collections.
* Populates the database with the 22 volunteer profiles from the official tracker.
* Maps CSV department names to official app team names.
* Generates granular points log subcollections (e.g. creating 3 separate `+3 pts` logs for 3 Weekly Meetings).
* Saves original temporary IDs to the `temp_id` field for seamless Google Auth linking.
* Uses **timezone-aware UTC timestamps** to ensure correct chronology in point lists.

---

## 🔑 All-of-YWP Meeting Attendance Points Scale
All-of-YWP meeting attendance points are awarded based on active participation:
1. **5 pts**: Present throughout + camera on + interactive
2. **4 pts**: Present throughout + interactive, camera off
3. **3 pts**: Present throughout + camera on, less interactive
4. **2 pts**: Present throughout, camera off, not interactive
5. **1 pt**: Present for at least half the meeting, camera off, not interactive

*Admins can select the exact participation level when adding a batch attendance or single point entry.*

---

## 💻 Local Development

### Installation
```bash
npm install
```

### Run Dev Server
```bash
npm run dev
```
Launches the site on `http://localhost:3000`.

### Production Build
```bash
npm run build
```
Compiles a highly-optimized, minified bundle in the `dist/` directory.
