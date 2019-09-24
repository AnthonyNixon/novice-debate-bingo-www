var app = angular.module('noviceDebateBingo', ['ngMaterial', 'ngMessages', 'ngRoute'])
    .config(function ($mdThemingProvider, $locationProvider, $routeProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('red');

        $routeProvider
            .when('/', {
                templateUrl: 'templates/home.html'
            })
            .when('/:code', {
                templateUrl: 'templates/board.html'
            });
    });

app.controller('welcomeCtrl', function ($scope, $timeout, $http, $location) {
    $scope.boardCode = "";
    $scope.buttonText = "New Board";

    var changeTimeout = $timeout(function() {
        if ($scope.boardCode !== "") {
            $scope.buttonText = "Go to " + $scope.boardCode;
        } else {
            $scope.buttonText = "New Board";
        }
    }, 100);

    $scope.$watch('boardCode', function () {
        changeTimeout.cancel;
        changeTimeout = $timeout(function() {
            if ($scope.boardCode !== "") {
                $scope.buttonText = "Go to " + $scope.boardCode;
            } else {
                $scope.buttonText = "New Board";
            }
        }, 1000);
    }, true);

    $scope.goToBoard = goToBoard;

    function goToBoard() {
        if ($scope.boardCode === "") {
            var onSuccess = function(response) {
                var newBoardID = response.data.board.code;
                console.log(response);
                $location.path('/' + newBoardID);
            };

            var onError = function(data) {
                console.error("Error creating new board.", data);
            };

            $http.post('https://api.novicedebatebingo.com/boards', {division: "novice"})
                .then(onSuccess, onError)
        } else {
            $location.path('/' + $scope.boardCode);
        }
    }
});

app.controller('homeCtrl', function ($scope) {

});

app.controller('bingoCtrl', function ($scope, $http, $routeParams) {
    $scope.fields = [];
    $scope.bingo = false;
    $scope.boardCode = $routeParams.code;

    console.log("Boardcode", $scope.boardCode);

    $http({
        method: 'GET',
        url: 'https://api.novicedebatebingo.com/boards/' + $scope.boardCode
    }).then(function successCallback(response) {
        data = response.data;
        updateGrid(data)

    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    });

    function clickCell(x, y) {
        console.log("Clicking", x, y);
        var onSuccess = function(response) {
            updateGrid(response.data);
        };

        var onError = function(data) {
            console.error("Error posting toggle event", data);
        };

        $http.post('https://api.novicedebatebingo.com/toggleBox', { board_id: $scope.boardCode, coordinates: {x: x, y: y}})
            .then(onSuccess, onError)

    }

    function updateGrid(data) {
        console.log(data);

        $scope.grid = new Array(5);
        for (x = 0; x < 5; x++) {
            $scope.grid[x] = new Array(5);
        }

        for (x = 0; x < 5; x++) {
            for (y = 0; y < 5; y++) {
                $scope.grid[x][y] = {content: data.boxes[x][y].content, checked: data.boxes[x][y].checked, coordinates: data.boxes[x][y].coordinates};
            }
        }

        console.log("hi");
        console.log($scope.grid);
    }

    $scope.clickCell = clickCell

    // $scope.$watch('grid', function () {
    //     $scope.bingo = checkBingo($scope.grid);
    //     console.log("$scope.bingo is ", $scope.bingo);
    //     console.log("hi");
    // }, true);

    // $scope.$watch('bingo', function () {
    //     if ($scope.bingo) {
    //         gtag('event', 'bingo', {
    //             'event_category': 'bingo',
    //             'event_label': 'bingo'
    //         });
    //     }
    //     console.log("BINGO! ", $scope.bingo);
    // })
});



