/**
 * Created by danielabrao on 9/26/16.
 */
(function () {
    "use strict";

    module.exports = function (app, iot_cloud, iot_local, io, GPIO, deviceTracker) {

        var led = new GPIO(4, "out"),
            ledStatus = 0;


        var sensor = require('node-dht-sensor');

        sensor.read(22, 4, function(err, temperature, humidity) {
            if (!err) {
                console.log('temp: ' + temperature.toFixed(1) + '°C, ' +
                    'humidity: ' + humidity.toFixed(1) + '%'
                );

                iot_cloud.publish("iot-2/evt/status/fmt/json", {
                    "temp": temperature,
                    "hum": humidity
                }, 2);
            }
        });


        iot_cloud.subscribe("iot-2/cmd/status/fmt/json");

        iot_cloud.on("message", function (topic, msg) {
            console.log("message received");
            console.log(topic);
            console.log(msg);

            if (topic === "iot-2/cmd/status/fmt/json") {
                deviceTracker.getLocation().then(function (data) {
                    iot_cloud.publish("iot-2/evt/status/fmt/json", JSON.stringify(data), 2);
                    console.log(data);
                }, function (error) {
                    console.log(error);
                });
            }

        });


        iot_local.on("message", function (topic, payload) {
            console.log([topic, payload].join(": "));
        });

    };

}());
