const express = require("express");
const app = express();
const opentype = require("opentype.js");
const port = 80;
const fontURL = "fonts/400.ttf";

app.get("/", (req, res) => {
    opentype.load(fontURL, function (err, font) {
        res.set('Content-Type', 'image/svg+xml');
        const path = font.getPath("Hello, World!", 0, 150, 72);
        // console.log(path.toSVG());
        // res.send("Hello World!");
        res.end('<svg xmlns="http://www.w3.org/2000/svg">' + path.toSVG() + '</svg>');
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
