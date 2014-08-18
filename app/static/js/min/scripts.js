var app = angular.module('lwf', ['angular-data.DSCacheFactory', 'ngFocus', 'creditCardType', 'cardExpiration', 'range']);

app.constant('globalConfig', {

  /**
   * array of states for State select lists in forms
   * @type {Array}
   */
  states: [
    {name: "AL"}, {name: "AK"}, {name: "AZ"}, {name: "AR"}, {name: "CA"},
    {name: "CO"}, {name: "CT"}, {name: "DE"}, {name: "DC"}, {name: "FL"},
    {name: "GA"}, {name: "HI"}, {name: "ID"}, {name: "IL"}, {name: "IN"},
    {name: "IA"}, {name: "KS"}, {name: "KY"}, {name: "LA"}, {name: "ME"},
    {name: "MD"}, {name: "MA"}, {name: "MI"}, {name: "MN"}, {name: "MS"},
    {name: "MO"}, {name: "MT"}, {name: "NE"}, {name: "NV"}, {name: "NH"},
    {name: "NJ"}, {name: "NM"}, {name: "NY"}, {name: "NC"}, {name: "ND"},
    {name: "OH"}, {name: "OK"}, {name: "OR"}, {name: "PA"}, {name: "RI"},
    {name: "SC"}, {name: "SD"}, {name: "TN"}, {name: "TX"}, {name: "UT"},
    {name: "VT"}, {name: "VA"}, {name: "WA"}, {name: "WV"}, {name: "WI"},
    {name: "WY"}
  ],
  countries: [
    {name: "United States"}, {name: "Canada"}, {name: "Mexico"}
  ]
});
app.controller('HomeCtrl', ['$scope', 'globalConfig', '$locale',  function($scope, globalConfig, $locale) {

	'use strict';


	/**
	* Actions to perform on controller initialization
	*/
	$scope.init = function() {
		// initialize dropdowns and defaults
		$scope.states = globalConfig.states;
		$scope.countries = globalConfig.countries;
		$scope.viewCheckout = true;
		$scope.viewConfirmation = false;
	};

		// set variables
	$scope.currentYear = new Date().getFullYear();
	$scope.currentMonth = new Date().getMonth() + 1;
	$scope.months = $locale.DATETIME_FORMATS.MONTH;

	// set error messages
	$scope.paymentErrors = {};

	//set form object
	$scope.paymentInfo = {};
	$scope.paymentInfo.type = undefined;
	$scope.paymentInfo.sameBilling = true;


	$scope.submitPaymentForm = function(data){
		if (this.paymentForm.$valid){
			$scope.submitted = true;

			// If same billing is checked make values equal
			if ($scope.paymentInfo.sameBilling == true) {
				$scope.paymentInfo.shipping_name = $scope.paymentInfo.billing_name;
				$scope.paymentInfo.shipping_address_1 = $scope.paymentInfo.billing_address_1;
				$scope.paymentInfo.shipping_address_2 = $scope.paymentInfo.billing_address_2;
				$scope.paymentInfo.shipping_city = $scope.paymentInfo.billing_city;
				$scope.paymentInfo.shipping_state = $scope.paymentInfo.billing_state;
				$scope.paymentInfo.shipping_zip = $scope.paymentInfo.billing_zip;
				$scope.paymentInfo.shipping_country = $scope.paymentInfo.billing_country;
				$scope.paymentInfo.shipping_phone = $scope.paymentInfo.billing_phone;
			}

			// hide checkout
			$scope.viewCheckout = false;

			// show confirmation
			$scope.viewConfirmation = true;
		}
	}

}]);
app.controller('NavCtrl', ['$scope', function($scope) {
'use strict';
 /**
  * Actions to perform on controller initialization
  */
 $scope.init = function() {

     var querySelector = document.querySelector.bind(document);

    var navdrawerContainer = querySelector('.navdrawer-container');
    var body = document.body;
    var appbarElement = querySelector('.app-bar');
    var menuBtn = querySelector('.menu');
    var main = querySelector('main');

    function closeMenu() {
      body.classList.remove('open');
      appbarElement.classList.remove('open');
      navdrawerContainer.classList.remove('open');
    }

    function toggleMenu() {
      body.classList.toggle('open');
      appbarElement.classList.toggle('open');
      navdrawerContainer.classList.toggle('open');
    }

    main.addEventListener('click', closeMenu);
    menuBtn.addEventListener('click', toggleMenu);
    navdrawerContainer.addEventListener('click', function (event) {
      if (event.target.nodeName === 'A' || event.target.nodeName === 'LI') {
        closeMenu();
      }
    });
 };

}]);
angular.module('creditCardType', []).directive( 'creditCardType', function(){
	var directive = {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {
			ctrl.$parsers.unshift(function(value) {
				scope.paymentInfo.type =
					(/^5[1-5]/.test(value)) ? 'mastercard'
					: (/^4/.test(value)) ? 'visa'
					: (/^(3[47])/.test(value)) ? 'amex'
					: (/^6011|65|64[4-9]|622(1(2[6-9]|[3-9]\d)|[2-8]\d{2}|9([01]\d|2[0-5]))/g.test(value)) ? 'discover'
					: undefined;
				ctrl.$setValidity('invalid',!!scope.paymentInfo.type);
				return value;
			})
		}
	}
	return directive
});
angular.module('cardExpiration', []).directive('cardExpiration', function() {
	var directive = {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {
			scope.$watch('[paymentInfo.exp_month,paymentInfo.exp_year]', function(value) {
				ctrl.$setValidity('invalid', true)
				if ( scope.paymentInfo.exp_year == scope.currentYear && scope.paymentInfo.exp_month <= scope.currentMonth) {
					ctrl.$setValidity('invalid', false)
				}
				return value
			}, true)
		}
	}
	return directive
});
angular.module('ngFocus', []).directive('ngFocus', [function() {
  var FOCUS_CLASS = "ng-focused";
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, element, attrs, ctrl) {
      ctrl.$focused = false;
      element.bind('focus', function(evt) {
        element.addClass(FOCUS_CLASS);
        scope.$apply(function() {ctrl.$focused = true;});
      }).bind('blur', function(evt) {
        element.removeClass(FOCUS_CLASS);
        scope.$apply(function() {ctrl.$focused = false;});
      });
    }
  }
}]);
angular.module('range', []).filter('range', function() {
	var filter = function(arr, lower, upper) {
		for (var i = lower; i <= upper; i++) arr.push(i)
			return arr
	}
	return filter
})