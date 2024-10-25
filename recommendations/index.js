const axios = require("axios");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const fetchRecommendations = async (recommendationsDataRaw, currentPage = 1) => {
    console.log({ recommendationsDataRaw });

    const directorsQueryParams = `&with_crew=${recommendationsDataRaw.directors.join("|")}`;
    const actorsQueryParams = `&with_pepople=${recommendationsDataRaw.actors.join("|")}`;
    const genresQueryParams = `&with_genre${recommendationsDataRaw.genres.join("|")}`;

    const url =
        "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=en-US&page=1&sort_by=popularity.desc" +
        directorsQueryParams +
        actorsQueryParams +
        genresQueryParams;

    console.log({ url });
    try {
        const response = await axios.get(`${url}`, {
            params: {
                api_key: TMDB_API_KEY,
                language: "en-US", // English language results
                page: currentPage, // Current page of results
            },
        });

        console.log({ response });
        fs.writeFileSync("./response.json", JSON.stringify({ data: response }));
        return response;
    } catch (error) {
        console.log("recommendations/index.js fetchRecommendations catch block -- ", { error });
    }
};

module.exports = fetchRecommendations;
