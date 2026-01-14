document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.getElementById('themeToggle');
    const iconEl = toggleBtn ? toggleBtn.querySelector('.theme-icon') : null;
    const introOverlay = document.getElementById('introOverlay');
    const investorOverlay = document.getElementById('introOverlayInvestor');
    const approvalsOverlay = document.getElementById('introOverlayApprovals');
    const fourthOverlay = document.getElementById('introOverlayFourth');

    const heroActionStrip = document.querySelector('.hero-action-strip');
    const heroVideo = document.querySelector('.hero-video-section video');

    // Keep the hero background video playing reliably (some browsers pause it after long idle)
    function ensureHeroVideoPlaying(videoEl) {
        if (!videoEl) return;

        // Reinforce required attributes for autoplay
        videoEl.muted = true;
        videoEl.loop = true;
        videoEl.playsInline = true;

        if (document.hidden) return;

        if (videoEl.paused || videoEl.ended) {
            const p = videoEl.play();
            if (p && typeof p.catch === 'function') {
                p.catch(() => {
                    // ignore autoplay / resume failures
                });
            }
        }
    }

    if (heroVideo) {
        document.addEventListener('visibilitychange', () => {
            ensureHeroVideoPlaying(heroVideo);
        });

        heroVideo.addEventListener('pause', () => {
            ensureHeroVideoPlaying(heroVideo);
        });

        heroVideo.addEventListener('ended', () => {
            try {
                heroVideo.currentTime = 0;
            } catch (e) {
                // ignore
            }
            ensureHeroVideoPlaying(heroVideo);
        });

        heroVideo.addEventListener('stalled', () => {
            ensureHeroVideoPlaying(heroVideo);
        });

        heroVideo.addEventListener('waiting', () => {
            ensureHeroVideoPlaying(heroVideo);
        });
    }

    // Keep hero action buttons in sync with the video playback
    // Hide on (re)start, then show again after 8 seconds each time the video starts/loops
    let heroButtonsTimeoutId = null;

    function scheduleHeroButtonsFromVideo() {
        if (!heroActionStrip) return;

        // Always hide first, then re-show after delay
        heroActionStrip.classList.remove('is-visible');

        if (heroButtonsTimeoutId) {
            clearTimeout(heroButtonsTimeoutId);
        }

        heroButtonsTimeoutId = setTimeout(() => {
            heroActionStrip.classList.add('is-visible');
        }, 8000);
    }

    if (heroVideo && heroActionStrip) {
        // Only (re)trigger the delay when a NEW video cycle starts.
        // This avoids hiding buttons when the video emits play again due to tab focus changes.
        let lastTime = 0;
        let scheduledThisCycle = false;

        function maybeScheduleForCycleStart() {
            if (scheduledThisCycle) return;
            if (heroVideo.currentTime <= 0.25) {
                scheduledThisCycle = true;
                scheduleHeroButtonsFromVideo();
            }
        }

        heroVideo.addEventListener('timeupdate', () => {
            const t = heroVideo.currentTime;
            if ((t + 0.25) < lastTime && t <= 0.25) {
                scheduledThisCycle = false;
                maybeScheduleForCycleStart();
            }
            maybeScheduleForCycleStart();
            lastTime = t;
        });

        maybeScheduleForCycleStart();
    } else if (heroActionStrip) {
        // Fallback: if no video element found, keep previous one-time 8s delay
        setTimeout(() => {
            heroActionStrip.classList.add('is-visible');
        }, 8000);
    }

    // Used to keep hero intro timings in sync across loops
    let introCycleId = 0;

    // Track timeouts used by the hero intro overlays so they don't stack up over time
    const introTimeoutIds = [];

    function clearIntroTimeouts() {
        while (introTimeoutIds.length) {
            const id = introTimeoutIds.pop();
            clearTimeout(id);
        }
    }

    function setIntroTimeout(fn, delay) {
        const id = setTimeout(fn, delay);
        introTimeoutIds.push(id);
        return id;
    }

    // Theme toggle functionality only
    if (toggleBtn && iconEl) {
        toggleBtn.addEventListener('click', function () {
            const isDark = document.body.classList.toggle('dark-theme');
            iconEl.classList.remove('lni-sun-1', 'lni-moon-half-right-5');
            iconEl.classList.add(isDark ? 'lni-moon-half-right-5' : 'lni-sun-1');
        });
    }

    // Reset overlay state so animations can replay
    function resetIntroOverlays() {
        [introOverlay, investorOverlay, approvalsOverlay, fourthOverlay].forEach(overlay => {
            if (!overlay) return;
            overlay.classList.remove('intro-start', 'intro-hide');
        });

        // Remove animation classes so CSS animations can trigger again
        const investorHeading = document.querySelector('.investor-heading');
        const investorSubheading = document.querySelector('.investor-subheading');
        const investorPills = document.querySelectorAll('.investor-pill-item');
        const approvalsSmall = document.querySelector('.approvals-small-text');
        const approvalsHeading = document.querySelector('.approvals-heading');
        const approvalsPills = document.querySelectorAll('.approvals-point-item');
        const fourthSmall = document.querySelector('.fourth-small-text');
        const fourthHeading = document.querySelector('.fourth-heading');
        const fourthPills = document.querySelectorAll('.fourth-point-item');

        investorHeading && investorHeading.classList.remove('investor-heading-pop');
        investorSubheading && (investorSubheading.style.opacity = '');

        investorPills.forEach(item => {
            item.classList.remove('investor-pill-pop');
            item.style.opacity = '';
            item.style.transform = '';
        });

        approvalsSmall && approvalsSmall.classList.remove('approvals-small-pop');
        approvalsHeading && approvalsHeading.classList.remove('approvals-heading-pop');
        approvalsPills.forEach(item => {
            item.classList.remove('approvals-pill-pop');
            item.style.opacity = '';
            item.style.transform = '';
        });

        fourthSmall && fourthSmall.classList.remove('approvals-small-pop');
        fourthHeading && fourthHeading.classList.remove('approvals-heading-pop');
        fourthPills.forEach(item => {
            item.classList.remove('approvals-pill-pop');
            item.style.opacity = '';
            item.style.transform = '';
        });
    }

    function runIntroSequence() {
        // Bump the cycle ID so any old timeouts from previous loops do nothing
        const cycleId = ++introCycleId;

        // Ensure no timers from previous cycles are still pending
        clearIntroTimeouts();

        resetIntroOverlays();

        // Show first intro overlay (images) after 2 seconds, then hide after animation (~3.5s)
        if (introOverlay) {
            setIntroTimeout(function () {
                if (cycleId !== introCycleId) return;
                introOverlay.classList.add('intro-start');
                setIntroTimeout(function () {
                    if (cycleId !== introCycleId) return;
                    introOverlay.classList.add('intro-hide');
                }, 3500);
            }, 2000);
        }

        // After first overlay hides, show Investor First overlay
        if (investorOverlay) {
            const firstTotal = 2000 + 3500; // delay + duration of first overlay

            setIntroTimeout(function () {
                if (cycleId !== introCycleId) return;
                investorOverlay.classList.add('intro-start');

                // Get all elements to animate
                const heading = document.querySelector('.investor-heading');
                const subheading = document.querySelector('.investor-subheading');
                const pillItems = document.querySelectorAll('.investor-pill-item');

                // Prepare elements for animation
                heading.style.opacity = '0';
                heading.style.transform = 'translateX(50px)';
                heading.style.transition = 'all 0.5s ease-out';

                subheading.style.opacity = '0';
                subheading.style.transform = 'translateX(50px)';
                subheading.style.transition = 'all 0.5s ease-out';

                // Hide pill items initially
                pillItems.forEach(item => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(50px)';
                    item.style.transition = 'all 0.5s ease-out';
                });

                // Animate elements sequentially
                setIntroTimeout(async () => {
                    if (cycleId !== introCycleId) return;
                    // Animate heading
                    heading.style.opacity = '1';
                    heading.style.transform = 'translateX(0)';
                    heading.classList.add('investor-heading-pop');

                    // After heading animation, animate subheading
                    await new Promise(resolve => setTimeout(resolve, 300));
                    subheading.style.opacity = '1';
                    subheading.style.transform = 'translateX(0)';

                    // After subheading, animate pill items with delay
                    await new Promise(resolve => setTimeout(resolve, 300));

                    for (let i = 0; i < pillItems.length; i++) {
                        await new Promise(resolve => {
                            setIntroTimeout(() => {
                                if (cycleId !== introCycleId) return;
                                pillItems[i].style.opacity = '1';
                                pillItems[i].style.transform = 'translateX(0)';
                                pillItems[i].classList.add('investor-pill-pop');
                                resolve();
                            }, 200 * i);
                        });
                    }
                }, 100);

                // Hide after all animations complete
                setIntroTimeout(function () {
                    if (cycleId !== introCycleId) return;
                    investorOverlay.classList.add('intro-hide');
                }, 8500); // Show for 10 seconds after animations start

            }, firstTotal);
        }

        // After Investor overlay hides, show Approvals overlay
        if (approvalsOverlay) {
            const firstTotal = 2000 + 3500; // same as above
            const investorDuration = 10000;  // as used above
            const secondTotal = firstTotal + investorDuration;

            setIntroTimeout(function () {
                if (cycleId !== introCycleId) return;
                approvalsOverlay.classList.add('intro-start');

                const smallText = document.querySelector('.approvals-small-text');
                const heading = document.querySelector('.approvals-heading');
                const points = document.querySelectorAll('.approvals-point-item');

                if (smallText) {
                    smallText.style.opacity = '0';
                    smallText.style.transform = 'translateY(20px)';
                }

                if (heading) {
                    heading.style.opacity = '0';
                    heading.style.transform = 'translateY(20px)';
                }

                points.forEach(item => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                });

                setIntroTimeout(async () => {
                    if (cycleId !== introCycleId) return;
                    if (smallText) {
                        smallText.classList.add('approvals-small-pop');
                    }

                    await new Promise(resolve => setTimeout(resolve, 250));

                    if (cycleId !== introCycleId) return;
                    if (heading) {
                        heading.classList.add('approvals-heading-pop');
                    }

                    await new Promise(resolve => setTimeout(resolve, 300));

                    for (let i = 0; i < points.length; i++) {
                        await new Promise(resolve => {
                            setIntroTimeout(() => {
                                if (cycleId !== introCycleId) return;
                                points[i].classList.add('approvals-pill-pop');
                                resolve();
                            }, 180 * i);
                        });
                    }
                }, 100);

                // Hide approvals overlay after some time
                setIntroTimeout(function () {
                    if (cycleId !== introCycleId) return;
                    approvalsOverlay.classList.add('intro-hide');
                }, 9000);

            }, secondTotal);
        }

        // After Approvals overlay hides, show Fourth overlay
        if (fourthOverlay) {
            const firstTotal = 2000 + 3500; // initial delay + first overlay
            const investorDuration = 10000;
            const approvalsDuration = 9000;
            const thirdTotal = firstTotal + investorDuration + approvalsDuration;

            setIntroTimeout(function () {
                if (cycleId !== introCycleId) return;
                fourthOverlay.classList.add('intro-start');

                const smallText = document.querySelector('.fourth-small-text');
                const heading = document.querySelector('.fourth-heading');
                const points = document.querySelectorAll('.fourth-point-item');

                if (smallText) {
                    smallText.style.opacity = '0';
                    smallText.style.transform = 'translateY(20px)';
                }

                if (heading) {
                    heading.style.opacity = '0';
                    heading.style.transform = 'translateY(20px)';
                }

                points.forEach(item => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                });

                setIntroTimeout(async () => {
                    if (cycleId !== introCycleId) return;
                    if (smallText) {
                        smallText.classList.add('approvals-small-pop');
                    }

                    await new Promise(resolve => setTimeout(resolve, 250));

                    if (cycleId !== introCycleId) return;
                    if (heading) {
                        heading.classList.add('approvals-heading-pop');
                    }

                    await new Promise(resolve => setTimeout(resolve, 300));

                    for (let i = 0; i < points.length; i++) {
                        await new Promise(resolve => {
                            setIntroTimeout(() => {
                                if (cycleId !== introCycleId) return;
                                points[i].classList.add('approvals-pill-pop');
                                resolve();
                            }, 200 * i);
                        });
                    }
                }, 100);

                // Hide fourth overlay after some time.
                // The next cycle will be restarted based on the actual video loop (see below).
                setIntroTimeout(function () {
                    if (cycleId !== introCycleId) return;
                    fourthOverlay.classList.add('intro-hide');
                }, 9000);

            }, thirdTotal);
        }
    }

    // Start/restart the looping intro sequence based on the actual video loop.
    // This prevents timer drift and overlay stacking after long runs.
    const introVideo = document.querySelector('.hero-video-section video');
    if (introVideo) {
        let lastIntroVideoTime = 0;
        let hasStartedOnce = false;

        function restartIntroForNewCycle() {
            hasStartedOnce = true;
            runIntroSequence();
        }

        introVideo.addEventListener('play', () => {
            if (!hasStartedOnce) {
                restartIntroForNewCycle();
            }
        });

        introVideo.addEventListener('timeupdate', () => {
            const t = introVideo.currentTime;
            if (t + 0.5 < lastIntroVideoTime) {
                restartIntroForNewCycle();
            }
            lastIntroVideoTime = t;
        });

        // Mobile browsers may block autoplay and therefore never emit play/timeupdate.
        // Always run the intro sequence once on load so the first scene is not missing.
        // If/when the video starts/loops, the handlers above will keep things in sync.
        ensureHeroVideoPlaying(introVideo);
        restartIntroForNewCycle();
    } else {
        runIntroSequence();
    }

    // Reforms carousel arrows
    const carouselViewport = document.querySelector('.reforms-carousel-viewport');
    const carouselTrack = document.querySelector('.reforms-carousel-track');
    const prevArrow = document.querySelector('.reforms-arrow-prev');
    const nextArrow = document.querySelector('.reforms-arrow-next');

    function scrollByCards(direction) {
        if (!carouselViewport || !carouselTrack) return;
        const cards = carouselTrack.querySelectorAll('.reform-card');
        if (!cards.length) return;

        const step = carouselViewport.clientWidth;
        carouselViewport.scrollBy({ left: direction * step, behavior: 'smooth' });
    }

    if (prevArrow && nextArrow) {
        prevArrow.addEventListener('click', () => scrollByCards(-1));
        nextArrow.addEventListener('click', () => scrollByCards(1));
    }

    // Punjab Leads carousel arrows
    const punjabViewport = document.querySelector('.punjab-leads-carousel-viewport');
    const punjabTrack = document.querySelector('.punjab-leads-carousel-track');
    const punjabPrev = document.querySelector('.punjab-leads-arrow-prev');
    const punjabNext = document.querySelector('.punjab-leads-arrow-next');

    function scrollPunjabLeads(direction) {
        if (!punjabViewport || !punjabTrack) return;
        const cards = punjabTrack.querySelectorAll('.punjab-lead-card');
        if (!cards.length) return;

        const step = punjabViewport.clientWidth;
        punjabViewport.scrollBy({ left: direction * step, behavior: 'smooth' });
    }

    if (punjabPrev && punjabNext) {
        punjabPrev.addEventListener('click', () => scrollPunjabLeads(-1));
        punjabNext.addEventListener('click', () => scrollPunjabLeads(1));
    }

    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Scroll-triggered content animations per section (below hero only)
    const sectionConfigs = [
        {
            sectionSelector: '.investor-first-section',
            itemSelectors: [
                '.investor-first-header',
                '.investor-first-media',
                '.investor-first-copy',
                '.investor-first-subheading',
                '.investor-first-list li'
            ]
        },
        {
            sectionSelector: '.invest-punjab-section',
            itemSelectors: [
                '.invest-eyebrow',
                '.invest-heading',
                '.invest-list',
                '.invest-actions .btn-invest-primary',
                '.invest-actions .btn-invest-ghost',
                '.invest-image-box'
            ]
        },
        {
            sectionSelector: '.inprinciple-section',
            itemSelectors: [
                '.inprinciple-heading',
                '.inprinciple-list',
                '.invest-actions .btn-invest-primary',
                '.invest-actions .btn-invest-ghost',
                '.inprinciple-image-box'
            ]
        },
        {
            sectionSelector: '.reforms-carousel-section',
            itemSelectors: [
                '.reform-card',
                '.reforms-cta-btn'
            ]
        },
        {
            sectionSelector: '.punjab-leads-section',
            itemSelectors: [
                '.punjab-leads-heading',
                '.punjab-lead-card'
            ]
        },
        {
            sectionSelector: '.advantage-punjab-section',
            itemSelectors: [
                '.advantage-heading',
                '.advantage-item-title'
            ]
        },
        {
            sectionSelector: '.footer-fasttrack',
            itemSelectors: [
                '.footer-logo-line1',
                '.footer-logo-line2',
                '.footer-logo-line3',
                '.footer-column-content'
            ]
        },
        {
            sectionSelector: 'body',
            itemSelectors: [
                '.invest-eyebrow.text-center'
            ]
        }
    ];

    const animationTargets = [];

    sectionConfigs.forEach((config) => {
        const sectionEls = document.querySelectorAll(config.sectionSelector);
        if (!sectionEls.length) return;

        sectionEls.forEach((sectionEl) => {
            config.itemSelectors.forEach((sel) => {
                sectionEl.querySelectorAll(sel).forEach((el, index) => {
                    // Set base hidden state for scroll animation
                    el.classList.add('animate-on-scroll');

                    if (
                        el.matches(
                            '.invest-heading, .inprinciple-heading, .punjab-leads-heading, .advantage-heading'
                        )
                    ) {
                        el.classList.add('from-left');
                    } else if (el.matches('.invest-eyebrow')) {
                        el.classList.add('from-right');
                    } else if (el.matches('.investor-first-media')) {
                        el.classList.add('from-left');
                    } else if (el.matches('.investor-first-header, .investor-first-copy, .investor-first-subheading')) {
                        el.classList.add('from-right');
                    }

                    if (el.matches('.investor-first-list li')) {
                        el.style.transitionDelay = `${index * 120}ms`;
                    }

                    animationTargets.push(el);
                });
            });
        });
    });

    if ('IntersectionObserver' in window && animationTargets.length) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const el = entry.target;

                    if (entry.isIntersecting) {
                        // Restart transition every time by toggling and forcing a reflow
                        el.classList.remove('is-visible');
                        void el.offsetWidth;
                        requestAnimationFrame(() => {
                            el.classList.add('is-visible');
                        });
                    } else {
                        el.classList.remove('is-visible');
                    }
                });
            },
            {
                threshold: 0.35,
                rootMargin: '0px 0px -5% 0px',
            }
        );

        animationTargets.forEach((el) => observer.observe(el));
    } else {
        // Fallback: if IntersectionObserver unsupported, show everything
        animationTargets.forEach((el) => el.classList.add('is-visible'));
    }
});
