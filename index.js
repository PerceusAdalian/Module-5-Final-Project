let allMovies = [];
let currentSort = '';
let currentGenre = '';

const searchInput = document.getElementById('search-input');
searchInput.addEventListener('keydown', (event) => 
{
    if (event.key === 'Enter') 
    {
        handleSearch(event.target.value.trim());
    }
});

async function handleSearch(query) 
{
    if (!query) return;
    const moviesWrapper = document.querySelector('.movies__rendered');
    moviesWrapper.innerHTML = `<i class="fas fa-spinner movies__loading--spinner"></i>`;

    allMovies = await searchMovies(query);
    currentSort = '';
    currentGenre = '';

    document.getElementById('sort').value = '';
    document.getElementById('genre').value = '';
    applyFiltersAndSort();
}

async function searchMovies(query) 
{
    const response = await fetch('https://www.omdbapi.com/?' + new URLSearchParams({
        apikey: 'aa8d4a8a',
        s: query
    }));
    const data = await response.json();

    if (data.Response === 'False') 
    {
        console.error(data.Error);
        return [];
    }

    const fullMovies = await Promise.all(
        data.Search.map(async (movie) => 
        {
            const detailRes = await fetch('https://www.omdbapi.com/?' + new URLSearchParams({
                apikey: 'aa8d4a8a',
                i: movie.imdbID
            }));
            return detailRes.json();
        })
    );

    return fullMovies;
}

function hasValidPoster(poster) 
{
    return poster && poster !== 'N/A';
}

function buildPlaceholderHTML(title) 
{
    return `<div class="movie__card movie__card--placeholder">
        <i class="fa-solid fa-film"></i>
        <span>${title}</span>
    </div>`;
}

async function renderMovies(data, bool) 
{
    let path = bool === true ? '.movies__featured' : '.movies__rendered';
    const moviesWrapper = document.querySelector(path);

    if (!data || data.length === 0) 
    {
        moviesWrapper.innerHTML = `
        <div class="movies__404">
            <figure class="figure__">
                <img src="./assets/no-data.svg" alt="No Results Found" class="img__">
            </figure>
            <span class="movies__404--text">{<i class="fa-solid fa-info"></i>}</span>
            <h1 class="section__title">No Results Found</h1>
        </div>`;
        return;
    }

    const moviesHTML = data.map(data => 
    {
        const posterHTML = hasValidPoster(data.Poster)
            ? `<img src="${data.Poster}" alt="${data.Title}" class="movie__card" data-title="${data.Title}">`
            : buildPlaceholderHTML(data.Title);

        return `<div class="movie" data-id="${data.imdbID}">
            <figure class="movie__card--wrapper">
                ${posterHTML}
            </figure>
            <div class="movie__description">
                <a class="movie__title">
                    ${data.Title} (${data.Year})
                </a>
                <div class="movie__ratings">
                    <i class="fa-solid fa-star"></i> - ${data.imdbRating}
                </div>
                <p><span class="text--red" style="font-weight:bold;">Genre</span>: ${data.Genre}</p>
                <p><span class="text--red" style="font-weight:bold;">Plot</span>: ${data.Plot}</p>
            </div>
        </div>`;
    }).join('');

    moviesWrapper.innerHTML = moviesHTML;

    moviesWrapper.querySelectorAll('.movie__card').forEach(img => 
    {
        if (img.tagName !== 'IMG') return;

        img.addEventListener('error', () => 
        {
            const title = img.dataset.title;
            img.outerHTML = buildPlaceholderHTML(title);
        }, { once: true });
    });
}

async function renderFeatureFilms() 
{
    let data = await searchMovies('Disney');
    renderMovies(data, true);
}

function sortMovies(data, sortType) 
{
    const sorted = [...data];
    switch (sortType) 
    {
        case 'RATING_HIGH_TO_LOW':
            sorted.sort((a, b) => (parseFloat(b.imdbRating) || 0) - (parseFloat(a.imdbRating) || 0));
            break;
        case 'RATING_LOW_TO_HIGH':
            sorted.sort((a, b) => (parseFloat(a.imdbRating) || 0) - (parseFloat(b.imdbRating) || 0));
            break;
        case 'TITLE_A_TO_Z':
            sorted.sort((a, b) => a.Title.localeCompare(b.Title));
            break;
        case 'TITLE_Z_TO_A':
            sorted.sort((a, b) => b.Title.localeCompare(a.Title));
            break;
        case 'YEAR_NEWEST':
            sorted.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
            break;
        case 'YEAR_OLDEST':
            sorted.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
            break;
    }
    return sorted;
}

function filterByGenre(data, genre) 
{
    if (!genre) return data;
    return data.filter(movie => movie.Genre.includes(genre));
}

async function initHomePage(query, filter) 
{
    allMovies = await searchMovies(query);
    applyFiltersAndSort();
}

function handleSortChange(event) 
{
    currentSort = event.target.value;
    applyFiltersAndSort();
}

function handleGenreChange(event) 
{
    currentGenre = event.target.value;
    applyFiltersAndSort();
}

function applyFiltersAndSort() 
{
    let result = filterByGenre(allMovies, currentGenre);
    result = sortMovies(result, currentSort);
    renderMovies(result);
}

initHomePage('Inception');
renderFeatureFilms();

function openMenu() 
{
    document.body.classList.add('menu--open');
}

function closeMenu() 
{
    document.body.classList.remove('menu--open');
}
