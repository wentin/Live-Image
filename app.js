const express = require("express");
const app = express();
const port = 80;
const opentype = require("opentype.js");
const fontURL = "fonts/400.ttf";

app.get("/", function (req, res) {
    opentype.load(fontURL, function (err, font) {
        res.set('Content-Type', 'image/svg+xml');
        const path = font.getPath("Hello, World!", 0, 150, 72);
        res.end('<svg xmlns="http://www.w3.org/2000/svg">' + path.toSVG() + '</svg>');
    });
});

app.listen(process.env.PORT || port, () => {
    console.log("Server is running...");
});
