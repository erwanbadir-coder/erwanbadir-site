// Accueil : deux colonnes qui défilent en sens OPPOSÉ.
// Gauche : de haut en bas (monte). Droite : inversée, de bas en haut (descend).
// Résultat : l'image gauche et l'image droite d'un même projet restent face à
// face pendant tout le scroll, et les colonnes vont visiblement à l'opposé.
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
    // hauteur de scroll = hauteur d'une colonne (section épinglée)
    index.style.height = left.offsetHeight + "px";
    update();
  }

  // On déplace les colonnes via `top` (et non `transform`) pour NE PAS isoler
  // les images sur une couche à part : l'en-tête garde ainsi son blend exclusion.
  function update() {
    if (!isDesktop()) return;
    const range = Math.max(1, left.offsetHeight - window.innerHeight);
    const p = Math.min(1, Math.max(0, window.scrollY / range));
    // animations réduites : les 2 colonnes défilent ensemble (pas de sens inverse)
    const rm = document.documentElement.classList.contains("rm") &&
               window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    left.style.top = `${-(p) * range}px`;                       // monte
    right.style.top = `${(rm ? -(p) : -(1 - p)) * range}px`;   // inverse (ou ensemble si RM)
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", layout);
  window.addEventListener("load", layout);
  index.querySelectorAll("img").forEach((im) => {
    if (!im.complete) im.addEventListener("load", layout);
  });
  layout();
})();

/* ---- Page projet : flèche "retour en haut" + pause vidéo au clic ---- */
(function () {
  const gallery = document.querySelector(".project__gallery");

  // Flèche retour en haut : apparaît après ~4 images de hauteur défilées
  const btn = document.querySelector(".project__totop");
  if (btn && gallery) {
    const figures = Array.from(gallery.querySelectorAll(".project__figure"));
    let threshold = Infinity;
    function computeThreshold() {
      const ref = figures[3] || figures[figures.length - 1]; // la 4e image
      threshold = ref ? ref.offsetTop : Infinity;
    }
    function onScroll() {
      btn.classList.toggle("is-visible", window.scrollY > threshold);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => { computeThreshold(); onScroll(); });
    window.addEventListener("load", () => { computeThreshold(); onScroll(); });
    btn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
    computeThreshold();
    onScroll();
  }

  // Vidéos : autoplay/boucle, mais cliquables pour mettre en pause / relancer
  document.querySelectorAll(".project__video").forEach((v) => {
    v.addEventListener("click", () => {
      v.paused ? v.play() : v.pause();
    });
  });
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
