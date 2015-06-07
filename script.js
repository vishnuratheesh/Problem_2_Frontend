var apiBaseURL = '//prob2backend.herokuapp.com/v1';

// create the module and name it myTicketingApp
var myTicketingApp = angular.module('myTicketingApp', ['ngRoute', 'smart-table', 'ui.bootstrap']);


// ROUTE CONFIGURATION

// configure our routes
myTicketingApp.config(function($routeProvider) {
  $routeProvider

  // route for the view tickets page
  .when('/', {
    templateUrl: 'pages/viewTickets.html',
    controller: 'MainController'
  })

  // route for the view tickets page
  .when('/viewTickets', {
    templateUrl: 'pages/viewTickets.html',
    controller: 'ViewTicketController'
  })

  // route for the create ticket page
  .when('/createTicket', {
    templateUrl: 'pages/createTicket.html',
    controller: 'CreateTicketController'
  })

  // route for the assign ticket page
  .when('/assignTickets', {
    templateUrl: 'pages/assignTickets.html',
    controller: 'AssignTicketsController'
  });
});


// SERVICES

myTicketingApp.factory('getTickets', function($http) {
  return {
    getJson: function() {
      var url = apiBaseURL + '/tickets';
      var promise = $http.get(url);
      return promise.then(function(result) {
        return result.data;
      });
    }
  }
});


myTicketingApp.service('modalService', ['$modal',
  function($modal) {

    var modalDefaults = {
      backdrop: true,
      keyboard: true,
      modalFade: true,
      templateUrl: '/pages/modal.html'
    };

    var modalOptions = {
      closeButtonText: 'Close',
      actionButtonText: 'OK',
      headerText: 'Proceed?',
      bodyText: 'Perform this action?'
    };

    this.showModal = function(customModalDefaults, customModalOptions) {
      if (!customModalDefaults) customModalDefaults = {};
      customModalDefaults.backdrop = 'static';
      return this.show(customModalDefaults, customModalOptions);
    };

    this.show = function(customModalDefaults, customModalOptions) {
      //Create temp objects to work with since we're in a singleton service
      var tempModalDefaults = {};
      var tempModalOptions = {};

      //Map angular-ui modal custom defaults to modal defaults defined in service
      angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

      //Map modal.html $scope custom properties to defaults defined in service
      angular.extend(tempModalOptions, modalOptions, customModalOptions);

      if (!tempModalDefaults.controller) {
        tempModalDefaults.controller = function($scope, $modalInstance) {
          $scope.modalOptions = tempModalOptions;
          $scope.modalOptions.ok = function(result) {
            $modalInstance.close(result);
          };
          $scope.modalOptions.close = function(result) {
            $modalInstance.dismiss('cancel');
          };
        }
      }

      return $modal.open(tempModalDefaults).result;
    };

  }
]);




// CONTROLLERS

// create the controller and inject Angular's $scope
myTicketingApp.controller('MainController', function($scope, $location) {

  // create a message to display in our view
  $location.path('/viewTickets');
});

// create the controller and inject Angular's $scope
myTicketingApp.controller('ViewTicketController', function($scope, getTickets, modalService) {

  // create a message to display in our view
  $scope.message = 'Use global search to narrow down results.';

  // $scope.rowCollection = [];

  // getTickets.getJson().then(function(data) {
  //   $scope.rowCollection = data;
  //   $scope.displayedCollection = $scope.rowCollection;
  // });

  var firstnames = ['Laurent', 'Blandine', 'Olivier', 'Max'];
  var lastnames = ['Renard', 'Faivre', 'Frere', 'Eponge'];
  var dates = ['1987-05-21', '1987-04-25', '1955-08-27', '1966-06-06'];
  var id = 1;

  function generateRandomItem(id) {

    var firstname = firstnames[Math.floor(Math.random() * 3)];
    var lastname = lastnames[Math.floor(Math.random() * 3)];
    var birthdate = dates[Math.floor(Math.random() * 3)];
    var balance = Math.floor(Math.random() * 2000);

    return {
      id: id
    }
  }

  $scope.rowCollection = [];

  getTickets.getJson().then(function(data) {
    // for (id; id < 5; id++) {
    //   $scope.rowCollection.push(generateRandomItem(id));
    // }
    $scope.rowCollection = data.data;
    //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
    $scope.displayedCollection = [].concat($scope.rowCollection);

  });


  $scope.show = function() {
    var modalOptions = {
      closeButtonText: 'Cancel',
      actionButtonText: 'Delete Customer',
      headerText: 'Delete ?',
      bodyText: 'Are you sure you want to delete this customer?'
    };

    modalService.showModal({}, modalOptions).then(function(result) {
      // dataService.deleteCustomer($scope.customer.id).then(function() {
      //   $location.path('/customers');
      // }, processError);
      getTickets.getJson().then(function(data) {
        // for (id; id < 5; id++) {
        //   $scope.rowCollection.push(generateRandomItem(id));
        // }
        $scope.rowCollection = data.data;
        //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
        $scope.displayedCollection = [].concat($scope.rowCollection);

      });

    });

  };


});

myTicketingApp.controller('ModalController', function($scope, close) {

  $scope.close = function(result) {
    close(result, 500); // close, but give 500ms for bootstrap to animate
  };

});

// create the controller and inject Angular's $scope
myTicketingApp.controller('CreateTicketController', function($scope) {

  // create a message to display in our view
  $scope.message = 'Create Tickets';
});


// create the controller and inject Angular's $scope
myTicketingApp.controller('AssignTicketsController', function($scope) {

  // create a message to display in our view
  $scope.message = 'Assign Tickets';
});