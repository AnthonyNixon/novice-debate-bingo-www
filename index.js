var app = angular.module('noviceDebateBingo', ['ngMaterial', 'ngMessages']);
app.controller('bingoCtrl', function($scope, $http, $interval) {
  $scope.fields = [];
  $scope.bingo = false;
   $http({
        method: 'GET',
        url: 'bingo.json'
    }).then(function successCallback(response) {
        data = response.data;
        console.log(data);

        for (i = 0; i < data.fields.length; i++) {
            console.log(i);
            data.fields[i].checked = false;
            $scope.fields.push(data.fields[i]);
        }
        
        $scope.fields = shuffle($scope.fields);
        
        $scope.fields.splice(12, 0, ({"content": "Free Space!", "checked": true}));
        $scope.grid = new Array(5)
        for (x = 0; x < 5; x++) {
          $scope.grid[x] = new Array(5);
        }

        
        for (y = 0; y < 5; y++) {
          for (x = 0; x < 5; x++) {
            $scope.grid[x][y] = $scope.fields[(y*5) + x];
          }
        }

        $scope.grid[2][2].checked = true;
        console.log("hi");
        console.log($scope.fields);
        console.log($scope.grid);

    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
    });
    
  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }
   
  $scope.$watch('grid', function() {
    $scope.bingo = checkBingo($scope.grid);
    console.log("$scope.bingo is ", $scope.bingo);
    console.log("hi");
  }, true);
  
  $scope.$watch('bingo', function() {
    if ($scope.bingo) {
       gtag('event', 'bingo', {
            'event_category': 'bingo',
            'event_label': 'bingo'
        });
    }
    console.log("BINGO! ", $scope.bingo);
  })
  
  function checkBingo(array) {
    console.log("Checking bingos.");
    console.log(array);
    //Check Horizontal Bingos
    if (array[0][0].checked && array[0][1].checked && array[0][2].checked && array[0][3].checked && array[0][4].checked) {
      return true;
    } else if (array[1][0].checked && array[1][1].checked && array[1][2].checked && array[1][3].checked && array[1][4].checked) {
      return true;
    } else if (array[2][0].checked && array[2][1].checked && array[2][2].checked && array[2][3].checked && array[2][4].checked) {
      return true;
    } else if (array[3][0].checked && array[3][1].checked && array[3][2].checked && array[3][3].checked && array[3][4].checked) {
      return true;
    } else if (array[4][0].checked && array[4][1].checked && array[4][2].checked && array[4][3].checked && array[4][4].checked) {
      return true;
    }
    
    // Check Horizontal Bingos
    else if (array[0][0].checked && array[1][0].checked && array[2][0].checked && array[3][0].checked && array[4][0].checked) {
      return true;
    } else if (array[0][1].checked && array[1][1].checked && array[2][1].checked && array[3][1].checked && array[4][1].checked) {
      return true;
    } else if (array[0][2].checked && array[1][2].checked && array[2][2].checked && array[3][2].checked && array[4][2].checked) {
      return true;
    } else if (array[0][3].checked && array[1][3].checked && array[2][3].checked && array[3][3].checked && array[4][3].checked) {
      return true;
    } else if (array[0][4].checked && array[1][4].checked && array[2][4].checked && array[3][4].checked && array[4][4].checked) {
      return true;
    }
    
    // Check Diagonal Bingos
    else if (array[0][0].checked && array[1][1].checked && array[2][2].checked && array[3][3].checked && array[4][4].checked) {
      return true;
    } else if (array[4][0].checked && array[3][1].checked && array[2][2].checked && array[1][3].checked && array[0][4].checked) {
      return true;
    } else {
      return false;
    }
    
  }
});



