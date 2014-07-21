/* global angular */
angular.module('main')

.controller('HeaderCtrl', ['$location','$scope', function ($location, $scope) {
    $scope.is = function (viewLocation) {
        return viewLocation === $location.path();
    };
    $scope.isChild = function (viewLocation) {
        return $location.path().indexOf(viewLocation) !== -1;
    };

}]);
