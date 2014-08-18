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