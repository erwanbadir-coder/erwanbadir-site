// En-tête "caméléon" : le texte se met en NOIR ou en BLANC selon le fond,
// en choisissant à chaque instant la couleur la plus lisible.
// Calculé en JS pour fonctionner partout (Safari inclus, contrairement à
// mix-blend-mode qui échoue à travers la section épinglée du double-scroll).
(function () {
  const segs = Array.from(
    document.querySelectorAll(
      ".site-header__logo, .site-header__tagline, .site-header__infos, .site-header__burger"
    )
  );
  if (!segs.length) return;

  const imgs = Array.from(document.querySelectorAll(".cell__img"));

  function computeAvg(img) {
    try {
      const iw = img.naturalWidth, ih = img.naturalHeight;
      if (!iw || !ih) return null;
      // On échantillonne la ZONE RÉELLEMENT DERRIÈRE L'EN-TÊTE : le haut de
      // l'image (≈12 %) sur les 60 % centraux de la largeur (en mobile
      // object-fit:cover recadre les côtés). Sinon la moyenne de toute l'image
      // choisit une couleur fausse quand le haut diffère du reste.
      const sx = Math.floor(iw * 0.20), sw = Math.max(1, Math.floor(iw * 0.60));
      const sy = 0,                     sh = Math.max(1, Math.floor(ih * 0.12));
      const c = document.createElement("canvas");
      c.width = 12; c.height = 8;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, 12, 8);
      const d = ctx.getImageData(0, 0, 12, 8).data;
      let r = 0, g = 0, b = 0, n = 0;
      for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; n++; }
      r /= n; g /= n; b /= n;
      return { r: r, g: g, b: b, grey: 0.2126 * r + 0.7152 * g + 0.0722 * b };
    } catch (e) { return null; }
  }
  function prime() {
    imgs.forEach((img) => {
      if (!img._avg && img.complete && img.naturalWidth) img._avg = computeAvg(img);
    });
  }

  // suivi de la cellule survolée (affichée en couleur)
  let hovered = null;
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.addEventListener("mouseenter", () => { hovered = cell; adapt(); });
    cell.addEventListener("mouseleave", () => { if (hovered === cell) hovered = null; adapt(); });
  });

  function imgUnder(seg) {
    const r = seg.getBoundingClientRect();
    const x = Math.min(window.innerWidth - 2, Math.max(2, r.left + r.width / 2));
    const y = Math.max(2, r.top + r.height / 2);
    const stack = document.elementsFromPoint(x, y);
    return stack.find((el) => el.classList && el.classList.contains("cell__img")) || null;
  }

  let raf = 0;
  function adapt() {
    prime();
    segs.forEach((seg) => {
      const img = imgUnder(seg);
      if (!img || !img._avg) { seg.style.color = ""; return; } // hors accueil : couleur CSS
      // Noir & blanc adaptatif : on met le texte en pur noir ou pur blanc,
      // selon celui qui est le plus lisible sur le fond (lisibilité maximale).
      // La luminance est identique que l'image soit affichée en N&B ou en couleur.
      const lum = img._avg.grey;                // 0 = fond noir, 255 = fond blanc
      seg.style.color = lum < 145 ? "#ffffff" : "#111111";
    });
  }
  function onScroll() { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; adapt(); }); }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  window.addEventListener("load", adapt);
  // MOBILE : l'accueil défile HORIZONTALEMENT dans un conteneur, pas la fenêtre.
  // On écoute donc aussi le défilement du carrousel pour recalculer la couleur
  // à chaque image qui passe sous l'en-tête.
  document.querySelectorAll(".index__stage, .index").forEach((el) =>
    el.addEventListener("scroll", onScroll, { passive: true })
  );
  imgs.forEach((img) => { if (!img.complete) img.addEventListener("load", adapt); });
  adapt();
})();
