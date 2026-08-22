// Accueil : deux colonnes qui défilent en sens OPPOSÉ.
(function () {
  const index = document.getElementById("index");
  if (!index) return;
  const left = index.querySelector(".index__col--left");
  const right = index.querySelector(".index__col--right");
  if (!left || !right) return;

  const isDesktop = () => window.matchMedia("(min-width:701px)").matches;

  function layout() {
    if (!isDesktop()) {
      index.style.height = "";
      left.style.top = "";
      right.style.top = "";
      return;
    }
    index.style.height = left.offsetHeight + "px";
    update();
  }

  function update() {
    if (!isDesktop()) return;
    const range = Math.max(1, left.offsetHeight - window.innerHeight);
    const p = Math.min(1, Math.max(0, window.scrollY / range));
    const rm = document.documentElement.classList.contains("rm") &&
               window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    left.style.top = `${-(p) * range}px`;
    right.style.top = `${(rm ? -(p) : -(1 - p)) * range}px`;
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", layout);
  window.addEventListener("load", layout);
  index.querySelectorAll("img").forEach((im) => {
    if (!im.complete) im.addEventListener("load", layout);
  });
  layout();
})();

/* ---- Page projet : flèche retour en haut + paysage plein cadre + autoplay vidéos ---- */
(function () {
  const gallery = document.querySelector(".project__gallery");

  const btn = document.querySelector(".project__totop");
  if (btn && gallery) {
    const figures = Array.from(gallery.querySelectorAll(".project__figure"));
    let threshold = Infinity;
    function computeThreshold() {
      const ref = figures[3] || figures[figures.length - 1];
      threshold = ref ? ref.offsetTop : Infinity;
    }
    function onScroll() {
      btn.classList.toggle("is-visible", window.scrollY > threshold);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => { computeThreshold(); onScroll(); });
    window.addEventListener("load", () => { computeThreshold(); onScroll(); });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    computeThreshold();
    onScroll();
  }

  // Images / vidéos PAYSAGE (largeur > hauteur) : pleine largeur automatiquement.
  document.querySelectorAll(".project__figure").forEach((fig) => {
    const media = fig.querySelector("img, video");
    if (!media) return;
    const apply = () => {
      const w = media.naturalWidth || media.videoWidth;
      const h = media.naturalHeight || media.videoHeight;
      if (w && h && w > h) fig.classList.add("wide");
    };
    if (media.tagName === "IMG") {
      media.complete ? apply() : media.addEventListener("load", apply);
    } else {
      media.readyState >= 1 ? apply() : media.addEventListener("loadedmetadata", apply);
    }
  });

  // Vidéos : lecture automatique en boucle (sans son), pause hors écran.
  const videos = Array.from(document.querySelectorAll(".project__video"));
  function tryPlay(v) {
    if (v._manualPause) return;
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  }
  videos.forEach((v) => {
    v.muted = true; v.setAttribute("muted", "");
    v.playsInline = true; v.setAttribute("playsinline", "");
    v.loop = true;
    v.preload = "auto";
    v._manualPause = false;
    v.addEventListener("loadeddata", () => tryPlay(v));
    v.addEventListener("canplay", () => tryPlay(v));
    v.addEventListener("click", () => {
      if (v.paused) { v._manualPause = false; tryPlay(v); }
      else { v._manualPause = true; v.pause(); }
    });
    tryPlay(v);
  });
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) tryPlay(e.target);
        else e.target.pause();
      });
    }, { threshold: 0.15 });
    videos.forEach((v) => io.observe(v));
  }
  function kick() {
    videos.forEach((v) => { if (v.paused && !v._manualPause) tryPlay(v); });
  }
  ["pointerdown", "touchstart", "keydown", "scroll", "mousemove"].forEach((ev) =>
    window.addEventListener(ev, kick, { once: true, passive: true })
  );
})();

/* ---- Page projet MOBILE : ancrage du défilement par écran ----
   La pellicule garde chaque média en pleine hauteur (largeur = ratio) ; ici on
   cale le défilement horizontal sur l'écran le plus proche quand on relâche —
   un pas = un écran, MÊME à l'intérieur d'une image plus large qu'un écran.
   (Le CSS `scroll-snap` ne sait ancrer que sur les bords d'un média, jamais à
   l'intérieur d'un média surdimensionné ; d'où ce petit script, sans dépendance.) */
(function () {
  const main = document.querySelector(".project__main");
  if (!main) return;
  const mqMobile = window.matchMedia("(max-width: 700px)");
  const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let timer = null;
  let snapping = false;

  function snap() {
    if (!mqMobile.matches) return;                 // desktop : grille, on ne touche pas
    const w = main.clientWidth;
    if (w <= 0) return;
    if (main.scrollWidth - w < 4) return;          // pas de débordement horizontal
    let target = Math.round(main.scrollLeft / w) * w;
    const max = main.scrollWidth - w;
    if (target > max) target = max;
    if (Math.abs(target - main.scrollLeft) < 1) return;
    snapping = true;
    main.scrollTo({ left: target, behavior: mqReduce.matches ? "auto" : "smooth" });
    setTimeout(() => { snapping = false; }, 450);
  }

  main.addEventListener("scroll", () => {
    if (snapping) return;                          // ignore les événements de notre propre recentrage
    if (timer) clearTimeout(timer);
    timer = setTimeout(snap, 110);                 // on ancre quand le doigt a relâché
  }, { passive: true });
})();

/* ---- Accueil mobile : masquer l'indice de scroll dès la 1re interaction ---- */
(function () {
  const hint = document.querySelector(".scroll-hint");
  if (!hint) return;
  const kill = () => { hint.style.display = "none"; };
  window.addEventListener("touchstart", kill, { once: true, passive: true });
  window.addEventListener("touchmove", kill, { once: true, passive: true });
  document.querySelectorAll(".index__stage").forEach((el) =>
    el.addEventListener("scroll", kill, { once: true, passive: true })
  );
})();
