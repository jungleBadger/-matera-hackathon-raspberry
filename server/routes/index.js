/*jslint node:true*/
(function () {
    'use strict';

    var registrationRoutes = require('./partials/registrationHandler');

    module.exports = function (app, request, mqtt, device_info) {
        registrationRoutes(app, request, device_info);



    };

}());
