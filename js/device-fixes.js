(function () {
    'use strict';

    var isIPad = /iPad/i.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isIPad) {
        document.documentElement.classList.add('is-ipad');
    }
}());
