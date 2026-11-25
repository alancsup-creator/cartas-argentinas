// Service worker del Salón de Cartas: permite instalar la app y jugar en modo local sin conexión.
// Si publicás cambios en index.html, subí el número de versión para que los celulares se actualicen.
const V="salon-v1",CORE=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./icon-maskable-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  if(u.origin!==location.origin)return; // Firebase y las fuentes van directo a la red
  if(r.mode==="navigate"){ // primero la red (para recibir actualizaciones); sin conexión, la copia guardada
    e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(ch=>ch.put("./index.html",c));return x}).catch(()=>caches.match("./index.html")));return}
  e.respondWith(caches.match(r).then(h=>h||fetch(r).then(x=>{const c=x.clone();caches.open(V).then(ch=>ch.put(r,c));return x})))});
