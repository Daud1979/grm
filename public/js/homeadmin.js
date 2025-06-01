   document.querySelector('.carrusel-formulario').addEventListener('submit', function (e) {
      const nombre = document.querySelector('.carrusel-input').value;
      const archivo = document.querySelector('.carrusel-file').files[0];

      if (!nombre || !archivo) {
        e.preventDefault();
        alert("Por favor completa el formulario correctamente.");
      }
    });

const btnSubirimagen = document.querySelector('#btnSubirimagen');

btnSubirimagen.addEventListener('click', () => {
  const nombreInput = document.querySelector('#nombreImagen');
  const fileInput = document.getElementById('imagenFile');
  const archivo = fileInput.files[0];

  if (nombreInput.value.trim() !== '' && archivo) {
    const datos = new FormData();
    datos.append('nombreImagen', nombreInput.value.trim());
    datos.append('imagen', archivo);  

    fetch('/verificarcarrusel', {
      method: 'POST',
      body: datos // no pongas headers
    })
      .then(response => response.json())
      .then(data => {
        
        if (data.existe == 1) {
           window.location.reload();
        } else {
          Notiflix.Notify.warning('EL ARCHIVO CON ESE NOMBRE YA EXISTE. CAMBIE DE NOMBRE.');
        }
      })
      .catch(err => {
        console.error('Error en la verificación:', err);
        Notiflix.Notify.failure('Error al verificar el nombre');
      });
  } else {
    Notiflix.Notify.warning('FALTAN DATOS');
  }
});



