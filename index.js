async function getAPIData() 
{
    const response = await fetch('http://www.omdbapi.com/?' + new URLSearchParams({
        apikey: 'aa8d4a8a',
        s: 'Inception'
    }));

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
}

async function logAPIData()
{
    const data = await getAPIData();
    return data;
}

logAPIData();

function openMenu() {
    document.body.classList +=  ' menu--open';
}

function closeMenu() {
    document.body.classList.remove('menu--open');
}

/*

<div class="book">
    <figure class="book__card--wrapper">
        <img src="./assets/crack the coding interview.png" alt="" class="book__card">
    </figure>
    <div class="book__description">
        <a class="book__title">
            Crack the Coding Interview
        </a>
        <div class="book__ratings">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star-half-alt"></i>
        </div>
        <div class="book__price">
            <span class="book__price--normal">$59.95</span> $14.95
        </div>
    </div>
</div>

*/