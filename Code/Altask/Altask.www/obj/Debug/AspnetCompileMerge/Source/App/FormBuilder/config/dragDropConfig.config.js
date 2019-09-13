const VERSION_NAME = 'Version';
const VERSION_VALUE = "1";

function dragDropConfigFunct(FormBuilderConfigProvider) {
    FormBuilderConfigProvider.setItemsNotTocount({
        //placeholder: '',
        itemBeingDragged: 'dndDraggingSource'
    });
}

dragDropConfigFunct.$inject = [
    'FormBuilderConfigProvider'
];

export default dragDropConfigFunct;

export {
    VERSION_NAME,
    VERSION_VALUE
};