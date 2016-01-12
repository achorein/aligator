'use strict';

angular.module('aligatorApp')
    .directive('aligatorAlert', function(AlertService) {
        return {
            restrict: 'E',
            template: '<div class="alerts" ng-cloak="">' +
                            '<div ng-repeat="alert in alerts" ng-class="alert.position">' +
                                '<uib-alert ng-cloak="" type="{{alert.type}}" close="alert.close()">{{ alert.msg }}</uib-alert>' +
                            '</div>' +
                      '</div>',
            controller: ['$scope',
                function($scope) {
                    $scope.alerts = AlertService.get();
                    $scope.$on('$destroy', function () {
                        $scope.alerts = [];
                    });
                }
            ]
        }
    });
