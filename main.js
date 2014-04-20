var gallery = angular.module('nickmusaelian_gallery', ['ngRoute','ui.bootstrap']);

gallery.config(function($routeProvider){
    $routeProvider.
        when('/paintings', {templateUrl: 'partials/image-gallery.html', controller: 'GalleryCtrl'}).
        when('/woodcuts', {templateUrl: 'partials/image-gallery.html', controller: 'GalleryCtrl'}).
        otherwise({redirectTo:'/paintings'});
});

gallery.directive('imgLoad', function() { // 'imgLoad'
    return {
        restrict: 'A',
        scope: {
            loadHandler: '&imgLoad' // 'imgLoad'
        },
        link: function (scope, element, attr) {
            element.on('load', scope.loadHandler);
        }
    };
});

var controllers = {};

controllers.ButtonsController = function($scope, $window) {
    $scope.isAboutShown = false;
}

controllers.GalleryCtrl = function($scope, $window, $http, $location) {
    $scope.page = {category: $location.path().slice(1)};
    $scope.isInfoHidden = true;
    $http.get("/img/" + $scope.page.category + "/info.json").then(function(result) {
        var imagejson = result.data; //Information about images (titles, id's, mediums)
        $scope.images = result.data.map(function(imagedat, index) {
            console.log(imagedat.id);
            return {
                active: (index == 0 ? true : false),
                image: "/img/" + $scope.page.category + "/" + imagedat.id + ".jpg"
            };
        }); //The array of objects for the carousel element
        $scope.images = $scope.images.map(function (image, index) {
            for (var attrname in imagejson[index]) { image[attrname] = imagejson[index][attrname]; }
            return image;
        });
        console.log($scope.images);
        $scope.totalImagesLoaded = 0;
        $scope.loadScreenClass = "";
        $scope.imageLoaded = function() {
            $scope.totalImagesLoaded++;
            if ($scope.totalImagesLoaded == $scope.images.length) {
                $scope.$apply(function() {$scope.loadScreenClass = "hide"});
                console.log("All images loaded.");
            }
        }
    },
    function(error) {
        alert("Error: "+JSON.stringify(error));
    });
};

gallery.controller(controllers);