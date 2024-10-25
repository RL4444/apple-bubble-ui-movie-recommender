const axios = require("axios");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();

// Fetch popular actors
const DIRECTOR_MINIMUM_ENTITIES = 10; // Minimum number of actors and directors required
const ACTOR_MINIMUM_ENTRIES = 25; // Minimum number of actors and directors required

const TMDB_API_KEY = process.env.TMDB_API_KEY;

let actors = [];
let directors = [];

// Fetch popular actors and directors recursively until both arrays have at least 25 entities
async function fetchPopularPeople(page = 1) {
    console.log("start transaction");

    try {
        // Fetch popular people from TMDb
        const response = await axios.get(`https://api.themoviedb.org/3/person/popular`, {
            params: {
                api_key: TMDB_API_KEY,
                language: "en-US", // English language results
                page: page, // Current page of results
            },
        });

        const people = response.data.results;

        const actorPromises = [];
        const directorPromises = [];

        // Separate actors and directors based on 'known_for_department'
        people.forEach((person, index) => {
            if (person.known_for_department === "Directing" && directors.length < DIRECTOR_MINIMUM_ENTITIES) {
                directorPromises.push(processPerson(person, directors.length + 1, "director"));
            } else if (person.known_for_department === "Acting" && actors.length < ACTOR_MINIMUM_ENTRIES) {
                actorPromises.push(processPerson(person, actors.length + 1, "actor"));
            }
        });

        // Wait for all promises to resolve and add results to respective arrays
        const newActors = await Promise.all(actorPromises);
        const newDirectors = await Promise.all(directorPromises);

        actors = actors.concat(newActors);
        directors = directors.concat(newDirectors);

        // Log the current number of actors and directors
        console.log(`Actors: ${actors.length}, Directors: ${directors.length}`);

        // Continue fetching if we don't have enough actors or directors
        if (actors.length < ACTOR_MINIMUM_ENTRIES || directors.length < DIRECTOR_MINIMUM_ENTITIES) {
            await fetchPopularPeople(page + 1); // Recursive call to fetch the next page
        } else {
            const actorsWithFixedIds = () =>
                JSON.parse(actors).data.map((eachOne, ix) => {
                    return {
                        ...eachOne,
                        id: `actor-${ix}`,
                        linkedMovieIds: eachOne.linkedMovieIds.map((eachOne) => `ombd-movie-${eachOne}`),
                        linkedGenreIds: eachOne.linkedGenreIds.map((eachOne) => `ombd-genre-${eachOne}`),
                    };
                });

            const directorsWithFixedIds = () =>
                JSON.parse(directors).data.map((eachOne) => {
                    return {
                        ...eachOne,
                        linkedMovieIds: eachOne.linkedMovieIds.map((eachOne) => `ombd-movie-${eachOne}`),
                        linkedGenreIds: eachOne.linkedGenreIds.map((eachOne) => `ombd-genre-${eachOne}`),
                    };
                });

            // When both arrays have at least 25 entities, log the results
            console.log("Final Actors:", actorsWithFixedIds());
            fs.writeFileSync("./_datasets/actors.json", JSON.stringify({ data: actorsWithFixedIds(), count: actorsWithFixedIds().length }));
            console.log("Final Directors:", directorsWithFixedIds());
            fs.writeFileSync(
                "./_datasets/directors.json",
                JSON.stringify({ data: directorsWithFixedIds(), count: directorsWithFixedIds().length })
            );

            return { actors, directors };
        }
    } catch (error) {
        console.error("Error fetching popular people:", error);
    }
}

// Process a person (either actor or director) and fetch associated movies
async function processPerson(person, index, type) {
    const movieData = await fetchPersonMovies(person.id);

    // Extract the movie IDs and genre IDs
    const linkedMovieIds = movieData.map((movie) => movie.id);
    const linkedGenreIds = Array.from(new Set(movieData.flatMap((movie) => movie.genre_ids))); // Unique genre IDs

    return {
        id: `${type}-${index}`, // Incremental ID for each person
        value: index * 100, // Simulated value
        name: person.name, // Name of the actor or director
        type: type, // Either 'actor' or 'director'
        linkedMovieIds: linkedMovieIds, // Movies associated with the person
        linkedGenreIds: linkedGenreIds, // Unique genres associated with the person
        tmdbId: person.id, // TMDb ID (can be mapped to OMDb/IMDb ID if needed)
        relevance: 500, // Default relevance
        selected: false, // Default selected status
    };
}

// Fetch movies for a given person (either actor or director) by their ID
async function fetchPersonMovies(personId) {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/person/${personId}/movie_credits`, {
            params: {
                api_key: TMDB_API_KEY,
                language: "en-US", // English language results
            },
        });

        // Return movie data for the person
        return response.data.cast; // The person's movie roles are in the "cast" array
    } catch (error) {
        console.error(`Error fetching movies for person ID ${personId}:`, error);
        return [];
    }
}

module.exports = fetchPopularPeople;
