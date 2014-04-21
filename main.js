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

Array.prototype.chunk = function(chunkSize) {
    var R = [];
    for (var i=0; i<this.length; i+=chunkSize)
        R.push(this.slice(i,i+chunkSize));
    return R;
}

var controllers = {};

controllers.ButtonsController = function($scope, $window) {
    $scope.isAboutShown = false;
    $scope.isChooserShown = false;
    $scope.hideChooser = function() {
        console.log("hide");
        $scope.isChooserShown = false;
    }
}

controllers.ThumbnailChooserController = function($scope, $window, $http, $location, $rootScope) {
    $scope.isLoaded = false;
    $scope.imagesLoaded = 0;
    $scope.imageLoaded = function() {
        $scope.imagesLoaded++;
        if ($scope.imagesLoaded == $scope.totalImages) {
            $scope.isLoaded = true;
        }
    }
    $http.get("/img/images.json").then(function(result) {
        $scope.totalImages = result.data.totalImages;
        $scope.categories = result.data.data;
    },
    function(error) {
        alert(error);
    });
}

controllers.GalleryCtrl = function($scope, $window, $http, $location) {
    $scope.page = {category: $location.path().slice(1)};
    $scope.isInfoHidden = true;
    $scope.$on('ChangeIndex', function(newid) {
        console.log("Change");
        for(var i = 0; i < $scope.images.length; i++) {
            if (images[i].id == newid) {
                images[i].active = true;
            }
            else {
                images[i].active = false;
            }
        }
    });
    $http.get("/img/" + $scope.page.category + "/info.json").then(function(result) {
        var imagejson = result.data; //Information about images (titles, id's, mediums)
        $scope.images = result.data.map(function(imagedat, index) {
            console.log(imagedat.id);
            return {
                active: (imagedat.id == '01' ? true : false),
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