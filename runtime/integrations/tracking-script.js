(() => {
    const getParameters = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const params = {};
        
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'voucherCode'].forEach(param => {
            if (urlParams.has(param)) {
                params[param] = urlParams.get(param);
            }
        });
        
        return params;
    };
    
    const updateLinks = () => {
        const ctaButtons = document.querySelectorAll('a[href*="tarifrechner"]');
        if (ctaButtons.length === 0) return;
        
        const params = getParameters();
        if (Object.keys(params).length === 0) return;
        
        ctaButtons.forEach(button => {
            const currentHref = button.getAttribute('href');
            const url = new URL(currentHref, window.location.origin);
            
            Object.keys(params).forEach(key => {
                url.searchParams.set(key, params[key]);
            });
            
            button.setAttribute('href', url.toString());
        });
    };
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateLinks);
    } else {
        updateLinks();
    }
})();
