
const btnSubirimagen = document.querySelector('#btnSubirimagen');

btnSubirimagen.addEventListener('click', () => {
  const titulo = document.querySelector('#titulo');
  const descripcion = document.querySelector('#descripcion');
  const fileInput = document.querySelector('#imagenFile1');
  const fileInput2 = document.querySelector('#imagenFile2');
  const fileInput3 = document.querySelector('#imagenFile3');
  
  const archivo = fileInput.files[0];
  if (titulo.value.trim() !== '' && archivo && titulo.value != '' && descripcion.value!='') {
    const datos = new FormData();
    datos.append('nombreImagen', nombreInput.value.trim());
    datos.append('titulo', titulo.value.trim());
    datos.append('descripcion', descripcion.value.trim());
    datos.append('imagen', archivo);  

    fetch('/registrarcurso', {
      method: 'POST',
      body: datos // no pongas headers
    })
      .then(response => response.json())
      .then(data => {       
         if (data.existe==1)
          {  
           window.location.reload();     
          }
          else
          {
            Notiflix.Notify.failure('UNA IMAGEN CON ESE NOMBRE YA EXISTE');
          }
      })
      .catch(err => {
        console.error('Error en la verificación:', err);
        Notiflix.Notify.failure('SE PRODUJO UN ERROR');
      });
  } else {
    Notiflix.Notify.warning('FALTAN DATOS');
  }
});



