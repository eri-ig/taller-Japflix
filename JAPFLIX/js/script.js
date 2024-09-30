const DATA_URL = " https://japceibal.github.io/japflix_api/movies-data.json"
let peliABuscar = document.getElementById("inputBuscar")
let botonBuscar = document.getElementById("btnBuscar")
let listadoDePeliculasFiltradas = document.getElementById("lista")
let listadoDePeliculas = []


document.addEventListener("DOMContentLoaded", function () {

    fetch(DATA_URL)
        .then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            } return response.json();
        })
        .then(pelicula => {
            listadoDePeliculas = pelicula;

            console.log(pelicula);
        })
        .catch(error => {
            console.error(error)
        });

    botonBuscar.addEventListener("click", () => {
        buscarPeliculas()
    })

})

function buscarPeliculas() {
    const peliConsultada = peliABuscar.value.toLowerCase();
    const resultadosDeFiltro = listadoDePeliculas.filter((peli) => {
        const generoEncontrado = peli.genres.some(genero => genero.name.toLowerCase().includes(peliConsultada))
        return peli.title.toLowerCase().includes(peliConsultada) || peli.overview.toLowerCase().includes(peliConsultada) || peli.tagline.toLowerCase().includes(peliConsultada) || generoEncontrado;
    })
    listadoDePeliculasFiltradas.innerHTML = ""
    if (resultadosDeFiltro.length === 0) {
        listadoDePeliculasFiltradas.innerHTML = "no se encontro su pelicula"
    } else {
        resultadosDeFiltro.forEach(peli => {
            const li = document.createElement("li")
            li.classList.add("list-group-item", "list-group-item-action", "cursor-active")
            li.innerHTML = ` 
                <div class="d-flex justify-content-between align-items-center">
            <div>
              <h3 class="mb-1">${peli.title}</h3>
              <p class="mb-1">${peli.tagline}</p>
            </div>
            <div>${generarEstrellas(peli.vote_average)}</div>
          </div>
                    
                `;

            li.addEventListener("click", () => {
                mostrarDetalleDePelicula(peli)
            });
            listadoDePeliculasFiltradas.appendChild(li)
        });

    }
}

function generarEstrellas(votacion) {
    const estrellasTotales = 5;
    const voto = Math.round((votacion / 10) * estrellasTotales);
    let estrellasHTML = "";
    for (let i = 1; i <= estrellasTotales; i++) {
        if (i <= voto) {
            estrellasHTML += '<span class="fa fa-star checked"></span>';
        } else {
            estrellasHTML += '<span class="fa fa-star"></span>';
        }
    }
    return estrellasHTML;
}

function mostrarDetalleDePelicula(peli) {
    const titulo = document.getElementById("offcanvasTopLabel")
    const sinopsis = document.getElementById("sinopsis")
    const generos = document.getElementById("generos")
    const lanzamiento = document.getElementById("anhoLanzamiento")
    const duracion = document.getElementById("duracion")
    const presupuesto = document.getElementById("presupuesto")
    const ganancias = document.getElementById("ganancias")
    const mostarINFO = document.getElementById("offcanvasTop")
    const elementoOffcanvas = new bootstrap.Offcanvas(mostarINFO);

    titulo.textContent = peli.title
    sinopsis.innerHTML = peli.overview
    generos.innerHTML = peli.genres.map(genero => `<li>${genero.name}</li>`).join('')
    lanzamiento.innerHTML = "Release date :" + peli.release_date
    duracion.innerHTML = "Runtime: "+ (peli.runtime)
    presupuesto.innerHTML = "Budget: $" + peli.budget
    ganancias.innerHTML = "Revenue: $" + peli.revenue
    elementoOffcanvas.show()
    const dropdownElement = document.getElementById('dropdownInfo');
//const dropdown = new bootstrap.Dropdown(dropdownElement, {
    //boundary: 'window'
//});
}
