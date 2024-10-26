const BASE_URL = 'http://localhost:2010/api/'

export const fetchInitialData = async () => {
    const endpoint = 'fetch-initial-data/'
    const url = `${BASE_URL}${endpoint}`
    const res = await fetch(url);

    const result = await res.json();

    return result
}

export const postRecommendations = async (recommendations: any) => {
    const endpoint = 'recommendations/'
    const url = `${BASE_URL}${endpoint}`
    const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ recommendations }),
        headers: { 'Content-Type': 'application/json' },
    });

    const result = await res.json();
    return result
}