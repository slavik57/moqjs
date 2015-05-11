'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var moqJS;
(function (moqJS) {
    var InvokeFunctionCallMode = (function () {
        function InvokeFunctionCallMode() {
        }
        return InvokeFunctionCallMode;
    })();
    moqJS.InvokeFunctionCallMode = InvokeFunctionCallMode;
    var VerifyFunctionCallMode = (function () {
        function VerifyFunctionCallMode() {
            this.numberOfMatches = 0;
        }
        return VerifyFunctionCallMode;
    })();
    moqJS.VerifyFunctionCallMode = VerifyFunctionCallMode;
    var OverrideFunctionCallMode = (function () {
        function OverrideFunctionCallMode(override) {
            this.override = override;
        }
        return OverrideFunctionCallMode;
    })();
    moqJS.OverrideFunctionCallMode = OverrideFunctionCallMode;
    var ReturnsOverrideFunctionCallMode = (function (_super) {
        __extends(ReturnsOverrideFunctionCallMode, _super);
        function ReturnsOverrideFunctionCallMode(getReturnValue) {
            _super.call(this, getReturnValue);
            this.getReturnValue = getReturnValue;
        }
        return ReturnsOverrideFunctionCallMode;
    })(OverrideFunctionCallMode);
    moqJS.ReturnsOverrideFunctionCallMode = ReturnsOverrideFunctionCallMode;
    var ThrowsOverrideFunctionCallMode = (function (_super) {
        __extends(ThrowsOverrideFunctionCallMode, _super);
        function ThrowsOverrideFunctionCallMode(getErrorToThrow) {
            _super.call(this, getErrorToThrow);
            this.getErrorToThrow = getErrorToThrow;
        }
        return ThrowsOverrideFunctionCallMode;
    })(OverrideFunctionCallMode);
    moqJS.ThrowsOverrideFunctionCallMode = ThrowsOverrideFunctionCallMode;
    var CallbackOverrideFunctionCallMode = (function (_super) {
        __extends(CallbackOverrideFunctionCallMode, _super);
        function CallbackOverrideFunctionCallMode(callbackFunction) {
            _super.call(this, callbackFunction);
            this.callbackFunction = callbackFunction;
        }
        return CallbackOverrideFunctionCallMode;
    })(OverrideFunctionCallMode);
    moqJS.CallbackOverrideFunctionCallMode = CallbackOverrideFunctionCallMode;
})(moqJS || (moqJS = {}));
'use strict';
var moqJS;
(function (moqJS) {
    var ArgumentsWithOverrides = (function () {
        function ArgumentsWithOverrides(exptectedArguments, override) {
            this.exptectedArguments = exptectedArguments;
            this.override = override;
        }
        return ArgumentsWithOverrides;
    })();
    var FunctionExecutionResult;
    (function (FunctionExecutionResult) {
        FunctionExecutionResult[FunctionExecutionResult["ThrowError"] = 0] = "ThrowError";
        FunctionExecutionResult[FunctionExecutionResult["ReturnValue"] = 1] = "ReturnValue";
        FunctionExecutionResult[FunctionExecutionResult["DoNothing"] = 2] = "DoNothing";
    })(FunctionExecutionResult || (FunctionExecutionResult = {}));
    var FunctionProxy = (function () {
        function FunctionProxy(originalFunctionName, originalFunction, thisObject, functionProxyConfigurations) {
            this.originalFunctionName = originalFunctionName;
            this.originalFunction = originalFunction;
            this.thisObject = thisObject;
            this.functionProxyConfigurations = functionProxyConfigurations;
            this._numberOfTimesCalled = 0;
            this._actualArguments = [];
            this._argumentsWithOverridesList = [];
        }
        FunctionProxy.prototype.callFunction = function (args) {
            if (this.functionProxyConfigurations.functionCallMode instanceof moqJS.InvokeFunctionCallMode) {
                return this._callFunctionWithoutVerification(args);
            }
            else if (this.functionProxyConfigurations.functionCallMode instanceof moqJS.OverrideFunctionCallMode) {
                this._addOverride(args, this.functionProxyConfigurations.functionCallMode);
            }
            else if (this.functionProxyConfigurations.functionCallMode instanceof moqJS.VerifyFunctionCallMode) {
                this._verifyFunction(args, this.functionProxyConfigurations.functionCallMode);
            }
            else {
                throw 'not supported functionCallMode';
            }
        };
        FunctionProxy.prototype._callFunctionWithoutVerification = function (actualArguments) {
            this._numberOfTimesCalled++;
            this._actualArguments.push(actualArguments);
            var matchingOverrides = this._getMatchingOverrides(actualArguments);
            if (matchingOverrides.length > 0) {
                var returnValue = this._executeOverrides(matchingOverrides, actualArguments);
                return this._moleReturnValueIfNeeded(returnValue);
            }
            if (this.functionProxyConfigurations.isStrict) {
                throw 'No function setups defined and using strict mode. Change "isStrict" to false or define a function setup';
            }
            if (this.functionProxyConfigurations.callBase) {
                var returnValue = this.originalFunction.apply(this.thisObject, actualArguments);
                return this._moleReturnValueIfNeeded(returnValue);
            }
        };
        FunctionProxy.prototype._getMatchingOverrides = function (actualArguments) {
            var result = [];
            for (var i = 0; i < this._argumentsWithOverridesList.length; i++) {
                var argumentsWithOverrides = this._argumentsWithOverridesList[i];
                if (this._doArgumentsMatch(argumentsWithOverrides.exptectedArguments, actualArguments)) {
                    result.push(argumentsWithOverrides.override);
                }
            }
            return result;
        };
        FunctionProxy.prototype._executeOverrides = function (overrides, args) {
            var functionExecutionResult = 2 /* DoNothing */;
            var lastError;
            var lastResult;
            for (var i = 0; i < overrides.length; i++) {
                var override = overrides[i];
                if (override instanceof moqJS.ThrowsOverrideFunctionCallMode) {
                    functionExecutionResult = 0 /* ThrowError */;
                    lastError = override.override.apply(this.thisObject, args);
                    continue;
                }
                if (override instanceof moqJS.ReturnsOverrideFunctionCallMode) {
                    functionExecutionResult = 1 /* ReturnValue */;
                    lastResult = override.override.apply(this.thisObject, args);
                    continue;
                }
                if (override instanceof moqJS.CallbackOverrideFunctionCallMode) {
                    override.override.apply(this.thisObject, args);
                    continue;
                }
            }
            switch (functionExecutionResult) {
                case 1 /* ReturnValue */:
                    return lastResult;
                case 0 /* ThrowError */:
                    throw lastError;
            }
        };
        FunctionProxy.prototype._verifyFunction = function (expectedArguments, verifyFunctionCallMode) {
            for (var i = 0; i < this._actualArguments.length; i++) {
                var actualArguments = this._actualArguments[i];
                if (this._doArgumentsMatch(expectedArguments, actualArguments)) {
                    verifyFunctionCallMode.numberOfMatches++;
                }
            }
        };
        FunctionProxy.prototype._doArgumentsMatch = function (expectedArguments, actualArguments) {
            if (expectedArguments.length !== actualArguments.length) {
                return false;
            }
            if (expectedArguments.length === 0) {
                return true;
            }
            for (var i = 0; i < expectedArguments.length; i++) {
                if (!this._isSameArgument(actualArguments[i], expectedArguments[i])) {
                    return false;
                }
            }
            return true;
        };
        FunctionProxy.prototype._isSameArgument = function (actual, expected) {
            var itIsItIsBase = moqJS.It.isAny(moqJS.ItIsBase);
            if (!itIsItIsBase.match(expected)) {
                return actual === expected;
            }
            var expectedItIsBase = expected;
            return expectedItIsBase.match(actual);
        };
        FunctionProxy.prototype._addOverride = function (expectedArguments, overrideMode) {
            var argumentsWithOverrides = new ArgumentsWithOverrides(expectedArguments, overrideMode);
            this._argumentsWithOverridesList.push(argumentsWithOverrides);
        };
        FunctionProxy.prototype._moleReturnValueIfNeeded = function (returnValue) {
            if (this.functionProxyConfigurations.moleReturnValue) {
                var mole = new moqJS.Mole(returnValue);
                mole.moleReturnValue = true;
            }
            return returnValue;
        };
        return FunctionProxy;
    })();
    moqJS.FunctionProxy = FunctionProxy;
})(moqJS || (moqJS = {}));
'use strict';
var moqJS;
(function (moqJS) {
    var FunctionProxyConfigurations = (function () {
        function FunctionProxyConfigurations() {
            this.callBase = true;
            this.isStrict = false;
            this.moleReturnValue = false;
            this.functionCallMode = new moqJS.InvokeFunctionCallMode();
        }
        return FunctionProxyConfigurations;
    })();
    moqJS.FunctionProxyConfigurations = FunctionProxyConfigurations;
})(moqJS || (moqJS = {}));
'use strict';
var moqJS;
(function (moqJS) {
    var FunctionSetup = (function () {
        function FunctionSetup(functionCall, object, functionProxyConfigurations) {
            this.functionCall = functionCall;
            this.object = object;
            this.functionProxyConfigurations = functionProxyConfigurations;
        }
        FunctionSetup.prototype.lazyReturns = function (returnFunction) {
            var _this = this;
            var overrideMode = new moqJS.ReturnsOverrideFunctionCallMode(function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return returnFunction.apply(_this.object, args);
            });
            return this._callWithOverrideMode(overrideMode);
        };
        FunctionSetup.prototype.lazyReturnsInOrder = function (returnFunctions) {
            var _this = this;
            // NOTE: Clone to keep all given values and not change the orinial array
            var functions = returnFunctions.map(function (func) { return func; });
            var overrideMode = new moqJS.ReturnsOverrideFunctionCallMode(function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                if (functions.length < 1) {
                    return undefined;
                }
                var firstFunction = functions.shift();
                return firstFunction.apply(_this.object, args);
            });
            return this._callWithOverrideMode(overrideMode);
        };
        FunctionSetup.prototype.returns = function (value) {
            var overrideMode = new moqJS.ReturnsOverrideFunctionCallMode(function () {
                return value;
            });
            return this._callWithOverrideMode(overrideMode);
        };
        FunctionSetup.prototype.returnsInOrder = function (values) {
            var itemsToReturnFunctions = values.map(function (value) {
                return function () { return value; };
            });
            return this.lazyReturnsInOrder(itemsToReturnFunctions);
        };
        FunctionSetup.prototype.callback = function (callback) {
            var _this = this;
            var overrideMode = new moqJS.CallbackOverrideFunctionCallMode(function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                callback.apply(_this.object, args);
            });
            return this._callWithOverrideMode(overrideMode);
        };
        FunctionSetup.prototype.lazyThrows = function (errorReturningFunction) {
            var _this = this;
            var overrideMode = new moqJS.ThrowsOverrideFunctionCallMode(function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return errorReturningFunction.apply(_this.object, args);
            });
            return this._callWithOverrideMode(overrideMode);
        };
        FunctionSetup.prototype.throws = function (error) {
            return this.lazyThrows(function () { return error; });
        };
        FunctionSetup.prototype._callWithOverrideMode = function (overrideMode) {
            this.functionProxyConfigurations.functionCallMode = overrideMode;
            this.functionCall(this.object);
            this.functionProxyConfigurations.functionCallMode = new moqJS.InvokeFunctionCallMode();
            return this;
        };
        return FunctionSetup;
    })();
    moqJS.FunctionSetup = FunctionSetup;
})(moqJS || (moqJS = {}));
'use strict';
var moqJS;
(function (moqJS) {
    var ItIsBase = (function () {
        function ItIsBase() {
        }
        ItIsBase.prototype.match = function (argument) {
            return false;
        };
        return ItIsBase;
    })();
    moqJS.ItIsBase = ItIsBase;
    var ItIsAny = (function (_super) {
        __extends(ItIsAny, _super);
        function ItIsAny(expectedType) {
            _super.call(this);
            this.expectedType = expectedType;
        }
        ItIsAny.prototype.match = function (argument) {
            if (argument === null || argument === undefined) {
                return false;
            }
            return argument.constructor === this.expectedType || argument instanceof this.expectedType;
        };
        return ItIsAny;
    })(ItIsBase);
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
    })(ItIsBase);
    var ItIsInRange = (function (_super) {
        __extends(ItIsInRange, _super);
        function ItIsInRange(minimumValue, maximumValue) {
            _super.call(this);
            this.minimumValue = minimumValue;
            this.maximumValue = maximumValue;
        }
        ItIsInRange.prototype.match = function (argument) {
            if (isNaN(argument)) {
                return false;
            }
            return this.minimumValue <= argument && argument <= this.maximumValue;
        };
        return ItIsInRange;
    })(ItIsBase);
    var ItIsRegex = (function (_super) {
        __extends(ItIsRegex, _super);
        function ItIsRegex(regExp) {
            _super.call(this);
            this.regExp = regExp;
        }
        ItIsRegex.prototype.match = function (argument) {
            if (!this._isString(argument)) {
                return false;
            }
            return this.regExp.test(argument);
        };
        ItIsRegex.prototype._isString = function (argument) {
            var isString = new ItIsAny(String);
            return isString.match(argument);
        };
        return ItIsRegex;
    })(ItIsBase);
    var It = (function () {
        function It() {
        }
        It.isAny = function (type) {
            return new ItIsAny(type);
        };
        It.is = function (predicate) {
            return new ItIs(predicate);
        };
        It.isInRange = function (minimumValue, maximumValue) {
            return new ItIsInRange(minimumValue, maximumValue);
        };
        It.isRegExp = function (regExp) {
            return new ItIsRegex(regExp);
        };
        return It;
    })();
    moqJS.It = It;
})(moqJS || (moqJS = {}));
'use strict';
var moqJS;
(function (moqJS) {
    // TODO: mole the returning value if the behavior is set
    var Mole = (function () {
        function Mole(object) {
            this.object = object;
            this._FunctionProxyConfigurations = new moqJS.FunctionProxyConfigurations();
            this._FunctionProxyConfigurations.callBase = true;
            this._setFunctionProxies();
            this._setPropertiesProxies();
            Mole._moles.push(this);
        }
        Mole.prototype.dispose = function () {
            for (var i = 0; i < this._functionProxies.length; i++) {
                var proxy = this._functionProxies[i];
                this.object[proxy.originalFunctionName] = proxy.originalFunction;
            }
            for (var i = 0; i < this._propertyGetterProxies.length; i++) {
                var proxy = this._propertyGetterProxies[i];
                var descriptor = this._getPropertyDescriptor(this.object, proxy.originalFunctionName);
                descriptor.get = proxy.originalFunction;
                this._setProperty(this.object, proxy.originalFunctionName, descriptor);
            }
            for (var i = 0; i < this._propertySetterProxies.length; i++) {
                var proxy = this._propertySetterProxies[i];
                var descriptor = this._getPropertyDescriptor(this.object, proxy.originalFunctionName);
                descriptor.set = proxy.originalFunction;
                this._setProperty(this.object, proxy.originalFunctionName, descriptor);
            }
            var thisMoleIndex = Mole._moles.indexOf(this);
            Mole._moles.splice(thisMoleIndex, 1);
        };
        Object.defineProperty(Mole.prototype, "callBase", {
            get: function () {
                return this._FunctionProxyConfigurations.callBase;
            },
            set: function (value) {
                this._FunctionProxyConfigurations.callBase = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mole.prototype, "isStrict", {
            get: function () {
                return this._FunctionProxyConfigurations.isStrict;
            },
            set: function (value) {
                this._FunctionProxyConfigurations.isStrict = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Mole.prototype, "moleReturnValue", {
            get: function () {
                return this._FunctionProxyConfigurations.moleReturnValue;
            },
            set: function (value) {
                this._FunctionProxyConfigurations.moleReturnValue = value;
            },
            enumerable: true,
            configurable: true
        });
        Mole.prototype.setup = function (functionCall) {
            return new moqJS.FunctionSetup(functionCall, this.object, this._FunctionProxyConfigurations);
        };
        Mole.prototype.setupPrivate = function (privatePropertyName) {
            var functionArguments = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                functionArguments[_i - 1] = arguments[_i];
            }
            var descriptor = this._getPropertyDescriptor(this.object, privatePropertyName);
            if (descriptor.value) {
                return this.setup(function (object) {
                    var privateFunction = object[privatePropertyName];
                    privateFunction.apply(object, functionArguments);
                });
            }
            if (functionArguments.length < 1 && descriptor.get) {
                return this.setup(function (object) {
                    descriptor.get.apply(object, functionArguments);
                });
            }
            if (functionArguments.length === 1 && descriptor.set) {
                return this.setup(function (object) {
                    descriptor.set.apply(object, functionArguments);
                });
            }
            throw 'Should be an existing function/getter/setter with appropriate number of arguments';
        };
        Mole.prototype.verify = function (functionCall, times) {
            var verifyMode = new moqJS.VerifyFunctionCallMode();
            this._FunctionProxyConfigurations.functionCallMode = verifyMode;
            functionCall(this.object);
            this._FunctionProxyConfigurations.functionCallMode = new moqJS.InvokeFunctionCallMode();
            var numberOfMatches = verifyMode.numberOfMatches;
            if (!times) {
                return numberOfMatches > 0;
            }
            return times.match(numberOfMatches);
        };
        Mole.prototype.verifyPrivate = function (privateFunctionName, functionArguments, times) {
            var functionCall = function (object) {
                var privateFunction = object[privateFunctionName];
                privateFunction.apply(object, functionArguments);
            };
            return this.verify(functionCall, times);
        };
        Mole.findMoleByObject = function (object) {
            if (object === null || object === undefined) {
                return null;
            }
            for (var i = 0; i < Mole._moles.length; i++) {
                var mole = Mole._moles[i];
                if (mole.object === object) {
                    return mole;
                }
            }
            return null;
        };
        Mole.prototype._setFunctionProxies = function () {
            this._functionProxies = [];
            var propertyNames = this._getObjectPropertyNames();
            for (var i = 0; i < propertyNames.length; i++) {
                try {
                    var propertyName = propertyNames[i];
                    var descriptor = this._getPropertyDescriptor(this.object, propertyName);
                    var propertyValue = descriptor.value;
                    if (typeof (propertyValue) != "function") {
                        continue;
                    }
                    var functionProxy = new moqJS.FunctionProxy(propertyName, propertyValue, this.object, this._FunctionProxyConfigurations);
                    this._functionProxies.push(functionProxy);
                    this._setFunctionProxy(this._functionProxies, this._functionProxies.length - 1, propertyName);
                }
                catch (e) {
                }
            }
        };
        Mole.prototype._getObjectPropertyNames = function () {
            var propertyNames = Object.getOwnPropertyNames(this.object);
            for (var propertyName in this.object) {
                if (propertyNames.lastIndexOf(propertyName) < 0) {
                    propertyNames.push(propertyName);
                }
            }
            return propertyNames;
        };
        Mole.prototype._setFunctionProxy = function (proxies, proxyNumber, functionName) {
            this.object[functionName] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return proxies[proxyNumber].callFunction(args);
            };
        };
        Mole.prototype._setPropertiesProxies = function () {
            this._propertyGetterProxies = [];
            this._propertySetterProxies = [];
            var propertyNames = this._getObjectPropertyNames();
            for (var i = 0; i < propertyNames.length; i++) {
                try {
                    var propertyName = propertyNames[i];
                    var descriptor = this._getPropertyDescriptor(this.object, propertyName);
                    if (!descriptor) {
                        continue;
                    }
                    if (descriptor.get) {
                        this._setPropertyGetterProxy(propertyName, descriptor);
                    }
                    if (descriptor.set) {
                        this._setPropertySetterProxy(propertyName, descriptor);
                    }
                    if (descriptor.get || descriptor.set) {
                        this._setProperty(this.object, propertyName, descriptor);
                    }
                }
                catch (e) {
                }
            }
        };
        Mole.prototype._getPropertyDescriptor = function (obj, propertyName) {
            var descriptor = Object.getOwnPropertyDescriptor(obj, propertyName);
            if (descriptor) {
                return descriptor;
            }
            if (!obj.__proto__) {
                return undefined;
            }
            return this._getPropertyDescriptor(obj.__proto__, propertyName);
        };
        Mole.prototype._setProperty = function (obj, propertyName, propertyDescriptor) {
            Object.defineProperty(obj, propertyName, propertyDescriptor);
        };
        Mole.prototype._setPropertyGetterProxy = function (propertyName, descriptor) {
            var functionProxy = new moqJS.FunctionProxy(propertyName, descriptor.get, this.object, this._FunctionProxyConfigurations);
            this._propertyGetterProxies.push(functionProxy);
            descriptor.get = function () { return functionProxy.callFunction([]); };
        };
        Mole.prototype._setPropertySetterProxy = function (propertyName, descriptor) {
            var functionProxy = new moqJS.FunctionProxy(propertyName, descriptor.set, this.object, this._FunctionProxyConfigurations);
            this._propertySetterProxies.push(functionProxy);
            descriptor.set = function (value) { return functionProxy.callFunction([value]); };
        };
        Mole._moles = [];
        return Mole;
    })();
    moqJS.Mole = Mole;
})(moqJS || (moqJS = {}));
'use strict';
var moqJS;
(function (moqJS) {
    var TimesBase = (function () {
        function TimesBase(expected) {
            this.expected = expected;
        }
        TimesBase.prototype.match = function (actual) {
            return false;
        };
        return TimesBase;
    })();
    var LessTimes = (function (_super) {
        __extends(LessTimes, _super);
        function LessTimes(expected) {
            _super.call(this, expected);
        }
        LessTimes.prototype.match = function (actual) {
            return actual < this.expected;
        };
        return LessTimes;
    })(TimesBase);
    var AtMostTimes = (function (_super) {
        __extends(AtMostTimes, _super);
        function AtMostTimes(expected) {
            _super.call(this, expected);
        }
        AtMostTimes.prototype.match = function (actual) {
            return actual <= this.expected;
        };
        return AtMostTimes;
    })(TimesBase);
    var ExactTimes = (function (_super) {
        __extends(ExactTimes, _super);
        function ExactTimes(expected) {
            _super.call(this, expected);
        }
        ExactTimes.prototype.match = function (actual) {
            return actual === this.expected;
        };
        return ExactTimes;
    })(TimesBase);
    var AtLeastTimes = (function (_super) {
        __extends(AtLeastTimes, _super);
        function AtLeastTimes(expected) {
            _super.call(this, expected);
        }
        AtLeastTimes.prototype.match = function (actual) {
            return actual >= this.expected;
        };
        return AtLeastTimes;
    })(TimesBase);
    var MoreTimes = (function (_super) {
        __extends(MoreTimes, _super);
        function MoreTimes(expected) {
            _super.call(this, expected);
        }
        MoreTimes.prototype.match = function (actual) {
            return actual > this.expected;
        };
        return MoreTimes;
    })(TimesBase);
    var BetweenTimes = (function () {
        function BetweenTimes(minimumExpected, maximumExpected) {
            this.minimumExpected = minimumExpected;
            this.maximumExpected = maximumExpected;
        }
        BetweenTimes.prototype.match = function (actual) {
            if (actual < this.minimumExpected) {
                return false;
            }
            if (actual > this.maximumExpected) {
                return false;
            }
            return true;
        };
        return BetweenTimes;
    })();
    var Times = (function () {
        function Times() {
        }
        Times.lessThan = function (expected) {
            return new LessTimes(expected);
        };
        Times.atMost = function (expected) {
            return new AtMostTimes(expected);
        };
        Times.exact = function (expected) {
            return new ExactTimes(expected);
        };
        Times.atLeast = function (expected) {
            return new AtLeastTimes(expected);
        };
        Times.moreThan = function (expected) {
            return new MoreTimes(expected);
        };
        Times.between = function (minimum, maximum) {
            return new BetweenTimes(minimum, maximum);
        };
        return Times;
    })();
    moqJS.Times = Times;
})(moqJS || (moqJS = {}));
//# sourceMappingURL=MoqJS.js.map