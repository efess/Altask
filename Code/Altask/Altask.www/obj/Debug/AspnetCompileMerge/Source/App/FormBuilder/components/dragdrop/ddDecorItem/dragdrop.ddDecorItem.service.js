const DRAG_DROP_ITEM_DECOR_SERVICE = 'dragDropItemDecorationService';

class dragDropItemDecorationService {
    constructor(FormBuilderConfig) {
        this.FormBuilderConfig = FormBuilderConfig;
        this.init();
    }

    init() {
        this._listItemClass = [].concat(this.FormBuilderConfig.getListItemCssClass());
    }

    getListClass() {
        return this._listItemClass;
    }

    getCssClassWhenNumberItemsInRowIs(thisNumber) {
        return this.FormBuilderConfig.cssClassFromColumns(thisNumber);
    }

    applyCssClassWholeLine(model, indexColumn, indexLine, numberItems, restrictToThisIndexColumn) {
        if (typeof numberItems !== 'undefined' &&
            typeof indexLine !== 'undefined' &&
            typeof indexColumn !== 'undefined' &&
            typeof model !== 'undefined' &&
            typeof restrictToThisIndexColumn !== 'undefined') {
            if (indexColumn === restrictToThisIndexColumn) {
                for (let i = model[indexColumn][indexLine].length - 1; i >= 0; i--) {
                    model[indexColumn][indexLine][i].cssClass = this.FormBuilderConfig.cssClassFromColumns(numberItems);
                }
            }
            return true;
        } else {
            return false;
        }
    }

    updateCssClassWholeColumn(model, indexColumn) {
        if (typeof indexColumn !== 'undefined' &&
            typeof model !== 'undefined') {
            for (let cpt = model[indexColumn].length - 1; cpt >= 0; cpt--) {
                for (let i = model[indexColumn][cpt].length - 1; i >= 0; i--) {
                    model[indexColumn][cpt][i].cssClass = this.FormBuilderConfig.cssClassFromColumns(model[indexColumn][cpt].length);
                }
            }
            return true;
        } else {
            return false;
        }
    }


}

dragDropItemDecorationService.$inject = [
    'FormBuilderConfig'
];

export default dragDropItemDecorationService;

export {
    DRAG_DROP_ITEM_DECOR_SERVICE
};