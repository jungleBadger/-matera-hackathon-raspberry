/**
 * Created by danielabrao on 9/26/16.
 */
(function () {
    "use strict";

    var deviceLocation = require("./deviceLocation");

    module.exports = function (app, iot_cloud, iot_local, io, GPIO, request) {

        var led = new GPIO(4, "out"),
            ledStatus = 0;

        iot_cloud.subscribe("iot-2/cmd/status/fmt/json");

        iot_cloud.on("message", function (topic, msg) {
            console.log("message received");
            console.log(topic);

            if (topic === "iot-2/cmd/status/fmt/json") {

                deviceLocation().then(function (data) {
                    console.log(data);
                })


            }

            console.log(msg);


            iot_cloud.publish("iot-2/evt/status/fmt/json", JSON.stringify({oi: "olá"}));

            if (ledStatus === 0) {
                ledStatus = 1;
            } else {
                ledStatus = 0;
            }
            led.writeSync(ledStatus);
        });


        iot_local.on("message", function (topic, payload) {
            console.log([topic, payload].join(": "));
        });

    };

}());
