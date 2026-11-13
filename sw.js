// Verificación de encamados INSESO: guarda la página en el teléfono para abrirla sin cobertura.
// Al publicar una versión nueva, cambie V.
const PREFIJO = "encamados-", V = PREFIJO + "v6";
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(["./", "./index.html", "./manifest.json"].map(u => new Request(u, {cache: "reload"}))))); self.skipWaiting(); });
// Solo borra sus propias cachés antiguas, nunca las de la app otras apps
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith(PREFIJO) && k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return; // las consultas de localidad van siempre a la red
  e.respondWith(fetch(e.request).then(r => { if (r.ok) { const c = r.clone(); caches.open(V).then(k => k.put(e.request, c)); } return r; })
    .catch(() => caches.match(e.request, {ignoreSearch: true}).then(r => r || caches.match("./index.html"))));
});
