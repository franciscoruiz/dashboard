/*jslint browser: true, devel: true, vars: true */
/*global autobahn: false, angular: false */

(function () {
    'use strict';
    angular.module('autobahn', []).factory('autobahn', function ($q, $rootScope) {
        var AutobahnConnection = function () {
            var deferredSession = $q.defer();
            this.session = deferredSession.promise;
            
            var connection = new autobahn.Connection({
                url: 'ws://127.0.0.1:8080/ws',
                realm: 'realm1'
            });
            connection.onopen = function (session) {
                $rootScope.$apply(function () {
                    deferredSession.resolve(session);
                });
            };
            connection.open();
        };
        AutobahnConnection.prototype.subscribe = function (eventName, subscriber) {
            this.session.then(function (session) {
                session.subscribe(eventName, subscriber);
            });
        };
        
        return new AutobahnConnection();
    });

    angular.module('dashboard', ['autobahn']).controller('ComponentCtrl', function ($scope, autobahn) {
        $scope.counter = -1;
        
        console.log('Subscribing to updates');
        autobahn.subscribe('com.dashboard', function (data) {
            console.log("Got event:", data);
            $scope.counter = data[0].counter;
        });
    });
}());
