const express = require("express");
const cors = require("cors");

const { fetchInitialData, fetchActorsAndDirectorsOnly } = require("./preproccess/index");
const fetchRecommendations = require("./recommendations");

const app = express();

const isDev = process.env.NODE_ENV ? false : true;
const port = process.env.PORT || 2010;

app.use(cors());
app.use(express.json());

app.get("/health-check", (req, res) => {
    res.json({ message: `hi from the ${isDev ? "dev" : "prod"} server at time ${new Date().getTime()}` });
});

app.post("/api/recommendations/", async (req, res) => {
    console.log("hitting recommendations ", req.body);
    const everything = await fetchRecommendations(req.body.recommendations);
    res.send(everything);
    return;
});

app.get("/api/fetch-initial-data/", async (req, res) => {
    console.log("hitting route");
    const { data, error, message } = fetchInitialData();

    if (error) {
        res.send({ error: true, status: 500, messsage: message });
        return;
    }

    res.send({ error: null, data: data, message: null });
    return;
});

app.get("/api/actors-director-questions/", async (req, res) => {
    const { data, error, message } = await fetchActorsAndDirectorsOnly();

    if (error) {
        res.json({ error: true, status: 500, messsage: message });
        return;
    }
    res.json({ error: null, data: data, message: null });
    return;
});

app.listen(port, () => {
    console.log(`listening on ${port}`);
});
