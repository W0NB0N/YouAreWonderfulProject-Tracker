// Firebase and LocalDB Fallback Configuration
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where, 
  orderBy,
  runTransaction,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

// Placeholder config - user can fill this in.
const firebaseConfig = {
  apiKey: "AIzaSyARxliWwwohrTFjpEWCNidJUFbnifd1nvI",
  authDomain: "ywp-tracker.firebaseapp.com",
  projectId: "ywp-tracker",
  storageBucket: "ywp-tracker.firebasestorage.app",
  messagingSenderId: "669453044748",
  appId: "1:669453044748:web:4645f677d29782665ab229",
  measurementId: "G-EED49416HZ"
};

let app, auth, db, provider, analytics;
let useFirebase = false;

// Attempt Firebase initialization
try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "PLACEHOLDER_API_KEY") {
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
    auth = getAuth(app);
    db = getFirestore(app);
    provider = new GoogleAuthProvider();
    useFirebase = true;
    console.log("Firebase initialized successfully.");
  }
} catch (e) {
  console.warn("Firebase initialization failed, falling back to LocalStorage:", e);
}

// Helper to get current date string in IST timezone (YYYY-MM-DD)
export function getISTDateString() {
  const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
  const formatter = new Intl.DateTimeFormat('en-CA', options); // en-CA locale formats to YYYY-MM-DD
  return formatter.format(new Date());
}

// ==========================================
// LOCAL STORAGE MOCK DATABASE (LocalDb)
// ==========================================
// Preloaded Mock Data for a fully functioning demo
const MOCK_INTERNS = [
  {
    uid: "intern_rahul",
    name: "Rahul Sharma",
    email: "rahul@ywp.org",
    role: "intern",
    department: "Content Team",
    tenure_start: "2026-01-01",
    tenure_end: "2026-06-30",
    type: "member",
    points_total: 142,
    points_redeemed: 19,
    points_available: 123,
    created_at: "2026-01-01T00:00:00Z"
  },
  {
    uid: "intern_priya",
    name: "Priya Patel",
    email: "priya@ywp.org",
    role: "intern",
    department: "Design Team",
    tenure_start: "2026-01-01",
    tenure_end: "2026-06-30",
    type: "head",
    points_total: 215,
    points_redeemed: 49,
    points_available: 166,
    created_at: "2026-01-02T00:00:00Z"
  },
  {
    uid: "intern_aman",
    name: "Aman Verma",
    email: "aman@ywp.org",
    role: "intern",
    department: "Help Team (Peer Support)",
    tenure_start: "2026-01-01",
    tenure_end: "2026-06-30",
    type: "member",
    points_total: 89,
    points_redeemed: 0,
    points_available: 89,
    created_at: "2026-01-03T00:00:00Z"
  }
];

const ADMIN_EMAILS = ["humanresources.ywp@gmail.com"];

const MOCK_ADMINS = [
  {
    uid: "admin_hr",
    name: "YWP HR Department",
    email: ADMIN_EMAILS[0],
    role: "hr",
    department: "HR Department",
    created_at: "2025-10-01T00:00:00Z"
  }
];

const MOCK_POINTS_LOGS = [
  // Rahul's Logs
  { id: "log_r1", user_id: "intern_rahul", activity: "Attending a weekly meeting", points: 3, note: "Weekly design sync", awarded_by: "Lalit Mohan", date: "2026-05-10" },
  { id: "log_r2", user_id: "intern_rahul", activity: "Completing tasks", points: 15, note: "Designed social media banners for Confessions Unplugged", awarded_by: "Lalit Mohan", date: "2026-05-12" },
  { id: "log_r3", user_id: "intern_rahul", activity: "Attending an offline meeting", points: 20, note: "All-hand offline meet in Delhi", awarded_by: "YWP HR Admin", date: "2026-05-18" },
  { id: "log_r4", user_id: "intern_rahul", activity: "Attending an All-of-YWP meeting", points: 5, note: "Full attendance, interactive, camera on", awarded_by: "YWP HR Admin", date: "2026-05-20" },
  { id: "log_r5", user_id: "intern_rahul", activity: "Completing tasks", points: 100, note: "End-of-term core campaign content build", awarded_by: "YWP HR Admin", date: "2026-06-25" },
  
  // Priya's Logs
  { id: "log_p1", user_id: "intern_priya", activity: "Attending a weekly meeting", points: 3, note: "Weekly design sync", awarded_by: "Lalit Mohan", date: "2026-05-10" },
  { id: "log_p2", user_id: "intern_priya", activity: "Taking initiative", points: 2, note: "Created new design templates for Instagram", awarded_by: "Lalit Mohan", date: "2026-05-15" },
  { id: "log_p3", user_id: "intern_priya", activity: "Attending an offline meeting", points: 20, note: "All-hand offline meet in Delhi", awarded_by: "YWP HR Admin", date: "2026-05-18" },
  { id: "log_p4", user_id: "intern_priya", activity: "Completing tasks", points: 150, note: "Designed the full brochure for S.P.E.A.K program", awarded_by: "YWP HR Admin", date: "2026-06-10" },
  { id: "log_p5", user_id: "intern_priya", activity: "Social Media Engagement", points: 40, note: "Consistent comments/reposts for May/June", awarded_by: "YWP HR Admin", date: "2026-06-28" },

  // Aman's Logs
  { id: "log_a1", user_id: "intern_aman", activity: "Attending a weekly meeting", points: 3, note: "Weekly peer sync", awarded_by: "YWP HR Admin", date: "2026-05-10" },
  { id: "log_a2", user_id: "intern_aman", activity: "Engaging in a group activity", points: 3, note: "Active participation in team bonding session", awarded_by: "YWP HR Admin", date: "2026-05-15" },
  { id: "log_a3", user_id: "intern_aman", activity: "Attending an offline meeting", points: 20, note: "All-hand offline meet in Delhi", awarded_by: "YWP HR Admin", date: "2026-05-18" },
  { id: "log_a4", user_id: "intern_aman", activity: "Completing tasks", points: 60, note: "Completed 3 shifts on the peer support live chat line", awarded_by: "YWP HR Admin", date: "2026-06-05" },
  { id: "log_a5", user_id: "intern_aman", activity: "Attending an All-of-YWP meeting", points: 3, note: "Present throughout, camera on, less interactive", awarded_by: "YWP HR Admin", date: "2026-06-12" }
];

const MOCK_MERCH = [
  { id: "merch_1", name: "YWP Stickers", price: 19, category: "Accessories", description: "Bespoke hand-illustrated semi-colon stickers for your laptop.", image_url: "stickers", color: "#C65D3E" },
  { id: "merch_2", name: "YWP Bookmarks", price: 49, category: "Stationery", description: "Soft tactile paper bookmarks with warm mental health quotes.", image_url: "bookmarks", color: "#B07BAC" },
  { id: "merch_3", name: "YWP Posters", price: 99, category: "Home", description: "A3 sized beautiful textured paper posters highlighting the four pillars.", image_url: "posters", color: "#3D5A80" },
  { id: "merch_4", name: "YWP Pocket Notebook", price: 249, category: "Stationery", description: "Pocket-sized eco-friendly lined notebook for quick daily notes.", image_url: "notebook", color: "#E07A5F" },
  { id: "merch_5", name: "YWP Hardcover Journal", price: 499, category: "Stationery", description: "Premium hardcover thread-bound journal with wellness prompts.", image_url: "journal", color: "#8D99AE" },
  { id: "merch_6", name: "YWP Ceramic Mug", price: 499, category: "Accessories", description: "Warm ceramic mug featuring expressively drawn characters.", image_url: "mugs", color: "#5B8C5A" },
  { id: "merch_7", name: "YWP Desk Calendar", price: 449, category: "Stationery", description: "A gorgeous desk calendar with wellness trackers for each month.", image_url: "calendar", color: "#D4A843" },
  { id: "merch_8", name: "YWP T-shirt", price: 799, category: "Apparel", description: "Soft organic cotton t-shirt with our signature semicolon emblem.", image_url: "tshirt", color: "#2A2A3A" },
  { id: "merch_9", name: "YWP Hoodie", price: 1499, category: "Apparel", description: "Premium ultra-soft terracotta hoodie designed to make you feel warm & safe.", image_url: "hoodie", color: "#C65D3E" }
];

const MOCK_ORDERS = [
  { id: "order_r1", user_id: "intern_rahul", items: [{ merch_id: "merch_1", name: "YWP Stickers", price: 19, qty: 1 }], total_points: 19, status: "fulfilled", created_at: "2026-05-20T12:00:00Z" },
  { id: "order_p1", user_id: "intern_priya", items: [{ merch_id: "merch_2", name: "YWP Bookmarks", price: 49, qty: 1 }], total_points: 49, status: "fulfilled", created_at: "2026-05-22T14:30:00Z" }
];

class LocalDatabase {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem("ywp_users")) {
      const allUsers = [...MOCK_INTERNS, ...MOCK_ADMINS];
      localStorage.setItem("ywp_users", JSON.stringify(allUsers));
    }
    if (!localStorage.getItem("ywp_points_logs")) {
      localStorage.setItem("ywp_points_logs", JSON.stringify(MOCK_POINTS_LOGS));
    }
    if (!localStorage.getItem("ywp_merch")) {
      localStorage.setItem("ywp_merch", JSON.stringify(MOCK_MERCH));
    }
    if (!localStorage.getItem("ywp_orders")) {
      localStorage.setItem("ywp_orders", JSON.stringify(MOCK_ORDERS));
    }
    this.currentUser = JSON.parse(sessionStorage.getItem("ywp_current_user")) || null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getUsers() {
    return JSON.parse(localStorage.getItem("ywp_users"));
  }

  getPointsLogs() {
    return JSON.parse(localStorage.getItem("ywp_points_logs"));
  }

  getMerch() {
    return JSON.parse(localStorage.getItem("ywp_merch"));
  }

  getOrders() {
    return JSON.parse(localStorage.getItem("ywp_orders"));
  }

  login(email, password) {
    const users = this.getUsers();
    // For demo purposes: matching email checks role mapping
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      this.currentUser = user;
      sessionStorage.setItem("ywp_current_user", JSON.stringify(user));
      return Promise.resolve(user);
    }
    return Promise.reject(new Error("User not found or invalid credentials. Use a mock email like 'rahul@ywp.org' or 'hr@ywp.org'."));
  }

  loginWithGoogle(emailInput) {
    const users = this.getUsers();
    const cleanEmail = (emailInput || "").toLowerCase().trim();

    if (!cleanEmail) {
      return Promise.reject(new Error("Please enter your Google account email."));
    }

    if (ADMIN_EMAILS.includes(cleanEmail)) {
      let adminUser = users.find(u => u.email.toLowerCase() === cleanEmail);
      if (!adminUser) {
        adminUser = {
          uid: "admin_" + cleanEmail.replace(/[^a-zA-Z0-9]/g, '_'),
          name: "YWP HR Department",
          email: cleanEmail,
          role: "hr",
          department: "HR Department",
          created_at: new Date().toISOString()
        };
        users.push(adminUser);
        localStorage.setItem("ywp_users", JSON.stringify(users));
      }
      this.currentUser = adminUser;
      sessionStorage.setItem("ywp_current_user", JSON.stringify(adminUser));
      return Promise.resolve(adminUser);
    }

    const user = users.find(u => u.email.toLowerCase() === cleanEmail && u.role === "intern");
    if (!user) {
      return Promise.reject(
        new Error(`Access Denied: The Google account (${cleanEmail}) is not registered as an intern with You're Wonderful Project;. Please contact HR at humanresources.ywp@gmail.com to be added.`)
      );
    }

    this.currentUser = user;
    sessionStorage.setItem("ywp_current_user", JSON.stringify(user));
    return Promise.resolve(user);
  }

  logout() {
    this.currentUser = null;
    sessionStorage.removeItem("ywp_current_user");
    return Promise.resolve();
  }

  // Admin action: Create Intern
  createIntern(userData) {
    const users = this.getUsers();
    if (users.find(u => u.email === userData.email)) {
      return Promise.reject(new Error("Email already exists."));
    }
    const newUser = {
      uid: "intern_" + Date.now(),
      points_total: 0,
      points_redeemed: 0,
      points_available: 0,
      created_at: new Date().toISOString(),
      role: "intern",
      ...userData
    };
    users.push(newUser);
    localStorage.setItem("ywp_users", JSON.stringify(users));
    return Promise.resolve(newUser);
  }

  updateIntern(uid, updatedFields) {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.uid === uid);
    if (userIndex === -1) {
      return Promise.reject(new Error("User not found."));
    }
    const user = users[userIndex];
    const updatedUser = {
      ...user,
      ...updatedFields
    };
    users[userIndex] = updatedUser;
    localStorage.setItem("ywp_users", JSON.stringify(users));
    
    if (this.currentUser && this.currentUser.uid === uid) {
      this.currentUser = updatedUser;
      sessionStorage.setItem("ywp_current_user", JSON.stringify(updatedUser));
    }
    return Promise.resolve(updatedUser);
  }

  // Admin action: Add point entry
  addPointEntry(targetUid, activity, points, note) {
    const logs = this.getPointsLogs();
    const users = this.getUsers();
    
    const userIndex = users.findIndex(u => u.uid === targetUid);
    if (userIndex === -1) return Promise.reject(new Error("User not found."));

    const newLog = {
      id: "log_" + Date.now(),
      user_id: targetUid,
      activity,
      points: Number(points),
      note,
      awarded_by: this.currentUser ? this.currentUser.name : "Admin",
      date: getISTDateString()
    };

    logs.unshift(newLog); // Prepend to show newest first
    localStorage.setItem("ywp_points_logs", JSON.stringify(logs));

    // Update user stats
    const user = users[userIndex];
    if (points > 0) {
      user.points_total += Number(points);
      user.points_available += Number(points);
    } else {
      // Just in case negative points are awarded, handle deduction
      user.points_total = Math.max(0, user.points_total + Number(points));
      user.points_available = Math.max(0, user.points_available + Number(points));
    }
    
    users[userIndex] = user;
    localStorage.setItem("ywp_users", JSON.stringify(users));

    // If logged in user is viewing themselves, update session
    if (this.currentUser && this.currentUser.uid === targetUid) {
      this.currentUser = user;
      sessionStorage.setItem("ywp_current_user", JSON.stringify(user));
    }

    return Promise.resolve(newLog);
  }

  // Intern action: Redeem points for merch
  redeemMerch(merchId) {
    const users = this.getUsers();
    const merch = this.getMerch();
    const orders = this.getOrders();
    const logs = this.getPointsLogs();

    const userIndex = users.findIndex(u => u.uid === this.currentUser.uid);
    const item = merch.find(m => m.id === merchId);

    if (!item) return Promise.reject(new Error("Item not found."));
    if (userIndex === -1) return Promise.reject(new Error("User not found."));
    
    const user = users[userIndex];
    if (user.points_available < item.price) {
      return Promise.reject(new Error("Insufficient available points."));
    }

    // Deduct points
    user.points_redeemed += item.price;
    user.points_available -= item.price;
    users[userIndex] = user;
    this.currentUser = user;
    sessionStorage.setItem("ywp_current_user", JSON.stringify(user));
    localStorage.setItem("ywp_users", JSON.stringify(users));

    // Create Order
    const newOrder = {
      id: "order_" + Date.now(),
      user_id: user.uid,
      items: [{ merch_id: item.id, name: item.name, price: item.price, qty: 1 }],
      total_points: item.price,
      status: "pending",
      created_at: new Date().toISOString()
    };
    orders.unshift(newOrder);
    localStorage.setItem("ywp_orders", JSON.stringify(orders));

    // Add activity log representing merch purchase (as negative points entry)
    const newLog = {
      id: "log_" + Date.now(),
      user_id: user.uid,
      activity: `Redeemed ${item.name}`,
      points: -item.price,
      note: `Merch store redemption`,
      awarded_by: "System",
      date: getISTDateString()
    };
    logs.unshift(newLog);
    localStorage.setItem("ywp_points_logs", JSON.stringify(logs));

    return Promise.resolve(newOrder);
  }
}

const localDb = new LocalDatabase();

async function fetchOrLinkUserByAuth(user) {
  if (!user) return null;
  const email = (user.email || "").toLowerCase().trim();

  // 1. Check if user profile doc exists with user.uid
  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    return { uid: user.uid, ...userDoc.data() };
  }

  // 2. Check if user is an Admin email
  if (ADMIN_EMAILS.includes(email)) {
    const profileData = {
      name: user.displayName || "YWP HR Department",
      email: email,
      role: "hr",
      department: "HR Department",
      created_at: new Date()
    };
    await setDoc(userDocRef, profileData);
    return { uid: user.uid, ...profileData };
  }

  // 3. Search Firestore for intern doc registered by Admin under this email
  const q = query(collection(db, "users"), where("email", "==", email));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    await signOut(auth);
    throw new Error(`Access Denied: The Google account (${email}) is not registered as an intern with You're Wonderful Project;. Please contact HR at humanresources.ywp@gmail.com.`);
  }

  // 4. Link pre-registered intern profile to their Google Auth UID
  const existingDoc = snapshot.docs[0];
  const existingData = existingDoc.data();
  const oldDocId = existingDoc.id;

  const linkedProfile = {
    ...existingData,
    uid: user.uid,
    email: email,
    temp_id: oldDocId
  };

  // Save to doc(db, "users", user.uid)
  await setDoc(userDocRef, linkedProfile);

  // If old doc was stored under a temp ID (e.g. intern_xyz), migrate points logs and delete old doc
  if (oldDocId !== user.uid) {
    try {
      const oldLogsSnap = await getDocs(collection(db, "users", oldDocId, "points_log"));
      for (const logDoc of oldLogsSnap.docs) {
        await setDoc(doc(db, "users", user.uid, "points_log", logDoc.id), logDoc.data());
        await deleteDoc(logDoc.ref);
      }
      // Delete old unlinked temp doc so no duplicate remains
      await deleteDoc(doc(db, "users", oldDocId));
    } catch (e) {
      console.warn("Points log migration warning:", e);
    }
  }

  return linkedProfile;
}

// Export unified db interface
export const dbService = {
  isFirebase: () => useFirebase,
  
  getCurrentUser: () => {
    if (useFirebase) {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            try {
              const profile = await fetchOrLinkUserByAuth(user);
              resolve(profile);
            } catch (e) {
              console.error("Auth resolve error:", e);
              resolve(null);
            }
          } else {
            resolve(null);
          }
        });
      });
    } else {
      return Promise.resolve(localDb.getCurrentUser());
    }
  },

  onAuthStateChanged: (callback) => {
    if (useFirebase) {
      return onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const profile = await fetchOrLinkUserByAuth(user);
            callback(profile);
          } catch (e) {
            console.error("Auth state listener error:", e);
            callback(null);
          }
        } else {
          callback(null);
        }
      });
    } else {
      // LocalStorage trigger on page load/action
      callback(localDb.getCurrentUser());
      return () => {}; // No-op unsubscriber
    }
  },

  login: async (email, password) => {
    if (useFirebase) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (!userDoc.exists()) throw new Error("User record not found in database.");
      return { uid: userCredential.user.uid, ...userDoc.data() };
    } else {
      return localDb.login(email, password);
    }
  },

  loginWithGoogle: async (emailInput) => {
    if (useFirebase) {
      try {
        const result = await signInWithPopup(auth, provider);
        return await fetchOrLinkUserByAuth(result.user);
      } catch (err) {
        if (err.code === 'permission-denied' || (err.message && err.message.includes('insufficient permissions'))) {
          throw new Error("Firestore Permission Error: Please update your Firestore Security Rules in Firebase Console. Go to Firestore Database → Rules tab and allow read/write access.");
        }
        throw err;
      }
    } else {
      if (!emailInput) {
        // If developer clicks main Google button in offline fallback mode without Firebase API keys
        throw new Error("Google OAuth Popup requires active Firebase API keys. Please configure your Firebase credentials in src/firebase.js or use the Developer Sandbox chips below to test!");
      }
      return localDb.loginWithGoogle(emailInput);
    }
  },

  logout: async () => {
    if (useFirebase) {
      await signOut(auth);
    } else {
      await localDb.logout();
    }
  },

  // Admin/Intern Fetching
  getInterns: async () => {
    if (useFirebase) {
      const q = query(collection(db, "users"), where("role", "==", "intern"));
      const snapshot = await getDocs(q);
      const allDocs = snapshot.docs.map(d => ({ uid: d.id, ...d.data() }));

      // Deduplicate by lowercased email, but bypass blank emails
      const uniqueMap = new Map();
      const blankEmailInterns = [];
      for (const intern of allDocs) {
        const emailKey = (intern.email || "").toLowerCase().trim();
        if (!emailKey) {
          blankEmailInterns.push(intern);
          continue;
        }
        if (!uniqueMap.has(emailKey)) {
          uniqueMap.set(emailKey, intern);
        } else {
          const existing = uniqueMap.get(emailKey);
          // If existing entry is tempId (starts with intern_), replace with real Google UID entry and delete temp doc
          if (existing.uid.startsWith("intern_") && !intern.uid.startsWith("intern_")) {
            deleteDoc(doc(db, "users", existing.uid)).catch(console.warn);
            uniqueMap.set(emailKey, intern);
          } else if (intern.uid.startsWith("intern_") && !existing.uid.startsWith("intern_")) {
            deleteDoc(doc(db, "users", intern.uid)).catch(console.warn);
          }
        }
      }
      return [...blankEmailInterns, ...Array.from(uniqueMap.values())];
    } else {
      return Promise.resolve(localDb.getUsers().filter(u => u.role === "intern"));
    }
  },

  getInternProfile: async (uid) => {
    if (useFirebase) {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return { uid: userDoc.id, ...userDoc.data() };
      }
      const q = query(collection(db, "users"), where("temp_id", "==", uid));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const foundDoc = snapshot.docs[0];
        return { uid: foundDoc.id, ...foundDoc.data() };
      }
      return null;
    } else {
      return Promise.resolve(localDb.getUsers().find(u => u.uid === uid) || null);
    }
  },

  getPointsLogs: async (uid) => {
    if (useFirebase) {
      let realUid = uid;
      const userDoc = await getDoc(doc(db, "users", uid));
      if (!userDoc.exists()) {
        const q = query(collection(db, "users"), where("temp_id", "==", uid));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          realUid = snapshot.docs[0].id;
        }
      }
      const qLogs = query(
        collection(db, "users", realUid, "points_log"), 
        orderBy("created_at", "desc")
      );
      const snapshotLogs = await getDocs(qLogs);
      return snapshotLogs.docs.map(d => ({ id: d.id, ...d.data() }));
    } else {
      return Promise.resolve(localDb.getPointsLogs().filter(l => l.user_id === uid));
    }
  },

  getMerchItems: async () => {
    if (useFirebase) {
      const snapshot = await getDocs(collection(db, "merch"));
      if (snapshot.empty) {
        // Auto-seed merch items into Firestore if collection is empty
        for (const item of MOCK_MERCH) {
          await setDoc(doc(db, "merch", item.id), item);
        }
        const seededSnap = await getDocs(collection(db, "merch"));
        return seededSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    } else {
      return Promise.resolve(localDb.getMerch());
    }
  },

  // Admin/Intern Mutations
  createIntern: async (userData) => {
    if (useFirebase) {
      // In firebase we must handle auth account creation. Normally done via Firebase Auth,
      // but for V1 we save the intern profile to Firestore, and when they login with Google
      // matching the email, their auth account links up automatically.
      const q = query(collection(db, "users"), where("email", "==", userData.email));
      const existing = await getDocs(q);
      if (!existing.empty) throw new Error("Email already exists.");

      // Generate random id for matching
      const tempId = "intern_" + Math.random().toString(36).substring(2, 9);
      const profile = {
        points_total: 0,
        points_redeemed: 0,
        points_available: 0,
        created_at: new Date(),
        role: "intern",
        ...userData
      };
      await setDoc(doc(db, "users", tempId), profile);
      return { uid: tempId, ...profile };
    } else {
      return localDb.createIntern(userData);
    }
  },

  addPointEntry: async (targetUid, activity, points, note) => {
    if (useFirebase) {
      const current = await dbService.getCurrentUser();
      const awardedBy = current ? current.name : "Admin";
      
      let realUid = targetUid;
      let userRef = doc(db, "users", realUid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        const q = query(collection(db, "users"), where("temp_id", "==", targetUid));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          realUid = snapshot.docs[0].id;
          userRef = doc(db, "users", realUid);
        } else {
          throw new Error("User does not exist.");
        }
      }

      const logRef = collection(db, "users", realUid, "points_log");

      await runTransaction(db, async (transaction) => {
        const freshUserDoc = await transaction.get(userRef);
        if (!freshUserDoc.exists()) throw new Error("User does not exist.");

        const userData = freshUserDoc.data();
        const newTotal = userData.points_total + Number(points);
        const newAvailable = userData.points_available + Number(points);

        // Update user
        transaction.update(userRef, {
          points_total: newTotal,
          points_available: newAvailable
        });

        // Add log doc
        const newLogDoc = doc(logRef);
        transaction.set(newLogDoc, {
          activity,
          points: Number(points),
          note,
          awarded_by: awardedBy,
          date: getISTDateString(),
          created_at: new Date()
        });
      });
      return true;
    } else {
      return localDb.addPointEntry(targetUid, activity, points, note);
    }
  },

  addEventPoints: async (targetUids, activity, points, note) => {
    for (const targetUid of targetUids) {
      await dbService.addPointEntry(targetUid, activity, points, note);
    }
    return true;
  },

  getAllOrders: async () => {
    if (useFirebase) {
      try {
        const snapshot = await getDocs(collection(db, "orders"));
        const orders = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        const usersSnap = await getDocs(collection(db, "users"));
        const usersMap = new Map(usersSnap.docs.map(d => [d.id, d.data().name || d.data().email]));
        return orders.map(o => ({
          ...o,
          userName: usersMap.get(o.user_id) || "Intern"
        })).sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      } catch (e) {
        console.warn("Error fetching orders from Firestore:", e);
        return [];
      }
    } else {
      const orders = localDb.getOrders() || [];
      const users = localDb.getUsers() || [];
      const usersMap = new Map(users.map(u => [u.uid, u.name]));
      return Promise.resolve(orders.map(o => ({
        ...o,
        userName: usersMap.get(o.user_id) || "Intern"
      })));
    }
  },

  redeemMerch: async (merchId) => {
    if (useFirebase) {
      const current = await dbService.getCurrentUser();
      if (!current) throw new Error("No authenticated user.");

      const userRef = doc(db, "users", current.uid);
      const merchRef = doc(db, "merch", merchId);
      const ordersRef = collection(db, "orders");
      const logsRef = collection(db, "users", current.uid, "points_log");

      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        const merchDoc = await transaction.get(merchRef);

        if (!userDoc.exists()) throw new Error("User does not exist.");
        if (!merchDoc.exists()) throw new Error("Merch item does not exist.");

        const userData = userDoc.data();
        const merchData = merchDoc.data();

        if (userData.points_available < merchData.price) {
          throw new Error("Insufficient points.");
        }

        // Deduct points
        transaction.update(userRef, {
          points_redeemed: userData.points_redeemed + merchData.price,
          points_available: userData.points_available - merchData.price
        });

        // Add order
        const newOrderDoc = doc(ordersRef);
        transaction.set(newOrderDoc, {
          user_id: current.uid,
          items: [{ merch_id: merchId, name: merchData.name, price: merchData.price, qty: 1 }],
          total_points: merchData.price,
          status: "pending",
          created_at: new Date()
        });

        // Add points log deduction
        const newLogDoc = doc(logsRef);
        transaction.set(newLogDoc, {
          activity: `Redeemed ${merchData.name}`,
          points: -merchData.price,
          note: `Merch store redemption`,
          awarded_by: "System",
          date: getISTDateString(),
          created_at: new Date()
        });
      });
      return true;
    } else {
      return localDb.redeemMerch(merchId);
    }
  },

  updateIntern: async (uid, updatedFields) => {
    if (useFirebase) {
      let realUid = uid;
      let userRef = doc(db, "users", realUid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        const q = query(collection(db, "users"), where("temp_id", "==", uid));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          realUid = snapshot.docs[0].id;
          userRef = doc(db, "users", realUid);
        }
      }
      await updateDoc(userRef, updatedFields);
      return true;
    } else {
      return localDb.updateIntern(uid, updatedFields);
    }
  }
};
