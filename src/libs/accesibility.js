export const accessibility = () => {
  // Funcionalidad del enlace de salto para accesibilidad
  const skipLink = document.querySelector(".skip-link");
  if (skipLink) {
    skipLink.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      // Si el objetivo existe, poner el foco en él
      if (targetElement) {
        targetElement.setAttribute("tabindex", "-1");
        targetElement.focus();

        // Eliminar tabindex después de blur
        targetElement.addEventListener("blur", function onBlur() {
          targetElement.removeAttribute("tabindex");
          targetElement.removeEventListener("blur", onBlur);
        });
      }
    });
  }
};
