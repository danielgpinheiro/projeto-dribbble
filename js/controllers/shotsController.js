app.controller("shotsController", ($scope, $http, $timeout, $window, config) => {
  $scope.shotsList = []
  $scope.shot = {}

  $scope.getAllShots = () => {
    $http.get(config.shotUrl).success((response, status) => {
			$scope.shotsList = response
      console.log(response.length)
		})
  }

  $scope.getUser = () => {
    $http.get(config.userUrl).success((response, status) => {
      $scope.user = response
    })
  }

  $scope.openShot = (id) => {
    $http.get(config.shotUrl + `${'/' + id}`).success((response, status) => {
			$scope.shot = response

      popupBehavior('open')

      $http.get(config.shotUrl + `${'/' + id + '/like'}`).success((response, status) => {
        $scope.shot.liked = true
  		}).error(() => {
        $scope.shot.liked = false
      })
		})
  }

  $scope.likeShot = (id) => {
    $http.get("https://dribbble.com/oauth/authorize?client_id=f2e17c0bde6181f90d4741d5234a3723a164091015107f31fa525cb1d8436738&redirect_uri=http://localhost:8888&scope=write").success((response, status) => {
      //$scope.user = response
      console.log(response)
    })

    // if(!$scope.shot.liked) {
    //   $http.post(config.shotUrl + `${'/' + id + '/like'}`).success((response, status) => {
    //     $scope.shot.liked = true
    //     $scope.shot.likes_count++
  	// 	})
    // }
    //
    // else {
    //   $http.delete(config.shotUrl + `${'/' + id + '/like'}`).success((response, status) => {
    //     $scope.shot.liked = false
    //     $scope.shot.likes_count--
  	// 	})
    // }
  }

  $scope.closeShot = () => {
    popupBehavior('close')

    $timeout(() => {
      $scope.shot = {}
    }, 300);
  }

  $scope.getAllShots()
  $scope.getUser()
})
