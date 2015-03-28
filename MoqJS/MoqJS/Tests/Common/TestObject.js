'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Tests;
(function (Tests) {
    var TestObject = (function () {
        function TestObject() {
        }
        TestObject.staticFunction = function () {
            if (this.staticFunctionCalled) {
                this.staticFunctionCalled();
            }
        };

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

    var TestObjectSon = (function (_super) {
        __extends(TestObjectSon, _super);
        function TestObjectSon() {
            _super.apply(this, arguments);
        }
        return TestObjectSon;
    })(TestObject);
    Tests.TestObjectSon = TestObjectSon;
})(Tests || (Tests = {}));
//# sourceMappingURL=TestObject.js.map
