document.addEventListener("DOMContentLoaded", function() {
    const url = "https://japceibal.github.io/japflix_api/movies-data.json";

    // Variables para almacenar los datos de películas
    let moviesData = [];
// Función para cargar los datos de películas
async function cargarDatosDePeliculas() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`No se pudo cargar los datos de películas. Código de estado: ${response.status}`);
        }

        const data = await response.json();
        moviesData = data;
        console.log(data);
    } catch (error) {
        console.error("Error al cargar los datos de las películas:", error);
    }
}
    // Función para mostrar los resultados de la búsqueda
    function mostrarResultadosDeBusqueda(query) {
        // Limpiar resultados anteriores
        const lista = document.getElementById("lista");
        lista.innerHTML = "";

        // Filtrar películas que coincidan con la consulta
        const resultados = moviesData.filter(movie => {
            const textoBuscado = query.toLowerCase();
            const genres = typeof movie.genres === 'string' ? movie.genres.toLowerCase() : '';
            return (
                movie.title.toLowerCase().includes(textoBuscado) ||
                genres.includes(textoBuscado) ||
                movie.tagline.toLowerCase().includes(textoBuscado) ||
                movie.overview.toLowerCase().includes(textoBuscado)
            );
        });

        // Mostrar resultados en la página
        resultados.forEach(movie => {
            const itemLista = document.createElement("li");
            itemLista.className = "list-group-item";
            itemLista.innerHTML = `
                <h3>${movie.title}</h3>
                <p>${movie.tagline}</p>
                <p>Rating: ${convertirARatingEstrellas(movie.vote_average)}</p>
            `;
            lista.appendChild(itemLista);

            // Agregar evento de clic para mostrar detalles de la película
            itemLista.addEventListener("click", function() {
                mostrarDetallesPelicula(movie);
            });
        });
    }

    // Función para mostrar todas las películas
    function mostrarTodasLasPeliculas() {
        // Limpiar resultados anteriores
        const lista = document.getElementById("lista");
        lista.innerHTML = "";

        // Mostrar todas las películas
        moviesData.forEach(movie => {
            const itemLista = document.createElement("li");
            itemLista.className = "list-group-item";
            itemLista.innerHTML = `
            <div class="movie-details">
            <div class="title-and-stars">
              <h3>${movie.title}</h3>
              <p class="stars">Rating: ${convertirARatingEstrellas(movie.vote_average)}</p>
            </div>
            <p class="tagline">${movie.tagline}</p>
          </div>
            `;
            lista.appendChild(itemLista);

            // Agregar evento de clic para mostrar detalles de la película
            itemLista.addEventListener("click", function() {
                mostrarDetallesPelicula(movie);
            });
        });
    }

    // Función para convertir el valor de vote_average a "estrellas"
    function convertirARatingEstrellas(valoracion) {
        const estrellaLlena = '<i class="fa fa-star checked"></i>';
        const estrellaVacia = '<i class="fa fa-star"></i>';
        const estrellasLlenas = Math.floor(valoracion / 2);
        const estrellasVacias = 5 - estrellasLlenas;
        return estrellaLlena.repeat(estrellasLlenas) + estrellaVacia.repeat(estrellasVacias);
    }

    // Evento al presionar el botón de búsqueda
    const btnBuscar = document.getElementById("btnBuscar");
    btnBuscar.addEventListener("click", function() {
        const inputBuscar = document.getElementById("inputBuscar");
        const query = inputBuscar.value.trim();

        // Verificar que se haya ingresado un valor en el campo de búsqueda
        if (query !== "") {
            mostrarResultadosDeBusqueda(query);
        } else {
            mostrarTodasLasPeliculas();
        }
    });

    // Cargar los datos de películas al inicio
    cargarDatosDePeliculas();
    
    function mostrarDetallesPelicula(pelicula) {
        const detalleTitulo = document.getElementById('detalleTitulo');
        const detalleOverview = document.getElementById('detalleOverview');
        const detalleGenres = document.getElementById('detalleGenres');
        const añoSalida = document.getElementById('añoSalida');
        const duracion = document.getElementById('duracion');
        const costeProduccion = document.getElementById('costeProduccion');
        const ganancias = document.getElementById('ganancias');
      
        detalleTitulo.textContent = pelicula.title;
        detalleOverview.textContent = pelicula.overview;
        añoSalida.textContent = `Release year: ${new Date(pelicula.release_date).getFullYear()}`;
        duracion.textContent = `Duration: ${pelicula.runtime} minutos`;
        costeProduccion.textContent = `Cost of production: $${pelicula.budget}`;
        ganancias.textContent = `Profits: $${pelicula.revenue}`;
      
        detalleGenres.innerHTML = '';
      
        
        pelicula.genres.forEach(genre => {
          const genreItem = document.createElement('li');
          genreItem.textContent = genre.name;
          genreItem.className += "genero"
          detalleGenres.appendChild(genreItem);
        });
        const offcanvas = new bootstrap.Offcanvas(document.getElementById('detallePelicula'));
        offcanvas.show();
      };
});