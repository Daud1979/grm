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
                    window.location.href = '/carrusel';
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
