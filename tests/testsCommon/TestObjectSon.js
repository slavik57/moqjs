"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TestObject_1 = require('./TestObject');
var TestObjectSon = (function (_super) {
    __extends(TestObjectSon, _super);
    function TestObjectSon() {
        _super.apply(this, arguments);
    }
    return TestObjectSon;
}(TestObject_1.TestObject));
exports.TestObjectSon = TestObjectSon;
