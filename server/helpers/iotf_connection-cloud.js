/**
 * Created by danielabrao on 9/26/16.
 */
(function() {
    'use strict';

    module.exports = function (mqtt, iotf_configs) {
        return {
            createConnection: function () {
                return new Promise(function (resolve, reject) {
                    var mqttApp = mqtt.connect(["mqtt://", iotf_configs.org].join(""), {
                        clientId: iotf_configs.id,
                        username: iotf_configs.username,
                        password: iotf_configs.password,
                        clean: false,
                        keepAlive: 6000000
                    });


                    mqttApp.on('connect', function () {
                        console.log("connected cloud");
                        resolve(mqttApp);
                    });

                    mqttApp.on('error', function (error) {
                        console.log(error);
                        reject(error);
                    });
                });
            },
            checkConnection: function (mqttInstance) {

                return new Promise(function (resolve, reject) {
                    if (!mqttInstance) {
                        reject('Create new MQTT');
                        return;
                    }

                    if (mqttInstance.connected) {
                        resolve(true);
                    } else {
                        reject(false);
                    }
                });
            },
            closeConnection: function (mqttInstance) {
                return new Promise(function (resolve, reject) {
                    mqttInstance.end(false, function cb() {
                        resolve('Client disconnected');
                    });
                });
            }
        }

    };

}());
