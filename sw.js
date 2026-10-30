
const CACHE_NAME = "move-shell-v3";
const APP_PATH = "/A1SC-CycleLab-Test/";

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll([
        APP_PATH,
        APP_PATH + "manifest.webmanifest",
        APP_PATH + "move-icon-192.png",
        APP_PATH + "move-icon-512.png"
      ])
    )
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key =>
            key.startsWith("move-shell-") &&
            key !== CACHE_NAME
          )
          .map(key => caches.delete(key))
      )
    )
  );
});

// Network-first for the app page so updates are not hidden
// behind an older cached copy.
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(APP_PATH)) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match(APP_PATH)
      )
    );
  }
});
