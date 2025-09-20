// Service Worker for Web3 Social dApps PWA
const CACHE_NAME = 'web3-social-v1.2.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  // Add other static assets here
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error('Service Worker: Cache addAll failed:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate event');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip Vite development server resources
  const url = new URL(event.request.url);
  const skipPaths = [
    '/@vite/',
    '/@react-refresh',
    '/src/',
    '/node_modules/',
    '/__vite_ping'
  ];

  if (skipPaths.some(path => url.pathname.startsWith(path))) {
    console.log('Service Worker: Skipping cache for dev resource:', event.request.url);
    return fetch(event.request);
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Service Worker: Serving from cache:', event.request.url);
          return cachedResponse;
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response for caching
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // Cache successful responses
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch((error) => {
            console.error('Service Worker: Fetch failed:', error);
            
            // Return offline page for navigation requests
            if (event.request.destination === 'document') {
              return caches.match('/offline.html');
            }
            
            throw error;
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync event:', event.tag);
  
  if (event.tag === 'post-sync') {
    event.waitUntil(syncPosts());
  }
  
  if (event.tag === 'like-sync') {
    event.waitUntil(syncLikes());
  }
});

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push event received');
  
  const options = {
    body: event.data ? event.data.text() : 'You have a new notification!',
    icon: '/pwa-icons/icon-192x192.png',
    badge: '/pwa-icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/pwa-icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/pwa-icons/icon-72x72.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Web3 Social', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click event');
  
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// Helper functions for background sync
async function syncPosts() {
  try {
    // Get pending posts from IndexedDB
    const pendingPosts = await getPendingPosts();
    
    for (const post of pendingPosts) {
      try {
        // Attempt to upload post
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(post.data)
        });
        
        if (response.ok) {
          // Remove from pending posts
          await removePendingPost(post.id);
          console.log('Service Worker: Post synced successfully');
        }
      } catch (error) {
        console.error('Service Worker: Failed to sync post:', error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Post sync failed:', error);
  }
}

async function syncLikes() {
  try {
    // Get pending likes from IndexedDB
    const pendingLikes = await getPendingLikes();
    
    for (const like of pendingLikes) {
      try {
        // Attempt to sync like
        const response = await fetch(`/api/posts/${like.postId}/like`, {
          method: like.action === 'like' ? 'POST' : 'DELETE'
        });
        
        if (response.ok) {
          // Remove from pending likes
          await removePendingLike(like.id);
          console.log('Service Worker: Like synced successfully');
        }
      } catch (error) {
        console.error('Service Worker: Failed to sync like:', error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Like sync failed:', error);
  }
}

// IndexedDB helpers (simplified)
async function getPendingPosts() {
  // Implement IndexedDB logic to retrieve pending posts
  return [];
}

async function removePendingPost(id) {
  // Implement IndexedDB logic to remove pending post
}

async function getPendingLikes() {
  // Implement IndexedDB logic to retrieve pending likes
  return [];
}

async function removePendingLike(id) {
  // Implement IndexedDB logic to remove pending like
}

// Update notification handler
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});