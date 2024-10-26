export const bubbleDummyData = [
    { id: 1, value: "300", name: "Horror", relevence: 500, selected: false },
    { id: 2, value: "2", name: "Comedy", relevence: 300, selected: false },
    { id: 3, value: "3", name: "Scary", relevence: 500, selected: false },
    { id: 4, value: "4", name: "Action", relevence: 300, selected: false },
    { id: 5, value: "5", name: "Thriller", relevence: 400, selected: false },
    { id: 6, value: "6", name: "Espionage", relevence: 500, selected: false },
    { id: 7, value: "7", name: "Romance", relevence: 300, selected: false },
    { id: 8, value: "8", name: "Rom-Com", relevence: 300, selected: false },
    { id: 9, value: "9", name: "Date Friendly", relevence: 300, selected: false },
    { id: 10, value: "10", name: "80's Action", relevence: 300, selected: false },
    { id: 11, value: "11", name: "Sci-Fi", relevence: 300, selected: false },
    { id: 12, value: "12", name: "Y2K Apocalyptic", relevence: 300, selected: false },
    { id: 13, value: "13", name: "Cartoon", relevence: 300, selected: false },
    { id: 14, value: "14", name: "Fantasy", relevence: 500, selected: false },
    { id: 15, value: "15", name: "Classic", relevence: 500, selected: false },
    { id: 16, value: "16", name: "Sports", relevence: 300, selected: false },
    { id: 17, value: "17", name: "Documentary", relevence: 500, selected: false },
    { id: 18, value: "18", name: "Football", relevence: 300, selected: false },
    { id: 19, value: "19", name: "Nature", relevence: 500, selected: false },
    { id: 20, value: "20", name: "War", relevence: 300, selected: false },
    { id: 21, value: "21", name: "Musical", relevence: 300, selected: false },
    { id: 22, value: "22", name: "Opera", relevence: 500, selected: false },
    { id: 23, value: "23", name: "Foreign Language", relevence: 500, selected: false },
    { id: 24, value: "24", name: "Teen", relevence: 300, selected: false },
]

export function toPrettyDate(rawDateStr: string) {
    const date = new Date(rawDateStr);
    return date.getFullYear(); // Should really use user-based locale here
}