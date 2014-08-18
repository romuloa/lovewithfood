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