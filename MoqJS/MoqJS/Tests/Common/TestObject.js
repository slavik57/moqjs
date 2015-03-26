'use strict';
var Tests;
(function (Tests) {
    var TestObject = (function () {
        function TestObject() {
        }
        TestObject.prototype.noArgumentsFunction = function () {
            if (this.onNoArgumentsFunctionCalled) {
                this.onNoArgumentsFunctionCalled();
            }
        };

        TestObject.prototype.oneArgumentsFunction = function (arg1) {
            if (this.onOneArgumentsFunctionCalled) {
                this.onOneArgumentsFunctionCalled(arg1);
            }
        };

        TestObject.prototype.manyArgumentsFunction = function (arg1, arg2, arg3) {
            if (this.onManyArgumentsFunctionCalled) {
                this.onManyArgumentsFunctionCalled(arg1, arg2, arg3);
            }
        };

        TestObject.prototype.returning1Function = function () {
            if (this.onReturnung1FunctionCalled) {
                this.onReturnung1FunctionCalled();
            }

            return 1;
        };

        TestObject.prototype.callPrivateFunction = function (arg1) {
            return this._privateFunction(arg1);
        };

        TestObject.prototype._privateFunction = function (arg1) {
            if (this.onPrivateFunctionCalled) {
                this.onPrivateFunctionCalled(arg1);
            }

            return 1;
        };
        TestObject.PRIVATE_FUNCTION_NAME = '_privateFunction';
        return TestObject;
    })();
    Tests.TestObject = TestObject;
})(Tests || (Tests = {}));
//# sourceMappingURL=TestObject.js.map
