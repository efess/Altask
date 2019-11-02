export class Logger {
    constructor() {
        this.DEBUG = true;
    }

    error(data) {
        this.DEBUG && console.error(data);
    }

    debug(data) {
        this.DEBUG && console.log(data);
    };

    warn(data) {
        this.DEBUG && console.warn(data);
    }
}

