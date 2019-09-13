/* global angular */
import ddDecorLineTemplate from './dragdrop.ddDecorLine.template.html';

const DRAG_DROP_DECOR_LINE = 'ddDecorLine';


function ddDecorLine($timeout) {
    let directive = {
        restrict: 'A',
        scope: {
            'verboseMode': '@ddLineVerboseMode',
            'currentIndex': '@ddLineCurrentIndex',
            'parentIndex': '@ddLineParentIndex',
            'removeLine': '&ddRemoveLine',
            'lineUp': '&ddLineUp',
            'lineDown': '&ddLineDown',
            'insertLine': '&ddInsertLine'
        },
        template: ddDecorLineTemplate,
        transclude: true,
        link: linkfct
    };
    return directive;


    function linkfct($scope, element, attrs, ctrl, transclude) {
        let verboseModeActive = $scope.verboseMode;
        let currentIndex = $scope.currentIndex;
        let parentIndex = $scope.parentIndex;
        $scope.deleteLine = {};
        $scope.deleteLine.readyToDelete = false;
        $scope.deleteLine.dblClickCount = 0;
        $scope.isCollapsed = false;
        let timer;


        // verbose mode: just for dev 
        if (verboseModeActive !== '') {
            let verbose = angular.lowercase(verboseModeActive);
            if (verbose === 'true' || verbose === '1') {
                /* eslint no-console:0 */
                console.dir({
                    whoAmI: 'I am verbose from ddDecorLine directive link',
                    verbodeMode: verbose,
                    ParentParentIndex: $scope.$parent.$parent.$index,
                    ParentIndex: parentIndex,
                    currentIndex: currentIndex
                });
            }
        }

        $scope.lineUpClick = (event) => {
            event.preventDefault();
            event.stopPropagation();

            if ($scope.parentIndex === '1') {
                $scope.lineUp();
                $timeout.cancel(timer);
            }
        };

        $scope.lineDownClick = (event) => {
            event.preventDefault();
            event.stopPropagation();

            if ($scope.parentIndex === '1') {
                $scope.lineDown();
                $timeout.cancel(timer);
            }
        };

        $scope.insertLineClick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            $scope.insertLine();
            $timeout.cancel(timer);
        }

        $scope.removeLineClick = (event) => {
            event.preventDefault();
            event.stopPropagation();

            if ($scope.parentIndex === '1') {
                /**
                 * NOTE: trick in calling parent controller function with input param when directive with isolate scope
                 * see: https://thinkster.io/egghead/isolate-scope-am
                 *
                 * Here should be:
                 * 
                 *-> in html: dd-remove-line="removeThisLine(indexToDelete)
                 *-> in controller: $scope.removeThisLine = function(lineIndex){
                 *-> so in directive call it : $scope.removeLine({indexToDelete: currentIndex});
                 *
                 *
                 * BUT in this case (repeats, ul> li.... complicated) 
                 * => works better (if shaking a lot of line in a row it won't mess up)
                 *
                 *-> in html: dd-remove-line="removeThisLine($index)
                 *-> in controller: $scope.removeThisLine = function(lineIndex){
                 *-> so in directive call it : $scope.removeLine();
                 */
                //$scope.removeLine({indexToDelete: currentIndex});
                $scope.removeLine();
                //console.warn('force timer destruction after delete!');
                $timeout.cancel(timer);
            }
        };


        /**
         * timer destruction to prevent from bad UI experience
         */
        $scope.$on('$destroy', () => $timeout.cancel(timer));



        /**
         * prevent transclusion creating child scope 
         *
         *
         * NOTE:if you want to know more about what I'm saying: check this nice tip on the subject: 
         * http://angular-tips.com/blog/2014/03/transclusion-and-scopes/ 
         */
        transclude($scope.$parent, (contentClone) => {
            //transclusion will append content to '<div id="lineDirectiveTranscludeHere"></div>'
            let childDiv = angular.element(element.children()[0]);
            childDiv.append(contentClone);
        });

    }

}

ddDecorLine.$inject = [
    '$timeout'
];

export default ddDecorLine;

export {
    DRAG_DROP_DECOR_LINE
};