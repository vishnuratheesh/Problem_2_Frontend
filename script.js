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

myTicketingApp.factory('updateTicket', function($http) {
  return {
    getJson: function(newData) {
      var url = apiBaseURL + '/tickets/';
      var promise = $http.put(url, newData, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        }
      });
      return promise.then(function(result) {
        return result.data;
      });
    }
  }
});

myTicketingApp.factory('createTicket', function($http) {
  return {
    getJson: function(newData) {
      var url = apiBaseURL + '/tickets';
      var promise = $http.post(url, newData, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        }
      });
      return promise.then(function(result) {
        return result.data;
      });
    }
  }
});


myTicketingApp.factory('getCSRs', function($http) {
  return {
    getJson: function() {
      var url = apiBaseURL + '/csrs';
      var promise = $http.get(url);
      return promise.then(function(result) {
        return result.data;
      });
    }
  }
});

myTicketingApp.factory('getStatus', function($http) {
  return {
    getJson: function() {
      var url = apiBaseURL + '/status';
      var promise = $http.get(url);
      return promise.then(function(result) {
        return result.data;
      });
    }
  }
});

myTicketingApp.factory('getCustomers', function($http) {
  return {
    getJson: function() {
      var url = apiBaseURL + '/customers';
      var promise = $http.get(url);
      return promise.then(function(result) {
        return result.data;
      });
    }
  }
});

myTicketingApp.factory('getProblemTypes', function($http) {
  return {
    getJson: function() {
      var url = apiBaseURL + '/probtypes';
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
      templateUrl: 'modal.html'
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
myTicketingApp.controller('ViewTicketController', function($scope, getTickets, modalService, getCSRs, getStatus, getCustomers, getProblemTypes, updateTicket, createTicket) {

  // create a message to display in our view
  $scope.message = 'Tip: Use global search to narrow down results.';


  $scope.rowCollection = [];

  getTickets.getJson().then(function(data) {
    $scope.rowCollection = data.data;
    //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
    $scope.displayedCollection = [].concat($scope.rowCollection);
  });

  getCSRs.getJson().then(function(data) {
    $scope.csrCollection = data.data;
  });

  getStatus.getJson().then(function(data) {
    $scope.statusCollection = data.data;
  });

  getCustomers.getJson().then(function(data) {
    $scope.customersCollection = data.data;
  });

  getProblemTypes.getJson().then(function(data) {
    $scope.probtypesCollection = data.data;
  });

  // UPDATE TICKET - MODAL
  $scope.show = function(row) {
    var modalOptions = {
      closeButtonText: 'Cancel',
      actionButtonText: 'Save',
      headerText: 'Ticket Details',
      // bodyText: 'Here are the ticket details.',
      rowData: row,
      csrs: $scope.csrCollection,
      status: $scope.statusCollection
    };


    var modalDefaults = {
      backdrop: true,
      keyboard: true,
      modalFade: true,
      templateUrl: '/pages/modal.html'
    };

    modalService.showModal(modalDefaults, modalOptions).then(function(result) {

      if (result.newStatus.id == 1 && result.newCSR.id > 1) {
        alert('Cannot set ticket to NEW with CSR asigned to it.');
        return;
      }

      //tticketID,cust_id,prob_id,status_id,comments,assigned_to
      var newData = {};
      newData.id = result.id;
      newData.cust_id = result.cust_id;
      newData.prob_id = result.prob_id;
      newData.status_id = result.newStatus.id;
      newData.comments = result.newComments;
      newData.assigned_to = result.newCSR.id;

      updateTicket.getJson(newData).then(function(data) {
        getTickets.getJson().then(function(data) {
          $scope.rowCollection = data.data;
          $scope.displayedCollection = [].concat($scope.rowCollection);
        });
      });


    });

  };

  // CREATE TICKET - MODAL
  $scope.showCreateTicket = function() {
    var modalOptions = {
      closeButtonText: 'Cancel',
      actionButtonText: 'Create',
      headerText: 'New Ticket',
      // bodyText: 'Here are the ticket details.',
      customers: $scope.customersCollection,
      probtypes: $scope.probtypesCollection
    };


    var modalDefaults = {
      backdrop: true,
      keyboard: true,
      modalFade: true,
      templateUrl: '/pages/createTicketModal.html'
    };

    modalService.showModal(modalDefaults, modalOptions).then(function(result) {

      // cust_id,prob_id,status_id,comments
      var newData = {};
      newData.cust_id = result.newCustomer.id;
      newData.prob_id = result.newProbType.id;
      newData.status_id = 1;
      newData.comments = result.newComments;
      newData.assigned_to = 1;

      createTicket.getJson(newData).then(function(data) {
        getTickets.getJson().then(function(data) {
          $scope.rowCollection = data.data;
          $scope.displayedCollection = [].concat($scope.rowCollection);
        });
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