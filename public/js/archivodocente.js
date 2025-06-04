
 document.getElementById("buscadorIncidencia").addEventListener("keyup", function () {
    const valor = this.value.toLowerCase();
    const filas = document.querySelectorAll("#tablaIncidencias tbody tr");

    filas.forEach(fila => {
      const texto = fila.innerText.toLowerCase();
      fila.style.display = texto.includes(valor) ? "" : "none";
    });
  });

  const tablaIncidencias = document.querySelector('#tablaIncidencias');
  tablaIncidencias.addEventListener('click', (e)=>{
    if (e.target.id=='eliminarfila')
    {     
      
       const datos={        
            id:e.target.dataset.id             
        }
        fetch('/eliminarincidencia', {
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
          Notiflix.Notify.success('SE ELIMINO CORRECTAMENTE');
          setTimeout(() => {location.reload();}, 2000); 
        }
        else
        {
          Notiflix.Notify.warning('FALTAN DATOS');      
        
        }
      })
    }

  });

  
  const modal = document.getElementById('modalImagen');
    const imagenGrande = document.getElementById('imagenModalGrande');

    // Abrir modal al hacer clic en imagen
    document.querySelectorAll('#incidenciadatos img').forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        imagenGrande.src = img.src;
        modal.style.display = 'flex';
      });
    });

    // Cerrar modal al hacer clic fuera de la imagen
    modal.addEventListener('click', (e) => {
      if (e.target !== imagenGrande) {
        modal.style.display = 'none';
        imagenGrande.src = '';
      }
    });