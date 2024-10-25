const axios = require("axios");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function fetchTopGenres() {
    try {
        // Fetch genres from TMDb API
        const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list`, {
            params: {
                api_key: TMDB_API_KEY,
                language: "en-US", // Language setting, you can modify if necessary
            },
        });

        const genres = response.data.genres.map((genre, index) => ({
            id: index + 1, // Incremental ID for each genre
            value: (index + 1) * 100, // Simulated value (you can modify how it's calculated)
            name: genre.name, // Name of the genre
            type: "genre", // Type is 'genre' in this case
            tmdbId: genre.id, // TMDb Genre ID (you can map this to your own system if needed)
            relevance: 500, // Default relevance
            selected: false, // Default selected status
        }));

        console.log({ genres });
        fs.writeFileSync("./_datasets/genres.json", JSON.stringify({ data: genres, count: genres.length }));

        return { genres };
    } catch (error) {
        console.error("Error fetching genres:", error);
    }
}

module.exports = fetchTopGenres;
