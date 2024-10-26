/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {},
        backgroundImage: {
            "movie-store": "url('../public/blend-bg.jpg')",
        },
    },
    plugins: [],
};
