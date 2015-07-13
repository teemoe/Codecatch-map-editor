angular.module('Map-Editor', ['ui.bootstrap', 'ngTagsInput']);


//This controller is defined to open up the modals of the POI defintion and help instructions

angular.module('Map-Editor').controller('ModalController', function ($scope, $modal, $log) {
    
  $scope.animationsEnabled = true;
     
  $scope.configMark = function () {
      
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'configureMarker.html',
      controller: 'ModalInstanceCtrl',

    });
        
  };    
    
  $scope.openHelp = function() {
      
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'instructions.html',
      controller: 'ModalHelp',

    });
      
  };       
    
});


// This controller receives the entries of the POI information and invokes the function used to add POI-markers to the map
angular.module('Map-Editor').controller('ModalInstanceCtrl', function ($scope, $modalInstance ) {

$scope.poiname = "";
$scope.poiinfo = ""; 
$scope.poilogo = "";  
    
$scope.tags = [

  ];    
    
 
  $scope.ok = function () {
    $modalInstance.close();       
    addM($scope.poiname, $scope.poiinfo, $scope.poilogo, $scope.tags);  

  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
    
    $scope.uploadFile = function(event){

        $scope.poilogo = event.target.files[0].name;
    };    
});


// This controller handles the modal of the helping instructions
angular.module('Map-Editor').controller('ModalHelp', function ($scope, $modalInstance ) {


  $scope.okHelp = function () {
    $modalInstance.close(); 
  };


});