// Curseur emoji : suit la souris sur tout le site (appareils à souris).
// Par défaut = licorne. Au survol d'un lien / bouton = main qui pointe.
// Sur l'accueil, au survol d'un projet = l'emoji défini pour ce projet.
(function () {
  if (window.matchMedia("(hover:none)").matches) return;
  const cursor = document.querySelector(".cursor");
  if (!cursor) return;

  const DEFAULT = "🦄";   // curseur par défaut
  const LINK = "👆";      // au survol d'un lien / bouton

  let x = window.innerWidth / 2, y = window.innerHeight / 2;
  let tx = x, ty = y;
  window.addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; });

  function loop() {
    tx += (x - tx) * 0.25;
    ty += (y - ty) * 0.25;
    cursor.style.transform = `translate(${tx}px, ${ty}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  // Choix de l'emoji selon l'élément survolé
  const INTERACTIVE = ".cell, a, button, summary, label, [role='button']";
  function pick(target) {
    const el = target && target.closest ? target.closest(INTERACTIVE) : null;
    if (!el) return DEFAULT;
    if (el.classList.contains("cell")) return el.dataset.cursor || DEFAULT; // projet sur l'accueil
    return LINK;                                                            // lien / bouton
  }
  document.addEventListener("mouseover", (e) => { cursor.textContent = pick(e.target); });

  // Masque l'emoji quand la souris quitte la fenêtre, le remontre au retour
  document.addEventListener("mouseleave", () => { cursor.style.opacity = "0"; });
  document.addEventListener("mouseenter", () => { cursor.style.opacity = ""; });
})();
