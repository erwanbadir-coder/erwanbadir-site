// Curseur licorne : suit la souris, visible au survol des images de projet.
(function () {
  if (window.matchMedia("(hover:none)").matches) return;
  const cursor = document.querySelector(".cursor");
  if (!cursor) return;

  let x = window.innerWidth / 2, y = window.innerHeight / 2;
  let tx = x, ty = y;

  window.addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; });

  // Lissage du mouvement
  function loop() {
    tx += (x - tx) * 0.25;
    ty += (y - ty) * 0.25;
    cursor.style.transform = `translate(${tx}px, ${ty}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  // Affiche la licorne uniquement au-dessus des images de projet
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.addEventListener("mouseenter", () => document.body.classList.add("cursor-active"));
    cell.addEventListener("mouseleave", () => document.body.classList.remove("cursor-active"));
  });
})();
