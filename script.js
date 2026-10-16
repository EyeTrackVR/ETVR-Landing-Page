// Keep hover highlights local to each frosted surface. Links work without JavaScript.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

for (const surface of document.querySelectorAll('.frosted')) {
    let frame;
    surface.addEventListener('pointermove', (event) => {
        if (event.pointerType === 'touch' || reducedMotion.matches) return;
        const bounds = surface.getBoundingClientRect();
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
            surface.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
            surface.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
        });
    });
    surface.addEventListener('pointerleave', () => {
        cancelAnimationFrame(frame);
        surface.style.removeProperty('--pointer-x');
        surface.style.removeProperty('--pointer-y');
    });
}

// Only collapse navigation after its controls are ready; links remain available without JS.
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('#nav-menu');
const mobileMenu = window.matchMedia('(max-width: 1050px)');

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
    header.addEventListener('focusout', (event) => {
        if (!header.contains(event.relatedTarget)) setMenuOpen(false);
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
