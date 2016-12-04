/**
 * Created by danielabrao on 9/26/16.
 */
(function () {
    "use strict";

    module.exports = function (app, iot_cloud, iot_local, io, GPIO, deviceTracker, tempSensor, Cloudant, device_info) {

        console.log(device_info);

        var trucksDB = Cloudant.db.use("trucks"),
            tripsDB = Cloudant.db.use("trips");

        function checkVehicleCondition () {
            tempSensor.read(22, 4, function(err, temperature, humidity) {
                if (!err) {
                    console.log('temp: ' + temperature.toFixed(1) + '°C, ' +
                        'humidity: ' + humidity.toFixed(1) + '%'
                    );

                    if (temperature.toFixed(1) > 30) {
                        deviceTracker.getLocation().then(function (data) {
                            iot_cloud.publish("iot-2/evt/status/fmt/json", JSON.stringify({
                                "location": data,
                                "temp": temperature,
                                "hum": humidity
                            }), 2);


                            trucksDB.find({
                                "selector": {
                                    "device": [device_info.Hardware, device_info.Serial].join("")
                                }
                            }, function (err, data) {

                                if (data.docs.length) {

                                    tripsDB.find({
                                        "selector": {
                                            "truck": data.docs[0].placa
                                        }
                                    }, function (err, data) {
                                        if (data.docs[0].status === "active") {
                                            if (data.docs[0].hasOwnProperty("vehicleWarning")) {
                                                data.docs[0].vehicleTrail.push({
                                                    "location": data,
                                                    "temp": temperature,
                                                    "hum": humidity,
                                                    "problem": "OVERHEAT"
                                                });
                                            } else {
                                                data.docs[0].vehicleTrail = [{
                                                    "location": data,
                                                    "temp": temperature,
                                                    "hum": humidity,
                                                    "problem": "OVERHEAT"
                                                }];
                                            }
                                        }

                                        tripsDB.insert(data.docs, function () {
                                            console.log("INSERTED");
                                        });
                                    });
                                }

                            });

                            console.log(data);
                        }, function (error) {
                            console.log(error);
                        });
                    } else {
                        trucksDB.find({
                            "selector": {
                                "device": [device_info.Hardware, device_info.Serial].join("")
                            }
                        }, function (err, data) {

                            if (data.docs.length) {

                                tripsDB.find({
                                    "selector": {
                                        "truck": data.docs[0].placa
                                    }
                                }, function (err, data) {
                                    if (data.docs[0].status === "active") {
                                        if (data.docs[0].hasOwnProperty("vehicleTrail")) {
                                            data.docs[0].vehicleTrail.push({
                                                "location": data,
                                                "temp": temperature,
                                                "hum": humidity
                                            });
                                        } else {
                                            data.docs[0].vehicleTrail = [{
                                                "location": data,
                                                "temp": temperature,
                                                "hum": humidity
                                            }];
                                        }
                                    }

                                    console.log(data.docs);
                                    tripsDB.insert(data.docs[0], function () {
                                        console.log("INSERTED");
                                    });
                                });

                            }

                        });
                    }
                }
            });


        }

        setInterval(function () {
            checkVehicleCondition();
        }, 60000);


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
