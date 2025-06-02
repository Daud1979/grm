
   const origen = document.getElementById('ci');
  const destino = document.getElementById('usuario');

  origen.addEventListener('input', function () {
    // Convertir a mayúsculas y eliminar caracteres no alfanuméricos
    this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    destino.value = this.value;
  });
const btnSubirimagen = document.querySelector('#btnRegistrar');

btnSubirimagen.addEventListener('click', () => {
 const ci = document.querySelector('#ci');
  const nombre = document.querySelector('#nombre');
  const descripcion = document.querySelector('#descripcion');
  const file = document.querySelector('#file');
  const usuario = document.querySelector('#usuario');
  const passwrd = document.querySelector('#passwrd');
  const archivo = file.files[0];

  if (ci.value.trim() != '' && nombre.value.trim() !== '' && archivo && usuario.value.trim() != '' && descripcion.value!='' && passwrd.value.trim() !='') 
  {    
    const datos = new FormData();
    datos.append('ci', ci.value.trim());
    datos.append('nombre', nombre.value.trim());
    datos.append('descripcion', descripcion.value.trim());
    datos.append('usuario', usuario.value.trim());
    datos.append('passwrd', passwrd.value.trim());
    datos.append('imagen', archivo); 
    fetch('/registrardocente', {
      method: 'POST',
      body: datos // no pongas headers
    })
      .then(response => response.json())
      .then(data => {       
         if (data.existe==1)
          {  
           window.location.reload();     
          }
          else if (data.existe==2)
          {  
           Notiflix.Notify.failure('EL DOCENTE YA FUE REGISTRADO ANTES');
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
  const tabla = document.getElementById('docentedatos');

  tabla.addEventListener('click', async (e) => {
    // Captura el botón presionado
    
    if (e.target.id =='eliminarfila')
    {
       const id = e.target.dataset.id;       
        const datos={
          id:id           
        }
        fetch('/docente', {
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
        fetch('/obtenerdocente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
            })
            .then(response => response.json())
            .then(data => {
              
              const ci=data.resultado.ci;
              const nombre=data.resultado.nombre;
              const descripcion=data.resultado.descripcion;
              const nombreImagen=data.resultado.nombreImagen;
              const ImagenURL=data.resultado.imagenURL;
              const estado=data.resultado.estado;
              const usuario=data.resultado.usuario;
              const passwrd=data.resultado.passwrd;
              
              mostrarModalTexto(id,ci,nombre,descripcion,nombreImagen,estado,usuario,passwrd,ImagenURL);
            })
    }   
  });  
});


function mostrarModalTexto(id, ci, nombre, descripcion, nombreImagen, estado, usuario, passwrd, imagenURL) {
  /* 1. Quitar modal anterior */
  const anterior = document.getElementById('modalTextoSimple');
  if (anterior) anterior.remove();
console.log(imagenURL);
  /* 2. Normalizar */
  id           = id           ?? '';
  ci           = ci           ?? '';
  nombre       = nombre       ?? '';
  descripcion  = descripcion  ?? '';
  usuario      = usuario      ?? '';
  passwrd      = passwrd      ?? '';
  nombreImagen = nombreImagen ?? '';
  imagenURL    = imagenURL    ?? '';
  estado       = Number(estado ?? 1);           // 1 = habilitado por defecto

  /* 3. HTML del modal */
  const modalHTML = `
    <div class="modal fade" id="modalTextoSimple" tabindex="-1">
      <div class="modal-dialog modal-sm">
        <div class="modal-content border-0 shadow-sm rounded-4">
          <div class="modal-header bg-danger text-white py-2">
            <h6 class="modal-title">Modificar Docente</h6>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body small">
            <input type="hidden" id="modalDocenteId" value="${id}">

            <div class="mb-2">
              <label class="form-label">CI</label>
              <input type="text" class="form-control form-control-sm" id="modalCi" value="${ci}">
            </div>

            <div class="mb-2">
              <label class="form-label">Nombre</label>
              <input type="text" class="form-control form-control-sm" id="modalNombre" value="${nombre}">
            </div>

            <div class="mb-2">
              <label class="form-label">Descripción</label>
              <textarea class="form-control form-control-sm" id="modalDescripcion" rows="2">${descripcion}</textarea>
            </div>

            <div class="mb-2">
              <label class="form-label">Usuario</label>
              <input type="text" class="form-control form-control-sm" id="modalUsuario" value="${usuario}">
            </div>

            <div class="mb-2">
              <label class="form-label">Contraseña</label>
              <input type="text" class="form-control form-control-sm" id="modalPasswrd" value="${passwrd}">
            </div>

            <div class="mb-2">
              <label class="form-label">Estado</label>
              <select id="modalEstado" class="form-select form-select-sm">
                <option value="1" ${estado === 1 ? 'selected' : ''}>Habilitado</option>
                <option value="0" ${estado === 0 ? 'selected' : ''}>Deshabilitado</option>
              </select>
            </div>

            <!-- Foto -->
            <div class="mb-2 text-center">
              <img id="previewImg"
                   src="${imagenURL}"
                   class="img-thumbnail mb-2"
                   style="max-width:120px;max-height:120px;${imagenURL ? '' : 'display:none;'}">
              <div class="input-group input-group-sm">
                <input type="file" class="form-control visually-hidden" id="fileImg" accept="image/*">
                <button class="btn btn-outline-secondary" type="button"
                        onclick="document.getElementById('fileImg').click()">Buscar</button>
                <input type="text" class="form-control" id="inputImg" value="${nombreImagen}" readonly>
              </div>
            </div>
          </div>

          <div class="modal-footer py-2">
            <button type="button" class="btn btn-primary btn-sm" id="guardarCambios">Modificar</button>
            <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  `;

  /* 4. Mostrar modal */
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  const modal = new bootstrap.Modal(document.getElementById('modalTextoSimple'));
  modal.show();

  /* 5. Preview de nueva imagen */
  const fileInput  = document.getElementById('fileImg');
  const textInput  = document.getElementById('inputImg');
  const previewImg = document.getElementById('previewImg');

  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    textInput.value = file.name;

    const reader = new FileReader();
    reader.onload = ev => {
      previewImg.src = ev.target.result;
      previewImg.style.display = 'block';
    };
    reader.readAsDataURL(file);
  });

  /* 6. Guardar cambios */
  document.getElementById('guardarCambios').addEventListener('click', () => {
    const formData = new FormData();
    formData.append('id',          id);
    formData.append('ci',          document.getElementById('modalCi').value);
    formData.append('nombre',      document.getElementById('modalNombre').value);
    formData.append('descripcion', document.getElementById('modalDescripcion').value);
    formData.append('usuario',     document.getElementById('modalUsuario').value);
    formData.append('passwrd',     document.getElementById('modalPasswrd').value);
    formData.append('estado',      document.getElementById('modalEstado').value);
    formData.append('nombreImagen',      document.getElementById('inputImg').value);
    const file = fileInput.files[0];
    if (file) formData.append('imagen', file);

    fetch('/modificardocente', { method: 'POST', body: formData })
      .then(r => r.json())
      .then(data => {
        bootstrap.Modal.getInstance(document.getElementById('modalTextoSimple')).hide();
        if (data.existe === 1) location.reload();
        else Notiflix.Notify.failure('SE PRODUJO UN ERROR');
      })
      .catch(err => console.error('Error al enviar los datos:', err));
  });
}

  document.getElementById('buscadorDocentes').addEventListener('keyup', function () {
    const filtro = this.value.toLowerCase();
    const filas = document.querySelectorAll('#docentedatos tr');

    filas.forEach(fila => {
      const texto = fila.textContent.toLowerCase();
      fila.style.display = texto.includes(filtro) ? '' : 'none';
    });
  });

