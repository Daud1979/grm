
  document.getElementById("buscador").addEventListener("input", function () {
    const filtro = this.value.toLowerCase();
    const filas = document.querySelectorAll("#tablaIncidencias tbody tr");

    filas.forEach(fila => {
      const nombre = fila.cells[2]?.textContent.toLowerCase();
      const titulo = fila.cells[3]?.textContent.toLowerCase();

      if (nombre.includes(filtro) || titulo.includes(filtro)) {
        fila.style.display = "";
      } else {
        fila.style.display = "none";
      }
    });
  });
  document.getElementById("buscadorA").addEventListener("input", function () {
    const filtro = this.value.toLowerCase();
    const filas = document.querySelectorAll("#tablaIncidenciasA tbody tr");

    filas.forEach(fila => {
      const nombre = fila.cells[2]?.textContent.toLowerCase();
      const titulo = fila.cells[3]?.textContent.toLowerCase();

      if (nombre.includes(filtro) || titulo.includes(filtro)) {
        fila.style.display = "";
      } else {
        fila.style.display = "none";
      }
    });
  });

  const modal = document.getElementById('modalImagenA');
    const imagenGrande = document.getElementById('imagenModalGrandeA');

    // Abrir modal al hacer clic en imagen
    document.querySelectorAll('#incidenciadatosA img').forEach(img => {
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
 
   const tablaAlumnos = document.querySelector('#incidenciadatos');

tablaAlumnos.addEventListener('click', (e) => {
  if(e.target.id==='aceptar')
  {
    const id=e.target.dataset.id;
      const datos={
          id:id         
        }
        fetch('/cambiarestadoincidencia', {
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
                    Notiflix.Notify.warning('SE PRODUJO UN ERROR');      
                  }
            })
  }
});