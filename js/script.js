// window route
const global = {
    currentPage: window.location.pathname,
};

// URL
const apiURL = 'https://api.themoviedb.org/3'

// API key
const key = '9c120a0bf16789c13f27cc2205cc0c5a'

//fetch data
async function fetchData(endPoint) {
    showSpinner()
    const res = await fetch(`${apiURL}${endPoint}?api_key=${key}&language=en-US`);
    const data = await res.json()
    hideSpinner()
    return data
};

// highlight the nav link
function highLightActiveLink () {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(navLink => {
        if (navLink.getAttribute('href') === global.currentPage) {
            navLink.classList.add('active');
        };
    });
};

// Change money format
function changeMoneyFormat (value) {
    return new Intl.NumberFormat().format(value);
};

// show spinner
function showSpinner () {
    const spinner = document.querySelector('.spinner');
    spinner.classList.add('show');
};

// hide spinner
function hideSpinner () {
    const spinner = document.querySelector('.spinner');
    spinner.classList.remove('show');
};

// show the popular movies
async function showPopularMovies() {
    const { results } =  await fetchData('/movie/popular');
    const popularMovies = document.querySelector('#popular-movies');

    results.forEach(movie => {
        const div = document.createElement('div');

        div.classList.add('card');
        div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
                ${movie.poster_path 
                    ? `<img 
                        src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                        class="card-img-top"
                        alt="${movie.title}"
                        />`
                    : `<img 
                        src="../images/no-image.jpg"
                        class="card-img-top"
                        alt="${movie.title}"
                        />`
                }
            </a>
            <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text">
                <small class="text-muted">Release: ${movie.release_date}</small>
                </p>
            </div>`
        popularMovies.appendChild(div);
    });
};

// show popular TV shows
async function showPopularTVShows () {
    const { results } = await fetchData('/tv/popular');
    const popularShows = document.querySelector('#popular-shows');

    results.forEach(show => {
        const div = document.createElement('div');

        div.classList.add('card');
        div.innerHTML = `
            <a href="tv-details.html?id=${show.id}">
                ${show.poster_path 
                    ? `<img 
                        src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                        class="card-img-top"
                        alt="${show.name}"
                        />`
                    : `<img 
                        src="../images/no-image.jpg"
                        class="card-img-top"
                        alt="${show.name}"
                        />`
                }
            </a>
            <div class="card-body">
                <h5 class="card-title">${show.name}</h5>
                <p class="card-text">
                <small class="text-muted">Aired: ${show.first_air_date}</small>
                </p>
            </div>`
        popularShows.appendChild(div);
    });
};

// Display Backdrop On Details Pages
function displayBackgroundImage(type, backgroundPath) {
    const overlayDiv = document.createElement('div');
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${backgroundPath})`;
    overlayDiv.style.backgroundSize = 'cover';
    overlayDiv.style.backgroundPosition = 'center';
    overlayDiv.style.backgroundRepeat = 'no-repeat';
    overlayDiv.style.height = '100vh';
    overlayDiv.style.width = '100vw';
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = '0';
    overlayDiv.style.left = '0';
    overlayDiv.style.zIndex = '-1';
    overlayDiv.style.opacity = '0.1';
  
    if (type === 'movie') {
      document.querySelector('#movie-details').appendChild(overlayDiv);
    } else {
      document.querySelector('#show-details').appendChild(overlayDiv);
    };
};

// show movie information
async function getMovieInfo () {
    const movieDetails = document.querySelector('#movie-details');

    const queryString = window.location.search;
    const id = Number(queryString.split('=')[1])

    const movie = await fetchData(`/movie/${id}`);

    const divTop = document.createElement('div');
    divTop.classList.add('details-top');

    const divBottom = document.createElement('div');
    divBottom.classList.add('details-bottom');

    divTop.innerHTML = `
        <div>
            ${movie.poster_path 
                ? `<img 
                    src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                    class="card-img-top"
                    alt="${movie.original_title}"
                    />`
                : `<img 
                    src="../images/no-image.jpg"
                    class="card-img-top"
                    alt="${movie.original_title}"
                    />`
            }
        </div>
        <div>
            <h2>${movie.original_title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
                ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
                ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
        </div>`

    divBottom.innerHTML = `
        <h2>Movie Info</h2>
        <ul>
        <li><span class="text-secondary">Budget:</span> $ ${changeMoneyFormat(movie.budget)}</li>
        <li><span class="text-secondary">Revenue:</span> $ ${changeMoneyFormat(movie.revenue)}</li>
        <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
        <li><span class="text-secondary">Status:</span> ${movie.status}</li>
        </ul>
        <h4>Production Companies</h4>
        <div class="list-group">${movie.production_companies.map((company) => `${company.name}`).join(', ')}</div>`
    
    displayBackgroundImage('movie', movie.backdrop_path);
    movieDetails.appendChild(divTop);
    movieDetails.appendChild(divBottom);
};

// show TV show information
async function getTVShowInfo () {
    const showDetails = document.querySelector('#show-details');

    const queryString = window.location.search;
    const id = Number(queryString.split('=')[1])

    const show = await fetchData(`/tv/${id}`);
    
    const divTop = document.createElement('div');
    divTop.classList.add('details-top');

    const divBottom = document.createElement('div');
    divBottom.classList.add('details-bottom');

    divTop.innerHTML = `
        <div>
            ${show.poster_path 
                ? `<img 
                    src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                    class="card-img-top"
                    alt="${show.original_name}"
                    />`
                : `<img 
                    src="../images/no-image.jpg"
                    class="card-img-top"
                    alt="${show.original_name}"
                    />`
            }
        </div>
        <div>
            <h2>${show.original_name}</h2>
            <p>
            <i class="fas fa-star text-primary"></i>
            ${show.vote_average} / 10
            </p>
            <p class="text-muted">Release Date: ${show.first_air_date}</p>
            <p>
                ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
                ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${show.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
        </div>`

    divBottom.innerHTML = `
        <h2>Show Info</h2>
        <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${show.number_of_episodes}</li>
            <li>
                <span class="text-secondary">Last Episode To Air:</span> ${show.last_episode_to_air.name}
            </li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
        </ul>
        <h4>Production Companies</h4>
        <div class="list-group">${show.production_companies.map((company) => `${company.name}`).join(', ')}</div>`
    
    displayBackgroundImage('show', show.backdrop_path);
    showDetails.appendChild(divTop);
    showDetails.appendChild(divBottom);
};

// initial function
function init () {
    switch (global.currentPage) {
        case '/':
        case '/index.html':
            showPopularMovies();
            break;
        case '/movie-details.html':
            getMovieInfo();
            break;
        case '/search.html':
            console.log('search');
            break;
        case '/shows.html':
            showPopularTVShows();
            break;
        case '/tv-details.html':
            getTVShowInfo();
            break;
        default:
            console.log(global.currentPage);
            break;
    };

    highLightActiveLink();
};

document.addEventListener('DOMContentLoaded', init);
