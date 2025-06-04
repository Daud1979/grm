
const btnSubirimagen = document.querySelector('#btnSubirimagen');
btnSubirimagen.addEventListener('click', () => {
  const titulo = document.querySelector('#titulo');
  const descripcion = document.querySelector('#descripcion');

  const fileInput = document.querySelector('#imagenFile');  
  const archivo = fileInput.files[0];

  if (titulo.value.trim() !== '' && archivo && descripcion.value!='') {
  
    const datos = new FormData();
    
    datos.append('titulo', titulo.value.trim());
    datos.append('descripcion', descripcion.value.trim());
    datos.append('imagen', archivo);  

    fetch('/registrarnoticia', {
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

document.addEventListener('DOMContentLoaded', () => {
  const tabla = document.getElementById('noticiasdatos');

  tabla.addEventListener('click', async (e) => {
    // Captura el botón presionado
    
    if (e.target.id =='eliminarfila')
    {
       const id = e.target.dataset.id;
       
        const datos={
            id:id
           
        }
        fetch('/noticias', {
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




