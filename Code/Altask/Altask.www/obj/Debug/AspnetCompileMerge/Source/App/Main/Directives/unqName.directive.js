unqName.$inject = [];
export function unqName() {
    return {
        restrict: 'A',
        scope: {
            unErrModel: "=unErrModel",
            unItems: "=unItems",
            unOtherFunc: "&unOtherFunc",
            unOrgName: "@unOrgName",
            unField: "@unField"
        },
        link: function(scope, elem, attrs) {
            if (!attrs.unOtherFunc) {
                scope.unOtherFunc = null;
            }

            if (elem.prop('nodeName') === "INPUT") {
                elem.bind("keyup", ($event) => {
                    scope.$evalAsync(() => {
                        let $elem = $($event.target || $event.currentTarget);
                        let $parent = $elem.parents(".form-group");
                        let unMessage = "Please specify a unique " + (scope.unField || "Name") + ".";
                        let unHasError = $parent && $parent.hasClass('has-error');
                        let unIndex = scope.unErrModel.findIndex((elem) => { return elem.control === $elem[0] && elem.error === unMessage; });
                        
                        let other = false;

                        if (scope.unOtherFunc){
                            other = scope.unOtherFunc();
                        } else {
                            let elem = scope.unItems.find((elem) => { return elem.Name === $elem.val().trim(); });

                            if (elem && elem.Name != scope.unOrgName){
                                other = true;
                            }
                        }
                        
                        if (other){
                            if (!$parent.hasClass('has-error')) {
                                $parent.addClass('has-error');
                            }

                            if (scope.unErrModel.find((elem) => { return elem.error === unMessage}) === undefined) {
                                scope.unErrModel.push({ control: $elem[0], error: unMessage });
                            }
                        } else {
                            let index = scope.unErrModel.findIndex((elem) => { return elem.error === unMessage });

                            if (index > -1) {
                                scope.unErrModel.splice(index, 1);
                            }

                            let otherErrors = scope.unErrModel.some((elem) => { return elem.control === $elem[0]; });

                            if (!otherErrors && $parent.hasClass('has-error')) {
                                $parent.removeClass('has-error');
                            }
                        }
                    });
                });
            }
        }
    }
}
