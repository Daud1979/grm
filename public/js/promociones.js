function abrirModalPromocion(imagenSrc, descripcion) {
  document.getElementById('modal-imagen-promociondet').src = imagenSrc;
  document.getElementById('modal-descripcion-promociondet').textContent = descripcion;
  document.getElementById('modal-promociondet').style.display = 'block';
}

function cerrarModalPromocion(event) {
  const modal = document.getElementById('modal-promociondet');
  const contenido = document.querySelector('.modal-contenido-promociondet');

  if (!event || event.target === modal || event.target.classList.contains('cerrar-promociondet')) {
    modal.style.display = 'none';
  }
}
