let movies;

async function searchMovies(query) {
    const response = await fetch('http://www.omdbapi.com/?' + new URLSearchParams({
        apikey: 'aa8d4a8a',
        s: query
    }));
    const data = await response.json();

    if (data.Response === 'False') {
        console.error(data.Error);
        return [];
    }

    const fullMovies = await Promise.all(
        data.Search.map(async (movie) => {
            const detailRes = await fetch('http://www.omdbapi.com/?' + new URLSearchParams({
                apikey: 'aa8d4a8a',
                i: movie.imdbID
            }));
            return detailRes.json();
        })
    );

    return fullMovies;
}

function hasValidPoster(poster) {
    return poster && poster !== 'N/A';
}

function buildPlaceholderHTML(title) {
    return `<div class="movie__card movie__card--placeholder">
        <i class="fa-solid fa-film"></i>
        <span>${title}</span>
    </div>`;
}

async function renderMovies(data, filter) 
{
    const moviesWrapper = document.querySelector('.movies__rendered');

    const moviesHTML = data.map(data => {
        const posterHTML = hasValidPoster(data.Poster)
            ? `<img src="${data.Poster}" alt="${data.Title}" class="movie__card" data-title="${data.Title}">`
            : buildPlaceholderHTML(data.Title);

        return `<div class="movie" data-id="${data.imdbID}">
            <figure class="movie__card--wrapper">
                ${posterHTML}
            </figure>
            <div class="movie__description">
                <a href="${data.imdbID}" class="movie__title">
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

    // Catch images that had a valid-looking URL but failed to actually load
    moviesWrapper.querySelectorAll('.movie__card').forEach(img => {
        if (img.tagName !== 'IMG') return; // skip ones already rendered as placeholders

        img.addEventListener('error', () => {
            const title = img.dataset.title;
            img.outerHTML = buildPlaceholderHTML(title);
        }, { once: true });
    });
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
    const movies = await searchMovies(query);
    renderMovies(movies, filter);
}

initHomePage('Inception');

function openMenu() 
{
    document.body.classList.add('menu--open');
}

function closeMenu() 
{
    document.body.classList.remove('menu--open');
}
