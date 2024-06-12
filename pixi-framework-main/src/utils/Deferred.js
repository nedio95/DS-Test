export default class Deferred {
    promise;
    resolve = () => null;
    reject = () => null;
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}
//# sourceMappingURL=Deferred.js.map