/**
 * Created by danielabrao on 9/26/16.
 */
(function () {
    "use strict";

    var deviceInfoHandler = {
        worker: require('child_process').exec,
        device: {},
        deviceProperties: ["Hardware", "Serial"],
        bashCommand: "cat tst",
        getDevice: function () {
            return this.device;
        },
        processStdoutValue: function (stringValue, info) {
            var extractValue = new RegExp(/: \w+/g),
                clearValue = new RegExp(/\w+/g);
            try {
                this.device[info] = clearValue.exec(extractValue.exec(stringValue)[0])[0];
            } catch (e) {
                this.device[info] = "Generic microprocessor value";
            }
        },
        extractInfo: function () {
            var self = this,
                counter = 0;
            return new Promise(function (resolve, reject) {
                for (var i = 0; i < self.deviceProperties.length; i += 1) {
                    (function (iterator) {
                        self.worker([self.bashCommand, "|grep ", self.deviceProperties[iterator]].join(""), function (error, stdout, stderr) {
                            if (error) {
                                reject(error);
                            }

                            self.processStdoutValue(stdout, self.deviceProperties[iterator]);
                            counter += 1;
                            if (counter === self.deviceProperties.length) {
                                resolve(self.getDevice());
                            }
                        });
                    }(i));
                }
            });
        }
    };

    module.exports = deviceInfoHandler.extractInfo();

}());