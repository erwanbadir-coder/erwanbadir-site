// Bascule clair / sombre. Peut exister en plusieurs exemplaires (accueil desktop
// + en-tête mobile), donc on câble TOUS les boutons. Préférence mémorisée, site-wide.
(function () {
  const btns = Array.from(document.querySelectorAll(".site-header__theme"));
  const root = document.documentElement;

  function isDark() { return root.getAttribute("data-theme") === "dark"; }
  function paint() { btns.forEach((b) => (b.textContent = isDark() ? "🌙" : "☀️")); }

  paint();

  btns.forEach((btn) =>
    btn.addEventListener("click", () => {
      const dark = !isDark();
      root.setAttribute("data-theme", dark ? "dark" : "light");
      try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
      paint();
    })
  );
})();
