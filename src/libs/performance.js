export const imgLoadingLazy = () => {
  // Lazy load para imágenes (cargar imágenes solo cuando estén visibles)
  if ("IntersectionObserver" in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    // Observar las imágenes y cargarlas cuando estén en el viewport
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
          }
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach((img) => {
      imageObserver.observe(img);
    });
  }
};
