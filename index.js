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