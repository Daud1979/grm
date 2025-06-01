
const btnSubirimagen = document.querySelector('#btnSubirimagen');
document.addEventListener('DOMContentLoaded', () => {
  const tabla = document.getElementById('eventodatos');

  tabla.addEventListener('click', async (e) => {
    // Captura el botón presionado
    
    if (e.target.id =='eliminarfila')
    {
       const id = e.target.dataset.id;
       
        const datos={
            id:id
           
        }
        fetch('/cursos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
            })
            .then(response => response.json())
            .then(data => {
                if(data.existe==1)
                {  
                  window.location.reload();     
                }
                else
                {
                    Notiflix.Notify.failure('CREDENCIALES INCORRECTAS');
                    usuario.value=''
                    passwrd.value=''
                }
            })
    }
   
  }
  );
});
// document.addEventListener('DOMContentLoaded', () => {
//   const tabla = document.getElementById('eventodatos');

//   tabla.addEventListener('click', async (e) => {
//     const boton = e.target;
//     console.log(e.target);
//     // Verificamos si se hizo clic en el botón de eliminar
//     if (boton.classList.contains('carrusel-btn-eliminar')) {
//       e.preventDefault();

//       // Capturar ID desde el data-id del botón
//       let id = boton.dataset.id;

//       // Si no hay data-id, capturamos desde la celda correspondiente
//       if (!id) {
//         const fila = boton.closest('tr');
//         id = fila.querySelector('td:nth-child(7)')?.textContent.trim(); // 7ma columna = ID
//       }

//       if (!id) {
//         Notiflix.Notify.failure('No se pudo obtener el ID');
//         return;
//       }

//       // 🔄 Enviar la solicitud de eliminación
//       const formData = new FormData();
//       formData.append('id', id);

//       try {
//         const res = await fetch('/cursos', {
//           method: 'POST',
//           body: formData
//         });

//         const data = await res.json();

//         if (data.existe === 1) {
//           Notiflix.Notify.success('Curso eliminado');
//           boton.closest('tr').remove(); // ❌ Eliminar visualmente la fila
//         } else {
//           Notiflix.Notify.failure('No se pudo eliminar el curso');
//         }
//       } catch (err) {
//         console.error('Error al eliminar:', err);
//         Notiflix.Notify.failure('Error en la petición');
//       }
//     }
//   });
// });


// document.querySelectorAll('.form-eliminar').forEach(form => {
//   form.addEventListener('submit', async (e) => {
//     e.preventDefault();

//     const boton = e.submitter;
//     const fila = boton.closest('tr'); // Captura la fila entera
//     const celdaCodigo = fila.children[6]; // Columna 6 (índice 6)
//     const id = celdaCodigo.textContent.trim(); // ID desde columna visible

//     const formData = new FormData();
//     formData.append('id', id); // Enviamos el valor de la columna 6

//     try {
//       const res = await fetch('/cursos', {
//         method: 'POST',
//         body: formData
//       });

//       const data = await res.json();

//       if (data.existe === 1) {
//         Notiflix.Notify.success('Curso eliminado');
//         fila.remove(); // Elimina la fila del DOM
//       } else {
//         Notiflix.Notify.failure('No se pudo eliminar el curso');
//       }
//     } catch (err) {
//       console.error('Error al eliminar curso:', err);
//       Notiflix.Notify.failure('Error en la petición');
//     }
//   });
// });







btnSubirimagen.addEventListener('click', (event) => {
  event.preventDefault(); // ✅ Esto evita que el formulario se envíe

  const titulo = document.querySelector('#titulo');
  const descripcion = document.querySelector('#descripcion');
  const fileInput1 = document.querySelector('#imagenFile1');
  const fileInput2 = document.querySelector('#imagenFile2');
  const fileInput3 = document.querySelector('#imagenFile3');

  const archivo1 = fileInput1.files[0]; // obligatorio
  const archivo2 = fileInput2.files[0]; // opcional
  const archivo3 = fileInput3.files[0]; // opcional

  if (archivo1 && titulo.value.trim() !== '' && descripcion.value.trim() !== '') {
   
    const datos = new FormData();    
    datos.append('titulo', titulo.value.trim());
    datos.append('descripcion', descripcion.value.trim());
    datos.append('imagen', archivo1); // obligatorio

    if (archivo2) {
      datos.append('imagen2', archivo2); // opcional
    }

    if (archivo3) {
      datos.append('imagen3', archivo3); // opcional
    }

    fetch('/registrarcurso', {
      method: 'POST',
      body: datos
    })
    .then(response => response.json())
    .then(data => {       
      if (data.existe == 1) {
        window.location.reload();     
      } else {
        Notiflix.Notify.failure('SE PRODUJO UN ERROR');
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




