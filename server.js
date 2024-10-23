const express = require("express");
const cors = require("cors");

const app = express();
const isDev = process.env.NODE_ENV ? false : true;
const port = process.env.PORT || 2010;

app.use(cors());

app.get("/test", (req, res) => {
    res.json({ message: `hi from the ${isDev ? "dev" : "prod"} server at time ${new Date().getTime()}` });
});

app.listen(port, () => {
    console.log(`listening on ${port}`);
});
