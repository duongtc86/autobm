let app = new Vue({
    el: "#app",
    vuetify: new Vuetify(),
    data: {
        drawer: null,
        video: 1,
        ws: [],
        games: [],
        history: null,
        i: 1,
        selectedItem: 1,
    },
    created: function () {
        var ketnoi = function () {
            ws = new WebSocket("wss:" + window.location.host);
            ws.onopen = function () {
                ws.send(
                    JSON.stringify({
                        type: "login",
                        data: "admin",
                    })
                );

            };

            ws.onmessage = function (e) {
                var res = JSON.parse(e.data);
                // console.log(res.type)

                if (res.type === 'table') {
                    var i = app.games.findIndex((x) => x.id === res.id);

                    if (i === -1) {
                        app.games.push(res);
                        app.games.sort(function (a, b) { return a.id - b.id });


                    } else {
                        app.selectedItem = i;

                        app.$set(app.games, i, res)
                        console.log(app.games[1].history);

                    }
                }
                if (res.type === 'countdownTimer') {
                    var i = app.games.findIndex((x) => x.id === res.table);
                    if (i !== -1) {
                        app.games[i].countdownTimer = res.data;
                    }

                }


            };
            ws.onclose = function (e) {
                setTimeout(function () {
                    ketnoi();
                }, 1000);
            };
        }
        ketnoi();
    },
    methods: {
        send_data: function (a) {
            ws.send(a);
        },
        load_videos: function () {
            this.i++;

            if (this.i > 7) {
                this.i = 1;
            }

            load_video(this.i);
        },
        check_idea: function () {

        },
        auto_play: function (a) {
            var item = {
                type: "auto",
                table: a
            };
            ws.send(JSON.stringify(item));


        }

    },
});

var flvPlayer;
function load_video(i) {
    if (flvjs.isSupported()) {
        var videoElement = document.getElementById("video");
        if (flvPlayer !== undefined) {
            flvPlayer.destroy();
        }

        flvPlayer = flvjs.createPlayer({
            type: "flv",
            isLive: true,
            hasAudio: false,
            url:
                "https://ld3-strm-edge-188.prdaldb18a1.com/live/010" +
                i +
                "_dealerPC2.flv",
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();
    }
}

document.addEventListener("DOMContentLoaded", function (event) {
     load_video(1);
});
