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

 /* back to top */
 var top = document.querySelector('.totop');
 if(top){
  top.hidden = false;
  var cc = document.getElementById('eds-cc');
  function sync(){
   top.classList.toggle('show', window.scrollY > 600);
   /* the cookie banner is full width at the bottom on phones; sit above it while it is open */
   var lift = cc && !cc.hidden && cc.getBoundingClientRect().height > 0 && cc.getBoundingClientRect().right > top.getBoundingClientRect().left;
   top.style.bottom = lift ? (innerHeight - cc.getBoundingClientRect().top + 12) + 'px' : '';
  }
  window.addEventListener('scroll', sync, { passive: true }); window.addEventListener('resize', sync); sync();
  if(cc){ new MutationObserver(sync).observe(cc, { attributes: true, attributeFilter: ['hidden'] }); cc.addEventListener('click', function(){ setTimeout(sync, 50); }); }
  top.addEventListener('click', function(){
   if(lenis){ lenis.scrollTo(0); } else { window.scrollTo({ top: 0, behavior: rm.matches ? 'auto' : 'smooth' }); }
   var h = document.querySelector('#hdr a, #hdr .logo, header a'); if(h) h.focus({ preventScroll: true });
  });
 }

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
