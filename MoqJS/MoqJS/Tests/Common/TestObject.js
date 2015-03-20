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
            return 1;
        };
        return TestObject;
    })();
    Tests.TestObject = TestObject;
})(Tests || (Tests = {}));
//# sourceMappingURL=TestObject.js.map
