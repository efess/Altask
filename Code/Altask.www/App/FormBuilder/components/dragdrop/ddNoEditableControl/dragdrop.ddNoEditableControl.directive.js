const DRAG_DROP_NO_EDITABLE_CONTROL = 'ddNoEditableControl';

function ddNoEditableControl() {
    let directive = {
        scope: {
            'item': '=ddItem'
        },
        link: linkfct
    };
    return directive;

    function linkfct($scope, element, attrs, ctrl, transclude) {
        element.on('click', (event) => event.preventDefault());


        //transclude($scope.$parent, (contentClone)=>{
        // let childDiv = angular.element(element.children()[0]); 
        // childDiv.append(contentClone);
        //}); 
    }
}

ddNoEditableControl.$inject = [];

export default ddNoEditableControl;

export {
    DRAG_DROP_NO_EDITABLE_CONTROL
};