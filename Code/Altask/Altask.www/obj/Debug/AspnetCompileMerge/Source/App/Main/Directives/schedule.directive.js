schedule.$inject = [];
export function schedule() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            click: "&",
        },
        template: `<button class="btn btn-primary" ng-click="click">label</button>`,
        link: function(scope, element, attrs) {
            
            //Define the open function for the popup
            scope.open = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                scope.opened = true;
            };; 
        }
    };
}