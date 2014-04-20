var gallery = angular.module('nickmusaelian_gallery', ['ngRoute','ui.bootstrap']);

gallery.config(function($routeProvider){
    $routeProvider.
        when('/paintings', {templateUrl: 'partials/paintings.html', controller: 'PaintingsCtrl'}).
        when('/woodcuts', {templateUrl: 'partials/woodcuts.html', controller: 'WoodcutsCtrl'}).
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

function calcImageHeight(clientWindowHeight, heightInInches){
    var imageHeight;
    console.log('height of the image', heightInInches);
    //approximately 400px for each 12"
    imageHeight = heightInInches/12*400;
    console.log(imageHeight,clientWindowHeight);
    return (imageHeight < clientWindowHeight) ? imageHeight : clientWindowHeight*0.9;
}

controllers.PaintingsCtrl = function($scope, $window){
    $scope.page = {name: "Paintings"};
    $scope.images = [
        {
            active: true,
            image: "img/paintings/01.jpg"
        },
        {
            active: false,
            image: "img/paintings/02.jpg"
        },
        {
            active: false,
            image: "img/paintings/03.jpg"
        },
        {
            active: false,
            image: "img/paintings/04.jpg"
        },
        {
            active: false,
            image: "img/paintings/05.jpg"
        }
    ];
    $scope.totalImagesLoaded = 0;
    $scope.loadScreenClass = "";
    $scope.imageLoaded = function() {
        $scope.totalImagesLoaded++;
        if ($scope.totalImagesLoaded == $scope.images.length) {
            $scope.$apply(function() {$scope.loadScreenClass = "hide"});
            console.log("All images loaded.");
        }
    }
};

controllers.WoodcutsCtrl = function($scope, $window, ImageLoader){
};

gallery.controller(controllers);