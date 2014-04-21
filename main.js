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

gallery.value("currents", {'paintings' : '01', 'woodcuts' : '01'});

var controllers = {};

controllers.ButtonsController = function($scope, $window) {
    $scope.isAboutShown = false;
    $scope.isChooserShown = false;
}

controllers.ThumbnailChooserController = function($scope, $window, $http, $location, $rootScope, currents) {
    $scope.isLoaded = false;
    $scope.imagesLoaded = 0;
    $scope.imageLoaded = function() {
        $scope.imagesLoaded++;
        if ($scope.imagesLoaded == $scope.totalImages) {
            $scope.isLoaded = true;
        }
    }
    $scope.goToImage = function(newid) {
        newid = newid.split('.');
        curr_category = $location.path().slice(1);
        currents[newid[0]] = newid[1];
        if (curr_category != newid[0]) {
            $location.path("/" + newid[0]);
        }
        $rootScope.$broadcast("ChangeIndex", newid[0]);
    }
    $http.get("/img/images.json").then(function(result) {
        $scope.totalImages = result.data.totalImages;
        $scope.categories = result.data.data;
    },
    function(error) {
        alert(error);
    });
}

controllers.GalleryCtrl = function($scope, $window, $http, $location, currents) {
    $scope.page = {category: $location.path().slice(1)};
    $scope.isInfoHidden = true;
    $scope.$on('ChangeIndex', function(event, category) {
        if ($scope.page.category == category) {
            $scope.images.forEach(function(element) {
                if (element.id == currents[category]) {
                    element.active = true;
                }
            });
        }
    });
    $http.get("/img/" + $scope.page.category + "/info.json").then(function(result) {
        var imagejson = result.data; //Information about images (titles, id's, mediums)
        $scope.images = result.data.map(function(imagedat, index) {
            return {
                active: (imagedat.id == currents[$scope.page.category] ? true : false),
                image: "/img/" + $scope.page.category + "/" + imagedat.id + ".jpg"
            };
        }); //The array of objects for the carousel element
        $scope.images = $scope.images.map(function (image, index) {
            for (var attrname in imagejson[index]) { image[attrname] = imagejson[index][attrname]; }
            return image;
        });
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