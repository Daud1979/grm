const seleccion = document.querySelector('#grm-rol');
const usuario = document.querySelector('#grm-usuario');
const passwrd = document.querySelector('#grm-password');
const btnEnviar = document.querySelector('#btnEnviar');
const mensajeError = document.querySelector('#mensajeError');


////////////////







////////
btnEnviar.addEventListener('click',()=>{
    
  mensajeError.classList.add('mensajeErrorLimpiar');
    if(seleccion.value != '' && usuario.value!='' && passwrd.value!='')
    {
       
        const datos={
            seleccion:seleccion.value,
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
                          
                    post(datos);
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
////////////////////////
function post(data) {
    // Crear un formulario temporal
    const form = document.createElement("form");
    form.method = "POST";
    form.action = '/carruselfotos';
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = data[key];
            form.appendChild(input);
        }
    }   
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}