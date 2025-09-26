const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Hello World X MotherFucker!");
});

app.get("/bye", (req, res) => {
    res.send("bye-bye World X  Rott in a hell!");
});

app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
});

module.exports = app;
