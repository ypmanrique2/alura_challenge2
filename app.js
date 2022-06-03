;(function() {
'use strict'
// Se declara esta variable para almacenar las palabras que el jugador debe adivinar
var palabras = [
    'ARGENTINA',
    'BRASIL',
    'COLOMBIA',
    'CHILE',
    'ECUADOR',
    'MEXICO',
    'PERU',
    'VENEZUELA',
]
// Se declara esta variable para almacenar la configuración actual del juego 
var juego = null
// Se declara esta variable para ver si ya se ha enviado alguna alerta de resultado
var finalizado = false
// Se modifica HTML del DOM con el operador $ para poder interactuar con los elementos 
var $html = {
    hombre: document.getElementById('hombre'),
    adivinado: document.querySelector('.adivinado'),
    errado: document.querySelector('.errado',)
}
// Se declara la función dibujar para que muestre los estados del juego en imágenes 
function dibujar(juego) {
    // Se declara la variable $elem para manipular el HTML del DOM y actualizar la imagen del hombre
    var $elem
    $elem = $html.hombre
    // Se declara la variable status para controlar la configuración del juego 
    var status  = juego.status
    if (status === 8) {
        status = juego.previo
    }
    // Se muestran las imágenes según el estado en que vaya azanzando el juego
    $elem.src = './img/status/0' + status + '.svg'
    // Se crean las variables para almacenar las letras ingresadas y las letras adivinadas
    var palabra = juego.palabra
    var adivinado = juego.adivinado
    $elem = $html.adivinado
    // Se borran los elementos anteriores
    $elem.innerHTML = ''
    // Se hace un ciclo for para buscar si la letra pertenece a la palabra seleccionada
    for (let letra of palabra) {
        let $span = document.createElement('span')
        let $txt = document.createTextNode('')
        if (adivinado.has(letra)) {
            $txt.nodeValue = letra
        }
        $span.setAttribute('class', 'letra adivinada')
        $span.appendChild($txt)
        $elem.appendChild($span)
    }
    // Se crean las letras erradas
    var errado = juego.errado
    $elem = $html.errado
    // Se borran los elementos anteriores
    $elem.innerHTML = ''
     // Se hace un ciclo for para buscar si la letra no pertenece a la palabra seleccionada
    for (let letra of errado) {
        let $span = document.createElement('span')
        let $txt = document.createTextNode(letra)
        $span.setAttribute('class', 'letra errada')
        $span.appendChild($txt)
        $elem.appendChild($span)
    }
}

function adivinar(juego, letra) {
    var status = juego.status
    // Si ya se ha perdido, o ganado, no hay que hacer nada 
    if (status === 1 || status === 8 ) {
        return
    }

    var adivinado = juego.adivinado
    var errado = juego.errado
    // Si ya se ha adivinado o errado la letra, no hay que hacer nada 
    if (adivinado.has(letra) || errado.has(letra)) {
        return
    }

    var palabra = juego.palabra
    var letras = juego.letras
    // Si es letra de la palabra, entonces...
    if (letras.has(letra)) {
        // Se añade a la lista de letras adivinadas
        adivinado.add(letra)
        // ASe actualizan las letras restantes
        juego.restante--

        // Si ya se ha ganado, se debe indicar
        if (juego.restante === 0) {
        juego.previo = juego.status
        juego.status = 8
        }
    } else {
        // Si no es letra de la palabra, se acerca el muñeno un paso más a su ahorcamiento
        juego.status--
        // Se añade la letra, a la lista de letras erradas
        errado.add(letra)
    }
}
// Para ingresar letras con el teclado en mayúsculas
window.onkeypress = function adivinarLetra(e) {
    var letra = e.key
    letra = letra.toUpperCase()
    if (/[^A-ZÑ]/.test(letra)) {
        return
    }
    adivinar(juego, letra)
    var status = juego.status
    if (status === 8 && !finalizado) {
        setTimeout(alertaGanado, 0)
        finalizado = true
    }else if (status === 1 && !finalizado) {
        let palabra = juego.palabra
        let fn = alertaPerdido.bind(undefined, palabra) 
        setTimeout(fn, 0)
        finalizado = true
    }
    dibujar(juego)
}

// Para configurar la lógica del juego
window.nuevoJuego = function nuevoJuego() {
    var palabra = palabraAleatoria()
    juego = {}
    juego.palabra = palabra
    juego.status = 7
    juego.adivinado = new Set()
    juego.errado = new Set()
    finalizado = false

    var letras = new Set()
    for (let letra of palabra) {
        letras.add(letra)
    }
    juego.letras = letras
    juego.restante = letras.size

    dibujar(juego)
    console.log(juego)
}

// Para elegir una palabra aleatoriamente
function palabraAleatoria() {
    var indice = ~~(Math.random() * palabras.length)
    return palabras[indice]
}
// Para alertar si ganó
function alertaGanado() {
    alert('Felicidades, ganaste!')
}
// Para alertar si perdió
function alertaPerdido(palabra) {
    alert('Lo siento, perdiste... la palabra era: ' + palabra)
}

nuevoJuego()


}())