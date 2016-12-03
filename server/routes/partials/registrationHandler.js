/**
 * Created by danielabrao on 9/26/16.
 */
/*jslint node:true*/
(function () {
    "use strict";

    module.exports = function (app, request, device_info) {
        request({
            "method": "POST",
            // "uri": "http://192.168.25.130:6026/createDevice",
            "uri": "https://home-over-web.mybluemix.net/createDevice",
            "form": {
                "serialNo": device_info.Serial,
                "deviceModel": device_info.Hardware,
                "location": "casa",
                "deviceId": [device_info.Hardware, device_info.Serial].join(""),
                "userId": "jungle"
            }
        }, function (error, response, body) {
            console.log(error);
            console.log(body);
        });
    };

}());