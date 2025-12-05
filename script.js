document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.getElementById('themeToggle');
    const iconEl = toggleBtn ? toggleBtn.querySelector('.theme-icon') : null;
    const introOverlay = document.getElementById('introOverlay');
    const investorOverlay = document.getElementById('introOverlayInvestor');
    const approvalsOverlay = document.getElementById('introOverlayApprovals');
    const fourthOverlay = document.getElementById('introOverlayFourth');

    // Used to keep hero intro timings in sync across loops
    let introCycleId = 0;

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

        resetIntroOverlays();

        // Show first intro overlay (images) after 2 seconds, then hide after animation (~3.5s)
        if (introOverlay) {
            setTimeout(function () {
                if (cycleId !== introCycleId) return;
                introOverlay.classList.add('intro-start');
                setTimeout(function () {
                    if (cycleId !== introCycleId) return;
                    introOverlay.classList.add('intro-hide');
                }, 3500);
            }, 2000);
        }

        // After first overlay hides, show Investor First overlay
        if (investorOverlay) {
            const firstTotal = 2000 + 3500; // delay + duration of first overlay

            setTimeout(function () {
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
                setTimeout(async () => {
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
                            setTimeout(() => {
                                pillItems[i].style.opacity = '1';
                                pillItems[i].style.transform = 'translateX(0)';
                                pillItems[i].classList.add('investor-pill-pop');
                                resolve();
                            }, 200 * i);
                        });
                    }
                }, 100);

                // Hide after all animations complete
                setTimeout(function () {
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

            setTimeout(function () {
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

                setTimeout(async () => {
                    if (smallText) {
                        smallText.classList.add('approvals-small-pop');
                    }

                    await new Promise(resolve => setTimeout(resolve, 250));

                    if (heading) {
                        heading.classList.add('approvals-heading-pop');
                    }

                    await new Promise(resolve => setTimeout(resolve, 300));

                    for (let i = 0; i < points.length; i++) {
                        await new Promise(resolve => {
                            setTimeout(() => {
                                points[i].classList.add('approvals-pill-pop');
                                resolve();
                            }, 180 * i);
                        });
                    }
                }, 100);

                // Hide approvals overlay after some time
                setTimeout(function () {
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

            setTimeout(function () {
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

                setTimeout(async () => {
                    if (smallText) {
                        smallText.classList.add('approvals-small-pop');
                    }

                    await new Promise(resolve => setTimeout(resolve, 250));

                    if (heading) {
                        heading.classList.add('approvals-heading-pop');
                    }

                    await new Promise(resolve => setTimeout(resolve, 300));

                    for (let i = 0; i < points.length; i++) {
                        await new Promise(resolve => {
                            setTimeout(() => {
                                points[i].classList.add('approvals-pill-pop');
                                resolve();
                            }, 200 * i);
                        });
                    }
                }, 100);

                // After some time, pause video briefly and then restart the hero intro loop
                setTimeout(function () {
                    if (cycleId !== introCycleId) return;
                    const videoEl = document.querySelector('.hero-video-section video');
                    if (videoEl) {
                        try {
                            // Pause video at end of cycle
                            videoEl.pause();
                        } catch (e) {
                            // ignore playback errors
                        }
                    }

                    // Hide 4th overlay after 2 seconds of paused video
                    setTimeout(function () {
                        if (cycleId !== introCycleId) return;
                        fourthOverlay.classList.add('intro-hide');
                    }, 2000);

                    // After full 3 seconds, restart video and the whole intro sequence
                    setTimeout(function () {
                        if (cycleId !== introCycleId) return;
                        const v = document.querySelector('.hero-video-section video');
                        if (v) {
                            try {
                                v.currentTime = 0;
                                v.play();
                            } catch (e) {
                                // ignore playback errors
                            }
                        }
                        runIntroSequence();
                    }, 3000);
                }, 9000);

            }, thirdTotal);
        }
    }

    // Start the looping intro sequence
    runIntroSequence();

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
        }
    ];

    const sectionMap = new Map();

    sectionConfigs.forEach((config) => {
        const sectionEl = document.querySelector(config.sectionSelector);
        if (!sectionEl) return;

        const targets = [];
        config.itemSelectors.forEach((sel) => {
            sectionEl.querySelectorAll(sel).forEach((el) => {
                // Set base hidden state for scroll animation
                el.classList.add('animate-on-scroll');
                targets.push(el);
            });
        });

        if (targets.length) {
            sectionMap.set(sectionEl, targets);
        }
    });

    if ('IntersectionObserver' in window && sectionMap.size) {
        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const targets = sectionMap.get(entry.target);
                    if (!targets || !targets.length) {
                        obs.unobserve(entry.target);
                        return;
                    }

                    // Reveal this section's items one by one for a modern feel
                    targets.forEach((el, index) => {
                        const delayMs = index * 120; // 0.12s stagger per item
                        setTimeout(() => {
                            el.classList.add('is-visible');
                        }, delayMs);
                    });

                    sectionMap.delete(entry.target);
                    obs.unobserve(entry.target);
                });
            },
            {
                threshold: 0.25,
                rootMargin: '0px 0px -10% 0px',
            }
        );

        sectionMap.forEach((_targets, sectionEl) => {
            observer.observe(sectionEl);
        });
    } else {
        // Fallback: if IntersectionObserver unsupported, show everything
        sectionMap.forEach((targets) => {
            targets.forEach((el) => el.classList.add('is-visible'));
        });
    }
});
