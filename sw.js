/**
 * 우리 반 1인 1역할 배정 시스템 - 서비스 워커 (Service Worker)
 * 오프라인 교실 환경 지원 및 앱 캐싱
 */

const CACHE_NAME = 'class-roles-app-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

// 설치 단계: 핵심 정적 에셋 사전 캐싱
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('캐싱 중 일부 파일 누락:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 활성화 단계: 구버전 캐시 정리
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 페치 이벤트: 네트워크 우선, 실패 시 오프라인 캐시 제공 (Stale-While-Revalidate 또는 Network-first)
self.addEventListener('fetch', (event) => {
  // GET 요청만 처리 (구글 Apps Script POST 등은 제외)
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 로컬 정적 파일 요청 처리
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // 캐시가 있으면 먼저 반환하고 백그라운드에서 최신화
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      // 캐시에 없으면 네트워크 시도 후 캐싱
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // 오프라인 상태에서 HTML 요청인 경우 캐시된 index.html 반환
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('./index.html') || caches.match('./');
        }
      });
    })
  );
});
