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
        if (adivinado.indexOf(letra) >= 0) {
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
    if (adivinado.indexOf(letra) >= 0 || 
        errado.indexOf(letra) >= 0) {
        return
    }

    var palabra = juego.palabra
    // Si es letra de la palabra, 
    if (palabra.indexOf(letra) >= 0) {
        let ganado = true
        // Debemos ver si llegamos al estado ganador 
        for (let l of palabra) {
            if (adivinado.indexOf(l) < 0 && l != letra) {
                ganado = false
                juego.previo = juego.status
                break
            }
        }
        // Si ya se ha ganado, debemos indicarlo 
        if (ganado) {
            juego.status = 8
        }
        // Agregamos la letra, a la lista de letras adivinadas
        adivinado.push(letra)
    } else {
        // Si no es letra de la palabra, acercamos al hombre un paso más de su horca
        juego.status--
        // Agregamos la letra, a la lista de letras erradas
        errado.push(letra)
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
        setTimeout(alertaGanado, 500)
        finalizado = true
    }else if (estado === 1 && !finalizado) {
        let palabra = juego.palabra
        let fn = alertaPerdido.bind(undefined, palabra) 
        setTimeout(fn, 500)
        finalizado = true
    }
    dibujar(juego)
}


window.nuevoJuego = function nuevoJuego() {
    var palabra = palabraAleatoria()
    juego = {}
    juego.palabra = palabra
    juego.status = 7
    juego.adivinado = []
    juego.errado = []
    finalizado = false
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