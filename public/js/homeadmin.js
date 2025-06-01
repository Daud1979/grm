   document.querySelector('.carrusel-formulario').addEventListener('submit', function (e) {
      const nombre = document.querySelector('.carrusel-input').value;
      const archivo = document.querySelector('.carrusel-file').files[0];

      if (!nombre || !archivo) {
        e.preventDefault();
        alert("Por favor completa el formulario correctamente.");
      }
    });