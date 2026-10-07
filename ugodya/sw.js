const SHELL = "ugodya-pages-shell-034-135089033531",
  SATELLITE = "ugodya-pages-satellite-v1";
const PRECACHE = ["/ugodya/assets/index-D2Nd0ZIr.js","/ugodya/assets/index-mLqqAVzX.css","/ugodya/branding/icon-192.png","/ugodya/branding/icon-512.png","/ugodya/branding/splash_background.png","/ugodya/branding/splash_final.png","/ugodya/branding/splash_glint.png","/ugodya/branding/splash_globe.png","/ugodya/branding/splash_pin.png","/ugodya/data/bakhchisaray_2_3_276-U.geojson","/ugodya/data/crimea_places.json","/ugodya/data/partizan_276-U.geojson","/ugodya/data/yalta_forestry_1_2.geojson","/ugodya/fonts/Noto Sans Regular/0-255.pbf","/ugodya/fonts/Noto Sans Regular/1024-1279.pbf","/ugodya/fonts/Noto Sans Regular/256-511.pbf","/ugodya/fonts/Noto Sans Regular/768-1023.pbf","/ugodya/index.html","/ugodya/manifest.webmanifest","/ugodya/maps/catalog.json","/ugodya/styles/satellite.json","/ugodya/styles/scheme.json"];
self.addEventListener("install", (event) =>
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL);
      await cache.addAll(PRECACHE);
    })(),
  ),
);
self.addEventListener("activate", (event) =>
  event.waitUntil(
    (async () => {
      for (const name of await caches.keys())
        if (name.startsWith("ugodya-pages-shell-") && name !== SHELL)
          await caches.delete(name);
      await self.clients.claim();
    })(),
  ),
);
self.addEventListener("message", (event) => {
  if (event.data === "ACTIVATE_UPDATE") self.skipWaiting();
});
self.addEventListener("fetch", (event) => {
  const request = event.request,
    url = new URL(request.url);
  if (request.method !== "GET") return;
  if (
    url.hostname === "server.arcgisonline.com" &&
    url.pathname.includes("/tile/")
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(SATELLITE),
        saved = await cache.match(request, {ignoreVary:true});
        if (saved) return saved;
        try {
          const response = await fetch(request);
          if (response.ok && response.type !== "opaque") {
            await cache.put(request, response.clone());
            const keys = await cache.keys();
            if (keys.length > 2500) await cache.delete(keys[0]);
          }
          return response;
        } catch {
          return new Response("", { status: 503 });
        }
      })(),
    );
    return;
  }
  if (
    url.origin !== self.location.origin || !url.pathname.startsWith("/ugodya/") ||
    (url.pathname.startsWith("/ugodya/maps/") && url.pathname !== "/ugodya/maps/catalog.json")
  )
    return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(SHELL);
      const saved = await cache.match(request, {ignoreVary:true});
      if (saved) return saved;
      try {
        return await fetch(request);
      } catch {
        if (request.mode === "navigate")
          return await cache.match("/ugodya/index.html", {ignoreVary:true});
        return new Response("", { status: 503 });
      }
    })(),
  );
});
