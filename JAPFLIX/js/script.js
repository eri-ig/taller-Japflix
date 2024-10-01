// se crean una constante que almacene la direccion del json. 
const DATA_URL = " https://japceibal.github.io/japflix_api/movies-data.json"
let peliABuscar = document.getElementById("inputBuscar") // se crean variables que guardan los elementos html que tenemos al momento de comenzar.
let botonBuscar = document.getElementById("btnBuscar")
let listadoDePeliculasFiltradas = document.getElementById("lista")
let listadoDePeliculas = [] // se crea un array vacio para guardar las peliculas que obtengamos del fetch

document.addEventListener("DOMContentLoaded", function () {

    fetch(DATA_URL) // mi querido fetch...
        .then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            } return response.json();
        })
        .then(pelicula => { 
            listadoDePeliculas = pelicula; // lo que obtenemos de la promesa lo guardamos en el array

            console.log(pelicula);// MI VICIO DE SABER SI SE REALIZO BIEN EL FETCH
        })
        .catch(error => {
            console.error(error)
        });

    botonBuscar.addEventListener("click", () => { // se añade un evento al boton de buscar para que muestre el resultado de la fun buscarPeliculas()
        buscarPeliculas()
    })
})

function buscarPeliculas() {
    const peliConsultada = peliABuscar.value.toLowerCase(); // se guarda el valor del imput en minuscula
    const resultadosDeFiltro = listadoDePeliculas.filter((peli) => { // se guarda el resultado de el filtrado que se realizara en en el array
        const generoEncontrado = peli.genres.some(genero => genero.name.toLowerCase().includes(peliConsultada)) // aqui realice la constante para guardar el resultado de la busqueda para saber si alguno de los generos cohincide con lo puesto en el imput de forma mas limpia en el codigo.
        return peli.title.toLowerCase().includes(peliConsultada) || peli.overview.toLowerCase().includes(peliConsultada) || peli.tagline.toLowerCase().includes(peliConsultada) || generoEncontrado;
    })
    listadoDePeliculasFiltradas.innerHTML = "" // comenzamos con el container vacio
    if (resultadosDeFiltro.length === 0) { // si no hay resultados se manda un mensaje al usuario para alertarle.
        listadoDePeliculasFiltradas.innerHTML = "no se encontro su pelicula"
    } else {
        resultadosDeFiltro.forEach(peli => {//para cada item
            const li = document.createElement("li")//se crea un elemento li
            li.classList.add("list-group-item", "list-group-item-action", "cursor-active")// se le añade clases de boostrap que ayuden con su interaccion y organizacion
            li.innerHTML = ` 
                <div class="d-flex justify-content-between align-items-center">
            <div>
              <h3 class="mb-1">${peli.title}</h3>
              <p class="mb-1">${peli.tagline}</p>
            </div>
            <div>${generarEstrellas(peli.vote_average)}</div>
          </div>                   
                `;// se le añade toda ese codigo para crear el elemento de ese li
            li.addEventListener("click", () => { // se le añade un evento para cuando se interaccione con el se muestre el resultado de de la funcion mostrar detalles
                mostrarDetalleDePelicula(peli)
            });
            listadoDePeliculasFiltradas.appendChild(li)// se le añade el li al grupo container de listado d peliculas filtradas
        });
    }
}

function generarEstrellas(votacion) {// para crear las estrellas(hay un css que tambien forma parte de esto)
    const estrellasTotales = 5;// se guarda la cantidad de estrellas totales que se van a mostrar en el li
    const voto = Math.round((votacion / 10) * estrellasTotales);// las estrellas estan a una escala de 10, asi que hay que aplicar una division. Use esta xk quiero adaptarme a utilizar este tipo de formula porque es mas flexible si la escala de votacion fuera otra
    let estrellasHTML = "";
    for (let i = 1; i <= estrellasTotales; i++) {
        if (i <= voto) {
            estrellasHTML += '<span class="fa fa-star checked"></span>'; //si el indice es menor que estrellastotales se le añade la clase checked.Si no, no.
        } else {
            estrellasHTML += '<span class="fa fa-star"></span>';
        }
    }
    return estrellasHTML;
}

function mostrarDetalleDePelicula(peli) { // añadi constantes que guardan los lugares donde deberian ir los datos.
    const titulo = document.getElementById("offcanvasTopLabel")
    const sinopsis = document.getElementById("sinopsis")
    const generos = document.getElementById("generos")
    const lanzamiento = document.getElementById("anhoLanzamiento")
    const duracion = document.getElementById("duracion")
    const presupuesto = document.getElementById("presupuesto")
    const ganancias = document.getElementById("ganancias")
    const mostarINFO = document.getElementById("offcanvasTop")
    const elementoOffcanvas = new bootstrap.Offcanvas(mostarINFO);// offcanvas decesita un detonador, en boostrap aparecia con un boton, pero en esta ocacion la controle mediante js e hice que el detonador fuera llamar al offcanvas mendiante la variable mostarINFO
//le añadi los datos
    titulo.textContent = peli.title
    sinopsis.innerHTML = peli.overview
    generos.innerHTML = peli.genres.map(genero => `<li>${genero.name}</li>`).join('')
    lanzamiento.innerHTML = "Release date :" + peli.release_date
    duracion.innerHTML = "Runtime: " + (peli.runtime) + " mint"
    presupuesto.innerHTML = "Budget: $" + peli.budget
    ganancias.innerHTML = "Revenue: $" + peli.revenue
    elementoOffcanvas.show()// lo hice para que se muestre en respuesta a al evento visto anteriormente.
}
