const express = require("express");
const app = express();
const opentype = require("opentype.js");
const { createCanvas, loadImage } = require('canvas');

const port = 80;
const fontURL = "fonts/400.ttf";

const width = 1200
const height = 630

const canvas = createCanvas(width, height)
const context = canvas.getContext('2d')

context.fillStyle = '#000'
context.fillRect(0, 0, width, height)

context.font = 'bold 70pt Menlo'
context.textAlign = 'center'
context.textBaseline = 'top'
context.fillStyle = '#3574d4'

const text = 'Hello, World!'
const textWidth = context.measureText(text).width
context.fillRect(600 - textWidth / 2 - 10, 170 - 5, textWidth + 20, 120)
context.fillStyle = '#fff'
context.fillText(text, 600, 170)

context.fillStyle = '#fff'
context.font = 'bold 30pt Menlo'
context.fillText('wentin.net', 600, 530)

app.get("/svg", function (req, res) {
    opentype.load(fontURL, function (err, font) {
        res.set('Content-Type', 'image/svg+xml');
        const path = font.getPath("Hello, World!", 0, 150, 72);
        res.end('<svg xmlns="http://www.w3.org/2000/svg">' + path.toSVG() + '</svg>');
    });
});
app.get("/", function (req, res) {
    loadImage('images/profile.png').then(image => {
        context.drawImage(image, 340, 515, 70, 70);
        const buffer = canvas.toBuffer('image/png')
        res.set('Content-Type', 'image/png');
        res.end(buffer, 'binary');
    })
});

app.listen(process.env.PORT || port, () => {
    console.log("Server is running...");
});
