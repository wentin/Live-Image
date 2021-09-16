const express = require("express");
const axios = require("axios");
const fs = require("fs");
const opentype = require("opentype.js");
const { registerFont, createCanvas, loadImage } = require("canvas");
const stream = require("stream");
const { promisify } = require("util");

const app = express();
const port = 80;
const fontURL = "fonts/700.ttf";
const googleFontURL =
    "http://fonts.gstatic.com/s/satisfy/v11/rP2Hp2yn6lkG50LoOZSCHBeHFl0.ttf";

app.get("/svg", function (req, res) {
    opentype.load(fontURL, function (err, font) {
        res.set("Content-Type", "image/svg+xml");
        const path = font.getPath("Hello, World!", 0, 150, 72);
        res.end(
            '<svg xmlns="http://www.w3.org/2000/svg">' + path.toSVG() + "</svg>"
        );
    });
});

app.get("/url", function (req, res) {
    axios({
        method: "get",
        url: "https://api.figma.com/v1/images/F2Lrfylcv74vnm1sl8F6Gc?ids=0:1&format=svg",
        headers: {
            "X-FIGMA-TOKEN": "237290-2eebc456-0e43-4232-8634-bf38fb844b80",
        },
    }).then(function (response) {
        let figmaURL = Object.values(response.data.images)[0];
        res.send(figmaURL);
    });
});

app.get("/fonts.png", function (req, res) {
    registerFont(fontURL, { family: "Poppins" });

    const width = 1500;
    const height = 500;
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    context.font = "56px Poppins";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText("Hello World", 50, 80);

    const type = "image/png";
    const buffer = canvas.toBuffer(type);
    res.set("Content-Type", type);
    res.end(buffer, "binary");
});

const finished = promisify(stream.finished);
app.get("/google.png", function (req, res) {
    const writer = fs.createWriteStream("temp/temp.ttf");
    axios({
        method: "get",
        url: googleFontURL,
        responseType: "stream",
    })
        .then(async (response) => {
            response.data.pipe(writer);
            return finished(writer);
        })
        .then(function () {
            registerFont("temp/temp.ttf", { family: "Poppins" });

            const width = 1500;
            const height = 500;
            const canvas = createCanvas(width, height);
            const context = canvas.getContext("2d");

            context.font = "56px Poppins";
            context.textAlign = "left";
            context.textBaseline = "top";
            context.fillText("Hello World", 50, 80);

            const type = "image/png";
            const buffer = canvas.toBuffer(type);
            res.set("Content-Type", type);
            res.end(buffer, "binary");
        });
});

app.get("/demo.png", function (req, res) {
    const width = 1500;
    const height = 500;

    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    axios({
        method: "get",
        url: "https://api.figma.com/v1/images/F2Lrfylcv74vnm1sl8F6Gc?ids=17:136&format=svg",
        headers: {
            "X-FIGMA-TOKEN": "237290-2eebc456-0e43-4232-8634-bf38fb844b80",
        },
    }).then(function (response) {
        let figmaURL = Object.values(response.data.images)[0];
        loadImage(figmaURL).then((image) => {
            context.drawImage(image, 0, 0, 1500, 500);

            context.font = "56px Poppins";
            context.textAlign = "left";
            context.textBaseline = "top";

            opentype.load(fontURL, function (err, font) {
                axios({
                    url: "https://api.hashnode.com/",
                    method: "post",
                    headers: {
                        Authorization: "<a3dba591-d040-487b-9046-e1a038f3e248>",
                    },
                    data: {
                        query: `
                        {
                            user(username: "wentin") {
                                publication {
                                    posts(page: 0) {
                                        title
                                    }
                                }
                            }
                        }`,
                    },
                }).then((result) => {
                    const text =
                        result.data.data.user.publication.posts[0].title;
                    const path = font.getPath(text, 580, 233, 48);
                    path.fill = "#4F5720";
                    path.draw(context);

                    const type = "image/png";
                    const buffer = canvas.toBuffer(type);
                    res.set("Content-Type", type);
                    res.end(buffer, "binary");
                });
            });
        });
    });
});

app.listen(process.env.PORT || port, () => {
    console.log("Server is running...");
});
