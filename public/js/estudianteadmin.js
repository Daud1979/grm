

 let contadorAlumnos = 1; 
document.getElementById("est-btn-agregar-alumno").addEventListener("click", function () {
  const contenedor = document.getElementById("est-alumnos-contenedor");

  const nuevoAlumno = document.createElement("div");
  nuevoAlumno.className = "est-alumno";

  // Generar las opciones del select con los cursos
  let opcionesCurso = '<option value="" disabled selected>Seleccione un curso</option>';
  cursosGlobal.forEach(curso => {
    opcionesCurso += `<option value="${curso}">${curso}</option>`;
  });

  nuevoAlumno.innerHTML = `
    <div>
      <label>CI Alumno</label>
      <input type="text" name="alumnos[${contadorAlumnos}][ci_alumno]" required>
    </div>
    <div>
      <label>Nombre</label>
      <input type="text" name="alumnos[${contadorAlumnos}][nombre]" required>
    </div>
    <div>
      <label>Curso</label>
      <select class='selectalumno' name="alumnos[${contadorAlumnos}][curso]" required>
        ${opcionesCurso}
      </select>
    </div>
  `;

  contenedor.appendChild(nuevoAlumno);
  contadorAlumnos++;
});
document.addEventListener('click', function (e) {
  if (e.target && e.target.id === 'btn-agregar-curso-tabla') {
    const txtcurso = document.querySelector('#nuevo-curso-input');

    if (txtcurso.value.trim() !== '') {
      const datos = {
        curso: txtcurso.value.trim()
      };

      fetch('/registrarcurso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
      })
        .then(response => response.json())
        .then(data => {
          if (data.existe === 1 && Array.isArray(data.carrusel)) {
            const tablaBody = document.querySelector('#tabla-cursos-body');
            tablaBody.innerHTML = ''; // Limpiamos la tabla antes de volver a llenar

            data.carrusel.forEach((cursoObj, index) => {
              const tr = document.createElement('tr');
              tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${cursoObj.curso}</td>
              
              `;
              tablaBody.appendChild(tr);
            });

            txtcurso.value = '';
          } else {
            Notiflix.Notify.failure('EL CURSO YA SE ENCUENTRA REGISTRADO');
          }
        })
        .catch(err => {
          console.error(err);
          Notiflix.Notify.failure('Error al registrar el curso');
        });
    } else {
      Notiflix.Notify.warning('DATO NO VÁLIDO');
    }
  }
});

/*PARA EL REGISTRO*/
const btnRegistrar = document.querySelector('#enviarregistroalumno');

