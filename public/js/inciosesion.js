const seleccion = document.querySelector('#grm-rol');
const usuario = document.querySelector('#grm-usuario');
const passwrd = document.querySelector('#grm-password');
const btnEnviar = document.querySelector('#btnEnviar');
const mensajeError = document.querySelector('#mensajeError');

btnEnviar.addEventListener('click',()=>{
    
  mensajeError.classList.add('mensajeErrorLimpiar');
    if(seleccion.value != '' && usuario.value!='' && passwrd.value!='')
    {
       
        const datos={
            tipo:seleccion.value,
            usuario:usuario.value,
            passwrd:passwrd.value
        }
        fetch('/verificariniciosesion', {
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
                    window.location.href = '/GRMCarrusel';
                }
                else if (data.existe==2)
                {
                    enviarUsuario(data.usuario);
                }
                else
                {
                    Notiflix.Notify.failure('CREDENCIALES INCORRECTAS');
                    usuario.value=''
                    passwrd.value=''
                }
            })
        
    }    
    else{
        mensajeError.classList.add('mensajeErrorLimpiar');
    }
});

function enviarUsuario(usuario) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = '/acciones'; // Tu ruta en el servidor
  form.style.display = 'none';

  // Agregamos los campos uno por uno
  for (const key in usuario) {
    if (usuario.hasOwnProperty(key)) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = usuario[key];
      form.appendChild(input);
    }
  }

  document.body.appendChild(form);
  form.submit(); // Esto enviará al servidor y permitirá la redirección
}
