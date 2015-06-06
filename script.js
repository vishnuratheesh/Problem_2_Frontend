var apiBaseURL = '//prob2backend.herokuapp.com/v1';

// create the module and name it myTicketingApp
var myTicketingApp = angular.module('myTicketingApp', ['ngRoute']);


// ROUTE CONFIGURATION

// configure our routes
myTicketingApp.config(function($routeProvider) {
  $routeProvider

  // route for the view tickets page
  .when('/', {
    templateUrl: 'pages/viewTickets.html',
    controller: 'MainController'
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



// CONTROLLERS

// create the controller and inject Angular's $scope
myTicketingApp.controller('MainController', function($scope, getTickets) {

  // create a message to display in our view
  $scope.message = 'View Tickets';

  var data = [];
  getTickets.getJson().then(function(data) {
    $scope.data = data;
  });
  data = $scope.data;
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