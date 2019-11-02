compileHtml.$inject = ["$compile"];
export function compileHtml($compile) {
    return {
        scope: {
            chtmlModel: "=",
        },
        link: function(scope, elem, attrs) {
            scope.control = scope.chtmlModel.control;
            scope.to = scope.control ? scope.control.templateOptions : null;
            elem.html(attrs.compileHtml);
            $compile(elem.contents())(scope);

            scope.$watch(() => scope.$parent.vm.editedControlKey, (newValue) => {
                if (scope.control.key === undefined){
                    scope.control = scope.chtmlModel.control;
                }

                if (newValue && newValue === scope.control.key) {
                    scope.control = scope.chtmlModel.control;
                    scope.to = scope.control ? scope.control.templateOptions : null;
                    elem.html(attrs.compileHtml);
                    $compile(elem.contents())(scope);
                    scope.$parent.vm.editedControlKey = null;
                }
            });
        }
    }
}
