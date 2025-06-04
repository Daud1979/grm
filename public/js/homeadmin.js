const btnSubirimagen = document.querySelector('#btnSubirimagen');
btnSubirimagen.addEventListener('click', () => {
  const nombreInput = document.querySelector('#nombreImagen');
  const fileInput = document.getElementById('imagenFile');
  const archivo = fileInput.files[0];

  if (archivo) {
    const datos = new FormData();
  
    datos.append('imagen', archivo);  

    fetch('/registrarcarrusel', {
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

document.addEventListener('DOMContentLoaded', () => {
  const tabla = document.getElementById('carruceldatos');
  tabla.addEventListener('click', async (e) => {
     
    if (e.target.id =='eliminarfila')
    {
       const id = e.target.dataset.id;
       
        const datos={
            id:id           
        }
        fetch('/carrusels', {
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


