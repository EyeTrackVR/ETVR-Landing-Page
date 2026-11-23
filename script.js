// Theme: light by default, like the docs. The choice is remembered; an inline script in <head> applies it before first paint.
// The control is a switch (off = light, on = dark), the same one the docs use; it stays hidden until this script can drive it.
// The choice is shared with the docs through an `etvr-theme` cookie on eyetrackvr.dev, which both sites read (the docs side is in EyeTrackVR-Docs, .vitepress/seo.js and .vitepress/theme/index.ts). localStorage is the fallback when cookies are off.
const themeSwitch = document.querySelector('.theme-switch');
if (themeSwitch) {
    const root = document.documentElement;
    const sync = () => themeSwitch.setAttribute('aria-checked', String(root.classList.contains('dark')));
    const sharedTheme = () => {
        try { return document.cookie.match(/(?:^|; )etvr-theme=(dark|light)/)?.[1]; } catch (error) { return undefined; }
    };
    const remember = (theme) => {
        try { localStorage.setItem('etvr-theme', theme); } catch (error) { /* private mode: the choice just lasts for this page */ }
        try {
            const domain = /(^|\.)eyetrackvr\.dev$/.test(location.hostname) ? '; domain=eyetrackvr.dev' : '';
            const secure = location.protocol === 'https:' ? '; secure' : '';
            document.cookie = `etvr-theme=${theme}; path=/; max-age=31536000; samesite=lax${domain}${secure}`;
        } catch (error) { /* cookies off: this site still remembers, the docs will not follow */ }
    };
    themeSwitch.addEventListener('click', () => {
        remember(root.classList.toggle('dark') ? 'dark' : 'light');
        sync();
    });
    // Coming back to this page (back button, or another tab) after switching on the docs: follow that choice.
    const follow = () => {
        const theme = sharedTheme();
        if (theme) root.classList.toggle('dark', theme === 'dark');
        sync();
    };
    window.addEventListener('pageshow', follow);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) follow(); });
    sync();
    themeSwitch.closest('.nav-appearance').hidden = false;
}

const header = document.querySelector('.site-header');

// Like the docs nav bar, the header only draws its bottom rule once the page has scrolled.
if (header) {
    const markScrolled = () => header.toggleAttribute('data-scrolled', window.scrollY > 0);
    window.addEventListener('scroll', markScrolled, { passive: true });
    markScrolled();
}

// Only collapse navigation after its controls are ready; links remain available without JS.
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('#nav-menu');
const mobileMenu = window.matchMedia('(max-width: 767px)');

if (header && menuToggle && navMenu) {
    const setMenuOpen = (open) => {
        header.dataset.menuOpen = String(open);
        menuToggle.setAttribute('aria-expanded', String(open));
        menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    };

    menuToggle.addEventListener('click', () => {
        setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
            setMenuOpen(false);
            menuToggle.focus();
        }
    });
    document.addEventListener('click', (event) => {
        if (!header.contains(event.target)) setMenuOpen(false);
    });
    // Close when focus moves to something outside the header. A tap on empty space inside the open menu also fires focusout, with nothing taking focus, and must not close it.
    header.addEventListener('focusout', (event) => {
        if (event.relatedTarget && !header.contains(event.relatedTarget)) setMenuOpen(false);
    });
    navMenu.addEventListener('click', (event) => {
        if (event.target.closest('a')) setMenuOpen(false);
    });
    mobileMenu.addEventListener('change', () => setMenuOpen(false));
    setMenuOpen(false);
    menuToggle.hidden = false;
    header.dataset.menuReady = 'true';
}

// Start the featured video without captions, even when muted autoplay enables them.
// Apply this once so visitors can still turn captions on in YouTube's controls.
const featuredVideo = document.querySelector('#hero-video-player');
if (featuredVideo) {
    const videoUrl = new URL(featuredVideo.src);
    videoUrl.searchParams.set('origin', window.location.origin);
    featuredVideo.src = videoUrl.href;

    const initializeFeaturedVideo = () => {
        let captionsInitialized = false;
        const disableInitialCaptions = ({ target: player }) => {
            if (captionsInitialized || player.getPlayerState() !== 1) return;
            captionsInitialized = true;
            player.setOption('captions', 'track', {});
            player.unloadModule('captions');
        };
        new window.YT.Player(featuredVideo, {
            events: {
                onReady: disableInitialCaptions,
                onApiChange: disableInitialCaptions,
                onStateChange: disableInitialCaptions,
            },
        });
    };

    if (window.YT?.Player) {
        initializeFeaturedVideo();
    } else {
        window.onYouTubeIframeAPIReady = initializeFeaturedVideo;
        const playerApi = document.createElement('script');
        playerApi.src = 'https://www.youtube.com/iframe_api';
        playerApi.async = true;
        document.head.append(playerApi);
    }
}
