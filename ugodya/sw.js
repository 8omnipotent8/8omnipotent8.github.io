const SHELL = "ugodya-pages-shell-039-defd044ca251",
  SATELLITE = "ugodya-pages-satellite-v1";
const PRECACHE = ["/ugodya/assets/index-B2HbJfyg.js","/ugodya/assets/index-BQ1E7q-M.css","/ugodya/boot-guard.js","/ugodya/branding/icon-192.png","/ugodya/branding/icon-512.png","/ugodya/branding/splash_background.png","/ugodya/branding/splash_final.png","/ugodya/branding/splash_glint.png","/ugodya/branding/splash_globe.png","/ugodya/branding/splash_pin.png","/ugodya/data/ai-petri.geojson","/ugodya/data/alma-kermen.geojson","/ugodya/data/bakhchisaray_2_3_276-U.geojson","/ugodya/data/crimea-district-100.geojson","/ugodya/data/crimea-district-103.geojson","/ugodya/data/crimea-district-114.geojson","/ugodya/data/crimea-district-12.geojson","/ugodya/data/crimea-district-139.geojson","/ugodya/data/crimea-district-146.geojson","/ugodya/data/crimea-district-153.geojson","/ugodya/data/crimea-district-162.geojson","/ugodya/data/crimea-district-163.geojson","/ugodya/data/crimea-district-174.geojson","/ugodya/data/crimea-district-183.geojson","/ugodya/data/crimea-district-214.geojson","/ugodya/data/crimea-district-41.geojson","/ugodya/data/crimea-district-57.geojson","/ugodya/data/crimea-district-64.geojson","/ugodya/data/crimea-district-75.geojson","/ugodya/data/crimea-district-78.geojson","/ugodya/data/crimea-district-94.geojson","/ugodya/data/crimea-district-97.geojson","/ugodya/data/crimean_loh_hanfield.geojson","/ugodya/data/crimea_places.json","/ugodya/data/kermen.geojson","/ugodya/data/krcrliso.geojson","/ugodya/data/lamat.geojson","/ugodya/data/oou-bakhchisaray1.geojson","/ugodya/data/partizan_276-U.geojson","/ugodya/data/partner-proekt.geojson","/ugodya/data/territories.json","/ugodya/data/tyaga-service.geojson","/ugodya/data/vepr.geojson","/ugodya/data/yalta_forestry_1_2.geojson","/ugodya/fonts/Noto Sans Regular/0-255.pbf","/ugodya/fonts/Noto Sans Regular/1024-1279.pbf","/ugodya/fonts/Noto Sans Regular/256-511.pbf","/ugodya/fonts/Noto Sans Regular/768-1023.pbf","/ugodya/index.html","/ugodya/manifest.webmanifest","/ugodya/maps/catalog.json","/ugodya/styles/satellite.json","/ugodya/styles/scheme.json"];
self.addEventListener("install", (event) =>
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL);
      await cache.addAll(PRECACHE);
      // Stored map chunks and account data are unchanged. New pages use the new shell.
      await self.skipWaiting();
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
      if(request.mode==='navigate' && url.searchParams.has('recover')) {
        try { const response=await fetch(request,{signal:AbortSignal.timeout(5000)});if(response.ok)return response; } catch {}
        return saved ?? await cache.match('/ugodya/index.html',{ignoreVary:true});
      }
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
