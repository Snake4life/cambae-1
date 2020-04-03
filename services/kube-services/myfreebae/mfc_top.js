var status_inter = 1 * 20 * 1000;
  setInterval(function() {
    var page = require("webpage").create(),
        url = "https://www.myfreecams.com/html/room_tracker.html?mode=popular_rooms&vcc=1547579831";
        page.onResourceReceived = function (response) {
            console.log('Receive ' + JSON.stringify(response, undefined, 4));
        };
        page.open(url);
  }, status_inter);
