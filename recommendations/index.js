const axios = require("axios");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const fetchRecommendations = async (recommendationsDataRaw, currentPage = 1) => {
    console.log({ recommendationsDataRaw });

    const actorsQueryParams = `&with_people=${recommendationsDataRaw.directors.join("|")}|${recommendationsDataRaw.actors.join("|")}`;
    const genresQueryParams = `&with_genres=${recommendationsDataRaw.genres.join("|")}`;

    const url =
        "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=en-US&page=1&sort_by=popularity.desc" +
        actorsQueryParams +
        genresQueryParams;

    try {
        const response = await axios.get(`${url}`, {
            params: {
                api_key: TMDB_API_KEY,
                language: "en-US", // English language results
                page: currentPage, // Current page of results
            },
        });

        const { data } = response;
        // fs.writeFileSync("./recommendations/response.json", JSON.stringify({ data: data.results }));
        return { data: data.results, error: false, status: 200, message: null };
    } catch (error) {
        console.log("recommendations/index.js fetchRecommendations catch block -- ", { error });
        return { data: null, error: true, status: 500, message: error };
    }
};

module.exports = fetchRecommendations;
