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
    
  $scope.openHelp = function() {
      
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'instructions.html',
      controller: 'ModalHelp',

    });

      
  };       
    


});


angular.module('Map-Editor').controller('ModalInstanceCtrl', function ($scope, $modalInstance ) {

$scope.poiname = "";
$scope.poiinfo = ""; 
$scope.poilogo = "";    
 
  $scope.ok = function () {
    $modalInstance.close(); 
      
    addM($scope.poiname, $scope.poiinfo, $scope.poilogo);  

  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
    
    $scope.uploadFile = function(){

        $scope.poilogo = event.target.files[0].name;
    };    
});


angular.module('Map-Editor').controller('ModalHelp', function ($scope, $modalInstance ) {


  $scope.okHelp = function () {
    $modalInstance.close(); 
  };


});




angular.module('Map-Editor').directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeFunc = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeFunc);
    }
  };
});