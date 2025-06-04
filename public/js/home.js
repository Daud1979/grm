 

  

    // Autoplay deslizado en galería (cada 3 segundos)
 let scrollPos = 0;
let scrollDirection = 1; // 1 para adelante, -1 para atrás

function autoplayGallery() {
    const containerWidth = galleryScroll.scrollWidth;   
    const visibleWidth = galleryScroll.clientWidth;     
    const maxScroll = containerWidth - visibleWidth; 
    scrollPos += 400 * scrollDirection;   
    if (scrollDirection === 1 && scrollPos >= maxScroll) {
        scrollPos = maxScroll;
        scrollDirection = -1; 
    } else if (scrollDirection === -1 && scrollPos <= 0) {
        scrollPos = 0;      
        scrollDirection = 1;
    }    
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

const boxes = document.querySelectorAll('.imgcntrbox');
let current = 0;

function updateCarousel() {
  const total = boxes.length;
  const visibleRange = 2; // cuántas a cada lado mostrar

  boxes.forEach((box, index) => {
    const rawOffset = (index - current + total) % total;
    const offset = rawOffset > total / 2 ? rawOffset - total : rawOffset;

    if (Math.abs(offset) > visibleRange) {
      box.style.opacity = 0;
      box.style.transform = 'scale(0)';
      box.style.zIndex = 0;
    } else {
      const scale = 1 - Math.abs(offset) * 0.2; // 1.0 -> 0.8 -> 0.6
      const translateX = offset * 350; // separación horizontal
      const zIndex = 100 - Math.abs(offset);

      box.style.opacity = 1;
      box.style.transform = `translateX(${translateX}px) scale(${scale})`;
      box.style.zIndex = zIndex;
    }
  });

  current = (current + 1) % total;
}

updateCarousel();
setInterval(updateCarousel, 2000);
