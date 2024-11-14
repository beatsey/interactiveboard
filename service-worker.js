//self.addEventListener("install", (event) => {
//    event.waitUntil(
//        caches.open("app-cache").then((cache) => {
//            return cache.addAll([
//                "board.html",
//                "main.css",
//                "main.js",
//                "manifest.json",
//                "service-worker.js",
//                "state.json",
//            ]);
//        })
//    );
//});
//
//self.addEventListener("fetch", (event) => {
//    event.respondWith(
//        caches.match(event.request).then((response) => {
//            return response || fetch(event.request);
//        })
//    );
//});
