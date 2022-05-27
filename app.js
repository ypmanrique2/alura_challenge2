;(function() {
'use strict'

var palabras = [
    'ALURA',
    'NIÑO',
    'AFINIDAD',
    'PROGRAMAR',
    'ORACLE',
    'YOUTUBE'
]

// Variable para almacenar la configuración actual
var juego = null
// Para ver si ya se ha enviado alguna alerta
var finalizado = false


var $html = {
    hombre: document.getElementById('hombre'),
    adivinado: document.querySelector('.adivinado'),
    errado: document.querySelector('.errado',)
}

function dibujar(juego) {
    // Actualizar la imagen del hombre
    var $elem
    $elem = $html.hombre
    
    var status  = juego.status
    if (status === 8) {
        status = juego.previo
    }
    $elem.src = './img/status/0' + status + '.svg'

    // Creamos las letras adivinadas
    var palabra = juego.palabra
    var adivinado = juego.adivinado
    $elem = $html.adivinado
    // Borramos los elementos anteriores
    $elem.innerHTML = ''
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

    // Creamos las letras erradas
    var errado = juego.errado
    $elem = $html.errado
    // Borramos los elementos anteriores
    $elem.innerHTML = ''
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
    // Si ya hemos adivinado o errado la letra, no hay que hacer nada 
    if (adivinado.has(letra) || errado.has(letra)) {
        return
    }

    var palabra = juego.palabra
    var letras = juego.letras
    // Si es letra de la palabra, 
    if (letras.has(letra)) {
        // Agregamos a la lista de letras adivinadas
        adivinado.add(letra)
        // Actualizamos las letras restantes
        juego.restante--

        // Si ya se ha ganado, debemos indicarlo 
        if (juego.restante === 0) {
        juego.previo = juego.status
        juego.status = 8
        }
    } else {
        // Si no es letra de la palabra, acercamos al hombre un paso más de su horca
        juego.status--
        // Agregamos la letra, a la lista de letras erradas
        errado.add(letra)
    }
}

window.onkeypress = function adivinarLetra(e) {
    var letra = e.key
    letra = letra.toUpperCase()
    if (/[^A-ZÑ]/.test(letra)) {
        return
    }
    adivinar(juego, letra)
    var estado = juego.estado
    if (estado === 8 && !finalizado) {
        setTimeout(alertaGanado, 0)
        finalizado = true
    }else if (estado === 1 && !finalizado) {
        let palabra = juego.palabra
        let fn = alertaPerdido.bind(undefined, palabra) 
        setTimeout(fn, 0)
        finalizado = true
    }
    dibujar(juego)
}


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


function palabraAleatoria() {
    var indice = ~~(Math.random() * palabras.length)
    return palabras[indice]
}

function alertaGanado() {
    alert('Felicidades, ganaste!')
}

function alertaPerdido(palabra) {
    alert('Lo siento, perdiste... la palabra era: ' + palabra)
}

nuevoJuego()


}())