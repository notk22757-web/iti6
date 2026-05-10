// Firebase configuration for cbttest-d46ea
(function () {
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function init() {
    if (!window.firebase) {
      await loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
      await loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js');
    }

    const firebaseConfig = {
      apiKey: "AIzaSyDfGFz0AsArdWCVYnMFEwggAK-PQBjuor0",
      authDomain: "cbttest-d46ea.firebaseapp.com",
      projectId: "cbttest-d46ea",
      storageBucket: "cbttest-d46ea.firebasestorage.app",
      messagingSenderId: "881028247098",
      appId: "1:881028247098:web:06e5dd2c3f884eb7c80f03",
      measurementId: "G-BXJST6GRDT"
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    window.firestoreDb = firebase.firestore();
    console.log('Firebase initialized');
  }

  init().catch(err => console.error('Firebase init failed:', err));
})();
