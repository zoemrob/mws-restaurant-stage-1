class ServiceWorkerController {
    constructor() {
        this._register();
    };

    _register() {
        if (!navigator.serviceWorker) return;

        navigator.serviceWorker.register('/sw.js').then(reg => {
            console.log('Service worker registered');
            if (!navigator.serviceWorker.controller) return;

            if (reg.waiting) {
                this._updateReady(reg.waiting);
                return;
            }

            if (reg.installing) {
                this._trackInstall(reg.installing);
                return;
            }

            reg.addEventListener('updatefound', () => {
                this._trackInstall(reg.installing);
            });

        }).catch(err => {
            console.log('Service worker registration failed', err);
        });

        navigator.serviceWorker.addEventListener('controllerchange', () => {
            location.reload();
        });
    }

    _updateReady(worker) {
        worker.postMessage('skip');
    }

    _trackInstall(worker) {
        worker.addEventListener('statechange', () => {
            if (worker.state === 'installed') {
                this._updateReady(worker);
            }
        })
    }
};