var webApp = angular.module('webApp',['ngMaterial'])
.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
})
.service('gameRepoService', function($http,$q) {
		
			this.getGameCollection = function(language,page){

			var deferred=$q.defer();
			$http({'method':'GET','url':'http://starlord.hackerearth.com/gamesarena'})
				.success(function(data,status,header,config){
					deferred.resolve(data);
				})
            .error(function(data,status,header,config){
                deferred.reject(status);

            });
				return deferred.promise;
			};
			
			
		});
webApp.controller('MainController',function($scope,$filter,gameRepoService){
	
	

	$scope.selectedItemChange = function(item){
		console.log(item);
		$scope.selectedGenre = item.genre;
		$scope.highlightGame = item.title;
	}
	$scope.selectedGenre = "All category";

	$scope.selectGenre = function(genre){
		$scope.selectedGenre = genre;
		$scope.highlightGame='';
	}
	$scope.getStars = function(rating) {
		// Get the value
		var val = parseFloat(rating);
		// Turn value into number/100
		var size = val/5*100;
		return size + '%';
	  }

	  $scope.filterList=['score'];
	$scope.simulateQuery = true;
	$scope.categoryList = []
	/*Repo Function*/
	gameRepoService.getGameCollection().then(function(data){
		$scope.gameData = data;
		$scope.xrateLimit = data[0].api_rate_limit;
		$scope.gameData.splice(0, 1);
		$scope.categoryList=['All category'];


		angular.forEach($scope.gameData,function(gamedata){
			var splitGame = gamedata.genre.split(",");
			angular.forEach(splitGame,function(splitResult){
				
					if(splitResult.trim() !=""){
						var finalcategory = splitResult.trim();
						if($scope.categoryList.indexOf(finalcategory) == -1){
						
						$scope.categoryList.push(finalcategory);
					}
					
				}
			})
		})
		$scope.gameData.map( function (repo) {
			repo.value = repo.title.toLowerCase();
			$scope.gameData
		  });
	},function(error){
		console.log(error);
	})

	$scope.querySearch = function(query) {
		var results = query ? $scope.gameData.filter( createFilterFor(query) ) : $scope.gameData,
			deferred;
		if (self.simulateQuery) {
		  deferred = $q.defer();
		  $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
		  return deferred.promise;
		} else {
		  return results;
		}
	  }

	  function createFilterFor(query) {
		var lowercaseQuery = angular.lowercase(query);
		
			  return function filterFn(item) {
				return (item.value.indexOf(lowercaseQuery) === 0);
			  };
  
	  }

	
});

