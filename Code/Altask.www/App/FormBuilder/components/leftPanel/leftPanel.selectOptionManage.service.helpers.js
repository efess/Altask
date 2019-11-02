const resetOptions = (options) => {
    let empty = {
        rows: []
    };
    angular.copy(empty, options);
};

const validateOption = (options, option) => {
    let response = {
        resultFlag: false,
        details: ''
    };

    if (option !== '') {
        for (var i = options.rows.length - 1; i >= 0; i--) {
            if (options.rows[i].option === option) {
                response.resultFlag = false;
                response.details = 'Entered option is not unique';
                return response;
            }
        }
        response.resultFlag = true;
        response.details = '';
        return response;
    }

    response.resultFlag = false;
    response.details = 'Entered option is empty';
    return response;
};

export {
    resetOptions,
    validateOption
};