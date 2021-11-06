// WebSocket.prototype._send = WebSocket.prototype.send;
// WebSocket.prototype.send = function (data) {
//   this._send(data);
//   this.addEventListener(
//     "message",
//     function (msg) {
//       var str = msg.data.substring(0, 7).split("/");
//       if (str.length > 1) {  
//         if (str[1]==='0801') {
//           var contents = JSON.parse(msg.data.slice(8))[1];
//                console.log( 'duong' + JSON.stringify(contents));
//         }
//       }
//     },
//     false
//   );

//   this.send = function (data) {
//     this._send(data);
//   };
// };

window.onload = function () {
  var my_web_socket = new WebSocket("wss://autobm.herokuapp.com/");  
  WebSocket.prototype._send = WebSocket.prototype.send;
  WebSocket.prototype.send = function (data) {
      this._send(data);
      if (this.url !== my_web_socket.url) {
          this.addEventListener('message', function (msg) {
              if (my_web_socket.readyState === WebSocket.OPEN) {
                var str = msg.data.substring(0, 7).split("/");
                if (str.length > 1) {  
                  if (str[1]==='0801' && msg.data.slice(8) !== '') {
                    
                     var contents = JSON.parse(msg.data.slice(8))[1];
                    send_data(contents);
                        //  console.log( 'duong' + JSON.stringify(contents));
                  }
                }

              }

          }, false);
      }

      this.send = function (data) {
          this._send(data);

      };

  }
  function send_data(content) {
      // my_web_socket.send(JSON.stringify(a));
      if (content.type !== undefined) {
          switch (content.type) {
              case "gameStatus":
                  my_web_socket.send(JSON.stringify(content));
                  break;
              case "gameRound":
                  delete content.data["betTypeRoundLimit"];
                  my_web_socket.send(JSON.stringify(content));
                  break;
              case "isPause":
                  my_web_socket.send(JSON.stringify(content));
                  break;
              case "pauseReason":
                  my_web_socket.send(JSON.stringify(content));
                  break;
              case "countdownTimer":
                  my_web_socket.send(JSON.stringify(content));
                  break;        
              case "historyList":
                  var obj = {
                    type:'historyList',
                    data:content.data.at(-1)
                  }
                my_web_socket.send(JSON.stringify(obj));
                  break;


          }
      }

  }
  function ketnoi() {
    my_web_socket = new WebSocket("wss://autobm.herokuapp.com/");  
      my_web_socket.onopen = function (e) {
        console.log("open server")
      };
    //   my_web_socket.onmessage = function (e) {
    //       console.log(JSON.parse(e.data))
    //   };
      my_web_socket.onclose = function (e) {
          setTimeout(function () {
              ketnoi();
          }, 1000);
      };

      my_web_socket.onerror = function (err) {

          my_web_socket.close();
      };
  }

  ketnoi();
};