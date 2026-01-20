importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAaVE3a0UCbvIVBmB_aFK0JV9hpCGNyHKY",
  authDomain: "jupiso-ink.firebaseapp.com",
  databaseURL: "https://jupiso-ink-default-rtdb.firebaseio.com",
  projectId: "jupiso-ink",
  storageBucket: "jupiso-ink.firebasestorage.app",
  messagingSenderId: "169259221620",
  appId: "1:169259221620:web:78022c0eb09fe505d78721",
  measurementId: "G-1Q2DGX0G9F"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title || 'Jupi§o Ink';
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'https://img.icons8.com/color/48/fountain-pen.png',
    badge: 'https://img.icons8.com/color/48/fountain-pen.png'
  };
  
  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  // --- LOGIC: DEFAULT TO CUSTOMER APP ---
  let targetFile = 'index.html';
  const title = (event.notification.title || "").toLowerCase();
  
  // ONLY Switch to Admin if it contains specific Owner Keywords
  if (
    title.includes('new order') ||
    title.includes('refund request') ||
    title.includes('premium request') ||
    title.includes('claim') ||
    title.includes('admin') ||
    title.includes('owner')
  ) {
    targetFile = 'admin.html';
  }
  
  // --- OPEN WINDOW LOGIC ---
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // 1. Check if the specific page is already open
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        
        if (targetFile === 'index.html') {
          // Check for index.html OR just the root '/'
          if ((client.url.indexOf('index.html') !== -1 || client.url.endsWith('/')) && 'focus' in client) {
            return client.focus();
          }
        } else {
          // Check for admin.html explicitly
          if (client.url.indexOf('admin.html') !== -1 && 'focus' in client) {
            return client.focus();
          }
        }
      }
      
      // 2. If not found, open new window
      if (clients.openWindow) {
        return clients.openWindow('./' + targetFile);
      }
    })
  );
});