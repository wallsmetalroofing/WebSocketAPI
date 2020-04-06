const express = require("express");
const bodyParser = require("body-parser");
const WebSocket = require("ws");
const path = require("path");

const data = require("./data");

// load the api to test
const api = require("./../../out/index");
let server = null;

// create the express server
const app = express();
const port = 3030;

app.use("/", express.static(path.join(__dirname, "./public/")));
app.use("/static", express.static(path.join(__dirname, "./../../static")));
app.use(bodyParser.json());

// create the websocket server
const wss = new WebSocket.Server({ port: 8090 });

// register the api
api.register(app, wss, "/api");

// setup the get request
api.on("todo/mine")
    .get((event) => {
        event.send(data.todo[0]);
    })
    .delete((event) => event.send({ deleted: true }));

// setup a echo for post request
api.on("echo")
    .post((event) => event.send(event.body))
    .put((event) => event.send(event.body));

api.on("error", (event) => event.send(new Error("test error")));

// just make the client timeout
api.on("timeout", () => {});

api.on("stop", (event) => {
    console.log("Closing server");
    event.send(true);

    setTimeout(() => {
        console.log("- - -");
        server.close();

        process.exit(0);
    }, 2000);
});

exports.start = (callback) => {
    server = app.listen(port, () => {
        callback();
    });
};

exports.stop = () => {
    if (server) {
        server.close();
    }
};