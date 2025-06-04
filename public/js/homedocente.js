const input = document.getElementById('buscadorAlumnos');
  const tabla = document.getElementById('tablaAlumnos').getElementsByTagName('tbody')[0];
  input.addEventListener('input', () => {
    const filtro = input.value.toLowerCase();
    const filas = tabla.getElementsByTagName('tr');
    Array.from(filas).forEach(fila => {
      const texto = fila.innerText.toLowerCase();
      fila.style.display = texto.includes(filtro) ? '' : 'none';
    });
  });
/****/
 const llamadaModal = document.getElementById('llamadaModal');
  llamadaModal.addEventListener('show.bs.modal', function (event) {
    
    const id=(event.relatedTarget.dataset.id);
    const nombre=(event.relatedTarget.dataset.nombre);
    const curso=(event.relatedTarget.dataset.curso);
      llamadaModal.querySelector('#id').value = id;
    llamadaModal.querySelector('#nombre').value = nombre;
    llamadaModal.querySelector('#curso').value = curso;
    llamadaModal.querySelector('#fecha').valueAsDate = new Date();
    // // Opcional: colocar la fecha actual automáticamente
    
  });

llamadaModal.addEventListener('click', (e) => {
  if (e.target.id === 'btnIncidencia') {
    const titulo = llamadaModal.querySelector('#titulo').value;
    const motivo = llamadaModal.querySelector('#motivo').value;
    const acciones = llamadaModal.querySelector('#acciones').value;
    const fecha = llamadaModal.querySelector('#fecha').value;
    const id = llamadaModal.querySelector('#id').value;
    const fileInput = document.querySelector('#imagenFile');
    const archivo = fileInput.files[0];

    if (motivo.trim() !== '' && fecha !== '') {
      const formData = new FormData();
      formData.append('titulo', titulo);
      formData.append('motivo', motivo);
      formData.append('acciones', acciones);
      formData.append('fecha', fecha);
      formData.append('id', id);
      if (archivo) {
        formData.append('imagen', archivo); // Este nombre debe coincidir con el campo `req.file` de multer
      }

      fetch('/registrarincidencia', {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          if (data.existe == 1) {
            Notiflix.Notify.success('SE REGISTRÓ CORRECTAMENTE');
            setTimeout(() => {
              location.reload();
            }, 2000);
          } else {
            Notiflix.Notify.warning('FALTAN DATOS');
          }
        })
        .catch(err => {
          console.error('Error en fetch:', err);
          Notiflix.Notify.failure('ERROR DE ENVÍO');
        });
    }
  }
});


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