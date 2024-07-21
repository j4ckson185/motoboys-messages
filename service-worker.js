self.addEventListener('install', event => {
    console.log('Service Worker instalado');
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('Service Worker ativado');
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
});

self.addEventListener('notificationclose', event => {
    console.log('Notificação fechada');
});
