/**
 * Created by danielabrao on 9/26/16.
 */
(function () {
    "use strict";

    module.exports = function (localEnv, device_info) {
        return {
            defaults: function buildObject () {
                return {
                    "org": localEnv.IOTF_ORG,
                    "id": [localEnv.IOTF_KEY, device_info.Hardware, device_info.Serial].join(""),
                    "username": localEnv.IOTF_AUTH,
                    "password": [device_info.Hardware, device_info.Serial, "HOW"].join("")
                };
            }
        };
    };
}());