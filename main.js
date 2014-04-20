var gallery = angular.module('nickmusaelian_gallery', ['ngRoute','ui.bootstrap']);

gallery.config(function($routeProvider){
    $routeProvider.
        when('/paintings', {templateUrl: 'partials/image-gallery.html', controller: 'PaintingsCtrl'}).
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

controllers.PaintingsCtrl = function($scope, $window, $http) {
    $scope.page = {title: "Paintings", category: "paintings"};
    $http.get("/img/" + $scope.page.category + "/info.json").then(function(result) {
        $scope.imagejson = result.data; //Information about images (titles, id's, mediums)
        $scope.images = result.data.map(function(imagedat, index) {
            console.log(imagedat.id);
            return {
                active: (index == 0 ? true : false),
                image: "/img/" + $scope.page.category + "/" + imagedat.id + ".jpg"
            };
        }); //The array of objects for the carousel element
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

controllers.WoodcutsCtrl = function($scope, $window, ImageLoader){
};

gallery.controller(controllers);