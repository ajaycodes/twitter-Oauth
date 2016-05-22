// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
	
angular.module('starter', ['ionic', 'ngCordova', 'ngTwitter','ngCordovaOauth'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('AppCtrl', function($scope, $ionicPlatform, $twitterApi, $cordovaOauth,$window) {
	
var twitterKey = 'STORAGE.TWITTER.KEY';
var clientId = "s8vU7TBgMw6SoEXVb0IpaLKbg";
var clientSecret = "w9nHt7t5hqYcuACif9uEWLKpN5GCvdPLv7ncQXjjnn9GOQlxpi";
var myToken = '';
 
$scope.tweet = {};
 
$ionicPlatform.ready(function() {
  myToken = JSON.parse(window.localStorage.getItem(twitterKey));
  console.log("in1"+myToken);
  if (myToken === '' || myToken === null) {
	  console.log("in");
    $cordovaOauth.twitter(clientId, clientSecret).then(function (succ) {
      myToken = succ;
	  console.log("in");
      window.localStorage.setItem(twitterKey, JSON.stringify(succ));
	  console.log("in");
      $twitterApi.configure(clientId, clientSecret, succ);
      $scope.showHomeTimeline();
    }, function(error) {
      console.log("e"+JSON.stringify(error));
    });
  } else {
    $twitterApi.configure(clientId, clientSecret, myToken);
    $scope.showHomeTimeline();
  }
});

$scope.showHomeTimeline = function() {
  $twitterApi.getHomeTimeline().then(function(data) {
    $scope.home_timeline = data;
  });
};
 
$scope.submitTweet = function() {
  $twitterApi.postStatusUpdate($scope.tweet.message).then(function(result) {
    $scope.showHomeTimeline();
  });
}
 
$scope.doRefresh = function() {
  $scope.showHomeTimeline();
  $scope.$broadcast('scroll.refreshComplete');
};
 
$scope.correctTimestring = function(string) {
  return new Date(Date.parse(string));
};

$scope.signout=function(){
window.localStorage.setItem(twitterKey, null);
	$window.location.reload();
};
});
