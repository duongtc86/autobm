const http = require("http");
const express = require("express");

const websock = require("ws");

const fs = require("fs");
const app = express();


const server = http.createServer(app);
const wss = new websock.Server({ server });


app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", function (req, res) {
    res.render("index");
    res.end();
});


function ghilog(t) {
    fs.appendFile("data.txt", t, function (err) {
        if (err) throw err;
        console.log("Saved!");
    });
}


wss.on("connection", function (ws) {
    ws.on("message", function (dt) {
        var res = JSON.parse(dt);
        broadcast(ws,res);
        //console.log(res);
   

    });
});

function broadcast(ws, item) {
    wss.clients.forEach((client) => {
        if (client != ws) {
            client.send(JSON.stringify(item));
        }
    });
}
function sends(ws, message) {
    wss.clients.forEach((client) => {
        if (client === ws) {
            client.send(JSON.stringify(message));
        }
    });
}
function send_all(message) {
    wss.clients.forEach((client) => {
        client.send(JSON.stringify(message));
    });
}
const PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
    console.log("start server");
});