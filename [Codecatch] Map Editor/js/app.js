angular.module('Map-Editor', ['ui.bootstrap']);
angular.module('Map-Editor').controller('ModalController', function ($scope, $modal, $log) {
    
  $scope.animationsEnabled = true;
     
  $scope.configMark = function () {
      
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'configureMarker.html',
      controller: 'ModalInstanceCtrl',

    });

      
  };    
    


});


angular.module('Map-Editor').controller('ModalInstanceCtrl', function ($scope, $modalInstance ) {

$scope.poiname = "";
$scope.poiinfo = "";    
 
  $scope.ok = function () {
    $modalInstance.close(); 
      
    addM($scope.poiname, $scope.poiinfo);  
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});