reqData.$inject = ["$parse"];
export function reqData($parse) {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            if (elem.prop('nodeName') === "INPUT") {
                elem.bind("keyup", ($event) => {
                    scope.$evalAsync(() => {
                        let fieldName = attrs.reqData || 'Field';
                        let pattern = attrs.rdPattern || null;
                        let errors = $parse(attrs.rdErrors)(scope);
                        let onChange = $parse(attrs.rdChange)(scope)
                        let $elem = $($event.target || $event.currentTarget);
                        let $formGroup = $elem.parents(".form-group");
                        let $matchElem = attrs.rdMatch ? $("#" + attrs.rdMatch) : null;
                        let requiredMessage = fieldName + " is required.";
                        let matchMessage = fieldName + " does not match.";
                        let patternMessage = attrs.rdPatternMsg || fieldName + " does not match the specified pattern.";
                        let hasErrorClass = $formGroup && $formGroup.hasClass('has-error');
                        let reqMsgIndex = errors.findIndex((elem) => { return elem.control === $elem[0] && elem.error == requiredMessage; });

                        if (!$elem.val() || $elem.val().length === 0 || /^\s*$/.test($elem.val())){
                            if (!hasErrorClass) {
                                $formGroup.addClass('has-error');
                            }

                            if (reqMsgIndex < 0) {
                                errors.push({ control: $elem[0], error: requiredMessage });
                            }
                        } else {
                            if (reqMsgIndex > -1){
                                errors.splice(reqMsgIndex, 1);
                                $parse(attrs.rdErrors).assign(scope, errors);
                            }

                            let otherErrors = errors.some((elem) => { return elem.control === $elem[0]; });

                            if (hasErrorClass && !otherErrors){
                                $formGroup.removeClass('has-error');
                            }
                        }

                        hasErrorClass = $formGroup && $formGroup.hasClass('has-error');
                        let indexMatch = errors.findIndex((elem) => { return elem.control === $elem[0] && elem.error === matchMessage; });

                        if ($matchElem && $matchElem.val() !== $elem.val()) {
                            if (!hasErrorClass) {
                                $formGroup.addClass('has-error');
                            }

                            if (indexMatch < 0){
                                errors.push({ control: $elem[0], error: matchMessage });
                            }
                        } else {
                            if (indexMatch > -1){
                                errors.splice(indexMatch, 1);
                                $parse(attrs.rdErrors).assign(scope, errors);
                            }

                            let otherErrors = errors.some((elem) => { return elem.control === $elem[0]; });

                            if (hasErrorClass && !otherErrors){
                                $formGroup.removeClass('has-error');
                            }
                        }

                        hasErrorClass = $formGroup && $formGroup.hasClass('has-error');
                        let patternMatchIndex = errors.findIndex((elem) => { return elem.control === $elem[0] && elem.error === patternMessage; });

                        if (pattern && !$elem.val().match(pattern)) {
                            if (!hasErrorClass) {
                                $formGroup.addClass('has-error');
                            }

                            if (patternMatchIndex < 0){
                                errors.push({ control: $elem[0], error: patternMessage });
                            }
                        } else {
                            if (patternMatchIndex > -1){
                                errors.splice(patternMatchIndex, 1);
                                $parse(attrs.rdErrors).assign(scope, errors);
                            }

                            let otherErrors = errors.some((elem) => { return elem.control === $elem[0]; });

                            if (hasErrorClass && !otherErrors){
                                $formGroup.removeClass('has-error');
                            }
                        }

                        if (onChange){
                            onChange;
                        }
                    });
                });
            }
        }
    }
}
