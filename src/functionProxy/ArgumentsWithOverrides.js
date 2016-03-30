"use strict";
var ArgumentsWithOverrides = (function () {
    function ArgumentsWithOverrides(exptectedArguments, override) {
        this.exptectedArguments = exptectedArguments;
        this.override = override;
    }
    return ArgumentsWithOverrides;
}());
exports.ArgumentsWithOverrides = ArgumentsWithOverrides;
