import { handleRouting } from './router.js';
import { dbService } from './firebase.js';

// Setup routing events on window load
window.addEventListener('hashchange', handleRouting);
window.addEventListener('load', handleRouting);

// Subscribe to auth state updates to trigger routing re-evaluations
dbService.onAuthStateChanged((user) => {
  console.log("Auth state updated. Active User:", user ? user.name : "Guest");
  handleRouting();
});
