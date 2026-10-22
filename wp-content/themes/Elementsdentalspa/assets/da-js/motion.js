/* Direction A motion, 2026-10-22 (mockup D).
   Lenis smooth scroll on desktop, off under prefers-reduced-motion; count-ups on first sight.
   The reveals, the parallax bands and the rating counter live in the templates already. */
(function(){
 var rm = window.matchMedia('(prefers-reduced-motion: reduce)');
 var lenis = null;
 function want(){ return !rm.matches && window.innerWidth > 760 && typeof Lenis === 'function'; }
 function start(){
  if(lenis || !want()) return;
  lenis = new Lenis({ lerp: .09, smoothWheel: true });
  window.edsLenis = lenis; /* exposed for the render gate only */
  window.edsLenis = lenis; /* exposed for the render gate only */
  function raf(t){ if(!lenis) return; lenis.raf(t); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  /* in-page anchors still land where they point */
  document.addEventListener('click', function(e){
   var a = e.target.closest('a[href^="#"]'); if(!a || a.getAttribute('href') === '#' || a.hasAttribute('data-bkopen') || a.getAttribute('href') === '#book') return;
   var t = document.querySelector(a.getAttribute('href')); if(!t) return;
   e.preventDefault(); lenis.scrollTo(t, { offset: -80 });
  });
 }
 function stop(){ if(lenis){ lenis.destroy(); lenis = null; window.edsLenis = null; } }
 start();
 if(rm.addEventListener) rm.addEventListener('change', function(e){ e.matches ? stop() : start(); });
 window.addEventListener('resize', function(){ want() ? start() : stop(); });

 /* count-ups: once, on first sight; reduced motion shows the final value */
 var els = [].slice.call(document.querySelectorAll('[data-count]'));
 if(!els.length) return;
 function run(el){
  var to = parseFloat(el.getAttribute('data-count')), dec = (el.getAttribute('data-count').split('.')[1] || '').length, suf = el.getAttribute('data-suffix') || '';
  if(rm.matches){ el.textContent = to.toFixed(dec) + suf; return; }
  var t0 = null;
  function f(t){ if(t0 === null) t0 = t; var p = Math.min(1, (t - t0) / 1100); var e = 1 - Math.pow(1 - p, 3); el.textContent = (to * e).toFixed(dec) + suf; if(p < 1) requestAnimationFrame(f); else el.textContent = to.toFixed(dec) + suf; }
  requestAnimationFrame(f);
 }
 if(!('IntersectionObserver' in window)){ els.forEach(run); return; }
 var io = new IntersectionObserver(function(entries){ entries.forEach(function(x){ if(x.isIntersecting){ io.unobserve(x.target); run(x.target); } }); }, { threshold: .4 });
 els.forEach(function(el){ io.observe(el); });
})();
