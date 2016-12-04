/**
 * Created by danielabrao on 6/18/16.
 */
/*jslint node:true*/
(function () {
    "use strict";
    var Cloudant = require("cloudant"),
        credentials = {
            username: "340a2e3b-6531-460f-99cb-440113db485b-bluemix",
            password: "01eff2210d71d34e78872ff7f881ac98cdc7c9ac00882bb30f9cd5be34ea1bc7"
        };

    module.exports = {
        init: new Cloudant(
            {
                account: credentials.username,
                password: credentials.password
            },
            function (err) {
                if (err) {
                    console.log("error connecting to DB " + err);
                } else {
                    console.log("connection success");
                }
            }
        ),
        exportedCredentials: new Buffer([credentials.username, credentials.password].join(":")).toString("base64")
    };
}());