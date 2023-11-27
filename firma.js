//Obtenemos referencias a los elementos HTML
const canvas = document.querySelector('canvas');
const form = document.querySelector('.firma-pad-form');
const botonLimpiar = document.querySelector('.boton-limpiar');
const botonImagen = document.querySelector('.boton-imagen');
const botonContrato = document.querySelector('boton-contrato');

//obtenemos el contexto del canvas para dibujar en 2D
const ctx = canvas.getContext('2d');
//Bandera que indica si ya comenzamos a presionar el boton de mouse sin soltarlo
let modoEscritura = false;
//variables para guardar la posicion del cursor
let xAnterior = 0, yAnterior = 0, xActual = 0, yActual = 0;
//Variables de estilo
const COLOR = 'blue';
const GROSOR = 2;

//Funcion que limpia el canvas poniendoloe el fondo blanco 
const limpiarPad = () => {
    ctx.fillStyle = 'white';
    ctx.fillRect (0, 0, canvas.width, canvas.height);
};
limpiarPad();

//Evento click del link "limpiar"
botonLimpiar.addEventListener('click', (e) => {
    //previene que se ejecute el link
    e.preventDefault();
    limpiarPad();
});

//Clic para descargar la imagen de la firma
botonImagen.addEventListener('click', (e) =>{
//previene que se ejecute el link
e.preventDefault();

const enlace = document.createElement('a');
//titulo de la imagen
enlace.download = "Firma.png";
//convertir la firma a Base64 y ponerlo en el enlace
enlace.href = canvas.toDataURL();
//clic en el enlace para descargar
enlace.click();
});

//esta funcion es para ser accedida por una ventna hijo
window.obtenerImagen = () => {
    return canvas.toDataURL();
};

botonContrato.addEventListener('click', (e) =>{
    //previene que se ejecute el link 
    e.preventDefault();

    //abre una nueva ventana hija
    const ventana= window.open('contrato.html');
});

//obtiene la posicion del cursor
const obtenerPosicionCursor = (e) => {
    positionX = e.clientX  - e.target.getBoundingClientRect().left;
    positionY = e.clientY - e.target.getBoundingClientRect().top;

    return [positionX, positionY];
}

//al iniciar el trazado, dibujamos un puntito
const OnClicOToqueIniciado = (e) => {
    modoEscritura = true;
    [xActual, yActual] = obtenerPosicionCursor(e);

    ctx.beginPath();
    ctx.fillStyle = COLOR;
    ctx.fillRect(xActual, yActual, GROSOR, GROSOR);
    ctx.closePath();
}

//Al mover el dedo o el mouse sin despegarlo dibujamos las lineas
const OnMouseODedoMovido = (e) => {
    if (!modoEscritura) return;

    let target = e;
    if(e.type.includes("touch"))
    {
        target = e.touches[0]; //solo dedo
    }
    xAnterior = xActual;
    yAnterior = yActual;
    [xActual, yActual] = obtenerPosicionCursor(target);

    ctx.beginPath();
    ctx.lineWidth = GROSOR;
    ctx.strokeStyle = COLOR;
    ctx.moveTo(xAnterior, yAnterior);
    ctx.lineTo(xActual, yActual);
    ctx.stroke();
    ctx.closePath();
}

    function OnClicODedoLevantado(){
        modoEscritura = false;
    }

    ['mousedown', 'touchstart'].forEach(nombreEvento => {
        canvas.addEventListener(nombreEvento, OnClicOToqueIniciado, {passive: true});
    });

    ['mousemove' , 'touchmove'].forEach(nombreEvento =>{
        canvas.addEventListener(nombreEvento, OnMouseODedoMovido,{passive: true});
    });

    ['moseup', 'touchend'].forEach(nombreEvento=> {
        canvas.addEventListener(nombreEvento, OnClicODedoLevantado,{passive: true});
    });

    