  //----
    const images = document.querySelectorAll('.imagen-itemactual img');
  const modal  = document.getElementById('imgModal');
  const modalImg = modal.querySelector('img');

  images.forEach(img => {
    img.addEventListener('click', () => {
      // 1) Añade clase de giro
      img.classList.add('rotate');

      // 2) Espera a que termine la animación (600 ms)
      setTimeout(() => {
        img.classList.remove('rotate');   // limpia la clase
        openModal(img.src);               // muestra la imagen en grande
      }, 600);
    });
  });

  // Abre el modal con la imagen dada
  function openModal(src) {
    modalImg.src = src;
    modal.classList.add('open');
  }

  // Cierra el modal al hacer clic fuera o presionar Esc
  modal.addEventListener('click', e => {
    if (e.target === modal || e.target === modalImg) modal.classList.remove('open');
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') modal.classList.remove('open');
  });