
/*
	ServiceWorker can not be module at present (12-2018), so
	you need to copy the code to your project and include it
	inside master html (the appshell code)
 */
class ServiceWorker {
	constructor(context, name, urls) {
		context.addEventListener('install', (event) => {
			context.skipWaiting();
			event.waitUntil(
				caches.open(name).then((cache) => {
					return cache.addAll(urls);
				})
			);
		});

		context.addEventListener('activate', (event) => {
			event.waitUntil(
				caches.keys().then((cacheNames) => {
					return Promise.all(
						cacheNames.map((cacheName) => {
							if (name !== cacheName) {
								return caches.delete(cacheName);
							}
						})
					);
				})
			);
		});

		context.addEventListener('fetch', (event) => {
			event.respondWith(
				caches.match(event.request).then((response) => {
					if (response) {
						return response;
					}
					return fetch(event.request);
				})
			);
		});
	}

	run() {
		main();
	}
}

const CACHE_NAME = 'webui-v1';
const urlsToCache = [
	// Put your assets here
	//'asset/application.css',
	//'main.js'
];

let sw = new ServiceWorker(self, CACHE_NAME, urlsToCache);
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/sw.js').then(registration => {
			sw.run();
		}, error => {
			console.log('ServiceWorker registration failed: ', error);
		});
	})
}
