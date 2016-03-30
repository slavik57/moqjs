"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ItIsBase_1 = require('./ItIsBase');
var ItIs = (function (_super) {
    __extends(ItIs, _super);
    function ItIs(predicate) {
        _super.call(this);
        this.predicate = predicate;
    }
    ItIs.prototype.match = function (argument) {
        return this.predicate(argument);
    };
    return ItIs;
}(ItIsBase_1.ItIsBase));
exports.ItIs = ItIs;
