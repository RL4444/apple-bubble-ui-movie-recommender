const axios = require("axios");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function fetchTopRatedMovies() {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/top_rated`, {
            params: {
                api_key: TMDB_API_KEY,
                language: "en-US",
                page: 1, // You can paginate through more pages if needed
            },
        });

        const topMovies = response.data.results.map((movie, index) => ({
            id: index + 1,
            rating: movie.vote_average.toString(), // Using the vote average as "value"
            name: movie.title,
            type: "movie",
            genre: movie.genre,
            omdbId: movie.id, // TMDb ID, could be mapped to OMDb/IMDb ID if necessary
            relevance: 500,
            selected: false,
        }));

        console.log({ topMovies });
        fs.writeFileSync("./_datasets/topMovies.json", JSON.stringify({ data: topMovies, count: topMovies.length }));
    } catch (error) {
        console.error("Error fetching top-rated movies:", error);
    }
}

module.exports = fetchTopRatedMovies;
