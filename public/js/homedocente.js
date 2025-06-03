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

   llamadaModal.addEventListener('click', (e)=>{
    if(e.target.id=='btnIncidencia')
    {
      const titulo = (llamadaModal.querySelector('#titulo').value);
      const motivo = (llamadaModal.querySelector('#motivo').value);
      const acciones = (llamadaModal.querySelector('#acciones').value);
      const fecha = (llamadaModal.querySelector('#fecha').value);
      const id = (llamadaModal.querySelector('#id').value);
     const idpr = (llamadaModal.querySelector('#idpr').value);
      if (motivo.trim() != '' && fecha !='')
      {
         const datos={
          titulo:titulo,
            id:id,
            idpr:idpr,
            acciones:acciones,
            motivo:motivo,
            fecha:fecha           
        }
        fetch('/registrarincidencia', {
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
          Notiflix.Notify.success('SE REGISTRO CORRECTAMENTE');
          setTimeout(() => {location.reload();}, 2000); 
        }
        else
        {
          Notiflix.Notify.warning('FALTAN DATOS');      
        
        }
      })      
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