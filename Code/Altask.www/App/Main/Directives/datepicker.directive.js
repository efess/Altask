datepicker.$inject = [];
export function datepicker() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            model: "=",
            id: "@",
            format: "@"
        },
        template: `<div class="input-group">
          <input type="text" class="form-control" id="{{id}}" uib-datepicker-popup="{{format}}" datepicker-options="datepickerOptions" ng-model="model" is-open="opened" ng-required="true"  />
          <span class="input-group-btn">
            <button type="button" class="btn btn-default" ng-click="open($event)"><i class="glyphicon glyphicon-calendar"></i></button>
          </span>
        </div>`,
        link: function(scope, element, attrs) {
            
            //Define the open function for the popup
            scope.open = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                scope.opened = true;
            };
        }
    };
}
