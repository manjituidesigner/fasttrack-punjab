document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.getElementById('themeToggle');
    const iconEl = toggleBtn ? toggleBtn.querySelector('.theme-icon') : null;
    const introOverlay = document.getElementById('introOverlay');
    const investorOverlay = document.getElementById('introOverlayInvestor');
    const approvalsOverlay = document.getElementById('introOverlayApprovals');
    const fourthOverlay = document.getElementById('introOverlayFourth');

    // Theme toggle functionality only
    if (toggleBtn && iconEl) {
        toggleBtn.addEventListener('click', function () {
            const isDark = document.body.classList.toggle('dark-theme');
            iconEl.classList.remove('lni-sun-1', 'lni-moon-half-right-5');
            iconEl.classList.add(isDark ? 'lni-moon-half-right-5' : 'lni-sun-1');
        });
    }

    // Typewriter effect function
    function typeWriter(element, text, speed = 30, delay = 0) {
        return new Promise(resolve => {
            setTimeout(() => {
                let i = 0;
                element.textContent = '';
                function type() {
                    if (i < text.length) {
                        element.textContent += text.charAt(i);
                        i++;
                        setTimeout(type, speed);
                    } else {
                        resolve();
                    }
                }
                type();
            }, delay);
        });
    }

    // Show first intro overlay (images) after 2 seconds, then hide after animation (~3.5s)
    if (introOverlay) {
        setTimeout(function () {
            introOverlay.classList.add('intro-start');
            setTimeout(function () {
                introOverlay.classList.add('intro-hide');
            }, 3500);
        }, 2000);
    }

    // After first overlay hides, show Investor First overlay
    if (investorOverlay) {
        const firstTotal = 2000 + 3500; // delay + duration of first overlay
        
        setTimeout(function () {
            investorOverlay.classList.add('intro-start');
            
            // Get all elements to animate
            const heading = document.querySelector('.investor-heading');
            const subheading = document.querySelector('.investor-subheading');
            const pillContainer = document.querySelector('.investor-pill');
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

            // Hide fourth overlay after some time
            setTimeout(function () {
                fourthOverlay.classList.add('intro-hide');
            }, 9000);

        }, thirdTotal);
    }
});
