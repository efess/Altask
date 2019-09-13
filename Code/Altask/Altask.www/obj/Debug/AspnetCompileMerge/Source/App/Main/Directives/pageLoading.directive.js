pageLoading.$inject = ["$compile"];
export function pageLoading($compile) {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            let $elem = $(elem);
            let $content = $("<div></div>", { "class": "pl-content" });
            let $message = $("<div></div>", { "class": "pl-message" });
            let $hide = $("<div></div>", { "class" : "pl-sheet" });
            
            $elem.empty();
            $elem.addClass("pl-indicator pl-hide");
            $content.append(`<img height="40" src="../../Images/loading-white.gif" alt="Loading Indicator" />`);
            $message.append("Loading...");
            $content.append($message);
            $elem.append($content);
            $elem.append($("<div></div>", { "class": "pl-backdrop"}));
            $elem.append($hide);

            if (attrs.plHide) {
                scope.$watch(attrs.plHide, (hide) => {
                    if (hide) {
                        $elem.addClass("ng-show");
                        $elem.removeClass("ng-hide");
                    } else {
                        $elem.addClass("ng-hide");
                        $elem.removeClass("ng-show");
                    }
                });
            }
            
            scope.$watch(attrs.pageLoading, (loading) => {
                if (loading) {
                    $elem.addClass("pl-show");
                    $elem.removeClass("pl-hide");
                } else {
                    $elem.addClass("pl-hide");
                    $elem.removeClass("pl-show");
                }
            });
            
            if (attrs.plMessage) {
                scope.$watch(attrs.plMessage, (message) => {
                    $message.empty();
                    $message.append(message);
                });
            }
        }
    }
}
