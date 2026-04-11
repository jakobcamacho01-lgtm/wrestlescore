// ─────────────────────────────────────────────────────────────
// WrestleScore — Firebase Configuration
// ─────────────────────────────────────────────────────────────
// SETUP STEPS:
//  1. Go to https://console.firebase.google.com
//  2. Click "Add project" → name it "WrestleScore" → Create
//  3. In your project: click the </> (Web) icon to add a web app
//  4. Register the app → copy the firebaseConfig object below
//  5. In Firebase console → Authentication → Get Started
//     → Sign-in method → enable "Email/Password" and "Google"
//  6. Authentication → Settings → Authorized domains
//     → Add your Netlify domain (e.g. wrestlescore.netlify.app)
//  7. Replace the placeholder values below with your real values
//  8. Change FIREBASE_CONFIGURED to true
// ─────────────────────────────────────────────────────────────

const firebaseConfig = {
  apiKey:            "REPLACE_WITH_YOUR_API_KEY",
  authDomain:        "REPLACE_WITH_YOUR_AUTH_DOMAIN",
  projectId:         "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket:     "REPLACE_WITH_YOUR_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
  appId:             "REPLACE_WITH_YOUR_APP_ID"
};

// Set to true once you've filled in the values above
const FIREBASE_CONFIGURED = false;
