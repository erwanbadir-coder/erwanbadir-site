// Burger : ouvre/ferme le menu déroulant (Infos + thème) sur mobile.
(function () {
  const burger = document.querySelector(".site-header__burger");
  const menu = document.querySelector(".site-header__menu");
  if (!burger || !menu) return;

  const close = menu.querySelector(".site-header__menu-close");

  function setOpen(open) {
    menu.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";   // fige le fond en plein écran
  }

  burger.addEventListener("click", (e) => {
    e.stopPropagation();
    setOpen(!menu.classList.contains("is-open"));
  });
  if (close) close.addEventListener("click", () => setOpen(false));
  // fermer après avoir cliqué "Infos" (le thème, lui, garde le menu ouvert)
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
})();
