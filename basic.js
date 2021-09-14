const express = require("express");
const app = express();
const port = 80;

app.get("/", function (req, res) {
    res.send("Hello World!");
});

app.listen(process.env.PORT || port, () => {
    console.log("Server is running...");
});
