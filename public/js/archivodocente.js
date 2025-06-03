
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