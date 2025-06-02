
const btnSubirimagen = document.querySelector('#btnSubirimagen');
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




