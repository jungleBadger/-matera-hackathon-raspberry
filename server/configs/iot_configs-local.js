/**
 * Created by danielabrao on 9/23/16.
 */
(function () {
    "use strict";

    module.exports = function (localEnv) {
        return {
            defaults: function buildObject () {
                return {
                    "username": localEnv.IOT_KEY,
                    "password": localEnv.IOT_TOKEN
                };
            },
            credentials: {
                "username": localEnv.IOT_KEY,
                "password": localEnv.IOT_TOKEN
            },
            exportedCredentials: (function buildCredential() {
                return function () {
                    return new Buffer([this.credentials.apiKey, ":", this.credentials.apiToken].join("")).toString("base64");
                };
            }())
        }

    }
}());