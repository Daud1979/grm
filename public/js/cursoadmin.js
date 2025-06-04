
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

    fetch('/registrarcursos', {
      method: 'POST',
      body: datos
    })
    .then(response => response.json())
    .then(data => {     
      console.log(data)  
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
  const tabla = document.getElementById('cursodatos');

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
                   Notiflix.Notify.failure('SE PRODUJO UN ERROR');
                  
                }
            })
    }
    else if (e.target.id=='modificarfila')
    {   
      const id=e.target.dataset.id;
      const datos={
          id:id           
        }
        fetch('/obtenercurso', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
            })
            .then(response => response.json())
            .then(data => {
              const curso=data.resultado[0].Curso;
              const descripcion=data.resultado[0].descripcion;
              const nombreImagenUno=data.resultado[0].nombreImagenUno;
              const nombreImagenDos=data.resultado[0].nombreImagenDos;
              const nombreImagenTres=data.resultado[0].nombreImagenTres;
             mostrarModalTexto(id,curso,descripcion,nombreImagenUno,nombreImagenDos,nombreImagenTres);
            })
      //
      

    

    }   
  });  
});


function mostrarModalTexto(id, Curso, descripcion, nombreImagenUno, nombreImagenDos, nombreImagenTres) {
  // Eliminar modal anterior si existe
  const anterior = document.getElementById('modalTextoSimple');
  if (anterior) anterior.remove();

  // Reemplazar nulls con string vacío
  id = id ?? '';
  Curso = Curso ?? '';
  descripcion = descripcion ?? '';
  nombreImagenUno = nombreImagenUno ?? '';
  nombreImagenDos = nombreImagenDos ?? '';
  nombreImagenTres = nombreImagenTres ?? '';

  const modalHTML = `
    <div class="modal fade" id="modalTextoSimple" tabindex="-1">
      <div class="modal-dialog modal-sm">
        <div class="modal-content border-0 shadow-sm rounded-4">
          <div class="modal-header bg-danger text-white py-2">
            <h6 class="modal-title">Modificar Curso</h6>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body small">
            <input type="hidden" id="modalCursoId" value="${id}">

            <div class="mb-2">
              <label for="modalTitulo" class="form-label">Título</label>
              <input type="text" class="form-control form-control-sm" id="modalTitulo" value="${Curso}">
            </div>

            <div class="mb-2">
              <label for="modalDescripcion" class="form-label">Descripción</label>
              <textarea class="form-control form-control-sm" id="modalDescripcion" rows="2">${descripcion}</textarea>
            </div>

          ${[1, 2, 3].map(i => {
  const nombres = [nombreImagenUno, nombreImagenDos, nombreImagenTres];
  const nombre = nombres[i - 1];
  const botonDeshabilitado = nombre ? 'disabled' : '';

  return `
    <div class="mb-2">
      <label class="form-label">Imagen ${i}</label>
      <div class="input-group input-group-sm">
        <input type="text" class="form-control" id="inputImg${i}" value="${nombre}" readonly>
        <input type="file" class="form-control visually-hidden" id="fileImg${i}" accept="image/*">
        <button class="btn btn-outline-secondary" type="button" onclick="document.getElementById('fileImg${i}').click()" ${botonDeshabilitado}>Buscar</button>
      </div>
    </div>
  `;
}).join('')}
          </div>

          <div class="modal-footer py-2">
            <button type="button" class="btn btn-primary btn-sm" id="guardarCambios">Modificar</button>
            <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  const modal = new bootstrap.Modal(document.getElementById('modalTextoSimple'));
  modal.show();

  // Eventos para mostrar nombre de archivo seleccionado
  for (let i = 1; i <= 3; i++) {
    const fileInput = document.getElementById(`fileImg${i}`);
    const textInput = document.getElementById(`inputImg${i}`);
    fileInput.addEventListener('change', (e) => {
      textInput.value = e.target.files[0]?.name || '';
    });
  }

  // Evento guardar
  document.getElementById('guardarCambios').addEventListener('click', () => {
  const formData = new FormData();

  // Añadir datos de texto
  formData.append('id', id);
  formData.append('titulo', document.getElementById('modalTitulo').value);
  formData.append('descripcion', document.getElementById('modalDescripcion').value);

  // Añadir archivos de imagen si fueron seleccionados

  const file2 = document.getElementById('fileImg2').files[0];
  const file3 = document.getElementById('fileImg3').files[0];

  
  if (file2) formData.append('imagen2', file2);
  if (file3) formData.append('imagen3', file3);

  // Enviar usando fetch
  fetch('/modificarcurso', {
    method: 'POST',
    body: formData,
  })
  .then(res => res.json())
  .then(data => {      
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalTextoSimple'));
    modal.hide();
    if(data.existe==1)
    {
      window.location.reload();     
    }
    else
    {
      Notiflix.Notify.failure('SE PRODUJO UN ERROR');
    }
  })
  .catch(err => {
    console.error('Error al enviar los datos:', err);
  });
});

}




