const CACHE = "ewq-v15";   // 商店上線＋五個全身特效。改 index.html、words.js 或音檔就要動這行
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
  // 單字圖片與發音音檔不進 install 的 ASSETS —— 任何一個 404 都會讓整個安裝失敗。
  // 改成第一次用到才抓，抓到就存起來，之後離線也看得到。
  // 老師現場加的字，圖來自 ARASAAC 的 CDN（不在 /img/ 底下），也要快取才能離線用
  if (e.request.url.includes("/img/") || e.request.url.includes("/audio/") || e.request.url.includes("static.arasaac.org")) {
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request).then(res => {
        // ⚠️ 跨網域的 <img> 是 no-cors 請求，回來的是 opaque response：
        //    status 恆為 0、ok 恆為 false。只看 res.ok 的話 ARASAAC 的圖一張都存不進去。
        //    opaque response 可以放進 Cache API（JS 讀不到內容，但瀏覽器餵得給 <img>）。
        if (res.ok || res.type === "opaque") {
          const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      })).catch(() => new Response("", {status: 404}))
    );
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)).catch(()=>caches.match("index.html")));
});
self.addEventListener("message", e => { if(e.data === "skipWaiting") self.skipWaiting(); });
