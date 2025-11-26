document.addEventListener('DOMContentLoaded', function () {
 const toggleBtn = document.getElementById('themeToggle');
 const iconEl = toggleBtn ? toggleBtn.querySelector('.theme-icon') : null;
 const introOverlay = document.getElementById('introOverlay');

 if (toggleBtn && iconEl) {
  toggleBtn.addEventListener('click', function () {
   const isDark = document.body.classList.toggle('dark-theme');
   iconEl.classList.remove('lni-sun-1', 'lni-moon-half-right-5');
   iconEl.classList.add(isDark ? 'lni-moon-half-right-5' : 'lni-sun-1');
  });
 }

 // Show intro overlay after 4 seconds, then hide after animations complete (~3.5s anim + ~3s pause)
 if (introOverlay) {
  setTimeout(function () {
   introOverlay.classList.add('intro-start');
   setTimeout(function () {
    introOverlay.classList.add('intro-hide');
   }, 3500);
  }, 2000);
 }
});
