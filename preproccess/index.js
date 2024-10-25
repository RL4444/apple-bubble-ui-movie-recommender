const fs = require("fs");
const fetchActorsAndDirectors = require("./topActorsAndDirectors");

const fetchInitialData = () => {
    try {
        if (
            !fs.existsSync("./_datasets/genres.json") ||
            !fs.existsSync("./_datasets/actors.json") ||
            !fs.existsSync("./_datasets/directors.json")
        ) {
            throw new Error("One or more dataset files are missing.");
        }

        const genresData = fs.readFileSync("./_datasets/genres.json", "utf8");
        const actorsData = fs.readFileSync("./_datasets/actors.json", "utf8");
        const directorsData = fs.readFileSync("./_datasets/directors.json", "utf8");

        const actorsWithFixedIds = JSON.parse(actorsData).data.map((eachOne, idx) => {
            return {
                ...eachOne,
                id: `actor-${idx + 1}`,
                linkedMovieIds: eachOne.linkedMovieIds.map((eachOne) => `ombd-movie-${eachOne}`),
                linkedGenreIds: eachOne.linkedGenreIds.map((eachOne) => `ombd-genre-${eachOne}`),
            };
        });

        const directorsWithFixedIds = JSON.parse(directorsData).data.map((eachOne, idx) => {
            return {
                ...eachOne,
                id: `director-${idx + 1}`,
                linkedMovieIds: eachOne.linkedMovieIds.map((eachOne) => `ombd-movie-${eachOne}`),
                linkedGenreIds: eachOne.linkedGenreIds.map((eachOne) => `ombd-genre-${eachOne}`),
            };
        });
        const genresWithFixedIds = JSON.parse(genresData).data.map((eachOne, idx) => {
            return {
                ...eachOne,
                id: `genre-${idx + 1}`,
            };
        });

        function getRandomActors(inputArray, limit) {
            if (!Array.isArray(inputArray)) {
                throw new Error("Input must be an array.");
            }

            if (inputArray.length <= 19) {
                throw new Error("Array must contain more than 19 items.");
            }

            // Shuffle the array using the Fisher-Yates algorithm
            const shuffledArray = [...inputArray]; // Create a copy to avoid mutating the original array
            for (let i = shuffledArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
            }

            // Return the first 20 items from the shuffled array
            return shuffledArray.slice(0, limit);
        }

        // Example usage
        const randomActors = getRandomActors(actorsWithFixedIds, 25);

        return {
            data: { genres: genresWithFixedIds, actors: randomActors, directors: directorsWithFixedIds },
            error: false,
            message: null,
            status: 200,
        };
    } catch (error) {
        console.log({ error });
        return { data: null, error: true, message: error, status: 500 };
    }
};

const fetchActorsAndDirectorsOnly = async () => {
    const { actors, directors } = await fetchActorsAndDirectors();
    return { actors, directors };
};

module.exports = { fetchInitialData, fetchActorsAndDirectorsOnly };
