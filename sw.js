const CACHE = "ewq-v6";
const ASSETS = ["./", "index.html", "data/words.js", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(()=>{}));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  // 單字圖片不進 install 的 ASSETS —— 任何一張 404 都會讓整個安裝失敗。
  // 改成第一次用到才抓，抓到就存起來，之後離線也看得到。
  if (e.request.url.includes("/img/")) {
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
        return res;
      })).catch(() => new Response("", {status: 404}))
    );
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)).catch(()=>caches.match("index.html")));
});
self.addEventListener("message", e => { if(e.data === "skipWaiting") self.skipWaiting(); });
