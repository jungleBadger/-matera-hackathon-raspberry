/**
 * Created by danielabrao on 12/3/16.
 */
(function () {
    "use strict";


    module.exports = function (request) {

        return {
            "getLocation": function () {
                return new Promise(function (resolve, reject) {
                    request.get("http://freegeoip.net/json", function (err, body, response) {
                        console.log(err);
                        console.log(body);
                        resolve(body);
                    });
                });
            }
        };


    };


}());