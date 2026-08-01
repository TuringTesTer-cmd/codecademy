(function () {
    'use strict';

    const config = window.siteTranslations || { common: {}, pages: {} };

    function currentLanguage() {
        const value = new URLSearchParams(window.location.search).get('lang');
        return value === 'en' ? 'en' : 'es';
    }

    function pageKey() {
        return document.body.dataset.page || 'profile';
    }

    function preserveWhitespace(original, translated) {
        const leading = original.match(/^\s*/)?.[0] || '';
        const trailing = original.match(/\s*$/)?.[0] || '';
        return leading + translated + trailing;
    }

    function translateTextNodes(dictionary) {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const nodes = [];
        let node;

        while ((node = walker.nextNode())) {
            const parent = node.parentElement;
            if (!parent || parent.closest('#language-switcher, [data-i18n-ignore]')) continue;
            if (/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/i.test(parent.tagName)) continue;
            const source = node.nodeValue.trim();
            if (source && Object.prototype.hasOwnProperty.call(dictionary, source)) {
                nodes.push([node, dictionary[source]]);
            }
        }

        nodes.forEach(([textNode, translated]) => {
            textNode.nodeValue = preserveWhitespace(textNode.nodeValue, translated);
        });
    }

    function translateAttributes(dictionary) {
        const attributes = ['alt', 'title', 'placeholder'];
        document.querySelectorAll('*').forEach((element) => {
            attributes.forEach((attribute) => {
                if (!element.hasAttribute(attribute)) return;
                const source = element.getAttribute(attribute).trim();
                if (Object.prototype.hasOwnProperty.call(dictionary, source)) {
                    element.setAttribute(attribute, dictionary[source]);
                }
            });
        });
    }

    function updateLanguageAwareResources(language) {
        document.querySelectorAll('[data-href-es][data-href-en]').forEach((link) => {
            link.setAttribute('href', link.dataset[language === 'en' ? 'hrefEn' : 'hrefEs']);
        });
    }

    function isInternalHtmlLink(anchor) {
        const href = anchor.getAttribute('href');
        if (!href || href.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(href)) return false;
        if (anchor.hasAttribute('data-href-es')) return false;
        const url = new URL(href, document.baseURI);
        if (window.location.protocol !== 'file:' && url.origin !== window.location.origin) return false;
        return /\.html$/i.test(url.pathname) || url.pathname.endsWith('/');
    }

    function keepLanguageAcrossNavigation(language) {
        document.querySelectorAll('a[href]').forEach((anchor) => {
            if (anchor.id === 'language-switcher' || !isInternalHtmlLink(anchor)) return;
            const url = new URL(anchor.getAttribute('href'), document.baseURI);
            url.searchParams.set('lang', language);
            const filename = url.pathname.split('/').pop() || 'index.html';
            anchor.setAttribute('href', filename + url.search + url.hash);
        });
    }

    function configureSwitcher(language) {
        const switcher = document.getElementById('language-switcher');
        if (!switcher) return;
        const target = language === 'en' ? 'es' : 'en';
        const url = new URL(window.location.href);
        url.searchParams.set('lang', target);
        switcher.textContent = target.toUpperCase();
        switcher.href = url.href;
        switcher.setAttribute('lang', target);
        switcher.setAttribute(
            'aria-label',
            language === 'en' ? 'Switch to Spanish' : 'Cambiar a inglés'
        );
    }

    function apply() {
        const language = currentLanguage();
        const dictionary = {
            ...(config.common || {}),
            ...((config.pages || {})[pageKey()] || {})
        };

        document.documentElement.lang = language;
        updateLanguageAwareResources(language);

        if (language === 'en') {
            if (Object.prototype.hasOwnProperty.call(dictionary, document.title)) {
                document.title = dictionary[document.title];
            }
            translateTextNodes(dictionary);
            translateAttributes(dictionary);
        }

        keepLanguageAcrossNavigation(language);
        configureSwitcher(language);
        document.documentElement.classList.remove('i18n-loading');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', apply, { once: true });
    } else {
        apply();
    }
})();
