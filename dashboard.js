/*jslint browser: true, devel: true, vars: true */
/*global autobahn: false, angular: false */

(function () {
    'use strict';
    angular.module('autobahn', []).service('AutobahnConnection', function ($q, $rootScope) {
        var AutobahnConnection = function (options) {
            var deferredSession = $q.defer();
            this.session = deferredSession.promise;
            
            var connection = new autobahn.Connection(options);
            connection.onopen = function (session) {
                deferredSession.resolve(session);
            };
            connection.open();
        };
        AutobahnConnection.prototype.subscribe = function (topic, subscriber) {
            this.session.then(function (session) {
                session.subscribe(topic, function (subscriber_arguments) {
                    $rootScope.$apply(function () {
                        subscriber.apply(subscriber, subscriber_arguments);
                    });
                });
            });
        };
        
        return AutobahnConnection;
    });
    

    var dashboard = angular.module('dashboard', ['autobahn']);
    
    dashboard.factory('dashboardEvents', function (AutobahnConnection) {
        return new AutobahnConnection({
            url: 'ws://127.0.0.1:8080/ws',
            realm: 'realm1'
        });
    });
    
    dashboard.controller('ComponentCtrl', function ($scope, dashboardEvents) {
        $scope.counter = -1;
        dashboardEvents.subscribe('com.dashboard', function (data) {
            $scope.counter = data.counter;
        });
    });
}());
