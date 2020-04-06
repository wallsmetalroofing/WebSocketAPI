const assert = require("assert");
const data = require("./data");
const fetch = require("node-fetch");
const WebSocket = require("ws");
const open = require("open");

// Test the server framework
describe("server", () => {

    let server = null;

    before((done) => {
        // start up the server so it's ready for requests
        server = require("./server");
        server.start(done);
    });

    // shutdown the websocket server after tests are completed
    after(() => {

        // start testing the browser
        open("http://localhost:3030/")
            .then(_ => {
                console.log("Opened page");

            });

    });

    // ---------------------------------------------------------------------------------------------------------
    // GET REQUESTS
    // ---------------------------------------------------------------------------------------------------------

    // test the server get request
    describe("get", () => {

        // test the server websocket response
        describe("websocket", () => {
            let ws = null;
            let called = false;

            beforeEach((done) => {
                called = false;
                ws = new WebSocket("ws://localhost:8090/api");

                ws.on("message", (data) => {
                    if (!called) {
                        done();
                    }
                    called = true;
                });
            });

            afterEach(() => {
                // console.log(ws);
                ws.close();
            });

            it("should respond with matching records", function(done) {
                ws.send('{"id":1,"name":"todo/mine","method":"GET"}');

                ws.on("message", (response) => {
                    const msg = JSON.parse(response);

                    if (msg.id === 1) {
                        assert.deepEqual(data.todo[0], msg.body);
                        done();
                    }
                });
            });

            it("should respond with status 404", function(done) {
                ws.send('{"id":2,"name":"something404","method":"GET"}');

                ws.on("message", (response) => {
                    const msg = JSON.parse(response);

                    if (msg.id === 2) {
                        assert.equal(404, msg.status);
                        done();
                    }
                });

            });

            it("should respond with an error", function(done) {

                ws.send('{"id":3,"name":"error","method":"GET"}');

                ws.on("message", (response) => {
                    const msg = JSON.parse(response);

                    if (msg.id === 3) {
                        const errMessage = Object.assign({}, data.errorMessage);
                        errMessage.id = 3;

                        assert.deepEqual(msg, errMessage);
                        done();
                    }
                });
            });
        });

        // test the server http response to the same api
        describe("http", () => {

            it("should respond with matching records", async function() {
                const response = await fetch("http://localhost:3030/api/1/todo%2fmine", { method: "GET" });
                const responseData = await response.json();

                assert.deepEqual(data.todo[0], responseData.body);

            });

            it("should respond with status 404", async function() {
                const response = await fetch("http://localhost:3030/api/1/something404", { method: "GET" });
                const responseData = await response.json();

                assert.equal(404, responseData.status);

            });

            it("should respond with an error", async function() {
                const response = await fetch("http://localhost:3030/api/1/error", { method: "GET" });
                const responseData = await response.json();

                assert.deepEqual(data.errorMessage, responseData);

            });
        });
    });

    // ---------------------------------------------------------------------------------------------------------
    // POST REQUESTS
    // ---------------------------------------------------------------------------------------------------------

    describe("post", () => {

        // test the server websocket response
        describe("websocket", () => {
            let ws = null;
            let called = false;

            beforeEach((done) => {
                called = false;
                ws = new WebSocket("ws://localhost:8090/api");

                ws.on("message", (data) => {
                    if (!called) {
                        done();
                    }
                    called = true;
                });
            });

            afterEach(() => {
                // console.log(ws);
                ws.close();
            });

            it("should respond with matching records", function(done) {
                ws.send(JSON.stringify({
                    id: 1,
                    method: "POST",
                    name: "echo",
                    body: data.todo[2],
                }));

                ws.on("message", (response) => {
                    const msg = JSON.parse(response);

                    if (msg.id === 1) {
                        assert.deepEqual(data.todo[2], msg.body);
                        done();
                    }
                });
            });

            it("should respond with status 404", function(done) {
                ws.send('{"id":2,"name":"something404","method":"POST"}');

                ws.on("message", (response) => {
                    const msg = JSON.parse(response);

                    if (msg.id === 2) {
                        assert.equal(404, msg.status);
                        done();
                    }
                });

            });

            it("should respond with an error", function(done) {

                ws.send('{"id":3,"name":"error","method":"POST"}');

                ws.on("message", (response) => {
                    const msg = JSON.parse(response);

                    if (msg.id === 3) {
                        const errMessage = Object.assign({}, data.errorMessage);
                        errMessage.id = 3;

                        assert.deepEqual(msg, errMessage);
                        done();
                    }
                });
            });
        });

        // test the server http response to the same api
        describe("http", () => {

            it("should respond with matching records", async function() {
                const response = await fetch("http://localhost:3030/api/1/echo", {
                    method: "POST",
                    body: JSON.stringify(data.todo[2]),
                    headers: { "Content-Type": "application/json" }
                });
                const responseData = await response.json();

                assert.deepEqual(responseData.body, data.todo[2]);

            });

            it("should respond with status 404", async function() {
                const response = await fetch("http://localhost:3030/api/1/something404", { method: "POST" });
                const responseData = await response.json();

                assert.equal(404, responseData.status);

            });

            it("should respond with an error", async function() {
                const response = await fetch("http://localhost:3030/api/1/error", { method: "POST" });
                const responseData = await response.json();

                assert.deepEqual(data.errorMessage, responseData);

            });
        });
    });


    // ---------------------------------------------------------------------------------------------------------
    // PUT REQUESTS
    // ---------------------------------------------------------------------------------------------------------

    describe("put", () => {

        // test the server websocket response
        describe("websocket", () => {
            let ws = null;
            let called = false;

            beforeEach((done) => {
                called = false;
                ws = new WebSocket("ws://localhost:8090/api");

                ws.on("message", (data) => {
                    if (!called) {
                        done();
                    }
                    called = true;
                });
            });

            afterEach(() => {
                // console.log(ws);
                ws.close();
            });

            it("should respond with matching records", function(done) {
                ws.send(JSON.stringify({
                    id: 1,
                    method: "PUT",
                    name: "echo",
                    body: data.todo[2],
                }));

                ws.on("message", (response) => {
                    const msg = JSON.parse(response);

                    if (msg.id === 1) {
                        assert.deepEqual(data.todo[2], msg.body);
                        done();
                    }
                });
            });

            it("should respond with status 404", function(done) {
                ws.send('{"id":2,"name":"something404","method":"PUT"}');

                ws.on("message", (response) => {
                    const msg = JSON.parse(response);

                    if (msg.id === 2) {
                        assert.equal(404, msg.status);
                        done();
                    }
                });

            });

            it("should respond with an error", function(done) {

                ws.send('{"id":3,"name":"error","method":"PUT"}');

                ws.on("message", (response) => {
                    const msg = JSON.parse(response);

                    if (msg.id === 3) {
                        const errMessage = Object.assign({}, data.errorMessage);
                        errMessage.id = 3;

                        assert.deepEqual(msg, errMessage);
                        done();
                    }
                });
            });
        });

        // test the server http response to the same api
        describe("http", () => {

            it("should respond with matching records", async function() {
                const response = await fetch("http://localhost:3030/api/1/echo", {
                    method: "PUT",
                    body: JSON.stringify(data.todo[2]),
                    headers: { "Content-Type": "application/json" }
                });
                const responseData = await response.json();

                assert.deepEqual(responseData.body, data.todo[2]);

            });

            it("should respond with status 404", async function() {
                const response = await fetch("http://localhost:3030/api/1/something404", { method: "PUT" });
                const responseData = await response.json();

                assert.equal(404, responseData.status);

            });

            it("should respond with an error", async function() {
                const response = await fetch("http://localhost:3030/api/1/error", { method: "PUT" });
                const responseData = await response.json();

                assert.deepEqual(data.errorMessage, responseData);

            });
        });
    });

    // ---------------------------------------------------------------------------------------------------------
    // DELETE REQUESTS
    // ---------------------------------------------------------------------------------------------------------

    describe("delete", () => {

        // test the server websocket response
        describe("websocket", () => {
            let ws = null;
            let called = false;

            beforeEach((done) => {
                called = false;
                ws = new WebSocket("ws://localhost:8090/api");

                ws.on("message", (data) => {
                    if (!called) {
                        done();
                    }
                    called = true;
                });
            });

            afterEach(() => {
                // console.log(ws);
                ws.close();
            });

            it("should respond with matching records", function(done) {
                ws.send('{"id":1,"name":"todo/mine","method":"DELETE"}');

                ws.on("message", (response) => {
                    const msg = JSON.parse(response);

                    if (msg.id === 1) {
                        assert.deepEqual(msg, data.deleted);
                        done();
                    }
                });
            });

            it("should respond with status 404", function(done) {
                ws.send('{"id":2,"name":"something404","method":"DELETE"}');

                ws.on("message", (response) => {
                    const msg = JSON.parse(response);

                    if (msg.id === 2) {
                        assert.equal(404, msg.status);
                        done();
                    }
                });

            });

            it("should respond with an error", function(done) {

                ws.send('{"id":3,"name":"error","method":"DELETE"}');

                ws.on("message", (response) => {
                    const msg = JSON.parse(response);

                    if (msg.id === 3) {
                        const errMessage = Object.assign({}, data.errorMessage);
                        errMessage.id = 3;

                        assert.deepEqual(msg, errMessage);
                        done();
                    }
                });
            });
        });

        // test the server http response to the same api
        describe("http", () => {

            it("should respond with matching records", async function() {
                const response = await fetch("http://localhost:3030/api/1/todo%2fmine", { method: "DELETE" });
                const responseData = await response.json();
                // console.log(responseData);
                assert.deepEqual(responseData, data.deleted);

            });

            it("should respond with status 404", async function() {
                const response = await fetch("http://localhost:3030/api/1/something404", { method: "DELETE" });
                const responseData = await response.json();

                assert.equal(404, responseData.status);

            });

            it("should respond with an error", async function() {
                const response = await fetch("http://localhost:3030/api/1/error", { method: "DELETE" });
                const responseData = await response.json();

                assert.deepEqual(responseData, data.errorMessage);

            });
        });
    });

});