 
    // Galería de imágenes automática y modal
    const images = [
      '/images/imagen1.jpg',
      '/images/imagen2.jpg',
      '/images/imagen3.jpg',
      '/images/imagen4.jpg',
      '/images/imagen5.jpg',
      '/images/imagen6.jpg',      
        
    ];
  const logo = document.getElementById('logo');
  
    const galleryScroll = document.getElementById("galleryScroll");

    function crearGaleria() {
      images.forEach((src, i) => {
        const div = document.createElement("div");
        div.classList.add("gallery-item");
        div.innerHTML = `<img src="${src}" alt="Imagen ${i + 1}" loading="lazy" />`;
        galleryScroll.appendChild(div);

        // Click para abrir modal
        div.addEventListener("click", () => {
          const modalImage = document.getElementById("modalImage");
          modalImage.src = src;
          const modal = new bootstrap.Modal(document.getElementById("imageModal"));
          modal.show();
        });
      });
    }
    crearGaleria();

    // Autoplay deslizado en galería (cada 3 segundos)
    let scrollPos = 0;
    function autoplayGallery() {
      const containerWidth = galleryScroll.scrollWidth;
      const visibleWidth = galleryScroll.clientWidth;
      scrollPos += 400; // ancho item aprox
      if (scrollPos > containerWidth - visibleWidth) scrollPos = 0;
      galleryScroll.scrollTo({ left: scrollPos, behavior: "smooth" });
    }
    setInterval(autoplayGallery, 3000);

   const leerMasModal = new bootstrap.Modal(document.getElementById('leerMasModal'));
const modalTitle = document.getElementById('leerMasModalLabel');
const modalContent = document.getElementById('leerMasContent');
const modalImage = document.getElementById('leerMasImage');

document.querySelectorAll(".leer-mas-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".card");
    const title = card.querySelector(".card-title").textContent;
    const description = card.querySelector(".card-text.description").innerHTML;
    const imageSrc = card.querySelector("img").getAttribute("src");

    modalTitle.textContent = title;
    modalContent.innerHTML = description;
    modalImage.src = imageSrc;

    leerMasModal.show();
  });
});

    // Permite cerrar modal con ESC
    document.getElementById('leerMasModal').addEventListener('keydown', (e) => {
      if (e.key === "Escape") {
        leerMasModal.hide();
      }
    });
