'use strict';

angular.module('aligatorApp')
    .provider('AlertService', function () {
        this.$get = ['$timeout', function($timeout) {

            var exports = {
                factory: factory,
                add: addAlert,
                closeAlert: closeAlert,
                closeAlertByIndex: closeAlertByIndex,
                clear: clear,
                get: get,
                success: success,
                error: error,
                info: info,
                warning: warning
            },
            
            alertId = 0, // unique id for each alert. Starts from 0.
            alerts = [],
            timeout = 10000; // default timeout

            function clear() {
                alerts = [];
            }

            function get() {
                return alerts;
            }

            function success(msg, params, position) {
                return this.add({
                    type: "success",
                    msg: msg,
                    params: params,
                    timeout: timeout,
                    position: position
                });
            }

            function error(msg, params, position) {
                return this.add({
                    type: "danger",
                    msg: msg,
                    params: params,
                    timeout: timeout,
                    position: position
                });
            }

            function warning(msg, params, position) {
                return this.add({
                    type: "warning",
                    msg: msg,
                    params: params,
                    timeout: timeout,
                    position: position
                });
            }

            function info(msg, params, position) {
                return this.add({
                    type: "info",
                    msg: msg,
                    params: params,
                    timeout: timeout,
                    position: position
                });
            }

            function factory(alertOptions) {
                var alert = {
                    type: alertOptions.type,
                    msg: alertOptions.msg,
                    id: alertOptions.alertId,
                    timeout: alertOptions.timeout,
                    position: alertOptions.position ? alertOptions.position : 'top right',
                    scoped: alertOptions.scoped,
                    close: function (alerts) {
                        return exports.closeAlert(this.id, alerts);
                    }
                }
                if(!alert.scoped) {
                    alerts.push(alert);
                }
                return alert;
            }

            function addAlert(alertOptions, extAlerts) {
                alertOptions.alertId = alertId++;
                var that = this;
                var alert = this.factory(alertOptions);
                if (alertOptions.timeout && alertOptions.timeout > 0) {
                    $timeout(function () {
                        that.closeAlert(alertOptions.alertId, extAlerts);
                    }, alertOptions.timeout);
                }
                return alert;
            }

            function closeAlert(id, extAlerts) {
                var thisAlerts = extAlerts ? extAlerts : alerts;
                return this.closeAlertByIndex(thisAlerts.map(function(e) { return e.id; }).indexOf(id), thisAlerts);
            }

            function closeAlertByIndex(index, thisAlerts) {
                return thisAlerts.splice(index, 1);
            }

            return exports;
        }];

    });
