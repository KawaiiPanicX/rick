document.addEventListener('DOMContentLoaded', () => {
    const logoContainer = document.getElementById('logo-container');
    const mobileControlsGroup = document.getElementById('mobile-controls-group');
    const hamburgerMenuBtn = document.getElementById('hamburger-menu-btn');
    const sideMenu = document.getElementById('side-menu');
    const sideMenuCloseBtn = document.getElementById('side-menu-close-btn');
    const desktopHeaderElements = document.getElementById('desktop-header-elements');

    const searchIconBtnMobileTrigger = document.getElementById('search-icon-btn-mobile-trigger');
    const mobileSearchActiveState = document.getElementById('mobile-search-active-state');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    const searchClearBtnMobile = document.getElementById('search-clear-btn-mobile');
    const searchSubmitBtnMobile = document.getElementById('search-submit-btn-mobile');

    const dynamicContentIframe = document.getElementById('dynamic-content-iframe');
    const loaderContainer = document.getElementById('loader-container');
    const mainContentArea = document.getElementById('main-content-area');
    const mainHeader = document.querySelector('.main-header');
    const mainFooter = document.querySelector('.main-footer');

    // --- Configuration for GitHub Pages Base Path ---
    const BASE_PATH = '';

    // Function to handle navigation and update browser history
    function navigate(route, pushState = true) {
        let browserUrl = '';
        if (window.location.protocol === 'blob:') {
            console.warn("Cannot use history.pushState with blob: URLs. URL in address bar will not change.");
            pushState = false;
            browserUrl = window.location.href;
        } else {
            browserUrl = BASE_PATH + route;
        }

        const iframeSrc = pageRoutes[route] || pageRoutes['/404'];

        if (pushState) {
            history.pushState({ path: route }, '', browserUrl);
        }

        dynamicContentIframe.classList.remove('loaded');
        loaderContainer.style.opacity = '1';
        loaderContainer.style.pointerEvents = 'auto';

        dynamicContentIframe.src = iframeSrc;

        if (sideMenu.classList.contains('open')) {
            sideMenu.classList.remove('open');
        }
    }

    // Event listener for iframe load completion
    dynamicContentIframe.addEventListener('load', () => {
        loaderContainer.style.opacity = '0';
        loaderContainer.style.pointerEvents = 'none';
        dynamicContentIframe.classList.add('loaded');
    });

    // Handle browser back/forward buttons
    window.onpopstate = (event) => {
        let path = event.state ? event.state.path : window.location.pathname;

        if (window.location.protocol === 'blob:') {
            path = '/';
        } else {
            path = path.replace(BASE_PATH, '');
        }

        navigate(path || '/', false);
    };

    // Initial load based on current URL
    let initialPath = window.location.pathname;
    if (window.location.protocol === 'blob:') {
        initialPath = '/';
    } else {
        initialPath = initialPath.replace(BASE_PATH, '');
    }
    navigate(initialPath || '/', true);

    // Function to ensure main content area fills available space
    function setMainContentAreaMinHeight() {
        const headerHeight = mainHeader.offsetHeight;
        const footerHeight = mainFooter.offsetHeight;
        const minHeightNeeded = window.innerHeight - headerHeight - footerHeight;
        mainContentArea.style.minHeight = `${minHeightNeeded > 0 ? minHeightNeeded : 0}px`;
    }

    // Call on load and resize
    setMainContentAreaMinHeight();
    window.addEventListener('resize', setMainContentAreaMinHeight);

    // --- Mobile Side Menu Logic ---
    hamburgerMenuBtn.addEventListener('click', () => {
        sideMenu.classList.add('open');
    });

    sideMenuCloseBtn.addEventListener('click', () => {
        sideMenu.classList.remove('open');
    });

    document.addEventListener('click', (event) => {
        if (sideMenu.classList.contains('open') &&
            !sideMenu.contains(event.target) &&
            !hamburgerMenuBtn.contains(event.target) &&
            !searchIconBtnMobileTrigger.contains(event.target) &&
            !mobileSearchActiveState.contains(event.target)) {
            sideMenu.classList.remove('open');
        }
    });

    // Toggle submenus for mobile side menu
    const sideMenuHasSubmenuItems = document.querySelectorAll('.side-menu ul li.has-submenu > a');
    sideMenuHasSubmenuItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            const parentLi = item.parentElement;
            parentLi.classList.toggle('open');
            const submenu = parentLi.querySelector('ul');
            if (submenu) {
                if (parentLi.classList.contains('open')) {
                    submenu.style.maxHeight = submenu.scrollHeight + "px";
                } else {
                    submenu.style.maxHeight = "0";
                }
            }
        });
    });

    // --- Desktop Dropdown Menu Logic ---
    const desktopNavSubmenuItems = document.querySelectorAll('.desktop-nav > ul > li.has-submenu');

    desktopNavSubmenuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const submenu = item.querySelector('ul');
            if (submenu) {
                submenu.style.opacity = '1';
                submenu.style.visibility = 'visible';
                submenu.style.transform = 'translateY(0)';
            }
        });

        item.addEventListener('mouseleave', () => {
            const submenu = item.querySelector('ul');
            if (submenu) {
                submenu.style.opacity = '0';
                submenu.style.visibility = 'hidden';
                submenu.style.transform = 'translateY(4px)';
            }
        });
    });

    // --- Mobile Search Functionality ---
    searchIconBtnMobileTrigger.addEventListener('click', () => {
        if (window.innerWidth < 768) {
            logoContainer.style.opacity = '0';
            logoContainer.style.width = '0';
            logoContainer.style.pointerEvents = 'none';

            mobileControlsGroup.style.opacity = '0';
            mobileControlsGroup.style.width = '0';
            mobileControlsGroup.style.pointerEvents = 'none';

            mobileSearchActiveState.classList.add('visible');
            mobileSearchInput.focus();
        }
    });

    searchClearBtnMobile.addEventListener('click', () => {
        mobileSearchInput.value = '';

        mobileSearchActiveState.classList.remove('visible');

        logoContainer.style.opacity = '1';
        logoContainer.style.width = 'auto';
        logoContainer.style.pointerEvents = 'auto';

        mobileControlsGroup.style.opacity = '1';
        mobileControlsGroup.style.width = 'auto';
        mobileControlsGroup.style.pointerEvents = 'auto';
    });

    searchSubmitBtnMobile.addEventListener('click', () => {
        const searchTerm = mobileSearchInput.value.trim();
        if (searchTerm) {
            console.log("Mobile Search submitted:", searchTerm);
            dynamicContentIframe.src = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
            searchClearBtnMobile.click();
        } else {
            console.log("Please enter a search term.");
        }
    });

    // --- Desktop Search Functionality ---
    const desktopSearchInput = document.getElementById('desktop-search-input');
    const searchIconBtnDesktop = document.getElementById('search-icon-btn-desktop');

    searchIconBtnDesktop.addEventListener('click', () => {
        const searchTerm = desktopSearchInput.value.trim();
        if (searchTerm) {
            console.log("Desktop Search submitted:", searchTerm);
            dynamicContentIframe.src = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
        } else {
            console.log("Please enter a search term for desktop search.");
        }
    });

    desktopSearchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            searchIconBtnDesktop.click();
        }
    });

    // --- Window Resize Logic to Reset UI ---
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            mobileSearchActiveState.classList.remove('visible');
            mobileSearchInput.value = '';

            logoContainer.style.opacity = '1';
            logoContainer.style.width = 'auto';
            logoContainer.style.pointerEvents = 'auto';

            mobileControlsGroup.style.opacity = '1';
            mobileControlsGroup.style.width = 'auto';
            mobileControlsGroup.style.pointerEvents = 'auto';
        }
        setMainContentAreaMinHeight();
    });

    // --- Navigation Link Click Handler (Unified) ---
    const allNavLinks = document.querySelectorAll('a[data-route]');
    allNavLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const route = link.getAttribute('data-route');
            if (route) {
                navigate(route);
            } else {
                console.warn("Navigation link clicked without a data-route:", link);
            }
        });
    });
});


