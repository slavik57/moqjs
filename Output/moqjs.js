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
            } else if (this.functionProxyConfigurations.functionCallMode instanceof moqJS.OverrideFunctionCallMode) {
                this._addOverride(args, this.functionProxyConfigurations.functionCallMode);
            } else if (this.functionProxyConfigurations.functionCallMode instanceof moqJS.VerifyFunctionCallMode) {
                this._verifyFunction(args, this.functionProxyConfigurations.functionCallMode);
            } else {
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
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                return returnFunction.apply(_this.object, args);
            });

            return this._callWithOverrideMode(overrideMode);
        };

        FunctionSetup.prototype.lazyReturnsInOrder = function (returnFunctions) {
            var _this = this;
            // NOTE: Clone to keep all given values and not change the orinial array
            var functions = returnFunctions.map(function (func) {
                return func;
            });

            var overrideMode = new moqJS.ReturnsOverrideFunctionCallMode(function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
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
                return function () {
                    return value;
                };
            });

            return this.lazyReturnsInOrder(itemsToReturnFunctions);
        };

        FunctionSetup.prototype.callback = function (callback) {
            var _this = this;
            var overrideMode = new moqJS.CallbackOverrideFunctionCallMode(function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                callback.apply(_this.object, args);
            });

            return this._callWithOverrideMode(overrideMode);
        };

        FunctionSetup.prototype.lazyThrows = function (errorReturningFunction) {
            var _this = this;
            var overrideMode = new moqJS.ThrowsOverrideFunctionCallMode(function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                return errorReturningFunction.apply(_this.object, args);
            });

            return this._callWithOverrideMode(overrideMode);
        };

        FunctionSetup.prototype.throws = function (error) {
            return this.lazyThrows(function () {
                return error;
            });
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
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                functionArguments[_i] = arguments[_i + 1];
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
                try  {
                    var propertyName = propertyNames[i];
                    var descriptor = this._getPropertyDescriptor(this.object, propertyName);

                    var propertyValue = descriptor.value;

                    if (typeof (propertyValue) != "function") {
                        continue;
                    }

                    var functionProxy = new moqJS.FunctionProxy(propertyName, propertyValue, this.object, this._FunctionProxyConfigurations);
                    this._functionProxies.push(functionProxy);

                    this._setFunctionProxy(this._functionProxies, this._functionProxies.length - 1, propertyName);
                } catch (e) {
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
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                return proxies[proxyNumber].callFunction(args);
            };
        };

        Mole.prototype._setPropertiesProxies = function () {
            this._propertyGetterProxies = [];
            this._propertySetterProxies = [];

            var propertyNames = this._getObjectPropertyNames();

            for (var i = 0; i < propertyNames.length; i++) {
                try  {
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
                } catch (e) {
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

            descriptor.get = function () {
                return functionProxy.callFunction([]);
            };
        };

        Mole.prototype._setPropertySetterProxy = function (propertyName, descriptor) {
            var functionProxy = new moqJS.FunctionProxy(propertyName, descriptor.set, this.object, this._FunctionProxyConfigurations);
            this._propertySetterProxies.push(functionProxy);

            descriptor.set = function (value) {
                return functionProxy.callFunction([value]);
            };
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
'use strict';
var Tests;
(function (Tests) {
    var TestObject = (function () {
        function TestObject() {
        }
        TestObject.prototype.complexReturnFunction = function () {
            return new TestObject();
        };

        Object.defineProperty(TestObject.prototype, "complexGetterFunction", {
            get: function () {
                return new TestObject();
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(TestObject.prototype, "getter", {
            get: function () {
                if (this.onGetterCalled) {
                    this.onGetterCalled();
                }

                return this.getterValue;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(TestObject.prototype, "setter", {
            set: function (value) {
                this.setterValue = value;

                if (this.onSetterCalled) {
                    this.onSetterCalled(value);
                }
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(TestObject.prototype, "getterAndSetter", {
            get: function () {
                if (this.onGetterOfGetterAndSetterCalled) {
                    this.onGetterOfGetterAndSetterCalled();
                }

                return this.getterAndSetterValue;
            },
            set: function (value) {
                this.getterAndSetterValue = value;

                if (this.onSetterOfGetterAndSetterCalled) {
                    this.onSetterOfGetterAndSetterCalled(value);
                }
            },
            enumerable: true,
            configurable: true
        });


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

        TestObject.prototype.callPrivateGetter = function () {
            return this._privateGetter;
        };

        TestObject.prototype.callPrivateSetter = function (value) {
            this._privateSetter = value;
        };

        TestObject.prototype.callPrivateGetterOfGetterAndSetter = function () {
            return this._privateGetterAndSetter;
        };

        TestObject.prototype.callPrivateSetterOfGetterAndSetter = function (value) {
            this._privateGetterAndSetter = value;
        };

        Object.defineProperty(TestObject.prototype, "_privateGetter", {
            get: function () {
                if (this.onPrivateGetterCalled) {
                    this.onPrivateGetterCalled();
                }

                return this.privateGetterValue;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(TestObject.prototype, "_privateSetter", {
            set: function (value) {
                this.privateSetterValue = value;

                if (this.onPrivateSetterCalled) {
                    this.onPrivateSetterCalled(value);
                }
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(TestObject.prototype, "_privateGetterAndSetter", {
            get: function () {
                if (this.onPrivateGetterOfGetterAndSetterCalled) {
                    this.onPrivateGetterOfGetterAndSetterCalled();
                }

                return this.privateGetterAndSetterValue;
            },
            set: function (value) {
                this.privateGetterAndSetterValue = value;

                if (this.onPrivateSetterOfGetterAndSetterCalled) {
                    this.onPrivateSetterOfGetterAndSetterCalled(value);
                }
            },
            enumerable: true,
            configurable: true
        });

        TestObject.PRIVATE_FUNCTION_NAME = '_privateFunction';
        TestObject.PRIVATE_GETTER_NAME = '_privateGetter';
        TestObject.PRIVATE_SETTER_NAME = '_privateSetter';
        TestObject.PRIVATE_GETTER_AND_SETTER_NAME = '_privateGetterAndSetter';
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
'use strict';
var Tests;
(function (Tests) {
    var ItIsBase = moqJS.ItIsBase;
    var It = moqJS.It;
    var FunctionProxyConfigurations = moqJS.FunctionProxyConfigurations;
    var FunctionProxy = moqJS.FunctionProxy;
    var VerifyFunctionCallMode = moqJS.VerifyFunctionCallMode;

    var CallbackOverrideFunctionCallMode = moqJS.CallbackOverrideFunctionCallMode;
    var ReturnsOverrideFunctionCallMode = moqJS.ReturnsOverrideFunctionCallMode;
    var ThrowsOverrideFunctionCallMode = moqJS.ThrowsOverrideFunctionCallMode;
    var InvokeFunctionCallMode = moqJS.InvokeFunctionCallMode;

    var FunctionProxyLifecycleObject = (function () {
        function FunctionProxyLifecycleObject() {
            this.beforeEach = function () {
                var context = this;

                context.thisObject = new Tests.TestObject();
                context.functionProxyConfigurations = new FunctionProxyConfigurations();

                context.noArgsFunctionProxy = new FunctionProxy('noArgumentsFunction', context.thisObject.noArgumentsFunction, context.thisObject, context.functionProxyConfigurations);

                context.oneArgsFunctionProxy = new FunctionProxy('oneArgumentsFunction', context.thisObject.oneArgumentsFunction, context.thisObject, context.functionProxyConfigurations);

                context.manyArgsFunctionProxy = new FunctionProxy('manyArgumentsFunction', context.thisObject.manyArgumentsFunction, context.thisObject, context.functionProxyConfigurations);

                context.returning1FunctionProxy = new FunctionProxy('returning1Function', context.thisObject.returning1Function, context.thisObject, context.functionProxyConfigurations);
            };
            this.afterEach = function () {
            };
            this.setVerifyMode = function () {
                var context = this;

                var verifyFunctionCallMode = new VerifyFunctionCallMode();

                context.functionProxyConfigurations.functionCallMode = verifyFunctionCallMode;

                return verifyFunctionCallMode;
            };
            this.setInvokeMode = function () {
                var context = this;

                var invokeFunctionCallMode = new InvokeFunctionCallMode();

                context.functionProxyConfigurations.functionCallMode = invokeFunctionCallMode;
            };
        }
        return FunctionProxyLifecycleObject;
    })();

    QUnit.module('FunctionProxy', new FunctionProxyLifecycleObject());

    QUnit.test('constructor - should initialize correctly', function (assert) {
        QUnit.expect(3);

        // Arrange
        var originalFunction = new Function();
        var thisObject = {};
        var functionProxyConfigurations = new FunctionProxyConfigurations();

        // Act
        var proxy = new FunctionProxy('originalFunction', originalFunction, thisObject, functionProxyConfigurations);

        // Assert
        assert.strictEqual(proxy.thisObject, thisObject);
        assert.strictEqual(proxy.originalFunction, originalFunction);
        assert.strictEqual(proxy.functionProxyConfigurations, functionProxyConfigurations);
    });

    QUnit.test('callbase - set to true, should call the original function', 1, function (assert) {
        // Arrange
        var context = this;

        context.functionProxyConfigurations.callBase = true;

        context.thisObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(true, 'should call original function');
        };

        // Act
        context.noArgsFunctionProxy.callFunction([]);
    });

    QUnit.test('callbase - set to false, should not call the original function', 0, function (assert) {
        // Arrange
        var context = this;

        context.functionProxyConfigurations.callBase = false;

        context.thisObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should call original function');
        };

        // Act
        context.noArgsFunctionProxy.callFunction([]);
    });

    QUnit.test('callbase - set to false, should not return the original function result', 1, function (assert) {
        // Arrange
        var context = this;

        context.functionProxyConfigurations.callBase = false;

        // Act
        var result = context.returning1FunctionProxy.callFunction([]);

        // Assert
        assert.notStrictEqual(result, 1, 'should not return the original value');
    });

    QUnit.test('callbase - set to false, should not return undefined', 1, function (assert) {
        // Arrange
        var context = this;

        context.functionProxyConfigurations.callBase = false;

        // Act
        var result = context.returning1FunctionProxy.callFunction([]);

        // Assert
        assert.strictEqual(result, undefined, 'should return undefined');
    });

    QUnit.test('callFunction - unknown mode - should throw error', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var unknownFunctionCallMode = {};

        context.functionProxyConfigurations.functionCallMode = unknownFunctionCallMode;

        try  {
            // Act
            context.noArgsFunctionProxy.callFunction([]);
        } catch (error) {
            assert.ok(true, 'should throw error on unknown functionCallMode');
        }
    });

    QUnit.test('callFunction - invoke mode - no arguments should call only the original function', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        context.thisObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(true, 'no arguments function should be called');
        };

        context.thisObject.onOneArgumentsFunctionCalled = function () {
            assert.ok(false, 'one arguments function should not be called');
        };

        context.thisObject.onManyArgumentsFunctionCalled = function () {
            assert.ok(false, 'many arguments function should not be called');
        };

        // Act
        context.noArgsFunctionProxy.callFunction([]);
    });

    QUnit.test('callFunction - invoke mode - one arguments should call only the original function', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.thisObject.onNoArgumentsFunctionCalled = function () {
            assert.ok(false, 'no arguments function should not be called');
        };

        context.thisObject.onOneArgumentsFunctionCalled = function (_arg) {
            // Assert
            assert.strictEqual(_arg, arg, 'The arguments should be the same');
        };

        context.thisObject.onManyArgumentsFunctionCalled = function () {
            assert.ok(false, 'many arguments function should not be called');
        };

        // Act
        context.oneArgsFunctionProxy.callFunction([arg]);
    });

    QUnit.test('callFunction - invoke mode - many arguments should call only the original function', function (assert) {
        QUnit.expect(3);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.thisObject.onNoArgumentsFunctionCalled = function () {
            assert.ok(false, 'no arguments function should not be called');
        };

        context.thisObject.onOneArgumentsFunctionCalled = function () {
            assert.ok(false, 'one arguments function should not be called');
        };

        context.thisObject.onManyArgumentsFunctionCalled = function (_arg1, _arg2, _arg3) {
            // Assert
            assert.strictEqual(_arg1, arg1, 'The 1st argument should be the same');
            assert.strictEqual(_arg2, arg2, 'The 2nd argument should be the same');
            assert.strictEqual(_arg3, arg3, 'The 3rd argument should be the same');
        };

        // Act
        context.manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
    });

    QUnit.test('callFunction - invoke mode - returning1Function - should return the original function result', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        var result = context.returning1FunctionProxy.callFunction([]);

        // Assert
        assert.strictEqual(result, 1, 'should return the original value');
    });

    QUnit.test('callFunction - verify mode no arguments -  was not called should not find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var verifyMode = context.setVerifyMode();

        // Act
        context.noArgsFunctionProxy.callFunction([]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 0, 'should not find a match');
    });

    QUnit.test('callFunction - verify mode no arguments - was called should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        context.noArgsFunctionProxy.callFunction([]);

        var verifyMode = context.setVerifyMode();

        // Act
        context.noArgsFunctionProxy.callFunction([]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode no arguments - was called twice should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        context.noArgsFunctionProxy.callFunction([]);
        context.noArgsFunctionProxy.callFunction([]);

        var verifyMode = context.setVerifyMode();

        // Act
        context.noArgsFunctionProxy.callFunction([]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 2, 'should find a match');
    });

    QUnit.test('callFunction - verify mode no arguments - was called with arguments should not find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        context.noArgsFunctionProxy.callFunction([{}]);

        var verifyMode = context.setVerifyMode();

        // Act
        context.noArgsFunctionProxy.callFunction([]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 0, 'should not find a match');
    });

    QUnit.test('callFunction - verify mode no arguments - was called with arguments and without arguments should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        context.noArgsFunctionProxy.callFunction([{}]);
        context.noArgsFunctionProxy.callFunction([]);

        var verifyMode = context.setVerifyMode();

        // Act
        context.noArgsFunctionProxy.callFunction([]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode no arguments - was called with arguments verify with same arguments should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};
        context.noArgsFunctionProxy.callFunction([arg]);

        var verifyMode = context.setVerifyMode();

        // Act
        context.noArgsFunctionProxy.callFunction([arg]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode no arguments - was called with arguments verify with different arguments should not find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        context.noArgsFunctionProxy.callFunction([arg1]);

        var verifyMode = context.setVerifyMode();

        // Act
        context.noArgsFunctionProxy.callFunction([arg2]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 0, 'should not find a match');
    });

    QUnit.test('callFunction - verify mode one argument -  was not called should not find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var verifyMode = context.setVerifyMode();

        var arg = {};

        // Act
        context.oneArgsFunctionProxy.callFunction([arg]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 0, 'should not find a match');
    });

    QUnit.test('callFunction - verify mode one argument - was called should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.noArgsFunctionProxy.callFunction([arg]);

        var verifyMode = context.setVerifyMode();

        // Act
        context.noArgsFunctionProxy.callFunction([arg]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode one argument - was called with IItIs which returns false, should not find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.noArgsFunctionProxy.callFunction([arg]);

        var verifyMode = context.setVerifyMode();

        var itIs = new ItIsBase();
        itIs.match = function () {
            return false;
        };

        // Act
        context.noArgsFunctionProxy.callFunction([itIs]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 0, 'should not find a match');
    });

    QUnit.test('callFunction - verify mode one argument - was called with IItIs which returns true, should f-nd a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.noArgsFunctionProxy.callFunction([arg]);

        var verifyMode = context.setVerifyMode();

        var itIs = new ItIsBase();
        itIs.match = function () {
            return true;
        };

        // Act
        context.noArgsFunctionProxy.callFunction([itIs]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode one argument - was called twice should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.noArgsFunctionProxy.callFunction([arg]);
        context.noArgsFunctionProxy.callFunction([arg]);

        var verifyMode = context.setVerifyMode();

        // Act
        context.noArgsFunctionProxy.callFunction([arg]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 2, 'should find a match');
    });

    QUnit.test('callFunction - verify mode one argument - was called twice should find a match for first arg', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.noArgsFunctionProxy.callFunction([arg1]);
        context.noArgsFunctionProxy.callFunction([arg2]);

        var verifyMode = context.setVerifyMode();

        // Act
        context.noArgsFunctionProxy.callFunction([arg1]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode one argument - was called twice should find a match for second arg', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.noArgsFunctionProxy.callFunction([arg1]);
        context.noArgsFunctionProxy.callFunction([arg2]);

        var verifyMode = context.setVerifyMode();

        // Act
        context.noArgsFunctionProxy.callFunction([arg2]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode one argument - was called twice should not find a match for another arg', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.noArgsFunctionProxy.callFunction([arg1]);
        context.noArgsFunctionProxy.callFunction([arg2]);

        var verifyMode = context.setVerifyMode();

        // Act
        context.noArgsFunctionProxy.callFunction([arg3]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 0, 'should not find a match');
    });

    QUnit.test('callFunction - verify mode one argument - was called without arguments should not find a match with arg', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.noArgsFunctionProxy.callFunction([]);

        var verifyMode = context.setVerifyMode();

        // Act
        context.noArgsFunctionProxy.callFunction([arg]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 0, 'should not find a match');
    });

    QUnit.test('callFunction - verify mode one argument - was called without arguments should find a match without arguments', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.noArgsFunctionProxy.callFunction([]);

        var verifyMode = context.setVerifyMode();

        // Act
        context.noArgsFunctionProxy.callFunction([]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode one argument - was called with IItIs which returns true 3 times, should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.noArgsFunctionProxy.callFunction([arg]);
        context.noArgsFunctionProxy.callFunction([arg]);
        context.noArgsFunctionProxy.callFunction([arg]);
        context.noArgsFunctionProxy.callFunction([arg]);
        context.noArgsFunctionProxy.callFunction([arg]);

        var verifyMode = context.setVerifyMode();

        var numberOfTimesReturnedTrue = 0;
        var itIs = new ItIsBase();
        itIs.match = function () {
            numberOfTimesReturnedTrue++;
            return numberOfTimesReturnedTrue <= 3;
        };

        // Act
        context.noArgsFunctionProxy.callFunction([itIs]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 3, 'should find a match');
    });

    QUnit.test('callFunction - verify mode many arguments -  was not called should not find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var verifyMode = context.setVerifyMode();

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        context.manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 0, 'should not find a match');
    });

    QUnit.test('callFunction - verify mode many arguments -  was called should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);

        var verifyMode = context.setVerifyMode();

        // Act
        context.manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode many arguments -  was called twice should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
        context.manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);

        var verifyMode = context.setVerifyMode();

        // Act
        context.manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 2, 'should find a match');
    });

    QUnit.test('callFunction - verify mode many arguments -  was called twice with different sets should find a match for first set', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.manyArgsFunctionProxy.callFunction(argSet1);
        context.manyArgsFunctionProxy.callFunction(argSet2);

        var verifyMode = context.setVerifyMode();

        // Act
        context.manyArgsFunctionProxy.callFunction(argSet1);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode many arguments -  was called twice with different sets should find a match for second set', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.manyArgsFunctionProxy.callFunction(argSet1);
        context.manyArgsFunctionProxy.callFunction(argSet2);

        var verifyMode = context.setVerifyMode();

        // Act
        context.manyArgsFunctionProxy.callFunction(argSet2);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode many arguments -  was called twice with different sets should not find a match for different set', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];
        var argSet3 = [{}, {}, {}];

        context.manyArgsFunctionProxy.callFunction(argSet1);
        context.manyArgsFunctionProxy.callFunction(argSet2);

        var verifyMode = context.setVerifyMode();

        // Act
        context.manyArgsFunctionProxy.callFunction(argSet3);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 0, 'should not find a match');
    });

    QUnit.test('callFunction - verify mode many arguments - was called twice with different sets should not find a match for set with one different parameter', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];
        var argSet3 = [argSet1[0], argSet1[1], argSet2[2]];

        context.manyArgsFunctionProxy.callFunction(argSet1);
        context.manyArgsFunctionProxy.callFunction(argSet2);

        var verifyMode = context.setVerifyMode();

        // Act
        context.manyArgsFunctionProxy.callFunction(argSet3);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 0, 'should not find a match');
    });

    QUnit.test('callFunction - verify mode many arguments -  was called with less parameters should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet = [{}, {}];

        context.manyArgsFunctionProxy.callFunction(argSet);

        var verifyMode = context.setVerifyMode();

        // Act
        context.manyArgsFunctionProxy.callFunction(argSet);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode many arguments -  was called with more parameters should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet = [{}, {}, {}, {}];

        context.manyArgsFunctionProxy.callFunction(argSet);

        var verifyMode = context.setVerifyMode();

        // Act
        context.manyArgsFunctionProxy.callFunction(argSet);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode many arguments -  was called with more parameters should not find a match with less parameters', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet = [{}, {}, {}, {}];

        context.manyArgsFunctionProxy.callFunction(argSet);

        var verifyMode = context.setVerifyMode();

        // Act
        context.manyArgsFunctionProxy.callFunction([argSet[0], argSet[1], argSet[2]]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 0, 'should not find a match');
    });

    QUnit.test('callFunction - verify mode many arguments -  was called with ItIs that returns false should not find a match with less parameters', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet = [{}, {}, {}];

        context.manyArgsFunctionProxy.callFunction(argSet);

        var verifyMode = context.setVerifyMode();

        var itIs = new ItIsBase();
        itIs.match = function () {
            return false;
        };

        // Act
        context.manyArgsFunctionProxy.callFunction([argSet[0], argSet[1], itIs]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 0, 'should not find a match');
    });

    QUnit.test('callFunction - verify mode many arguments -  was called with ItIs that returns true should find a match with less parameters', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet = [{}, {}, {}];

        context.manyArgsFunctionProxy.callFunction(argSet);

        var verifyMode = context.setVerifyMode();

        var itIs = new ItIsBase();
        itIs.match = function () {
            return true;
        };

        // Act
        context.manyArgsFunctionProxy.callFunction([argSet[0], argSet[1], itIs]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode many arguments -  was called with ItIs that returns true 3 times should find a match with less parameters', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet = [{}, {}, {}];

        context.manyArgsFunctionProxy.callFunction(argSet);
        context.manyArgsFunctionProxy.callFunction(argSet);
        context.manyArgsFunctionProxy.callFunction(argSet);
        context.manyArgsFunctionProxy.callFunction(argSet);
        context.manyArgsFunctionProxy.callFunction(argSet);
        context.manyArgsFunctionProxy.callFunction(argSet);

        var verifyMode = context.setVerifyMode();

        var numberOfTimesReturnedTrue = 0;
        var itIs = new ItIsBase();
        itIs.match = function () {
            numberOfTimesReturnedTrue++;
            return numberOfTimesReturnedTrue <= 3;
        };

        // Act
        context.manyArgsFunctionProxy.callFunction([argSet[0], argSet[1], itIs]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 3, 'should find a match');
    });

    QUnit.test('callFunction - verify mode many arguments -  was called with 3 ItIs that returns true should find a match with less parameters', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet = [{}, {}, {}];

        context.manyArgsFunctionProxy.callFunction(argSet);

        var verifyMode = context.setVerifyMode();

        var itIs = new ItIsBase();
        itIs.match = function () {
            return true;
        };

        // Act
        context.manyArgsFunctionProxy.callFunction([itIs, itIs, itIs]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 1, 'should find a match');
    });

    QUnit.test('callFunction - verify mode many arguments -  was called with 2 ItIs that returns true and one that returns false should find a match with less parameters', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet = [{}, {}, {}];

        context.manyArgsFunctionProxy.callFunction(argSet);

        var verifyMode = context.setVerifyMode();

        var trueItIs = new ItIsBase();
        trueItIs.match = function () {
            return true;
        };

        var falseItIs = new ItIsBase();
        falseItIs.match = function () {
            return false;
        };

        // Act
        context.manyArgsFunctionProxy.callFunction([trueItIs, falseItIs, trueItIs]);

        // Assert
        assert.strictEqual(verifyMode.numberOfMatches, 0, 'should not find a match');
    });

    QUnit.test('callFunction - override mode Callback - should not call the original function', 0, function (assert) {
        // Arrange
        var context = this;

        context.thisObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        var override = function () {
        };
        var functionCallMode = new CallbackOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        // Act
        context.noArgsFunctionProxy.callFunction([]);
    });

    QUnit.test('callFunction - override mode Returns - should not call the original function', 0, function (assert) {
        // Arrange
        var context = this;

        context.thisObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        var override = function () {
        };
        var functionCallMode = new ReturnsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        // Act
        context.noArgsFunctionProxy.callFunction([]);
    });

    QUnit.test('callFunction - override mode Throws - should not call the original function', 0, function (assert) {
        // Arrange
        var context = this;

        context.thisObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        var override = function () {
        };
        var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        // Act
        context.noArgsFunctionProxy.callFunction([]);
    });

    QUnit.test('callFunction - override mode Callback - should not call the original function with arguments', 0, function (assert) {
        // Arrange
        var context = this;

        context.thisObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        var override = function () {
        };
        var functionCallMode = new CallbackOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        // Act
        context.manyArgsFunctionProxy.callFunction([{}, {}, {}]);
    });

    QUnit.test('callFunction - override mode Returns - should not call the original function with arguments', 0, function (assert) {
        // Arrange
        var context = this;

        context.thisObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        var override = function () {
        };
        var functionCallMode = new ReturnsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        // Act
        context.manyArgsFunctionProxy.callFunction([{}, {}, {}]);
    });

    QUnit.test('callFunction - override mode Throws - should not call the original function with arguments', 0, function (assert) {
        // Arrange
        var context = this;

        context.thisObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        var override = function () {
        };
        var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        // Act
        context.manyArgsFunctionProxy.callFunction([{}, {}, {}]);
    });

    QUnit.test('callFunction - override mode Callback - invoking the function should not call the original function', 0, function (assert) {
        // Arrange
        var context = this;

        context.thisObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        var override = function () {
        };
        var functionCallMode = new CallbackOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.noArgsFunctionProxy.callFunction([]);

        // Act
        context.setInvokeMode();
        context.noArgsFunctionProxy.callFunction([]);
    });

    QUnit.test('callFunction - override mode Returns - invoking the function should not call the original function', 0, function (assert) {
        // Arrange
        var context = this;

        context.thisObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        var override = function () {
        };
        var functionCallMode = new ReturnsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.noArgsFunctionProxy.callFunction([]);

        // Act
        context.setInvokeMode();
        context.noArgsFunctionProxy.callFunction([]);
    });

    QUnit.test('callFunction - override mode Throws - invoking the function should not call the original function', 0, function (assert) {
        // Arrange
        var context = this;

        context.thisObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        var override = function () {
        };
        var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.noArgsFunctionProxy.callFunction([]);

        // Act
        context.setInvokeMode();
        try  {
            context.noArgsFunctionProxy.callFunction([]);
        } catch (e) {
        }
    });

    QUnit.test('callFunction - override mode Callback - invoking the function should call the override function', 1, function (assert) {
        // Arrange
        var context = this;

        var override = function () {
            // Assert
            assert.ok(true, 'should call the overriden function');
        };
        var functionCallMode = new CallbackOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.noArgsFunctionProxy.callFunction([]);

        // Act
        context.setInvokeMode();
        context.noArgsFunctionProxy.callFunction([]);
    });

    QUnit.test('callFunction - override mode Returns - invoking the function should call the override function', 1, function (assert) {
        // Arrange
        var context = this;

        var override = function () {
            // Assert
            assert.ok(true, 'should call the overriden function');
        };
        var functionCallMode = new CallbackOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.noArgsFunctionProxy.callFunction([]);

        // Act
        context.setInvokeMode();
        context.noArgsFunctionProxy.callFunction([]);
    });

    QUnit.test('callFunction - override mode Throws - invoking the function should call the override function', 1, function (assert) {
        // Arrange
        var context = this;

        var override = function () {
            // Assert
            assert.ok(true, 'should call the overriden function');
        };
        var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.noArgsFunctionProxy.callFunction([]);

        // Act
        context.setInvokeMode();
        try  {
            context.noArgsFunctionProxy.callFunction([]);
        } catch (er) {
        }
    });

    QUnit.test('callFunction - override mode Callback - calling the function should not call the override function', 0, function (assert) {
        // Arrange
        var context = this;

        var override = function () {
            // Assert
            assert.ok(false, 'should not call the overriden function on override mode');
        };
        var functionCallMode = new CallbackOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        // Act
        context.noArgsFunctionProxy.callFunction([]);
    });

    QUnit.test('callFunction - override mode Returns - calling the function should not call the override function', 0, function (assert) {
        // Arrange
        var context = this;

        var override = function () {
            // Assert
            assert.ok(false, 'should not call the overriden function on override mode');
        };
        var functionCallMode = new ReturnsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        // Act
        context.noArgsFunctionProxy.callFunction([]);
    });

    QUnit.test('callFunction - override mode Throws - calling the function should not call the override function', 0, function (assert) {
        // Arrange
        var context = this;

        var override = function () {
            // Assert
            assert.ok(false, 'should not call the overriden function on override mode');
        };
        var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        // Act
        context.noArgsFunctionProxy.callFunction([]);
    });

    QUnit.test('callFunction - override mode Callback - invoking the function should call the override with same parameters', 3, function (assert) {
        // Arrange
        var context = this;

        var args = [{}, {}, {}];

        var override = function (_arg1, _arg2, _arg3) {
            // Assert
            assert.strictEqual(_arg1, args[0], 'should pass the parameters');
            assert.strictEqual(_arg2, args[1], 'should pass the parameters');
            assert.strictEqual(_arg3, args[2], 'should pass the parameters');
        };
        var functionCallMode = new CallbackOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction(args);

        // Act
        context.setInvokeMode();
        context.manyArgsFunctionProxy.callFunction(args);
    });

    QUnit.test('callFunction - override mode Returns - invoking the function should call the override with same parameters', 3, function (assert) {
        // Arrange
        var context = this;

        var args = [{}, {}, {}];

        var override = function (_arg1, _arg2, _arg3) {
            // Assert
            assert.strictEqual(_arg1, args[0], 'should pass the parameters');
            assert.strictEqual(_arg2, args[1], 'should pass the parameters');
            assert.strictEqual(_arg3, args[2], 'should pass the parameters');
        };
        var functionCallMode = new ReturnsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction(args);

        // Act
        context.setInvokeMode();
        context.manyArgsFunctionProxy.callFunction(args);
    });

    QUnit.test('callFunction - override mode Throws - invoking the function should call the override with same parameters', 3, function (assert) {
        // Arrange
        var context = this;

        var args = [{}, {}, {}];

        var override = function (_arg1, _arg2, _arg3) {
            // Assert
            assert.strictEqual(_arg1, args[0], 'should pass the parameters');
            assert.strictEqual(_arg2, args[1], 'should pass the parameters');
            assert.strictEqual(_arg3, args[2], 'should pass the parameters');
        };
        var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction(args);

        // Act
        context.setInvokeMode();
        try  {
            context.manyArgsFunctionProxy.callFunction(args);
        } catch (er) {
        }
    });

    QUnit.test('callFunction - override mode Callback - invoking the function with other parameters should not call the override', 0, function (assert) {
        // Arrange
        var context = this;

        var args = [{}, {}, {}];

        var override = function (_arg1, _arg2, _arg3) {
            // Assert
            assert.ok(false, 'should not call override');
        };
        var functionCallMode = new CallbackOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction(args);

        // Act
        context.setInvokeMode();
        context.manyArgsFunctionProxy.callFunction([args[0], args[1], {}]);
    });

    QUnit.test('callFunction - override mode Returns - invoking the function with other parameters should not call the override', 0, function (assert) {
        // Arrange
        var context = this;

        var args = [{}, {}, {}];

        var override = function (_arg1, _arg2, _arg3) {
            // Assert
            assert.ok(false, 'should not call override');
        };
        var functionCallMode = new ReturnsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction(args);

        // Act
        context.setInvokeMode();
        context.manyArgsFunctionProxy.callFunction([args[0], args[1], {}]);
    });

    QUnit.test('callFunction - override mode Throws - invoking the function with other parameters should not call the override', 0, function (assert) {
        // Arrange
        var context = this;

        var args = [{}, {}, {}];

        var override = function (_arg1, _arg2, _arg3) {
            // Assert
            assert.ok(false, 'should not call override');
        };
        var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction(args);

        // Act
        context.setInvokeMode();
        try  {
            context.manyArgsFunctionProxy.callFunction([args[0], args[1], {}]);
        } catch (er) {
        }
    });

    QUnit.test('callFunction - override mode Callback - invoking the function with other parameters should call the original function', 3, function (assert) {
        // Arrange
        var context = this;

        var args1 = [{}, {}, {}];
        var args2 = [args1[0], args1[1], {}];

        context.thisObject.onManyArgumentsFunctionCalled = function (_arg1, _arg2, _arg3) {
            // Assert
            assert.strictEqual(_arg1, args2[0], 'should call with the parameters');
            assert.strictEqual(_arg2, args2[1], 'should call with the parameters');
            assert.strictEqual(_arg3, args2[2], 'should call with the parameters');
        };

        var override = function () {
        };
        var functionCallMode = new CallbackOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction(args1);

        // Act
        context.setInvokeMode();
        context.manyArgsFunctionProxy.callFunction(args2);
    });

    QUnit.test('callFunction - override mode Returns - invoking the function with other parameters should call the original function', 3, function (assert) {
        // Arrange
        var context = this;

        var args1 = [{}, {}, {}];
        var args2 = [args1[0], args1[1], {}];

        context.thisObject.onManyArgumentsFunctionCalled = function (_arg1, _arg2, _arg3) {
            assert.strictEqual(_arg1, args2[0], 'should call with the parameters');
            assert.strictEqual(_arg2, args2[1], 'should call with the parameters');
            assert.strictEqual(_arg3, args2[2], 'should call with the parameters');
        };

        var override = function () {
        };
        var functionCallMode = new ReturnsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction(args1);

        // Act
        context.setInvokeMode();
        context.manyArgsFunctionProxy.callFunction(args2);
    });

    QUnit.test('callFunction - override mode Throws - invoking the function with other parameters should call the original function', 3, function (assert) {
        // Arrange
        var context = this;

        var args1 = [{}, {}, {}];
        var args2 = [args1[0], args1[1], {}];

        context.thisObject.onManyArgumentsFunctionCalled = function (_arg1, _arg2, _arg3) {
            assert.strictEqual(_arg1, args2[0], 'should call with the parameters');
            assert.strictEqual(_arg2, args2[1], 'should call with the parameters');
            assert.strictEqual(_arg3, args2[2], 'should call with the parameters');
        };

        var override = function () {
        };
        var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction(args1);

        // Act
        context.setInvokeMode();
        context.manyArgsFunctionProxy.callFunction(args2);
    });

    QUnit.test('callFunction - override mode Callback - calling the function with ItIs and than invoking should call the override', 3, function (assert) {
        // Arrange
        var context = this;

        context.thisObject.onManyArgumentsFunctionCalled = function (_arg1, _arg2, _arg3) {
            assert.ok(false, 'should not call the original');
        };

        var arg1 = 1;
        var arg2 = 2;
        var arg3 = 3;

        var override = function (_arg1, _arg2, _arg3) {
            // Assert
            assert.strictEqual(_arg1, arg1, 'arguments should be the same');
            assert.strictEqual(_arg2, arg2, 'arguments should be the same');
            assert.strictEqual(_arg3, arg3, 'arguments should be the same');
        };

        var functionCallMode = new CallbackOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction([It.isAny(Number), It.isAny(Number), arg3]);

        // Act
        context.setInvokeMode();
        context.manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
    });

    QUnit.test('callFunction - override mode Return - calling the function with ItIs and than invoking should call the override', 3, function (assert) {
        // Arrange
        var context = this;

        context.thisObject.onManyArgumentsFunctionCalled = function (_arg1, _arg2, _arg3) {
            assert.ok(false, 'should not call the original');
        };

        var arg1 = 1;
        var arg2 = 2;
        var arg3 = 3;

        var override = function (_arg1, _arg2, _arg3) {
            // Assert
            assert.strictEqual(_arg1, arg1, 'arguments should be the same');
            assert.strictEqual(_arg2, arg2, 'arguments should be the same');
            assert.strictEqual(_arg3, arg3, 'arguments should be the same');
        };

        var functionCallMode = new ReturnsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction([It.isAny(Number), It.isAny(Number), arg3]);

        // Act
        context.setInvokeMode();
        context.manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
    });

    QUnit.test('callFunction - override mode Throws - calling the function with ItIs and than invoking should call the override', 3, function (assert) {
        // Arrange
        var context = this;

        context.thisObject.onManyArgumentsFunctionCalled = function (_arg1, _arg2, _arg3) {
            assert.ok(false, 'should not call the original');
        };

        var arg1 = 1;
        var arg2 = 2;
        var arg3 = 3;

        var override = function (_arg1, _arg2, _arg3) {
            // Assert
            assert.strictEqual(_arg1, arg1, 'arguments should be the same');
            assert.strictEqual(_arg2, arg2, 'arguments should be the same');
            assert.strictEqual(_arg3, arg3, 'arguments should be the same');
        };

        var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction([It.isAny(Number), It.isAny(Number), arg3]);

        // Act
        context.setInvokeMode();
        try  {
            context.manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
        } catch (er) {
        }
    });

    QUnit.test('callFunction - override mode Callback - calling the function with ItIs and than invoking with not matching argument should not call the override and call the original', 3, function (assert) {
        // Arrange
        var context = this;

        context.thisObject.onManyArgumentsFunctionCalled = function (_arg1, _arg2, _arg3) {
            // Assert
            assert.strictEqual(_arg1, arg1, 'arguments should be the same');
            assert.strictEqual(_arg2, arg2, 'arguments should be the same');
            assert.strictEqual(_arg3, arg3, 'arguments should be the same');
        };

        var arg1 = 1;
        var arg2 = '';
        var arg3 = 3;

        var override = function (_arg1, _arg2, _arg3) {
            assert.ok(false, 'should not call the override');
        };

        var functionCallMode = new CallbackOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction([It.isAny(Number), It.isAny(Number), arg3]);

        // Act
        context.setInvokeMode();
        context.manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
    });

    QUnit.test('callFunction - override mode Returns - calling the function with ItIs and than invoking with not matching argument should not call the override and call the original', 3, function (assert) {
        // Arrange
        var context = this;

        context.thisObject.onManyArgumentsFunctionCalled = function (_arg1, _arg2, _arg3) {
            // Assert
            assert.strictEqual(_arg1, arg1, 'arguments should be the same');
            assert.strictEqual(_arg2, arg2, 'arguments should be the same');
            assert.strictEqual(_arg3, arg3, 'arguments should be the same');
        };

        var arg1 = 1;
        var arg2 = '';
        var arg3 = 3;

        var override = function (_arg1, _arg2, _arg3) {
            assert.ok(false, 'should not call the override');
        };

        var functionCallMode = new ReturnsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction([It.isAny(Number), It.isAny(Number), arg3]);

        // Act
        context.setInvokeMode();
        context.manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
    });

    QUnit.test('callFunction - override mode Throws - calling the function with ItIs and than invoking with not matching argument should not call the override and call the original', 3, function (assert) {
        // Arrange
        var context = this;

        context.thisObject.onManyArgumentsFunctionCalled = function (_arg1, _arg2, _arg3) {
            // Assert
            assert.strictEqual(_arg1, arg1, 'arguments should be the same');
            assert.strictEqual(_arg2, arg2, 'arguments should be the same');
            assert.strictEqual(_arg3, arg3, 'arguments should be the same');
        };

        var arg1 = 1;
        var arg2 = '';
        var arg3 = 3;

        var override = function (_arg1, _arg2, _arg3) {
            assert.ok(false, 'should not call the override');
        };

        var functionCallMode = new ThrowsOverrideFunctionCallMode(override);
        context.functionProxyConfigurations.functionCallMode = functionCallMode;

        context.manyArgsFunctionProxy.callFunction([It.isAny(Number), It.isAny(Number), arg3]);

        // Act
        context.setInvokeMode();
        context.manyArgsFunctionProxy.callFunction([arg1, arg2, arg3]);
    });

    QUnit.test('callFunction - override mode mixed - with ItIsAny should call all on invoke', 3, function (assert) {
        // Arrange
        var context = this;

        var error = {};
        var throwsOverride = function (_arg) {
            assert.ok(true, 'throws override should be called');
            return error;
        };

        var returnValue = {};
        var returnsOverride = function (_arg) {
            assert.ok(true, 'returns override should be called');
            return returnValue;
        };

        var callbackOverride = function (_arg) {
            assert.ok(true, 'callback override should be called');
        };

        var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode(throwsOverride);
        var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode(returnsOverride);
        var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode(callbackOverride);

        context.functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        // Act
        context.setInvokeMode();
        context.oneArgsFunctionProxy.callFunction([1]);
    });

    QUnit.test('callFunction - override mode mixed - with ItIsAny should call all on invoke with same parameter', 3, function (assert) {
        // Arrange
        var context = this;

        var arg = {};

        var error = {};
        var throwsOverride = function (_arg) {
            assert.strictEqual(_arg, arg, 'arguments should match');
            return error;
        };

        var returnValue = {};
        var returnsOverride = function (_arg) {
            assert.strictEqual(_arg, arg, 'arguments should match');
            return returnValue;
        };

        var callbackOverride = function (_arg) {
            assert.strictEqual(_arg, arg, 'arguments should match');
        };

        var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode(throwsOverride);
        var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode(returnsOverride);
        var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode(callbackOverride);

        context.functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([arg]);

        context.functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([arg]);

        context.functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([arg]);

        // Act
        context.setInvokeMode();
        context.oneArgsFunctionProxy.callFunction([arg]);
    });

    QUnit.test('callFunction - override mode mixed - with value should call all on invoke', 3, function (assert) {
        // Arrange
        var context = this;

        var error = {};
        var throwsOverride = function (_arg) {
            assert.ok(true, 'throws override should be called');
            return error;
        };

        var returnValue = {};
        var returnsOverride = function (_arg) {
            assert.ok(true, 'returns override should be called');
            return returnValue;
        };

        var callbackOverride = function (_arg) {
            assert.ok(true, 'callback override should be called');
        };

        var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode(throwsOverride);
        var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode(returnsOverride);
        var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode(callbackOverride);

        context.functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([1]);

        context.functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([1]);

        context.functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([1]);

        // Act
        context.setInvokeMode();
        context.oneArgsFunctionProxy.callFunction([1]);
    });

    QUnit.test('callFunction - override mode mixed - with value should call only a callback on invoke', 1, function (assert) {
        // Arrange
        var context = this;

        var error = {};
        var throwsOverride = function (_arg) {
            assert.ok(false, 'throws override should not be called');
            return error;
        };

        var returnValue = {};
        var returnsOverride = function (_arg) {
            assert.ok(false, 'returns override should not be called');
            return returnValue;
        };

        var callbackOverride = function (_arg) {
            assert.ok(true, 'callback override should be called');
        };

        var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode(throwsOverride);
        var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode(returnsOverride);
        var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode(callbackOverride);

        context.functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([0]);

        context.functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([0]);

        context.functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([1]);

        // Act
        context.setInvokeMode();
        context.oneArgsFunctionProxy.callFunction([1]);
    });

    QUnit.test('callFunction - override mode mixed - with value should call only a returns on invoke', 1, function (assert) {
        // Arrange
        var context = this;

        var error = {};
        var throwsOverride = function (_arg) {
            assert.ok(false, 'throws override should not be called');
            return error;
        };

        var returnValue = {};
        var returnsOverride = function (_arg) {
            assert.ok(true, 'returns override should be called');
            return returnValue;
        };

        var callbackOverride = function (_arg) {
            assert.ok(false, 'callback override should not be called');
        };

        var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode(throwsOverride);
        var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode(returnsOverride);
        var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode(callbackOverride);

        context.functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([0]);

        context.functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([1]);

        context.functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([0]);

        // Act
        context.setInvokeMode();
        context.oneArgsFunctionProxy.callFunction([1]);
    });

    QUnit.test('callFunction - override mode mixed - with value should call only a throws on invoke', 1, function (assert) {
        // Arrange
        var context = this;

        var error = {};
        var throwsOverride = function (_arg) {
            assert.ok(true, 'throws override should be called');
            return error;
        };

        var returnValue = {};
        var returnsOverride = function (_arg) {
            assert.ok(false, 'returns override should not be called');
            return returnValue;
        };

        var callbackOverride = function (_arg) {
            assert.ok(false, 'callback override should not be called');
        };

        var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode(throwsOverride);
        var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode(returnsOverride);
        var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode(callbackOverride);

        context.functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([1]);

        context.functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([0]);

        context.functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([0]);

        // Act
        context.setInvokeMode();
        try  {
            context.oneArgsFunctionProxy.callFunction([1]);
        } catch (e) {
        }
    });

    QUnit.test('callFunction - override mode mixed - with ItIsAny should return the return value', 1, function (assert) {
        // Arrange
        var context = this;

        var error = {};
        var throwsOverride = function (_arg) {
            return error;
        };

        var returnValue = {};
        var returnsOverride = function (_arg) {
            return returnValue;
        };

        var callbackOverride = function (_arg) {
        };

        var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode(throwsOverride);
        var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode(returnsOverride);
        var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode(callbackOverride);

        context.functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        // Act
        context.setInvokeMode();
        var result = context.oneArgsFunctionProxy.callFunction([1]);

        // Assert
        assert.strictEqual(result, returnValue, 'should throw the error');
    });

    QUnit.test('callFunction - override mode mixed - with ItIsAny should throw the error', 1, function (assert) {
        // Arrange
        var context = this;

        var error = {};
        var throwsOverride = function (_arg) {
            return error;
        };

        var returnValue = {};
        var returnsOverride = function (_arg) {
            return returnValue;
        };

        var callbackOverride = function (_arg) {
        };

        var throwsOverrideCallMode = new ThrowsOverrideFunctionCallMode(throwsOverride);
        var returnsOverrideCallMode = new ReturnsOverrideFunctionCallMode(returnsOverride);
        var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode(callbackOverride);

        context.functionProxyConfigurations.functionCallMode = returnsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = throwsOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        // Act
        context.setInvokeMode();
        try  {
            context.oneArgsFunctionProxy.callFunction([1]);
        } catch (actualError) {
            // Assert
            assert.strictEqual(actualError, error, 'should return the return value');
        }
    });

    QUnit.test('callFunction - override mode mixed - with ItIsAny should throw the last error', 1, function (assert) {
        // Arrange
        var context = this;

        var error1 = {};
        var throwsOverride1 = function (_arg) {
            return error1;
        };

        var error2 = {};
        var throwsOverride2 = function (_arg) {
            return error2;
        };

        var callbackOverride = function (_arg) {
        };

        var throwsOverrideCallMode1 = new ThrowsOverrideFunctionCallMode(throwsOverride1);
        var throwsOverrideCallMode2 = new ThrowsOverrideFunctionCallMode(throwsOverride2);
        var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode(callbackOverride);

        context.functionProxyConfigurations.functionCallMode = throwsOverrideCallMode1;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = throwsOverrideCallMode2;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        // Act
        context.setInvokeMode();
        try  {
            context.oneArgsFunctionProxy.callFunction([1]);
        } catch (actualError) {
            // Assert
            assert.strictEqual(actualError, error2, 'should throw the second error');
        }
    });

    QUnit.test('callFunction - override mode mixed - with ItIsAny should return the last return value', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue1 = {};
        var returnsOverride1 = function (_arg) {
            return returnValue1;
        };

        var returnValue2 = {};
        var returnsOverride2 = function (_arg) {
            return returnValue2;
        };

        var callbackOverride = function (_arg) {
        };

        var returnsOverrideCallMode1 = new ReturnsOverrideFunctionCallMode(returnsOverride1);
        var returnsOverrideCallMode2 = new ReturnsOverrideFunctionCallMode(returnsOverride2);
        var callbackOverrideCallMode = new CallbackOverrideFunctionCallMode(callbackOverride);

        context.functionProxyConfigurations.functionCallMode = returnsOverrideCallMode1;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = returnsOverrideCallMode2;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = callbackOverrideCallMode;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        // Act
        context.setInvokeMode();
        var result = context.oneArgsFunctionProxy.callFunction([1]);

        // Assert
        assert.strictEqual(result, returnValue2, 'should return the second return value');
    });

    QUnit.test('callFunction - override mode mixed - with ItIsAny should call all duplicates', 7, function (assert) {
        // Arrange
        var context = this;

        var returnValue1 = {};
        var returnsOverride1 = function (_arg) {
            assert.ok(true, '1st return should be called');
            return returnValue1;
        };

        var error1 = {};
        var throwsOverride1 = function (_arg) {
            assert.ok(true, '1st throws should be called');
            return error1;
        };

        var callbackOverride1 = function (_arg) {
            assert.ok(true, '1st callbeck should be called');
        };

        var error2 = {};
        var throwsOverride2 = function (_arg) {
            assert.ok(true, '2nd throws should be called');
            return error2;
        };

        var returnValue2 = {};
        var returnsOverride2 = function (_arg) {
            assert.ok(true, '2nd return should be called');
            return returnValue2;
        };

        var callbackOverride2 = function (_arg) {
            assert.ok(true, '2nd callbeck should be called');
        };

        var throwsOverrideCallMode1 = new ReturnsOverrideFunctionCallMode(returnsOverride1);
        var throwsOverrideCallMode2 = new ReturnsOverrideFunctionCallMode(returnsOverride2);
        var returnsOverrideCallMode1 = new ReturnsOverrideFunctionCallMode(returnsOverride1);
        var returnsOverrideCallMode2 = new ReturnsOverrideFunctionCallMode(returnsOverride2);
        var callbackOverrideCallMode1 = new CallbackOverrideFunctionCallMode(callbackOverride1);
        var callbackOverrideCallMode2 = new CallbackOverrideFunctionCallMode(callbackOverride2);

        context.functionProxyConfigurations.functionCallMode = returnsOverrideCallMode1;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = throwsOverrideCallMode1;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = callbackOverrideCallMode1;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = throwsOverrideCallMode2;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = callbackOverrideCallMode2;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        context.functionProxyConfigurations.functionCallMode = returnsOverrideCallMode2;
        context.oneArgsFunctionProxy.callFunction([It.isAny(Number)]);

        // Act
        context.setInvokeMode();
        var result = context.oneArgsFunctionProxy.callFunction([1]);

        // Assert
        assert.strictEqual(result, returnValue2, 'should return the second return value');
    });

    QUnit.test('callFunction - strict - no setup should throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.functionProxyConfigurations.isStrict = true;

        try  {
            context.noArgsFunctionProxy.callFunction([]);
        } catch (error) {
            // Assert
            assert.ok(true, 'should throw error');
        }
    });

    QUnit.test('callFunction - strict - has callback setup should not thow error', 0, function (assert) {
        // Arrange
        var context = this;
        context.functionProxyConfigurations.isStrict = true;

        var functionCallMode = new CallbackOverrideFunctionCallMode(function () {
        });
        context.functionProxyConfigurations.functionCallMode = functionCallMode;
        context.noArgsFunctionProxy.callFunction([]);

        try  {
            context.noArgsFunctionProxy.callFunction([]);
        } catch (error) {
            // Assert
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('callFunction - strict - has returns setup should not thow error', 0, function (assert) {
        // Arrange
        var context = this;
        context.functionProxyConfigurations.isStrict = true;

        var functionCallMode = new ReturnsOverrideFunctionCallMode(function () {
            return 1;
        });
        context.functionProxyConfigurations.functionCallMode = functionCallMode;
        context.noArgsFunctionProxy.callFunction([]);

        try  {
            context.noArgsFunctionProxy.callFunction([]);
        } catch (error) {
            // Assert
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('callFunction - strict - has throws setup should thow the configured error', 1, function (assert) {
        // Arrange
        var context = this;
        context.functionProxyConfigurations.isStrict = true;

        var thrownError = {};
        var functionCallMode = new ThrowsOverrideFunctionCallMode(function () {
            throw thrownError;
        });
        context.functionProxyConfigurations.functionCallMode = functionCallMode;
        context.noArgsFunctionProxy.callFunction([]);

        context.setInvokeMode();

        try  {
            context.noArgsFunctionProxy.callFunction([]);
        } catch (error) {
            // Assert
            assert.strictEqual(thrownError, error, 'should throw the configured error');
        }
    });
})(Tests || (Tests = {}));
'use strict';
var Tests;
(function (Tests) {
    var FunctionSetup = moqJS.FunctionSetup;
    var FunctionProxyConfigurations = moqJS.FunctionProxyConfigurations;

    var OverrideFunctionCallMode = moqJS.OverrideFunctionCallMode;
    var InvokeFunctionCallMode = moqJS.InvokeFunctionCallMode;
    var CallbackOverrideFunctionCallMode = moqJS.CallbackOverrideFunctionCallMode;
    var ReturnsOverrideFunctionCallMode = moqJS.ReturnsOverrideFunctionCallMode;
    var ThrowsOverrideFunctionCallMode = moqJS.ThrowsOverrideFunctionCallMode;

    var FunctionSetupLyfecycleObject = (function () {
        function FunctionSetupLyfecycleObject() {
            this.beforeEach = function () {
                var context = this;

                context.argument = {};
                context.testObject = new Tests.TestObject();
                context.functionProxyConfigurations = new FunctionProxyConfigurations();

                context.oneArgumentFunctionSetup = new FunctionSetup(function (object) {
                    return object.oneArgumentsFunction(context.argument);
                }, context.testObject, context.functionProxyConfigurations);

                context.returning1FunctionSetup = new FunctionSetup(function (object) {
                    return object.returning1Function();
                }, context.testObject, context.functionProxyConfigurations);
            };
            this.afterEach = function () {
            };
        }
        return FunctionSetupLyfecycleObject;
    })();

    QUnit.module('FunctionSetup', new FunctionSetupLyfecycleObject());

    QUnit.test('constructor - should initialize correctly', 3, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var functionCall = function (object) {
            return object.returning1Function();
        };
        var functionProxyConfigurations = new FunctionProxyConfigurations();

        // Act
        var functionSetup = new FunctionSetup(functionCall, testObject, functionProxyConfigurations);

        // Assert
        assert.strictEqual(functionSetup.object, testObject, 'testObject should be same');
        assert.strictEqual(functionSetup.functionCall, functionCall, 'functionCall should be same');
        assert.strictEqual(functionSetup.functionProxyConfigurations, functionProxyConfigurations, 'functionProxyConfigurations should be same');
    });

    QUnit.test('returns - should call functionCall', 1, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            assert.ok(true, 'should be called');
        };

        // Act
        context.returning1FunctionSetup.returns(4);
    });

    QUnit.test('returns - should call when the override type is returns', 1, function (assert) {
        // Arrange
        var context = this;

        var newReturnValue = {};

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;

            // Assert
            assert.ok(functionCallMode instanceof ReturnsOverrideFunctionCallMode, 'functionCallMode should be returns');
        };

        // Act
        context.returning1FunctionSetup.returns(newReturnValue);
    });

    QUnit.test('returns - should call when the override contains function that returns the new value', 1, function (assert) {
        // Arrange
        var context = this;

        var newReturnValue = {};

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;

            var result = functionCallMode.override();

            // Assert
            assert.strictEqual(result, newReturnValue, 'should return the setup value');
        };

        // Act
        context.returning1FunctionSetup.returns(newReturnValue);
    });

    QUnit.test('returns - should call when the override contains function that returns the new value 2', 1, function (assert) {
        // Arrange
        var context = this;

        var newReturnValue = {};

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;
            var result = functionCallMode.override();

            // Assert
            assert.strictEqual(result, newReturnValue, 'should return the setup value');
        };

        // Act
        context.oneArgumentFunctionSetup.returns(newReturnValue);
    });

    QUnit.test('returns - should not call other function', 0, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call other function');
        };

        var newReturnValue = {};

        // Act
        context.oneArgumentFunctionSetup.returns(newReturnValue);
    });

    QUnit.test('returns - should call functionCall with same parameter', 1, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            // Assert
            assert.strictEqual(_arg, context.argument, 'should be called with same argument');
        };

        // Act
        context.oneArgumentFunctionSetup.returns(4);
    });

    QUnit.test('returns - after returns functionCallMode should be InvokeFunctionCallMode', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.oneArgumentFunctionSetup.returns(4);

        // Assert
        assert.ok(context.functionProxyConfigurations.functionCallMode instanceof InvokeFunctionCallMode, 'functionCallMode should be InvokeFunctionCallMode');
    });

    QUnit.test('returns - should return the same function setup object', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        var functionSetup = context.oneArgumentFunctionSetup.returns(4);

        // Assert
        assert.strictEqual(functionSetup, context.oneArgumentFunctionSetup, 'should return the same setup');
    });

    QUnit.test('returnsInOrder - should call functionCall', 1, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            assert.ok(true, 'should be called');
        };

        // Act
        context.returning1FunctionSetup.returnsInOrder([4, 5]);
    });

    QUnit.test('returnsInOrder - should call when the override type is returns', 1, function (assert) {
        // Arrange
        var context = this;

        var newReturnValue1 = {};
        var newReturnValue2 = {};
        var newReturnValue3 = {};

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;

            // Assert
            assert.ok(functionCallMode instanceof ReturnsOverrideFunctionCallMode, 'functionCallMode should be returns');
        };

        // Act
        context.returning1FunctionSetup.returnsInOrder([newReturnValue1, newReturnValue2, newReturnValue3]);
    });

    QUnit.test('returnsInOrder - should call when the override contains function that returns the new values', 4, function (assert) {
        // Arrange
        var context = this;

        var newReturnValue1 = {};
        var newReturnValue2 = {};
        var newReturnValue3 = {};

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;

            var result1 = functionCallMode.override();
            var result2 = functionCallMode.override();
            var result3 = functionCallMode.override();
            var result4 = functionCallMode.override();

            // Assert
            assert.strictEqual(result1, newReturnValue1, 'should return the setup value1');
            assert.strictEqual(result2, newReturnValue2, 'should return the setup value2');
            assert.strictEqual(result3, newReturnValue3, 'should return the setup value3');
            assert.strictEqual(result4, undefined, 'should return undefined');
        };

        // Act
        context.returning1FunctionSetup.returnsInOrder([newReturnValue1, newReturnValue2, newReturnValue3]);
    });

    QUnit.test('returnsInOrder - should call when the override contains function that returns the new values 2', 4, function (assert) {
        // Arrange
        var context = this;

        var newReturnValue1 = {};
        var newReturnValue2 = {};
        var newReturnValue3 = {};

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;
            var result1 = functionCallMode.override();
            var result2 = functionCallMode.override();
            var result3 = functionCallMode.override();
            var result4 = functionCallMode.override();

            // Assert
            assert.strictEqual(result1, newReturnValue1, 'should return the setup value1');
            assert.strictEqual(result2, newReturnValue2, 'should return the setup value2');
            assert.strictEqual(result3, newReturnValue3, 'should return the setup value3');
            assert.strictEqual(result4, undefined, 'should return undefined');
        };

        // Act
        context.oneArgumentFunctionSetup.returnsInOrder([newReturnValue1, newReturnValue2, newReturnValue3]);
    });

    QUnit.test('returnsInOrder - should not call other function', 0, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call other function');
        };

        var newReturnValue = {};

        // Act
        context.oneArgumentFunctionSetup.returnsInOrder([newReturnValue]);
    });

    QUnit.test('returnsInOrder - should call functionCall with same parameter', 1, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            // Assert
            assert.strictEqual(_arg, context.argument, 'should be called with same argument');
        };

        // Act
        context.oneArgumentFunctionSetup.returnsInOrder([4]);
    });

    QUnit.test('returnsInOrder - after returns functionCallMode should be InvokeFunctionCallMode', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.oneArgumentFunctionSetup.returnsInOrder([4]);

        // Assert
        assert.ok(context.functionProxyConfigurations.functionCallMode instanceof InvokeFunctionCallMode, 'functionCallMode should be InvokeFunctionCallMode');
    });

    QUnit.test('returnsInOrder - should return the same function setup object', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        var functionSetup = context.oneArgumentFunctionSetup.returnsInOrder([4]);

        // Assert
        assert.strictEqual(functionSetup, context.oneArgumentFunctionSetup, 'should return the same setup');
    });

    QUnit.test('lazyReturns - should call functionCall', 1, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            assert.ok(true, 'should be called');
        };

        // Act
        context.returning1FunctionSetup.lazyReturns(function () {
            return 4;
        });
    });

    QUnit.test('lazyReturns - should call when the functionCallMode is OverrideFunctionCallMode', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};

        var returnFunction = function () {
            return returnValue;
        };

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;

            // Assert
            assert.ok(functionCallMode instanceof OverrideFunctionCallMode, 'functionCallMode should be should OverrideFunctionCallMode');
        };

        // Act
        context.returning1FunctionSetup.lazyReturns(returnFunction);
    });

    QUnit.test('lazyReturns - should call when the override type is returns', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};

        var returnFunction = function () {
            return returnValue;
        };

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;

            // Assert
            assert.ok(functionCallMode instanceof ReturnsOverrideFunctionCallMode, 'functionCallMode should be returns');
        };

        // Act
        context.returning1FunctionSetup.lazyReturns(returnFunction);
    });

    QUnit.test('lazyReturns - should call when the override contains function that returns the new value', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};

        var returnFunction = function () {
            return returnValue;
        };

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;
            var result = functionCallMode.override();

            // Assert
            assert.strictEqual(result, returnValue, 'should return the setup value');
        };

        // Act
        context.returning1FunctionSetup.lazyReturns(returnFunction);
    });

    QUnit.test('lazyReturns - should call when the override contains function that returns the new value 2', 1, function (assert) {
        // Arrange
        var context = this;

        var newReturnValue = {};
        var returnFunction = function () {
            return newReturnValue;
        };

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;
            var result = functionCallMode.override();

            // Assert
            assert.strictEqual(result, newReturnValue, 'should return the setup value');
        };

        // Act
        context.oneArgumentFunctionSetup.lazyReturns(returnFunction);
    });

    QUnit.test('lazyReturns - should not call other function', 0, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call other function');
        };

        var returnFrunction = function () {
        };

        // Act
        context.oneArgumentFunctionSetup.lazyReturns(returnFrunction);
    });

    QUnit.test('lazyReturns - should call functionCall with same parameter', 1, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            // Assert
            assert.strictEqual(_arg, context.argument, 'should be called with same argument');
        };

        // Act
        context.oneArgumentFunctionSetup.lazyReturns(function () {
            return 4;
        });
    });

    QUnit.test('lazyReturns - after returns functionCallMode should be InvokeFunctionCallMode', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.oneArgumentFunctionSetup.lazyReturns(function () {
            return 4;
        });

        // Assert
        assert.ok(context.functionProxyConfigurations.functionCallMode instanceof InvokeFunctionCallMode, 'functionCallMode should be InvokeFunctionCallMode');
    });

    QUnit.test('lazyReturns - should return same function setup object', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        var functionSetup = context.oneArgumentFunctionSetup.lazyReturns(function () {
            return 4;
        });

        // Assert
        assert.strictEqual(functionSetup, context.oneArgumentFunctionSetup, 'should rerturn same function setup');
    });

    QUnit.test('lazyReturnsInOrder - should call functionCall', 1, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            assert.ok(true, 'should be called');
        };

        // Act
        context.returning1FunctionSetup.lazyReturnsInOrder([function () {
                return 4;
            }, function () {
                return 5;
            }]);
    });

    QUnit.test('lazyReturnsInOrder - should call when the functionCallMode is OverrideFunctionCallMode', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};

        var returnFunction = function () {
            return returnValue;
        };

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;

            // Assert
            assert.ok(functionCallMode instanceof OverrideFunctionCallMode, 'functionCallMode should be should OverrideFunctionCallMode');
        };

        // Act
        context.returning1FunctionSetup.lazyReturnsInOrder([returnFunction]);
    });

    QUnit.test('lazyReturnsInOrder - should call when the override type is returns', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};

        var returnFunction = function () {
            return returnValue;
        };

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;

            // Assert
            assert.ok(functionCallMode instanceof ReturnsOverrideFunctionCallMode, 'functionCallMode should be returns');
        };

        // Act
        context.returning1FunctionSetup.lazyReturnsInOrder([returnFunction]);
    });

    QUnit.test('lazyReturnsInOrder - should call when the override contains function that returns the new values', 4, function (assert) {
        // Arrange
        var context = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};

        var returnFunction1 = function () {
            return returnValue1;
        };
        var returnFunction2 = function () {
            return returnValue2;
        };
        var returnFunction3 = function () {
            return returnValue3;
        };

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;
            var result1 = functionCallMode.override();
            var result2 = functionCallMode.override();
            var result3 = functionCallMode.override();
            var result4 = functionCallMode.override();

            // Assert
            assert.strictEqual(result1, returnValue1, 'should return the setup value1');
            assert.strictEqual(result2, returnValue2, 'should return the setup value2');
            assert.strictEqual(result3, returnValue3, 'should return the setup value3');
            assert.strictEqual(result4, undefined, 'should return undefined');
        };

        // Act
        context.returning1FunctionSetup.lazyReturnsInOrder([returnFunction1, returnFunction2, returnFunction3]);
    });

    QUnit.test('lazyReturnsInOrder - should call when the override contains function that returns the new values 2', 4, function (assert) {
        // Arrange
        var context = this;

        var newReturnValue1 = {};
        var newReturnValue2 = {};
        var newReturnValue3 = {};

        var returnFunction1 = function () {
            return newReturnValue1;
        };
        var returnFunction2 = function () {
            return newReturnValue2;
        };
        var returnFunction3 = function () {
            return newReturnValue3;
        };

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;
            var result1 = functionCallMode.override();
            var result2 = functionCallMode.override();
            var result3 = functionCallMode.override();
            var result4 = functionCallMode.override();

            // Assert
            assert.strictEqual(result1, newReturnValue1, 'should return the setup value1');
            assert.strictEqual(result2, newReturnValue2, 'should return the setup value2');
            assert.strictEqual(result3, newReturnValue3, 'should return the setup value3');
            assert.strictEqual(result4, undefined, 'should return the setup value');
        };

        // Act
        context.oneArgumentFunctionSetup.lazyReturnsInOrder([returnFunction1, returnFunction2, returnFunction3]);
    });

    QUnit.test('lazyReturnsInOrder - should not call other function', 0, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call other function');
        };

        var returnFrunction = function () {
        };

        // Act
        context.oneArgumentFunctionSetup.lazyReturnsInOrder([returnFrunction]);
    });

    QUnit.test('lazyReturnsInOrder - should call functionCall with same parameter', 1, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            // Assert
            assert.strictEqual(_arg, context.argument, 'should be called with same argument');
        };

        // Act
        context.oneArgumentFunctionSetup.lazyReturnsInOrder([function () {
                return 4;
            }]);
    });

    QUnit.test('lazyReturnsInOrder - after returns functionCallMode should be InvokeFunctionCallMode', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.oneArgumentFunctionSetup.lazyReturnsInOrder([function () {
                return 4;
            }]);

        // Assert
        assert.ok(context.functionProxyConfigurations.functionCallMode instanceof InvokeFunctionCallMode, 'functionCallMode should be InvokeFunctionCallMode');
    });

    QUnit.test('lazyReturnsInOrder - should return same function setup object', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        var functionSetup = context.oneArgumentFunctionSetup.lazyReturnsInOrder([function () {
                return 4;
            }]);

        // Assert
        assert.strictEqual(functionSetup, context.oneArgumentFunctionSetup, 'should rerturn same function setup');
    });

    QUnit.test('callback - should call functionCall', 1, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            assert.ok(true, 'should be called');
        };

        var callback = function () {
        };

        // Act
        context.returning1FunctionSetup.callback(callback);
    });

    QUnit.test('callback - should call when the functionCallMode type is OverrideFunctionCallMode', 1, function (assert) {
        // Arrange
        var context = this;

        var callback = function () {
        };

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;

            // Assert
            assert.ok(functionCallMode instanceof OverrideFunctionCallMode, 'functionCallMode should be OverrideFunctionCallMode');
        };

        // Act
        context.returning1FunctionSetup.callback(callback);
    });

    QUnit.test('callback - should call when the override type is Callback', 1, function (assert) {
        // Arrange
        var context = this;

        var callback = function () {
        };

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;

            // Assert
            assert.ok(functionCallMode instanceof CallbackOverrideFunctionCallMode, 'functionCallMode should be callback');
        };

        // Act
        context.returning1FunctionSetup.callback(callback);
    });

    QUnit.test('callback - should call when the override contains the callback', 1, function (assert) {
        // Arrange
        var context = this;

        var callback = function () {
            // Assert
            assert.ok(true, 'callback was called');
        };

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;
            functionCallMode.override();
        };

        // Act
        context.returning1FunctionSetup.callback(callback);
    });

    QUnit.test('callback - should call when the override contains the callback with same parameter', 2, function (assert) {
        // Arrange
        var context = this;

        var callback = function (_arg) {
            // Assert
            assert.ok(true, 'callback was called');
            assert.strictEqual(_arg, context.argument, 'should be the same parameter');
        };

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;
            functionCallMode.override(_arg);
        };

        // Act
        context.oneArgumentFunctionSetup.callback(callback);
    });

    QUnit.test('callback - should not call other function', 0, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call other function');
        };

        var callback = function () {
        };

        // Act
        context.oneArgumentFunctionSetup.callback(callback);
    });

    QUnit.test('callback - should call functionCall with same parameter', 1, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            // Assert
            assert.strictEqual(_arg, context.argument, 'should be called with same argument');
        };

        var callback = function () {
        };

        // Act
        context.oneArgumentFunctionSetup.callback(callback);
    });

    QUnit.test('callback - should return same function setup object', 1, function (assert) {
        // Arrange
        var context = this;

        var callback = function () {
        };

        // Act
        var functionSetup = context.oneArgumentFunctionSetup.callback(callback);

        // Assert
        assert.strictEqual(functionSetup, context.oneArgumentFunctionSetup, 'should rerturn same function setup');
    });

    QUnit.test('callback - after callback functionCallMode should be InvokeFunctionCallMode', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.oneArgumentFunctionSetup.callback(function () {
        });

        // Assert
        assert.ok(context.functionProxyConfigurations.functionCallMode instanceof InvokeFunctionCallMode, 'functionCallMode should be InvokeFunctionCallMode');
    });

    QUnit.test('throws - should call functionCall', 1, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            assert.ok(true, 'should be called');
        };

        // Act
        context.returning1FunctionSetup.throws(4);
    });

    QUnit.test('throws - should call when the functionCallMode is OverrideFunctionCallMode', 1, function (assert) {
        // Arrange
        var context = this;

        var error = {};

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;

            // Assert
            assert.ok(functionCallMode instanceof OverrideFunctionCallMode, 'functionCallMode should be OverrideFunctionCallMode');
        };

        // Act
        context.returning1FunctionSetup.throws(error);
    });

    QUnit.test('throws - should call when the override type is Throws', 1, function (assert) {
        // Arrange
        var context = this;

        var error = {};

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;

            // Assert
            assert.ok(functionCallMode instanceof ThrowsOverrideFunctionCallMode, 'functionCallMode should be throws');
        };

        // Act
        context.returning1FunctionSetup.throws(error);
    });

    QUnit.test('throws - should call when the override contains function that returns the error', 1, function (assert) {
        // Arrange
        var context = this;

        var error = {};

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;
            var actualError = functionCallMode.override();

            // Assert
            assert.strictEqual(actualError, error, 'should throw the error');
        };

        // Act
        context.returning1FunctionSetup.throws(error);
    });

    QUnit.test('throws - should call when the override contains function that throws the error 2', 1, function (assert) {
        // Arrange
        var context = this;

        var error = {};

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            // Assert
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;
            var actualError = functionCallMode.override();
            assert.strictEqual(actualError, error, 'should throw the error');
        };

        // Act
        context.oneArgumentFunctionSetup.throws(error);
    });

    QUnit.test('throws - should not call other function', 0, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call other function');
        };

        var error = {};

        // Act
        context.oneArgumentFunctionSetup.throws(error);
    });

    QUnit.test('throws - should call functionCall with same parameter', 1, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            // Assert
            assert.strictEqual(_arg, context.argument, 'should be called with same argument');
        };

        // Act
        context.oneArgumentFunctionSetup.throws(4);
    });

    QUnit.test('throws - after callback functionCallMode should be InvokeFunctionCallMode', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.oneArgumentFunctionSetup.throws({});

        // Assert
        assert.ok(context.functionProxyConfigurations.functionCallMode instanceof InvokeFunctionCallMode, 'functionCallMode should be InvokeFunctionCallMode');
    });

    QUnit.test('throws - should return same function setup object', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        var functionSetup = context.oneArgumentFunctionSetup.throws({});

        // Assert
        assert.strictEqual(functionSetup, context.oneArgumentFunctionSetup, 'should rerturn same function setup');
    });

    QUnit.test('lazyThrows - should call functionCall', 1, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            assert.ok(true, 'should be called');
        };

        // Act
        context.returning1FunctionSetup.lazyThrows(function () {
            return 'error';
        });
    });

    QUnit.test('lazyThrows - should call when the functionCallMode is OverrideFunctionCallMode', 1, function (assert) {
        // Arrange
        var context = this;

        var error = {};

        var errorReturningFunction = function () {
            return error;
        };

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;

            // Assert
            assert.ok(functionCallMode instanceof OverrideFunctionCallMode, 'functionCallMode should be should OverrideFunctionCallMode');
        };

        // Act
        context.returning1FunctionSetup.lazyThrows(errorReturningFunction);
    });

    QUnit.test('lazyThrows - should call when the override type is throws', 1, function (assert) {
        // Arrange
        var context = this;

        var error = {};

        var errorReturningFunction = function () {
            return error;
        };

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;

            // Assert
            assert.ok(functionCallMode instanceof ThrowsOverrideFunctionCallMode, 'functionCallMode should be throws');
        };

        // Act
        context.returning1FunctionSetup.lazyThrows(errorReturningFunction);
    });

    QUnit.test('lazyThrows - should call when the override contains function that returns the error', 1, function (assert) {
        // Arrange
        var context = this;

        var error = {};

        var errorReturningFunction = function () {
            return error;
        };

        context.testObject.onReturnung1FunctionCalled = function () {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;
            var actualError = functionCallMode.override();

            // Assert
            assert.strictEqual(actualError, error, 'should throw the setup error');
        };

        // Act
        context.returning1FunctionSetup.lazyThrows(errorReturningFunction);
    });

    QUnit.test('lazyThrows - should call when the override contains function that throws the error 2', 1, function (assert) {
        // Arrange
        var context = this;

        var error = {};
        var errorReturningFunction = function () {
            return error;
        };

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            var functionCallMode = context.functionProxyConfigurations.functionCallMode;
            var actualError = functionCallMode.override();

            // Assert
            assert.strictEqual(actualError, error, 'should return the setup value');
        };

        // Act
        context.oneArgumentFunctionSetup.lazyThrows(errorReturningFunction);
    });

    QUnit.test('lazyThrows - should not call other function', 0, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onReturnung1FunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call other function');
        };

        var errorReturningFunction = function () {
        };

        // Act
        context.oneArgumentFunctionSetup.lazyThrows(errorReturningFunction);
    });

    QUnit.test('lazyThrows - should call functionCall with same parameter', 1, function (assert) {
        // Arrange
        var context = this;

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            // Assert
            assert.strictEqual(_arg, context.argument, 'should be called with same argument');
        };

        // Act
        context.oneArgumentFunctionSetup.lazyThrows(function () {
            return 4;
        });
    });

    QUnit.test('lazyThrows - after returns functionCallMode should be InvokeFunctionCallMode', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.oneArgumentFunctionSetup.lazyThrows(function () {
            return 4;
        });

        // Assert
        assert.ok(context.functionProxyConfigurations.functionCallMode instanceof InvokeFunctionCallMode, 'functionCallMode should be InvokeFunctionCallMode');
    });

    QUnit.test('lazyThrows - should return same function setup object', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        var functionSetup = context.oneArgumentFunctionSetup.lazyThrows(function () {
            return 4;
        });

        // Assert
        assert.strictEqual(functionSetup, context.oneArgumentFunctionSetup, 'should rerturn same function setup');
    });
})(Tests || (Tests = {}));
'use strict';
var Tests;
(function (Tests) {
    var It = moqJS.It;

    var Parent = (function () {
        function Parent() {
        }
        return Parent;
    })();

    var Son = (function (_super) {
        __extends(Son, _super);
        function Son() {
            _super.apply(this, arguments);
        }
        return Son;
    })(Parent);

    var ItIsLyfecycleObject = (function () {
        function ItIsLyfecycleObject() {
            this.beforeEach = function () {
                var context = this;
            };
            this.afterEach = function () {
            };
        }
        return ItIsLyfecycleObject;
    })();

    QUnit.module('It', new ItIsLyfecycleObject());

    QUnit.test('isAny - expect number check number should return true', 1, function (assert) {
        // Arrange
        var expectedType = Number;
        var actual = 1;

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });

    QUnit.test('isAny - expect number check string should return false', 1, function (assert) {
        // Arrange
        var expectedType = Number;
        var actual = '';

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect string check number should return false', 1, function (assert) {
        // Arrange
        var expectedType = String;
        var actual = 1;

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect string check empty string should return true', 1, function (assert) {
        // Arrange
        var expectedType = String;
        var actual = '';

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });

    QUnit.test('isAny - expect string check string should return true', 1, function (assert) {
        // Arrange
        var expectedType = String;
        var actual = 'some text';

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });

    QUnit.test('isAny - expect string check null should return false', 1, function (assert) {
        // Arrange
        var expectedType = String;
        var actual = null;

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect string check undefined should return false', 1, function (assert) {
        // Arrange
        var expectedType = String;
        var actual = undefined;

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect number check null should return false', 1, function (assert) {
        // Arrange
        var expectedType = Number;
        var actual = null;

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect number check undefined should return false', 1, function (assert) {
        // Arrange
        var expectedType = Number;
        var actual = undefined;

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect parent check son should return true', 1, function (assert) {
        // Arrange
        var expectedType = Parent;
        var actual = new Son();

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });

    QUnit.test('isAny - expect parent check parent should return true', 1, function (assert) {
        // Arrange
        var expectedType = Parent;
        var actual = new Parent();

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });

    QUnit.test('isAny - expect son check parent should return false', 1, function (assert) {
        // Arrange
        var expectedType = Son;
        var actual = new Parent();

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect son check son should return true', 1, function (assert) {
        // Arrange
        var expectedType = Son;
        var actual = new Son();

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });

    QUnit.test('isAny - expect son check null should return false', 1, function (assert) {
        // Arrange
        var expectedType = Son;
        var actual = null;

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect son check undefined should return false', 1, function (assert) {
        // Arrange
        var expectedType = Son;
        var actual = undefined;

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect number check [] should return false', 1, function (assert) {
        // Arrange
        var expectedType = Number;
        var actual = [];

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect number check Array should return false', 1, function (assert) {
        // Arrange
        var expectedType = Number;
        var actual = new Array();

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect array check number should return false', 1, function (assert) {
        // Arrange
        var expectedType = Array;
        var actual = 1;

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, false, 'should not match the type');
    });

    QUnit.test('isAny - expect array check [] should return true', 1, function (assert) {
        // Arrange
        var expectedType = Array;
        var actual = [];

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });

    QUnit.test('isAny - expect array check array should return true', 1, function (assert) {
        // Arrange
        var expectedType = Array;
        var actual = new Array();

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });

    QUnit.test('isAny - expect array check not empty [] should return true', 1, function (assert) {
        // Arrange
        var expectedType = Array;
        var actual = [1, '', {}];

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });

    QUnit.test('isAny - expect array check not empty array should return true', 1, function (assert) {
        // Arrange
        var expectedType = Array;
        var actual = new Array(1, '', {});

        var isAny = It.isAny(expectedType);

        // Act
        var result = isAny.match(actual);

        // Assert
        assert.strictEqual(result, true, 'should match the type');
    });

    QUnit.test('is - should call the function passed with the argument', 1, function (assert) {
        // Arrange
        var context = this;

        var arg = {};

        var itIs = It.is(function (_arg) {
            // Assert
            assert.strictEqual(_arg, arg, 'Should pass the argument');
            return true;
        });

        // Act
        itIs.match(arg);
    });

    QUnit.test('is - function returns true should return true', 1, function (assert) {
        // Arrange
        var context = this;

        var arg = {};

        var itIs = It.is(function (_arg) {
            return true;
        });

        // Act
        var result = itIs.match(arg);

        // Assert
        assert.strictEqual(result, true, 'when passed function returns true should return true');
    });

    QUnit.test('is - function returns false should return false', 1, function (assert) {
        // Arrange
        var context = this;

        var arg = {};

        var itIs = It.is(function (_arg) {
            return false;
        });

        // Act
        var result = itIs.match(arg);

        // Assert
        assert.strictEqual(result, false, 'when passed function returns false should return false');
    });

    QUnit.test('isInRange - not a number should return false', 1, function (assert) {
        // Arrange
        var context = this;

        var arg = {};

        var itIs = It.isInRange(1, 2);

        // Act
        var result = itIs.match(arg);

        // Assert
        assert.strictEqual(result, false, 'when passed not a number should return false');
    });

    QUnit.test('isInRange - min range number should return true', 1, function (assert) {
        // Arrange
        var context = this;

        var min = 1;
        var max = 3;

        var itIs = It.isInRange(min, max);

        // Act
        var result = itIs.match(min);

        // Assert
        assert.strictEqual(result, true, 'when passed min range number should return true');
    });

    QUnit.test('isInRange - max range number should return true', 1, function (assert) {
        // Arrange
        var context = this;

        var min = 1;
        var max = 3;

        var itIs = It.isInRange(min, max);

        // Act
        var result = itIs.match(max);

        // Assert
        assert.strictEqual(result, true, 'when passed max range number should return true');
    });

    QUnit.test('isInRange - middle number should return true', 1, function (assert) {
        // Arrange
        var context = this;

        var min = 1;
        var middle = 2;
        var max = 3;

        var itIs = It.isInRange(min, max);

        // Act
        var result = itIs.match(middle);

        // Assert
        assert.strictEqual(result, true, 'when passed middle range number should return true');
    });

    QUnit.test('isRegExp - not string should return false', 1, function (assert) {
        // Arrange
        var context = this;

        var itIs = It.isRegExp(new RegExp('[1-8]'));

        // Act
        var result = itIs.match(1);

        // Assert
        assert.strictEqual(result, false, 'on not a string should return false');
    });

    QUnit.test('isRegExp - not string should return false 2', 1, function (assert) {
        // Arrange
        var context = this;

        var itIs = It.isRegExp(new RegExp('[1-8]'));

        // Act
        var result = itIs.match({});

        // Assert
        assert.strictEqual(result, false, 'on not a string should return false');
    });

    QUnit.test('isRegExp - not matching should return false', 1, function (assert) {
        // Arrange
        var context = this;

        var itIs = It.isRegExp(new RegExp('[1-8]'));

        // Act
        var result = itIs.match('9');

        // Assert
        assert.strictEqual(result, false, 'on not matching should return false');
    });

    QUnit.test('isRegExp - matching should return true', 1, function (assert) {
        // Arrange
        var context = this;

        var itIs = It.isRegExp(new RegExp('[1-8]'));

        // Act
        var result = itIs.match('8');

        // Assert
        assert.strictEqual(result, true, 'on matching should return false');
    });
})(Tests || (Tests = {}));
'use strict';
var Tests;
(function (Tests) {
    var ItIsBase = moqJS.ItIsBase;
    var It = moqJS.It;

    var Times = moqJS.Times;
    var Mole = moqJS.Mole;

    var MoleLifecycleObject = (function () {
        function MoleLifecycleObject() {
            this.beforeEach = function () {
                var context = this;

                context.testObject = new Tests.TestObject();

                context.mole = new Mole(context.testObject);
            };
            this.afterEach = function () {
                var context = this;

                context.mole.dispose();
            };
        }
        return MoleLifecycleObject;
    })();

    QUnit.module('Mole', new MoleLifecycleObject());

    QUnit.test('constructor - should initialize correctly', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();

        // Act
        var mole = new Mole(testObject);

        // Assert
        assert.strictEqual(mole.object, testObject);
    });

    QUnit.test('noArgumentsFunction - should call only the original function', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var shouldNotBeCalled = function () {
            return assert.ok(false, 'should not be called');
        };

        context.testObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(true, 'no arguments function should be called');
        };

        context.testObject.onOneArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onManyArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onGetterCalled = shouldNotBeCalled;
        context.testObject.onSetterOfGetterAndSetterCalled = shouldNotBeCalled;
        context.testObject.onGetterOfGetterAndSetterCalled = shouldNotBeCalled;
        context.testObject.onSetterCalled = shouldNotBeCalled;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('oneArgumentsFunction - one arguments should call only the original function', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var shouldNotBeCalled = function () {
            return assert.ok(false, 'should not be called');
        };

        var arg = {};

        context.testObject.onNoArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onManyArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onGetterCalled = shouldNotBeCalled;
        context.testObject.onSetterOfGetterAndSetterCalled = shouldNotBeCalled;
        context.testObject.onGetterOfGetterAndSetterCalled = shouldNotBeCalled;
        context.testObject.onSetterCalled = shouldNotBeCalled;

        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            // Assert
            assert.strictEqual(_arg, arg, 'The arguments should be the same');
        };

        // Act
        context.testObject.oneArgumentsFunction(arg);
    });

    QUnit.test('manyArgumentsFunction - many arguments should call only the original function', function (assert) {
        QUnit.expect(3);

        // Arrange
        var context = this;

        var shouldNotBeCalled = function () {
            return assert.ok(false, 'should not be called');
        };

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.onNoArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onGetterCalled = shouldNotBeCalled;
        context.testObject.onSetterOfGetterAndSetterCalled = shouldNotBeCalled;
        context.testObject.onGetterOfGetterAndSetterCalled = shouldNotBeCalled;
        context.testObject.onSetterCalled = shouldNotBeCalled;
        context.testObject.onOneArgumentsFunctionCalled = shouldNotBeCalled;

        context.testObject.onManyArgumentsFunctionCalled = function (_arg1, _arg2, _arg3) {
            // Assert
            assert.strictEqual(_arg1, arg1, 'The 1st argument should be the same');
            assert.strictEqual(_arg2, arg2, 'The 2nd argument should be the same');
            assert.strictEqual(_arg3, arg3, 'The 3rd argument should be the same');
        };

        // Act
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
    });

    QUnit.test('getter - should call only the original getter', 2, function (assert) {
        // Arrange
        var context = this;

        var shouldNotBeCalled = function () {
            return assert.ok(false, 'should not be called');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onOneArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onManyArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onSetterOfGetterAndSetterCalled = shouldNotBeCalled;
        context.testObject.onGetterOfGetterAndSetterCalled = shouldNotBeCalled;
        context.testObject.onSetterCalled = shouldNotBeCalled;

        context.testObject.onGetterCalled = function () {
            return assert.ok(true, 'should call the getter');
        };

        var value = {};
        context.testObject.getterValue = value;

        // Act
        var actualValue = context.testObject.getter;

        // Assert
        assert.strictEqual(actualValue, value, 'Should return the getter value');
    });

    QUnit.test('setter - should call only the original setter', 2, function (assert) {
        // Arrange
        var context = this;

        var shouldNotBeCalled = function () {
            return assert.ok(false, 'should not be called');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onOneArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onManyArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onSetterOfGetterAndSetterCalled = shouldNotBeCalled;
        context.testObject.onGetterOfGetterAndSetterCalled = shouldNotBeCalled;
        context.testObject.onGetterCalled = shouldNotBeCalled;

        context.testObject.onSetterCalled = function () {
            return assert.ok(true, 'should call the getter');
        };

        var value = {};

        // Act
        context.testObject.setter = value;

        // Assert
        assert.strictEqual(context.testObject.setterValue, value, 'Should set the setter value');
    });

    QUnit.test('getter&setter - setter - should call only the original setter', 2, function (assert) {
        // Arrange
        var context = this;

        var shouldNotBeCalled = function () {
            return assert.ok(false, 'should not be called');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onOneArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onManyArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onSetterCalled = shouldNotBeCalled;
        context.testObject.onGetterOfGetterAndSetterCalled = shouldNotBeCalled;
        context.testObject.onGetterCalled = shouldNotBeCalled;

        context.testObject.onSetterOfGetterAndSetterCalled = function () {
            return assert.ok(true, 'should call the getter');
        };

        var value = {};

        // Act
        context.testObject.getterAndSetter = value;

        // Assert
        assert.strictEqual(context.testObject.getterAndSetterValue, value, 'Should set the value');
    });

    QUnit.test('getter&setter - getter - should call only the original getter', 2, function (assert) {
        // Arrange
        var context = this;

        var shouldNotBeCalled = function () {
            return assert.ok(false, 'should not be called');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onOneArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onManyArgumentsFunctionCalled = shouldNotBeCalled;
        context.testObject.onSetterCalled = shouldNotBeCalled;
        context.testObject.onSetterOfGetterAndSetterCalled = shouldNotBeCalled;
        context.testObject.onGetterCalled = shouldNotBeCalled;

        context.testObject.onGetterOfGetterAndSetterCalled = function () {
            return assert.ok(true, 'should call the getter');
        };

        var value = {};
        context.testObject.getterAndSetterValue = value;

        // Act
        var actualValue = context.testObject.getterAndSetter;

        // Assert
        assert.strictEqual(actualValue, value, 'Should get the value');
    });

    QUnit.test('verify - should verify only the no arguments function', 7, function (assert) {
        // Arrange
        var context = this;
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        context.testObject.noArgumentsFunction();

        // Assert
        var verifyNoArguments = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        });
        var verifyOneArguments = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg1);
        });
        var verifyManyArguments = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        });
        var verifyGetter = context.mole.verify(function (_) {
            return _.getter;
        });
        var verifySetter = context.mole.verify(function (_) {
            return _.setter = arg1;
        });
        var verifyGetterAndSetterGetter = context.mole.verify(function (_) {
            return _.getterAndSetter;
        });
        var verifyGetterAndSetterSetter = context.mole.verify(function (_) {
            return _.getterAndSetter = arg1;
        });

        assert.strictEqual(verifyNoArguments, true, 'no arguments should be verified');
        assert.strictEqual(verifyOneArguments, false, 'one arguments should not be verified');
        assert.strictEqual(verifyManyArguments, false, 'many arguments should not be verified');
        assert.strictEqual(verifyGetter, false, 'getter should not be verified');
        assert.strictEqual(verifySetter, false, 'setter should not be verified');
        assert.strictEqual(verifyGetterAndSetterSetter, false, 'setter of getter and setter should not be verified');
        assert.strictEqual(verifyGetterAndSetterGetter, false, 'getter of getter and setter should not be verified');
    });

    QUnit.test('verify - should verify only the one argument function', 7, function (assert) {
        // Arrange
        var context = this;
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        context.testObject.oneArgumentsFunction(arg1);

        // Assert
        var verifyNoArguments = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        });
        var verifyOneArguments = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg1);
        });
        var verifyManyArguments = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        });
        var verifyGetter = context.mole.verify(function (_) {
            return _.getter;
        });
        var verifySetter = context.mole.verify(function (_) {
            return _.setter = arg1;
        });
        var verifyGetterAndSetterGetter = context.mole.verify(function (_) {
            return _.getterAndSetter;
        });
        var verifyGetterAndSetterSetter = context.mole.verify(function (_) {
            return _.getterAndSetter = arg1;
        });

        assert.strictEqual(verifyNoArguments, false, 'no arguments should not be verified');
        assert.strictEqual(verifyOneArguments, true, 'one arguments should be verified');
        assert.strictEqual(verifyManyArguments, false, 'many arguments should not be verified');
        assert.strictEqual(verifyGetter, false, 'getter should not be verified');
        assert.strictEqual(verifySetter, false, 'setter should not be verified');
        assert.strictEqual(verifyGetterAndSetterGetter, false, 'getter of getter and setter should not be verified');
        assert.strictEqual(verifyGetterAndSetterSetter, false, 'setter of getter and setter should not be verified');
    });

    QUnit.test('verify - should verify only the many argument function', 7, function (assert) {
        // Arrange
        var context = this;
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Assert
        var verifyNoArguments = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        });
        var verifyOneArguments = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg1);
        });
        var verifyManyArguments = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        });
        var verifyGetter = context.mole.verify(function (_) {
            return _.getter;
        });
        var verifySetter = context.mole.verify(function (_) {
            return _.setter = arg1;
        });
        var verifyGetterAndSetterGetter = context.mole.verify(function (_) {
            return _.getterAndSetter;
        });
        var verifyGetterAndSetterSetter = context.mole.verify(function (_) {
            return _.getterAndSetter = arg1;
        });

        assert.strictEqual(verifyNoArguments, false, 'no arguments should not be verified');
        assert.strictEqual(verifyOneArguments, false, 'one arguments should not be verified');
        assert.strictEqual(verifyManyArguments, true, 'many arguments should be verified');
        assert.strictEqual(verifyGetter, false, 'getter should not be verified');
        assert.strictEqual(verifySetter, false, 'setter should not be verified');
        assert.strictEqual(verifyGetterAndSetterSetter, false, 'setter of getter and setter should not be verified');
        assert.strictEqual(verifyGetterAndSetterGetter, false, 'getter of getter and setter should not be verified');
    });

    QUnit.test('verify - should verify only the getter', 7, function (assert) {
        // Arrange
        var context = this;
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        var value = context.testObject.getter;

        // Assert
        var verifyNoArguments = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        });
        var verifyOneArguments = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg1);
        });
        var verifyManyArguments = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        });
        var verifyGetter = context.mole.verify(function (_) {
            return _.getter;
        });
        var verifySetter = context.mole.verify(function (_) {
            return _.setter = arg1;
        });
        var verifyGetterAndSetterGetter = context.mole.verify(function (_) {
            return _.getterAndSetter;
        });
        var verifyGetterAndSetterSetter = context.mole.verify(function (_) {
            return _.getterAndSetter = arg1;
        });

        assert.strictEqual(verifyNoArguments, false, 'no arguments should not be verified');
        assert.strictEqual(verifyOneArguments, false, 'one arguments should not be verified');
        assert.strictEqual(verifyManyArguments, false, 'many arguments should not be verified');
        assert.strictEqual(verifyGetter, true, 'getter should be verified');
        assert.strictEqual(verifySetter, false, 'setter should not be verified');
        assert.strictEqual(verifyGetterAndSetterSetter, false, 'setter of getter and setter should not be verified');
        assert.strictEqual(verifyGetterAndSetterGetter, false, 'getter of getter and setter should not be verified');
    });

    QUnit.test('verify - should verify only the setter', 7, function (assert) {
        // Arrange
        var context = this;
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        context.testObject.setter = arg1;

        // Assert
        var verifyNoArguments = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        });
        var verifyOneArguments = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg1);
        });
        var verifyManyArguments = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        });
        var verifyGetter = context.mole.verify(function (_) {
            return _.getter;
        });
        var verifySetter = context.mole.verify(function (_) {
            return _.setter = arg1;
        });
        var verifyGetterAndSetterGetter = context.mole.verify(function (_) {
            return _.getterAndSetter;
        });
        var verifyGetterAndSetterSetter = context.mole.verify(function (_) {
            return _.getterAndSetter = arg1;
        });

        assert.strictEqual(verifyNoArguments, false, 'no arguments should not be verified');
        assert.strictEqual(verifyOneArguments, false, 'one arguments should not be verified');
        assert.strictEqual(verifyManyArguments, false, 'many arguments should not be verified');
        assert.strictEqual(verifyGetter, false, 'getter should not be verified');
        assert.strictEqual(verifySetter, true, 'setter should be verified');
        assert.strictEqual(verifyGetterAndSetterSetter, false, 'setter of getter and setter should not be verified');
        assert.strictEqual(verifyGetterAndSetterGetter, false, 'Getter of getter and setter should not be verified');
    });

    QUnit.test('verify - should verify only the getter of getter and setter', 7, function (assert) {
        // Arrange
        var context = this;
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        var value = context.testObject.getterAndSetter;

        // Assert
        var verifyNoArguments = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        });
        var verifyOneArguments = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg1);
        });
        var verifyManyArguments = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        });
        var verifyGetter = context.mole.verify(function (_) {
            return _.getter;
        });
        var verifySetter = context.mole.verify(function (_) {
            return _.setter = arg1;
        });
        var verifyGetterAndSetterGetter = context.mole.verify(function (_) {
            return _.getterAndSetter;
        });
        var verifyGetterAndSetterSetter = context.mole.verify(function (_) {
            return _.getterAndSetter = arg1;
        });

        assert.strictEqual(verifyNoArguments, false, 'no arguments should not be verified');
        assert.strictEqual(verifyOneArguments, false, 'one arguments should not be verified');
        assert.strictEqual(verifyManyArguments, false, 'many arguments should not be verified');
        assert.strictEqual(verifyGetter, false, 'getter should not be verified');
        assert.strictEqual(verifySetter, false, 'setter should not be verified');
        assert.strictEqual(verifyGetterAndSetterGetter, true, 'getter of getter and setter should be verified');
        assert.strictEqual(verifyGetterAndSetterSetter, false, 'setter of getter and setter should not be verified');
    });

    QUnit.test('verify - should verify only the setter of getter and setter', 7, function (assert) {
        // Arrange
        var context = this;
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        context.testObject.getterAndSetter = arg1;

        // Assert
        var verifyNoArguments = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        });
        var verifyOneArguments = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg1);
        });
        var verifyManyArguments = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        });
        var verifyGetter = context.mole.verify(function (_) {
            return _.getter;
        });
        var verifySetter = context.mole.verify(function (_) {
            return _.setter = arg1;
        });
        var verifyGetterAndSetterGetter = context.mole.verify(function (_) {
            return _.getterAndSetter;
        });
        var verifyGetterAndSetterSetter = context.mole.verify(function (_) {
            return _.getterAndSetter = arg1;
        });

        assert.strictEqual(verifyNoArguments, false, 'no arguments should not be verified');
        assert.strictEqual(verifyOneArguments, false, 'one arguments should not be verified');
        assert.strictEqual(verifyManyArguments, false, 'many arguments should not be verified');
        assert.strictEqual(verifyGetter, false, 'getter should not be verified');
        assert.strictEqual(verifySetter, false, 'setter should not be verified');
        assert.strictEqual(verifyGetterAndSetterGetter, false, 'getter of getter and setter should not be verified');
        assert.strictEqual(verifyGetterAndSetterSetter, true, 'setter of getter and setter should be verified');
    });

    QUnit.test('verify - no arguments - was not called should not find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        // Act
        var result = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        });

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - no arguments - was not called should not find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        // Act
        var result = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - no arguments - was not called should return true on 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        // Act
        var result = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should verified');
    });

    QUnit.test('verify - no arguments - was called should return false on 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        context.testObject.noArgumentsFunction();

        // Act
        var result = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should return false on 0 mathes');
    });

    QUnit.test('verify - no arguments - was called should return true on 1 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        context.testObject.noArgumentsFunction();

        // Act
        var result = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should be verified');
    });

    QUnit.test('verify - no arguments - was called should return false on 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        context.testObject.noArgumentsFunction();

        // Act
        var result = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - no arguments - was called twice should return true on 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        context.testObject.noArgumentsFunction();
        context.testObject.noArgumentsFunction();

        // Act
        var result = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should be verified');
    });

    QUnit.test('verify - no arguments - was called twice should return false on 1 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        context.testObject.noArgumentsFunction();
        context.testObject.noArgumentsFunction();

        // Act
        var result = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - no arguments - was called twice should return false on 3 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        context.testObject.noArgumentsFunction();
        context.testObject.noArgumentsFunction();

        // Act
        var result = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - one argument - was not called should not find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg);
        });

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verify - one argument - was not called should not find 1 match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg);
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verify - one argument - was not called should not find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verify - one argument - was not called should find 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg);
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should find 0 matches');
    });

    QUnit.test('verify - one argument - was called should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.oneArgumentsFunction(arg);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg);
        });

        // Assert
        assert.strictEqual(result, true, 'should find a match');
    });

    QUnit.test('verify - one argument - was called should find 1 match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.oneArgumentsFunction(arg);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg);
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should find a match');
    });

    QUnit.test('verify - one argument - was called should not find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.oneArgumentsFunction(arg);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not find matches');
    });

    QUnit.test('verify - one argument - was called should not verify 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.oneArgumentsFunction(arg);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg);
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify 0 matches');
    });

    QUnit.test('verify - one argument - was called twice should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.oneArgumentsFunction(arg);
        context.testObject.oneArgumentsFunction(arg);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg);
        });

        // Assert
        assert.strictEqual(result, true, 'should verify match');
    });

    QUnit.test('verify - one argument - was called twice should find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.oneArgumentsFunction(arg);
        context.testObject.oneArgumentsFunction(arg);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify match');
    });

    QUnit.test('verify - one argument - was called twice should not find 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.oneArgumentsFunction(arg);
        context.testObject.oneArgumentsFunction(arg);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg);
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify 0 matches');
    });

    QUnit.test('verify - one argument - was called twice should not find 1 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.oneArgumentsFunction(arg);
        context.testObject.oneArgumentsFunction(arg);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg);
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify 1 matches');
    });

    QUnit.test('verify - one argument - was called twice should not find 3 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.oneArgumentsFunction(arg);
        context.testObject.oneArgumentsFunction(arg);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg);
        }, Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not verify 3 matches');
    });

    QUnit.test('verify - one argument - was called twice should verify first arg', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg1);
        });

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - one argument - was called twice should verify first arg called 1 time', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg1);
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - one argument - was called twice should not verify first arg called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg1);
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called twice should not verify first arg called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg1);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called 3 times should not verify first arg called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg1);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called 3 times should verify first arg called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);
        context.testObject.oneArgumentsFunction(arg1);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg1);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - one argument - was called twice should verify second arg was called', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg2);
        });

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - one argument - was called twice should verify second arg was called 1 time', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg2);
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - one argument - was called twice should not verify second arg was called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg2);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called twice should not verify second arg was called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg2);
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called 3 times should not verify second arg was called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg2);
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called 3 times should not verify second arg was called 1 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg2);
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called 3 times should verify second arg was called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg2);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - one argument - was called 3 times should not verify second arg was called 3 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg2);
        }, Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called twice should not verify with another arg', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg3);
        });

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called twice should not verify with another arg was called 1 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg3);
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called twice should not verify with another arg was called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg3);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - one argument - was called twice should verify with another arg was called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg3);
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments - was not called should not verify', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        });

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments - was not called should not verify for 1 time', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments - was not called should not verify for 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments - was not called should verify for 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments - was called should verify', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        });

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments - was called should verify for 1 time', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments - was called should not verify for 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments - was called should not verify for 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments - was called twice should not verify for 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments - was called twice should not verify for 1 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments - was called twice should verify for 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments - was called twice should verify', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        });

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments - was called twice should not verify for 3 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        }, Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should verify first set', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        });

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should verify first set 1 time', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should not verify first set 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should not verify first set 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should verify second set', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);
        });

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should verify second set 1 time', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should not verify second set 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should not verify second set 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should not verify another set', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet2[2]);
        });

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should not verify another set 1 time', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet2[2]);
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should not verify another set 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet2[2]);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - many arguments -  was called twice with different sets should verify another set 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var argSet1 = [{}, {}, {}];
        var argSet2 = [{}, {}, {}];

        context.testObject.manyArgumentsFunction(argSet1[0], argSet1[1], argSet1[2]);
        context.testObject.manyArgumentsFunction(argSet2[0], argSet2[1], argSet2[2]);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet1[0], argSet1[1], argSet2[2]);
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - getter - was not called should not find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getter;
        });

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - getter - was not called should not find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - getter - was not called should return true on 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should verified');
    });

    QUnit.test('verify - getter - was called should return false on 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var value = context.testObject.getter;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should return false on 0 mathes');
    });

    QUnit.test('verify - getter - was called should return true on 1 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var value = context.testObject.getter;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should be verified');
    });

    QUnit.test('verify - getter - was called should return false on 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var value = context.testObject.getter;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - getter - was called twice should return true on 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var value1 = context.testObject.getter;
        var value2 = context.testObject.getter;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should be verified');
    });

    QUnit.test('verify - getter - was called twice should return false on 1 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var value1 = context.testObject.getter;
        var value2 = context.testObject.getter;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - getter - was called twice should return false on 3 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var value1 = context.testObject.getter;
        var value2 = context.testObject.getter;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - setter - was not called should not find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg;
        });

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verify - setter - was not called should not find 1 match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verify - setter - was not called should not find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verify - setter - was not called should find 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should find 0 matches');
    });

    QUnit.test('verify - setter - was called should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.setter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg;
        });

        // Assert
        assert.strictEqual(result, true, 'should find a match');
    });

    QUnit.test('verify - setter - was called should find 1 match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.setter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should find a match');
    });

    QUnit.test('verify - setter - was called should not find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.setter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not find matches');
    });

    QUnit.test('verify - setter - was called should not verify 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.setter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify 0 matches');
    });

    QUnit.test('verify - setter - was called twice should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.setter = arg;
        context.testObject.setter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg;
        });

        // Assert
        assert.strictEqual(result, true, 'should verify match');
    });

    QUnit.test('verify - setter - was called twice should find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.setter = arg;
        context.testObject.setter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify match');
    });

    QUnit.test('verify - setter - was called twice should not find 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.setter = arg;
        context.testObject.setter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify 0 matches');
    });

    QUnit.test('verify - setter - was called twice should not find 1 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.setter = arg;
        context.testObject.setter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify 1 matches');
    });

    QUnit.test('verify - setter - was called twice should not find 3 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.setter = arg;
        context.testObject.setter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg;
        }, Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not verify 3 matches');
    });

    QUnit.test('verify - setter - was called twice should verify first arg', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg1;
        });

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - setter - was called twice should verify first arg called 1 time', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg1;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - setter - was called twice should not verify first arg called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg1;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - setter - was called twice should not verify first arg called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg1;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - setter - was called 3 times should not verify first arg called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg1;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - setter - was called 3 times should verify first arg called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;
        context.testObject.setter = arg1;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg1;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - setter - was called twice should verify second arg was called', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg2;
        });

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - setter - was called twice should verify second arg was called 1 time', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg2;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - setter - was called twice should not verify second arg was called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg2;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - setter - was called twice should not verify second arg was called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg2;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - setter - was called 3 times should not verify second arg was called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg2;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - setter - was called 3 times should not verify second arg was called 1 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg2;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - setter - was called 3 times should verify second arg was called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg2;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - setter - was called 3 times should not verify second arg was called 3 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg2;
        }, Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - setter - was called twice should not verify with another arg', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg3;
        });

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - setter - was called twice should not verify with another arg was called 1 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg3;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - setter - was called twice should not verify with another arg was called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg3;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - setter - was called twice should verify with another arg was called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.setter = arg1;
        context.testObject.setter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = arg3;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - getter&setter - getter - was not called should not find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter;
        });

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - getter&setter - getter - was not called should not find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - getter&setter - getter - was not called should return true on 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should verified');
    });

    QUnit.test('verify - getter&setter - getter - was called should return false on 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var value = context.testObject.getterAndSetter;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should return false on 0 mathes');
    });

    QUnit.test('verify - getter&setter - getter - was called should return true on 1 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var value = context.testObject.getterAndSetter;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should be verified');
    });

    QUnit.test('verify - getter&setter - getter - was called should return false on 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var value = context.testObject.getterAndSetter;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - getter&setter - getter - was called twice should return true on 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var value1 = context.testObject.getterAndSetter;
        var value2 = context.testObject.getterAndSetter;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should be verified');
    });

    QUnit.test('verify - getter&setter - getter - was called twice should return false on 1 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var value1 = context.testObject.getterAndSetter;
        var value2 = context.testObject.getterAndSetter;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - getter&setter - getter - was called twice should return false on 3 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var value1 = context.testObject.getterAndSetter;
        var value2 = context.testObject.getterAndSetter;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not be verified');
    });

    QUnit.test('verify - getter&setter - setter - was not called should not find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg;
        });

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verify - getter&setter - setter - was not called should not find 1 match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verify - getter&setter - setter - was not called should not find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verify - getter&setter - setter - was not called should find 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should find 0 matches');
    });

    QUnit.test('verify - getter&setter - setter - was called should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.getterAndSetter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg;
        });

        // Assert
        assert.strictEqual(result, true, 'should find a match');
    });

    QUnit.test('verify - getter&setter - setter - was called should find 1 match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.getterAndSetter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should find a match');
    });

    QUnit.test('verify - getter&setter - setter - was called should not find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.getterAndSetter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not find matches');
    });

    QUnit.test('verify - getter&setter - setter - was called should not verify 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.getterAndSetter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify 0 matches');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.getterAndSetter = arg;
        context.testObject.getterAndSetter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg;
        });

        // Assert
        assert.strictEqual(result, true, 'should verify match');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.getterAndSetter = arg;
        context.testObject.getterAndSetter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify match');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should not find 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.getterAndSetter = arg;
        context.testObject.getterAndSetter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify 0 matches');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should not find 1 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.getterAndSetter = arg;
        context.testObject.getterAndSetter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify 1 matches');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should not find 3 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.getterAndSetter = arg;
        context.testObject.getterAndSetter = arg;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg;
        }, Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not verify 3 matches');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should verify first arg', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg1;
        });

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should verify first arg called 1 time', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg1;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should not verify first arg called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg1;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should not verify first arg called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg1;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - getter&setter - setter - was called 3 times should not verify first arg called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg1;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - getter&setter - setter - was called 3 times should verify first arg called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;
        context.testObject.getterAndSetter = arg1;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg1;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should verify second arg was called', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg2;
        });

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should verify second arg was called 1 time', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg2;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should not verify second arg was called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg2;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should not verify second arg was called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg2;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - getter&setter - setter - was called 3 times should not verify second arg was called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg2;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - getter&setter - setter - was called 3 times should not verify second arg was called 1 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg2;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - getter&setter - setter - was called 3 times should verify second arg was called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg2;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - getter&setter - setter - was called 3 times should not verify second arg was called 3 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg2;
        }, Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should not verify with another arg', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg3;
        });

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should not verify with another arg was called 1 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg3;
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should not verify with another arg was called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg3;
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verify - getter&setter - setter - was called twice should verify with another arg was called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.getterAndSetter = arg1;
        context.testObject.getterAndSetter = arg2;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = arg3;
        }, Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verify - complex test', function (assert) {
        // Arrange
        var context = this;
        var argSet = [{}, {}, {}, {}, {}, {}];

        // Act
        context.testObject.noArgumentsFunction();
        context.testObject.oneArgumentsFunction(argSet[0]);
        context.testObject.setter = argSet[0];
        context.testObject.getterAndSetter = argSet[0];
        context.testObject.getterAndSetter;
        context.testObject.manyArgumentsFunction(argSet[2], argSet[2], argSet[2]);
        context.testObject.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]);
        context.testObject.oneArgumentsFunction(argSet[2]);
        context.testObject.getterAndSetter;
        context.testObject.setter = argSet[2];
        context.testObject.getterAndSetter = argSet[2];
        context.testObject.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]);
        context.testObject.oneArgumentsFunction(argSet[0]);
        context.testObject.setter = argSet[0];
        context.testObject.getterAndSetter;
        context.testObject.getterAndSetter = argSet[0];
        context.testObject.manyArgumentsFunction(argSet[1], argSet[1], argSet[1]);
        context.testObject.getter;
        context.testObject.noArgumentsFunction();
        context.testObject.oneArgumentsFunction(argSet[0]);
        context.testObject.setter = argSet[0];
        context.testObject.getterAndSetter = argSet[0];
        context.testObject.getter;
        context.testObject.noArgumentsFunction();
        context.testObject.getterAndSetter;
        context.testObject.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]);
        context.testObject.noArgumentsFunction();
        context.testObject.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]);
        context.testObject.getter;
        context.testObject.setter = argSet[1];
        context.testObject.oneArgumentsFunction(argSet[1]);
        context.testObject.getterAndSetter = argSet[1];
        context.testObject.getterAndSetter = argSet[2];
        context.testObject.getterAndSetter = argSet[2];
        context.testObject.manyArgumentsFunction(argSet[2], argSet[1], argSet[2]);
        context.testObject.getter;
        context.testObject.oneArgumentsFunction(argSet[2]);
        context.testObject.setter = argSet[2];
        context.testObject.setter = argSet[2];
        context.testObject.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]);
        context.testObject.oneArgumentsFunction(argSet[2]);

        // Assert
        assert.strictEqual(context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }), true, 'no arguments function should be verified');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(0)), false, 'no arguments function should not be verified for 0');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(1)), false, 'no arguments function should not be verified for 1');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(2)), false, 'no arguments function should not be verified for 2');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(3)), false, 'no arguments function should not be verified for 3');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(4)), true), 'no arguments function should be verified for 4';
        assert.strictEqual(context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(5)), false, 'no arguments function should not be verified for 5');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(6)), false, 'no arguments function should not be verified for 6');

        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[0]);
        }), true, 'one arguments function should be verified for argSet[0]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[1]);
        }), true, 'one arguments function should be verified for argSet[1]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[2]);
        }), true, 'one arguments function should be verified for argSet[2]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[3]);
        }), false, 'one arguments function should not be verified for argSet[3]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[0]);
        }, Times.exact(0)), false, 'one arguments function should not be verified for argSet[0] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[0]);
        }, Times.exact(1)), false, 'one arguments function should not be verified for argSet[0] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[0]);
        }, Times.exact(2)), false, 'one arguments function not should be verified for argSet[0] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[0]);
        }, Times.exact(3)), true, 'one arguments function should be verified for argSet[0] 3 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[0]);
        }, Times.exact(4)), false, 'one arguments function should not be verified for argSet[0] 4 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[1]);
        }, Times.exact(0)), false, 'one arguments function should not be verified for argSet[1] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[1]);
        }, Times.exact(1)), true, 'one arguments function should be verified for argSet[1] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[1]);
        }, Times.exact(2)), false, 'one arguments function should not be verified for argSet[1] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[1]);
        }, Times.exact(3)), false, 'one arguments function should not be verified for argSet[1] 3 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[2]);
        }, Times.exact(0)), false, 'one arguments function should not be verified for argSet[2] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[2]);
        }, Times.exact(1)), false, 'one arguments function should not be verified for argSet[2] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[2]);
        }, Times.exact(2)), false, 'one arguments function should not be verified for argSet[2] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[2]);
        }, Times.exact(3)), true, 'one arguments function should be verified for argSet[2] 3 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[2]);
        }, Times.exact(4)), false, 'one arguments function should not be verified for argSet[2] 4 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(argSet[2]);
        }, Times.exact(5)), false, 'one arguments function should not be verified for argSet[2] 5 times');

        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]);
        }), true, 'many arguments function should be verified for argSet[0,1,2]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]);
        }, Times.exact(0)), false, 'many arguments function should not be verified for argSet[0,1,2] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]);
        }, Times.exact(1)), false, 'many arguments function should not be verified for argSet[0,1,2] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]);
        }, Times.exact(2)), false, 'many arguments function should not be verified for argSet[0,1,2] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]);
        }, Times.exact(3)), true, 'many arguments function should be verified for argSet[0,1,2] 3 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]);
        }, Times.exact(4)), false, 'many arguments function should not be verified for argSet[0,1,2] 4 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[2]);
        }, Times.exact(5)), false, 'many arguments function should not be verified for argSet[0,1,2] 5 times');

        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]);
        }), true, 'many arguments function should be verified for argSet[0,1,0]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]);
        }, Times.exact(0)), false, 'many arguments function should not be verified for argSet[0,1,0] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]);
        }, Times.exact(1)), false, 'many arguments function should not be verified for argSet[0,1,0] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]);
        }, Times.exact(2)), true, 'many arguments function should be verified for argSet[0,1,0] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]);
        }, Times.exact(3)), false, 'many arguments function should not be verified for argSet[0,1,0] 3 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[1], argSet[0]);
        }, Times.exact(4)), false, 'many arguments function should not be verified for argSet[0,1,0] 4 times');

        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[1], argSet[1], argSet[1]);
        }), true, 'many arguments function should not be verified for argSet[1,1,1]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[1], argSet[1], argSet[1]);
        }, Times.exact(0)), false, 'many arguments function should not be verified for argSet[1,1,1] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[1], argSet[1], argSet[1]);
        }, Times.exact(1)), true, 'many arguments function should be verified for argSet[1,1,1] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[1], argSet[1], argSet[1]);
        }, Times.exact(2)), false, 'many arguments function should not be verified for argSet[1,1,1] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[1], argSet[1], argSet[1]);
        }, Times.exact(3)), false, 'many arguments function should not be verified for argSet[1,1,1] 3 times');

        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[2], argSet[1], argSet[2]);
        }), true, 'many arguments function should be verified for argSet[2,1,2]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[2], argSet[1], argSet[2]);
        }, Times.exact(0)), false, 'many arguments function should not be verified for argSet[2,1,2] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[2], argSet[1], argSet[2]);
        }, Times.exact(1)), true, 'many arguments function should be verified for argSet[2,1,2] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[2], argSet[1], argSet[2]);
        }, Times.exact(2)), false, 'many arguments function should not be verified for argSet[2,1,2] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[2], argSet[1], argSet[2]);
        }, Times.exact(3)), false, 'many arguments function should not be verified for argSet[2,1,2] 3 times');

        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[2], argSet[2], argSet[2]);
        }), true, 'many arguments function should be verified for argSet[2,2,2]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[2], argSet[2], argSet[2]);
        }, Times.exact(0)), false, 'many arguments function should not be verified for argSet[2,2,2] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[2], argSet[2], argSet[2]);
        }, Times.exact(1)), true, 'many arguments function should be verified for argSet[2,2,2] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[2], argSet[2], argSet[2]);
        }, Times.exact(2)), false, 'many arguments function should not be verified for argSet[2,2,2] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[2], argSet[2], argSet[2]);
        }, Times.exact(3)), false, 'many arguments function should not be verified for argSet[2,2,2] 3 times');

        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[0], argSet[0]);
        }), false, 'many arguments function should not be verified for argSet[0,0,0]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[0], argSet[0]);
        }, Times.exact(0)), true, 'many arguments function should be verified for argSet[0,0,0] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[0], argSet[0]);
        }, Times.exact(1)), false, 'many arguments function should not be verified for argSet[0,0,0] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[0], argSet[0]);
        }, Times.exact(2)), false, 'many arguments function should not be verified for argSet[0,0,0] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.manyArgumentsFunction(argSet[0], argSet[0], argSet[0]);
        }, Times.exact(3)), false, 'many arguments function should not be verified for argSet[0,0,0] 3 times');

        assert.strictEqual(context.mole.verify(function (_) {
            return _.getter;
        }), true, 'getter should be verified');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(0)), false, 'getter should not be verified for 0');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(1)), false, 'getter should not be verified for 1');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(2)), false, 'getter should not be verified for 2');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(3)), false, 'getter should not be verified for 3');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(4)), true), 'getter should be verified for 4';
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(5)), false, 'getter should not be verified for 5');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(6)), false, 'getter should not be verified for 6');

        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[0];
        }), true, 'setter should be verified for argSet[0]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[1];
        }), true, 'setter should be verified for argSet[1]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[2];
        }), true, 'setter should be verified for argSet[2]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[3];
        }), false, 'setter should not be verified for argSet[3]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[0];
        }, Times.exact(0)), false, 'setter should not be verified for argSet[0] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[0];
        }, Times.exact(1)), false, 'setter should not be verified for argSet[0] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[0];
        }, Times.exact(2)), false, 'setter not should be verified for argSet[0] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[0];
        }, Times.exact(3)), true, 'setter should be verified for argSet[0] 3 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[0];
        }, Times.exact(4)), false, 'setter should not be verified for argSet[0] 4 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[1];
        }, Times.exact(0)), false, 'setter should not be verified for argSet[1] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[1];
        }, Times.exact(1)), true, 'setter should be verified for argSet[1] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[1];
        }, Times.exact(2)), false, 'setter should not be verified for argSet[1] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[1];
        }, Times.exact(3)), false, 'setter should not be verified for argSet[1] 3 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[2];
        }, Times.exact(0)), false, 'setter should not be verified for argSet[2] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[2];
        }, Times.exact(1)), false, 'setter should not be verified for argSet[2] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[2];
        }, Times.exact(2)), false, 'setter should not be verified for argSet[2] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[2];
        }, Times.exact(3)), true, 'setter should be verified for argSet[2] 3 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[2];
        }, Times.exact(4)), false, 'setter should not be verified for argSet[2] 4 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.setter = argSet[2];
        }, Times.exact(5)), false, 'setter should not be verified for argSet[2] 5 times');

        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter;
        }), true, 'getterAndSetter getter should be verified');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(0)), false, 'getterAndSetter getter should not be verified for 0');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(1)), false, 'getterAndSetter getter should not be verified for 1');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(2)), false, 'getterAndSetter getter should not be verified for 2');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(3)), false, 'getterAndSetter getter should not be verified for 3');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(4)), true), 'getterAndSetter getter should be verified for 4';
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(5)), false, 'getterAndSetter getter should not be verified for 5');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(6)), false, 'getterAndSetter getter should not be verified for 6');

        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[0];
        }), true, 'getterAndSetter setter should be verified for argSet[0]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[1];
        }), true, 'getterAndSetter setter should be verified for argSet[1]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[2];
        }), true, 'getterAndSetter setter should be verified for argSet[2]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[3];
        }), false, 'getterAndSetter setter should not be verified for argSet[3]');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[0];
        }, Times.exact(0)), false, 'getterAndSetter setter should not be verified for argSet[0] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[0];
        }, Times.exact(1)), false, 'getterAndSetter setter should not be verified for argSet[0] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[0];
        }, Times.exact(2)), false, 'getterAndSetter setter not should be verified for argSet[0] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[0];
        }, Times.exact(3)), true, 'getterAndSetter setter should be verified for argSet[0] 3 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[0];
        }, Times.exact(4)), false, 'getterAndSetter setter should not be verified for argSet[0] 4 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[1];
        }, Times.exact(0)), false, 'getterAndSetter setter should not be verified for argSet[1] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[1];
        }, Times.exact(1)), true, 'getterAndSetter setter should be verified for argSet[1] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[1];
        }, Times.exact(2)), false, 'getterAndSetter setter should not be verified for argSet[1] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[1];
        }, Times.exact(3)), false, 'getterAndSetter setter should not be verified for argSet[1] 3 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[2];
        }, Times.exact(0)), false, 'getterAndSetter setter should not be verified for argSet[2] 0 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[2];
        }, Times.exact(1)), false, 'getterAndSetter setter should not be verified for argSet[2] 1 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[2];
        }, Times.exact(2)), false, 'getterAndSetter setter should not be verified for argSet[2] 2 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[2];
        }, Times.exact(3)), true, 'getterAndSetter setter should be verified for argSet[2] 3 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[2];
        }, Times.exact(4)), false, 'getterAndSetter setter should not be verified for argSet[2] 4 times');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getterAndSetter = argSet[2];
        }, Times.exact(5)), false, 'getterAndSetter setter should not be verified for argSet[2] 5 times');
    });

    QUnit.test('verify - times returns false should return false', 1, function (assert) {
        // Arrange
        var context = this;

        var timesMole = {
            match: function () {
                return false;
            }
        };

        // Act
        var result = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, timesMole);

        // Assert
        assert.strictEqual(result, false, 'should return false if times do not match');
    });

    QUnit.test('verify - times returns true should return true', 1, function (assert) {
        // Arrange
        var context = this;

        var timesMole = {
            match: function () {
                return true;
            }
        };

        // Act
        var result = context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, timesMole);

        // Assert
        assert.strictEqual(result, true, 'should return true if times match');
    });

    QUnit.test('verify - one argument - ItIsBase returns false should return false', 1, function (assert) {
        // Arrange
        var context = this;

        var itIs = new ItIsBase();
        itIs.match = function () {
            return false;
        };

        context.testObject.oneArgumentsFunction(1);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(itIs);
        });

        // Assert
        assert.strictEqual(result, false, 'should return false if ItIs returns false');
    });

    QUnit.test('verify - one argument - ItIsBase returns false should return true', 1, function (assert) {
        // Arrange
        var context = this;

        var itIs = new ItIsBase();
        itIs.match = function () {
            return true;
        };

        context.testObject.oneArgumentsFunction(1);

        // Act
        var result = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(itIs);
        });

        // Assert
        assert.strictEqual(result, true, 'should return true if ItIs returns true');
    });

    QUnit.test('verify - many arguments - ItIsBase returns false should return false', 1, function (assert) {
        // Arrange
        var context = this;

        var itIs = new ItIsBase();
        itIs.match = function () {
            return false;
        };

        context.testObject.manyArgumentsFunction(1, 1, 1);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(itIs, itIs, itIs);
        });

        // Assert
        assert.strictEqual(result, false, 'should return false if ItIs returns false');
    });

    QUnit.test('verify - many arguments - ItIsBase returns true should return true', 1, function (assert) {
        // Arrange
        var context = this;

        var itIs = new ItIsBase();
        itIs.match = function () {
            return true;
        };

        context.testObject.manyArgumentsFunction(1, 1, 1);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(itIs, itIs, itIs);
        });

        // Assert
        assert.strictEqual(result, true, 'should return true if ItIs returns true');
    });

    QUnit.test('verify - many arguments - ItIsBase returns true and false should return false', 1, function (assert) {
        // Arrange
        var context = this;

        var trueItIs = new ItIsBase();
        trueItIs.match = function () {
            return true;
        };

        var falseItIs = new ItIsBase();
        falseItIs.match = function () {
            return false;
        };

        context.testObject.manyArgumentsFunction(1, 1, 1);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(trueItIs, trueItIs, falseItIs);
        });

        // Assert
        assert.strictEqual(result, false, 'should return false if some ItIs returns false');
    });

    QUnit.test('verify - many arguments - ItIsBase returns true and other arguments dont match should return false', 1, function (assert) {
        // Arrange
        var context = this;

        var trueItIs = new ItIsBase();
        trueItIs.match = function () {
            return true;
        };

        context.testObject.manyArgumentsFunction(1, 1, 1);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(trueItIs, trueItIs, 2);
        });

        // Assert
        assert.strictEqual(result, false, 'should return false if some arguments dont match');
    });

    QUnit.test('verify - many arguments - called many times ItIsBase returns true should return true', 1, function (assert) {
        // Arrange
        var context = this;

        var trueItIs = new ItIsBase();
        trueItIs.match = function () {
            return true;
        };

        context.testObject.manyArgumentsFunction(1, 1, 2);
        context.testObject.manyArgumentsFunction(1, 1, 1);
        context.testObject.manyArgumentsFunction(1, 1, 1);
        context.testObject.manyArgumentsFunction(1, 1, 2);
        context.testObject.manyArgumentsFunction(1, 1, 1);
        context.testObject.manyArgumentsFunction(1, 1, 1);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(trueItIs, trueItIs, 2);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should return true if ItIs returns true and the times match');
    });

    QUnit.test('verify - many arguments - called many times ItIsBase returns true once should return true', 1, function (assert) {
        // Arrange
        var context = this;

        var trueItIs = new ItIsBase();
        var numberOfTimesReturnedTrue = 0;
        trueItIs.match = function () {
            numberOfTimesReturnedTrue++;
            return numberOfTimesReturnedTrue <= 1;
        };

        context.testObject.manyArgumentsFunction(1, 1, 2);
        context.testObject.manyArgumentsFunction(1, 1, 1);
        context.testObject.manyArgumentsFunction(1, 1, 1);
        context.testObject.manyArgumentsFunction(1, 1, 2);
        context.testObject.manyArgumentsFunction(1, 1, 1);
        context.testObject.manyArgumentsFunction(1, 1, 1);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(1, trueItIs, 2);
        }, Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should return true if ItIs returns true and the times match');
    });

    QUnit.test('verify - many arguments - called with numbers and strings should return only the strings', 1, function (assert) {
        // Arrange
        var context = this;

        var numberItIs = It.isAny(Number);
        var stringItIs = It.isAny(String);

        context.testObject.manyArgumentsFunction(11, 1, 1);
        context.testObject.manyArgumentsFunction(12, 1, 2);
        context.testObject.manyArgumentsFunction(13, '1', 3);
        context.testObject.manyArgumentsFunction(14, 1, 4);
        context.testObject.manyArgumentsFunction(15, '112', 5);
        context.testObject.manyArgumentsFunction(16, 1, 6);

        // Act
        var result = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(numberItIs, stringItIs, numberItIs);
        }, Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should return true for 2 string calls');
    });

    QUnit.test('verify - setter - ItIsBase returns false should return false', 1, function (assert) {
        // Arrange
        var context = this;

        var itIs = new ItIsBase();
        itIs.match = function () {
            return false;
        };

        context.testObject.setter = 1;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = itIs;
        });

        // Assert
        assert.strictEqual(result, false, 'should return false if ItIs returns false');
    });

    QUnit.test('verify - setter - ItIsBase returns false should return true', 1, function (assert) {
        // Arrange
        var context = this;

        var itIs = new ItIsBase();
        itIs.match = function () {
            return true;
        };

        context.testObject.setter = 1;

        // Act
        var result = context.mole.verify(function (_) {
            return _.setter = itIs;
        });

        // Assert
        assert.strictEqual(result, true, 'should return true if ItIs returns true');
    });

    QUnit.test('verify - getter&setter - setter - ItIsBase returns false should return false', 1, function (assert) {
        // Arrange
        var context = this;

        var itIs = new ItIsBase();
        itIs.match = function () {
            return false;
        };

        context.testObject.getterAndSetter = 1;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = itIs;
        });

        // Assert
        assert.strictEqual(result, false, 'should return false if ItIs returns false');
    });

    QUnit.test('verify - getter&setter - setter - ItIsBase returns false should return true', 1, function (assert) {
        // Arrange
        var context = this;

        var itIs = new ItIsBase();
        itIs.match = function () {
            return true;
        };

        context.testObject.getterAndSetter = 1;

        // Act
        var result = context.mole.verify(function (_) {
            return _.getterAndSetter = itIs;
        });

        // Assert
        assert.strictEqual(result, true, 'should return true if ItIs returns true');
    });

    QUnit.test('verify - after setups should count ok', function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.getter;
        }).callback(function () {
        });
        context.testObject.getter;
        context.testObject.getter;
        context.testObject.getter;
        context.testObject.getter;

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(1);
        }).callback(function () {
        });
        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(2);
        }).callback(function () {
        });
        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(3);
        }).callback(function () {
        });
        context.testObject.oneArgumentsFunction(1);
        context.testObject.oneArgumentsFunction(2);
        context.testObject.oneArgumentsFunction(2);
        context.testObject.oneArgumentsFunction(3);
        context.testObject.oneArgumentsFunction(3);
        context.testObject.oneArgumentsFunction(3);
        context.testObject.oneArgumentsFunction(4);
        context.testObject.oneArgumentsFunction(4);
        context.testObject.oneArgumentsFunction(4);
        context.testObject.oneArgumentsFunction(4);

        // Assert
        assert.strictEqual(context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(4)), true, 'should verify getter correctly');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(1);
        }, Times.exact(1)), true, 'should verify calling the function with parameter correctly');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(2);
        }, Times.exact(2)), true, 'should verify calling the function with parameter correctly');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(3);
        }, Times.exact(3)), true, 'should verify calling the function with parameter correctly');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(4);
        }, Times.exact(4)), true, 'should verify calling the function with parameter correctly');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }, Times.exact(10)), true, 'should verify calling with any number correctly');
        assert.strictEqual(context.mole.verify(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }, Times.exact(11)), false, 'should verify calling with any number correctly');
    });

    QUnit.test('verifyPrivate - should verify only the private function', 3, function (assert) {
        // Arrange
        var context = this;
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        context.testObject.callPrivateFunction(1);

        // Assert
        var verifyPrivateFunction = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [1]);
        var verifyOneArguments = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg1);
        });
        var verifyManyArguments = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        });

        assert.strictEqual(verifyPrivateFunction, true, 'private function should be verified');
        assert.strictEqual(verifyOneArguments, false, 'one arguments should not be verified');
        assert.strictEqual(verifyManyArguments, false, 'many arguments should not be verified');
    });

    QUnit.test('verifyPrivate - should verify only the many argument function', 3, function (assert) {
        // Arrange
        var context = this;
        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        // Act
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);

        // Assert
        var verifyPrivateFunction = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [It.isAny(Object)]);
        var verifyOneArguments = context.mole.verify(function (_) {
            return _.oneArgumentsFunction(arg1);
        });
        var verifyManyArguments = context.mole.verify(function (_) {
            return _.manyArgumentsFunction(arg1, arg2, arg3);
        });

        assert.strictEqual(verifyPrivateFunction, false, 'no arguments should not be verified');
        assert.strictEqual(verifyOneArguments, false, 'one arguments should not be verified');
        assert.strictEqual(verifyManyArguments, true, 'many arguments should be verified');
    });

    QUnit.test('verifyPrivate - was not called should not find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg]);

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verifyPrivate - was not called should not find 1 match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verifyPrivate - was not called should not find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not find a match');
    });

    QUnit.test('verifyPrivate - was not called should find 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should find 0 matches');
    });

    QUnit.test('verifyPrivate - was called should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.callPrivateFunction(arg);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg]);

        // Assert
        assert.strictEqual(result, true, 'should find a match');
    });

    QUnit.test('verifyPrivate - was called should find 1 match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.callPrivateFunction(arg);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should find a match');
    });

    QUnit.test('verifyPrivate - was called should not find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.callPrivateFunction(arg);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not find matches');
    });

    QUnit.test('verifyPrivate - was called should not verify 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.callPrivateFunction(arg);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify 0 matches');
    });

    QUnit.test('verifyPrivate - was called twice should find a match', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.callPrivateFunction(arg);
        context.testObject.callPrivateFunction(arg);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg]);

        // Assert
        assert.strictEqual(result, true, 'should verify match');
    });

    QUnit.test('verifyPrivate - was called twice should find 2 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.callPrivateFunction(arg);
        context.testObject.callPrivateFunction(arg);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify match');
    });

    QUnit.test('verifyPrivate - was called twice should not find 0 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.callPrivateFunction(arg);
        context.testObject.callPrivateFunction(arg);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify 0 matches');
    });

    QUnit.test('verifyPrivate - was called twice should not find 1 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.callPrivateFunction(arg);
        context.testObject.callPrivateFunction(arg);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify 1 matches');
    });

    QUnit.test('verifyPrivate - was called twice should not find 3 matches', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg = {};

        context.testObject.callPrivateFunction(arg);
        context.testObject.callPrivateFunction(arg);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg], Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not verify 3 matches');
    });

    QUnit.test('verifyPrivate - was called twice should verify first arg', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg1]);

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verifyPrivate - was called twice should verify first arg called 1 time', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg1], Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verifyPrivate - was called twice should not verify first arg called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg1], Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called twice should not verify first arg called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg1], Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called 3 times should not verify first arg called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg1], Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called 3 times should verify first arg called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);
        context.testObject.callPrivateFunction(arg1);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg1], Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verifyPrivate - was called twice should verify second arg was called', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg2]);

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verifyPrivate - was called twice should verify second arg was called 1 time', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg2], Times.exact(1));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verifyPrivate - was called twice should not verify second arg was called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg2], Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called twice should not verify second arg was called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg2], Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called 3 times should not verify second arg was called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg2], Times.exact(0));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called 3 times should not verify second arg was called 1 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg2], Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called 3 times should verify second arg was called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg2], Times.exact(2));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verifyPrivate - was called 3 times should not verify second arg was called 3 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg2], Times.exact(3));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called twice should not verify with another arg', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg3]);

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called twice should not verify with another arg was called 1 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg3], Times.exact(1));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called twice should not verify with another arg was called 2 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg3], Times.exact(2));

        // Assert
        assert.strictEqual(result, false, 'should not verify');
    });

    QUnit.test('verifyPrivate - was called twice should verify with another arg was called 0 times', function (assert) {
        QUnit.expect(1);

        // Arrange
        var context = this;

        var arg1 = {};
        var arg2 = {};
        var arg3 = {};

        context.testObject.callPrivateFunction(arg1);
        context.testObject.callPrivateFunction(arg2);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [arg3], Times.exact(0));

        // Assert
        assert.strictEqual(result, true, 'should verify');
    });

    QUnit.test('verifyPrivate - times returns false should return false', 1, function (assert) {
        // Arrange
        var context = this;

        var timesMole = {
            match: function () {
                return false;
            }
        };

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [1], timesMole);

        // Assert
        assert.strictEqual(result, false, 'should return false if times do not match');
    });

    QUnit.test('verifyPrivate - times returns true should return true', 1, function (assert) {
        // Arrange
        var context = this;

        var timesMole = {
            match: function () {
                return true;
            }
        };

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [1], timesMole);

        // Assert
        assert.strictEqual(result, true, 'should return true if times match');
    });

    QUnit.test('verifyPrivate - one argument - ItIsBase returns false should return false', 1, function (assert) {
        // Arrange
        var context = this;

        var itIs = new ItIsBase();
        itIs.match = function () {
            return false;
        };

        context.testObject.callPrivateFunction(1);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [itIs]);

        // Assert
        assert.strictEqual(result, false, 'should return false if ItIs returns false');
    });

    QUnit.test('verifyPrivate - one argument - ItIsBase returns false should return true', 1, function (assert) {
        // Arrange
        var context = this;

        var itIs = new ItIsBase();
        itIs.match = function () {
            return true;
        };

        context.testObject.callPrivateFunction(1);

        // Act
        var result = context.mole.verifyPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, [itIs]);

        // Assert
        assert.strictEqual(result, true, 'should return true if ItIs returns true');
    });

    QUnit.test('callBase - set to true after constructor should call the original function', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = true;

        testObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(true, 'original function should be called');
        };

        // Act
        testObject.noArgumentsFunction();
    });

    QUnit.test('callBase - set to true after constructor should call the original getter', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = true;

        var originalGetterWasCalled = function () {
            // Assert
            assert.ok(true, 'original getter should be called');
        };

        testObject.onGetterCalled = originalGetterWasCalled;

        // Act
        testObject.getter;
    });

    QUnit.test('callBase - set to true after constructor should call the original setter', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = true;

        var originalSetterWasCalled = function () {
            // Assert
            assert.ok(true, 'original setter should be called');
        };

        testObject.onSetterCalled = originalSetterWasCalled;

        // Act
        testObject.setter = 1;
    });

    QUnit.test('callBase - set to true after constructor should call the original getter of getter and setter', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = true;

        var originalGetterWasCalled = function () {
            // Assert
            assert.ok(true, 'original getter should be called');
        };

        testObject.onGetterOfGetterAndSetterCalled = originalGetterWasCalled;

        // Act
        testObject.getterAndSetter;
    });

    QUnit.test('callBase - set to true after constructor should call the original setter of getter and setter', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = true;

        var originalSetterWasCalled = function () {
            // Assert
            assert.ok(true, 'original setter should be called');
        };

        testObject.onSetterOfGetterAndSetterCalled = originalSetterWasCalled;

        // Act
        testObject.getterAndSetter = 1;
    });

    QUnit.test('callBase - set to false after constructor should not call the original function', 0, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = false;

        testObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(false, 'original function should not be called');
        };

        // Act
        testObject.noArgumentsFunction();
    });

    QUnit.test('callBase - set to false after constructor should not call the original getters and setters', 0, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = false;

        var shouldNotCall = function () {
            // Assert
            assert.ok(false, 'should not be called');
        };

        testObject.onGetterCalled = shouldNotCall;
        testObject.onSetterCalled = shouldNotCall;
        testObject.onGetterOfGetterAndSetterCalled = shouldNotCall;
        testObject.onSetterOfGetterAndSetterCalled = shouldNotCall;

        // Act
        testObject.getter;
        testObject.setter = 1;
        testObject.getterAndSetter;
        testObject.getterAndSetter = 1;
    });

    QUnit.test('callBase - set to true should return the original function value', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = true;

        // Act
        var result = testObject.returning1Function();

        // Assert
        assert.strictEqual(result, 1, 'should return the original value');
    });

    QUnit.test('callBase - set to true should return the original getter value', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = true;

        var getterValue = {};
        testObject.getterValue = getterValue;

        // Act
        var result = testObject.getter;

        // Assert
        assert.strictEqual(result, getterValue, 'should return the correct value');
    });

    QUnit.test('callBase - set to true should set the setter value', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = true;

        var setterValue = {};

        // Act
        testObject.setter = setterValue;

        // Assert
        assert.strictEqual(testObject.setterValue, setterValue, 'should set the correct value');
    });

    QUnit.test('callBase - set to true should return the original getter of getter and setter value', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = true;

        var getterAndSetterValue = {};
        testObject.getterAndSetterValue = getterAndSetterValue;

        // Act
        var result = testObject.getterAndSetter;

        // Assert
        assert.strictEqual(result, getterAndSetterValue, 'should return the correct value');
    });

    QUnit.test('callBase - set to true should set the setter of getter and setter value', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = true;

        var getterAndSetterValue = {};

        // Act
        testObject.getterAndSetter = getterAndSetterValue;

        // Assert
        assert.strictEqual(testObject.getterAndSetterValue, getterAndSetterValue, 'should set the correct value');
    });

    QUnit.test('callBase - set to false should not return the original function value', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = false;

        // Act
        var result = testObject.returning1Function();

        // Assert
        assert.notStrictEqual(result, 1, 'should not return the original value');
    });

    QUnit.test('callBase - set to false should not return the original getter value', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = false;

        var getterValue = {};
        testObject.getterValue = getterValue;

        // Act
        var result = testObject.getter;

        // Assert
        assert.notStrictEqual(result, getterValue, 'should not return the value');
    });

    QUnit.test('callBase - set to false should not set the setter value', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = false;

        var setterValue = {};

        // Act
        testObject.setter = setterValue;

        // Assert
        assert.notStrictEqual(testObject.setterValue, setterValue, 'should not set the value');
    });

    QUnit.test('callBase - set to false should not return the original getter of getter and setter value', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = false;

        var getterAndSetterValue = {};
        testObject.getterAndSetterValue = getterAndSetterValue;

        // Act
        var result = testObject.getterAndSetter;

        // Assert
        assert.notStrictEqual(result, getterAndSetterValue, 'should not return the correct value');
    });

    QUnit.test('callBase - set to false should not set the setter of getter and setter value', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = false;

        var getterAndSetterValue = {};

        // Act
        testObject.getterAndSetter = getterAndSetterValue;

        // Assert
        assert.notStrictEqual(testObject.getterAndSetterValue, getterAndSetterValue, 'should not set the value');
    });

    QUnit.test('callBase - set to false should return undefined', 1, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = false;

        // Act
        var result = testObject.returning1Function();

        // Assert
        assert.strictEqual(result, undefined, 'should return undefined');
    });

    QUnit.test('callBase - set to false should return undefined from getters', 2, function (assert) {
        // Arrange
        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);
        mole.callBase = false;

        testObject.getterValue = 1;
        testObject.getterAndSetterValue = 1;

        // Act
        var result1 = testObject.getter;
        var result2 = testObject.getterAndSetter;

        // Assert
        assert.strictEqual(result1, undefined, 'should return undefined');
        assert.strictEqual(result2, undefined, 'should return undefined');
    });

    QUnit.test('setup - callback - should not call callback if function is not called', 0, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).callback(function () {
            // Assert
            assert.ok(false, 'should not call callback');
        });
    });

    QUnit.test('setup - callback - should not call callback if getter is not called', 0, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.getter;
        }).callback(function () {
            // Assert
            assert.ok(false, 'should not call callback');
        });
    });

    QUnit.test('setup - callback - should not call callback if setter is not called', 0, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.setter = 1;
        }).callback(function () {
            // Assert
            assert.ok(false, 'should not call callback');
        });
    });

    QUnit.test('setup - callback - should not call callback if getter of getter and setter is not called', 0, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).callback(function () {
            // Assert
            assert.ok(false, 'should not call callback');
        });
    });

    QUnit.test('setup - callback - should not call callback if setter of getter and setter is not called', 0, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.getterAndSetter = 1;
        }).callback(function () {
            // Assert
            assert.ok(false, 'should not call callback');
        });
    });

    QUnit.test('setup - callback - should call callback when function is called', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - callback - should call callback when getter is called', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getter;
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.getter;
    });

    QUnit.test('setup - callback - should call callback when setter is called', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.setter = 1;
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.setter = 1;
    });

    QUnit.test('setup - callback - should call callback when getter of getter and setter is called', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.getterAndSetter;
    });

    QUnit.test('setup - callback - should call callback when setter of getter and setter is called', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getterAndSetter = 1;
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.getterAndSetter = 1;
    });

    QUnit.test('setup - callback - should not call the original function', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).callback(function () {
        });

        context.testObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - callback - should not call the original getter', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getter;
        }).callback(function () {
        });

        context.testObject.onGetterCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.getter;
    });

    QUnit.test('setup - callback - should not call the original setter', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.setter = 1;
        }).callback(function () {
        });

        context.testObject.onSetterCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.setter = 1;
    });

    QUnit.test('setup - callback - should not call the original getter of getter and setter', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).callback(function () {
        });

        context.testObject.onGetterOfGetterAndSetterCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.getterAndSetter;
    });

    QUnit.test('setup - callback - should not call the original setter of getter and setter', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getterAndSetter = 1;
        }).callback(function () {
        });

        context.testObject.onSetterOfGetterAndSetterCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.getterAndSetter = 1;
    });

    QUnit.test('setup - callback - should pass the same parameters', 1, function (assert) {
        // Arrange
        var context = this;

        var arg = 1;

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).callback(function (_arg) {
            // Assert
            assert.strictEqual(_arg, arg, 'should return same argument');
        });

        // Act
        context.testObject.oneArgumentsFunction(arg);
    });

    QUnit.test('setup - callback - should pass the same parameters 2', 3, function (assert) {
        // Arrange
        var context = this;

        var arg1 = 1;
        var arg2 = 2;
        var arg3 = 3;

        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).callback(function (_arg1, _arg2, _arg3) {
            // Assert
            assert.strictEqual(_arg1, arg1, 'should return same argument');
            assert.strictEqual(_arg2, arg2, 'should return same argument');
            assert.strictEqual(_arg3, arg3, 'should return same argument');
        });

        // Act
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
    });

    QUnit.test('setup - callback - should pass the same parameters to setter', 1, function (assert) {
        // Arrange
        var context = this;

        var arg = 1;

        context.mole.setup(function (_) {
            return _.setter = It.isAny(Number);
        }).callback(function (_arg) {
            // Assert
            assert.strictEqual(_arg, arg, 'should call with same argument');
        });

        // Act
        context.testObject.setter = arg;
    });

    QUnit.test('setup - callback - should pass the same parameters to setter of getter and setter', 1, function (assert) {
        // Arrange
        var context = this;

        var arg = 1;

        context.mole.setup(function (_) {
            return _.getterAndSetter = It.isAny(Number);
        }).callback(function (_arg) {
            // Assert
            assert.strictEqual(_arg, arg, 'should pass the same argument');
        });

        // Act
        context.testObject.getterAndSetter = arg;
    });

    QUnit.test('setup - callback - should not call other original functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).callback(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;
        context.testObject.onGetterCalled = shouldNotHappen;
        context.testObject.onSetterCalled = shouldNotHappen;
        context.testObject.onGetterOfGetterAndSetterCalled = shouldNotHappen;
        context.testObject.onSetterOfGetterAndSetterCalled = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - callback - should not call other original functions 2', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).callback(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;
        context.testObject.onGetterCalled = shouldNotHappen;
        context.testObject.onSetterCalled = shouldNotHappen;
        context.testObject.onGetterOfGetterAndSetterCalled = shouldNotHappen;
        context.testObject.onSetterOfGetterAndSetterCalled = shouldNotHappen;

        // Act
        context.testObject.getterAndSetter;
    });

    QUnit.test('setup - callback - should not call other original functions 3', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.setter = 1;
        }).callback(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;
        context.testObject.onGetterCalled = shouldNotHappen;
        context.testObject.onSetterCalled = shouldNotHappen;
        context.testObject.onGetterOfGetterAndSetterCalled = shouldNotHappen;
        context.testObject.onSetterOfGetterAndSetterCalled = shouldNotHappen;

        // Act
        context.testObject.setter = 1;
    });

    QUnit.test('setup - callback - should not call callbacks on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).callback(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).callback(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).callback(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.getter;
        }).callback(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.setter = 1;
        }).callback(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).callback(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.getterAndSetter = 1;
        }).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;
        context.testObject.onGetterCalled = shouldNotHappen;
        context.testObject.onSetterCalled = shouldNotHappen;
        context.testObject.onGetterOfGetterAndSetterCalled = shouldNotHappen;
        context.testObject.onSetterOfGetterAndSetterCalled = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - callback - should not call lazyReturns on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).callback(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).lazyReturns(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - callback - should not return the callback return value', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.returning1Function();
        }).callback(function () {
            return {};
        });

        // Act
        var result = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result, undefined, 'should return undefined');
    });

    QUnit.test('setup - callback - should call all the callbacks when function is called', 4, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - callback - should call all the callbacks when function is called for getter', 4, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getter;
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.getter;
    });

    QUnit.test('setup - callback - should call all the callbacks when function is called for setter', 4, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.setter = 1;
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.setter = 1;
    });

    QUnit.test('setup - callback - should call all the callbacks when function is called for getter of getter and setter', 4, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.getterAndSetter;
    });

    QUnit.test('setup - callback - should call all the callbacks when function is called for setter of getter and setter', 4, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getterAndSetter = 1;
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.getterAndSetter = 1;
    });

    QUnit.test('setup - callback - should pass teh same parameters to all the callbacks when function is called', 4, function (assert) {
        // Arrange
        var context = this;

        var arg = 12;

        var checkArgument = function (_arg) {
            // Assert
            assert.strictEqual(_arg, arg, 'should pass same argument');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).callback(checkArgument).callback(checkArgument).callback(checkArgument).callback(checkArgument);

        // Act
        context.testObject.oneArgumentsFunction(arg);
    });

    QUnit.test('setup - callback - should pass teh same parameters to all the callbacks when function is called 2', 12, function (assert) {
        // Arrange
        var context = this;

        var arg1 = 11;
        var arg2 = 12;
        var arg3 = 13;

        var checkArgument = function (_arg1, _arg2, _arg3) {
            // Assert
            assert.strictEqual(_arg1, arg1, 'should pass same argument');
            assert.strictEqual(_arg2, arg2, 'should pass same argument');
            assert.strictEqual(_arg3, arg3, 'should pass same argument');
        };

        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).callback(checkArgument).callback(checkArgument).callback(checkArgument).callback(checkArgument);

        // Act
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
    });

    QUnit.test('setup - callback - should not affect verify', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).callback(function () {
        });

        // Assert
        assert.ok(context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(0)), 'should not effect verify');
    });

    QUnit.test('setup - callback - should not affect verify for getter', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.getter;
        }).callback(function () {
        });

        // Assert
        assert.ok(context.mole.verify(function (_) {
            return _.getter;
        }, Times.exact(0)), 'should not effect verify');
    });

    QUnit.test('setup - callback - should not affect verify for setter', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.setter = 1;
        }).callback(function () {
        });

        // Assert
        assert.ok(context.mole.verify(function (_) {
            return _.setter = 1;
        }, Times.exact(0)), 'should not effect verify');
    });

    QUnit.test('setup - callback - should not affect verify for getter of getter and setter', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).callback(function () {
        });

        // Assert
        assert.ok(context.mole.verify(function (_) {
            return _.getterAndSetter;
        }, Times.exact(0)), 'should not effect verify');
    });

    QUnit.test('setup - callback - should not affect verify for setter of getter and setter', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.getterAndSetter = 1;
        }).callback(function () {
        });

        // Assert
        assert.ok(context.mole.verify(function (_) {
            return _.getterAndSetter = 1;
        }, Times.exact(0)), 'should not effect verify');
    });

    QUnit.test('setup - callback - setting setter should not affect getter', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getterAndSetter = 1;
        }).callback(function () {
        });

        var value = {};
        context.testObject.getterAndSetterValue = value;

        // Act
        var result = context.testObject.getterAndSetter;

        // Assert
        assert.strictEqual(result, value, 'should return the correct value');
    });

    QUnit.test('setup - callback - setting getter should not affect setter', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).callback(function () {
        });

        var value = {};

        // Act
        context.testObject.getterAndSetter = value;

        // Assert
        assert.strictEqual(context.testObject.getterAndSetterValue, value, 'should set the correct value');
    });

    QUnit.test('setup - callback - calling with not matching value should call the original function', 2, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(1);
        }).callback(function () {
        });

        var arg = {};
        context.testObject.onOneArgumentsFunctionCalled = function (_arg) {
            // Assert
            assert.ok(true, 'should call the original function');
            assert.strictEqual(_arg, arg, 'should call with the passed value');
        };

        // Act
        context.testObject.oneArgumentsFunction(arg);
    });

    QUnit.test('setup - callback - calling setter with not matching value should call the original setter', 2, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.setter = 1;
        }).callback(function () {
        });

        var arg = {};
        context.testObject.onSetterCalled = function (_arg) {
            // Assert
            assert.ok(true, 'should call the original setter');
            assert.strictEqual(_arg, arg, 'should call with the passed value');
        };

        // Act
        context.testObject.setter = arg;
    });

    QUnit.test('setup - returns - should not call the original function', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).returns(111);

        context.testObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - returns - should not call the original getter', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getter;
        }).returns(111);

        context.testObject.onGetterCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.getter;
    });

    QUnit.test('setup - returns - should not call the original getter of getter and setter', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).returns(111);

        context.testObject.onGetterOfGetterAndSetterCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.getterAndSetter;
    });

    QUnit.test('setup - returns - should not call other original functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).returns(111);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - returns - should not call callbacks on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).returns(111);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).callback(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - returns - should not call lazyReturns on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).returns(111);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).lazyReturns(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - returns - should return the value', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        context.mole.setup(function (_) {
            return _.returning1Function();
        }).returns(returnValue);

        // Act
        var result = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result, returnValue, 'should return the configured value');
    });

    QUnit.test('setup - returns - should return the value for getter', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        context.mole.setup(function (_) {
            return _.getter;
        }).returns(returnValue);

        // Act
        var result = context.testObject.getter;

        // Assert
        assert.strictEqual(result, returnValue, 'should return the configured value');
    });

    QUnit.test('setup - returns - should return the value for getter and setter', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).returns(returnValue);

        // Act
        var result = context.testObject.getterAndSetter;

        // Assert
        assert.strictEqual(result, returnValue, 'should return the configured value');
    });

    QUnit.test('setup - returns - should return the last returns value', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};
        context.mole.setup(function (_) {
            return _.returning1Function();
        }).returns(returnValue1);
        context.mole.setup(function (_) {
            return _.returning1Function();
        }).returns(returnValue2);
        context.mole.setup(function (_) {
            return _.returning1Function();
        }).returns(returnValue3);
        context.mole.setup(function (_) {
            return _.returning1Function();
        }).returns(returnValue4);

        // Act
        var result = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result, returnValue4, 'should return the last returnValue');
    });

    QUnit.test('setup - returns - should not affect verify', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).returns(4);

        // Assert
        assert.ok(context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(0)), 'should not effect verify');
    });

    QUnit.test('setup - returns - setting getter should not affect setter', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).returns(returnValue);

        var valueToSet = {};

        // Act
        context.testObject.getterAndSetter = valueToSet;

        // Assert
        assert.strictEqual(context.testObject.getterAndSetterValue, valueToSet, 'should set the configured value');
    });

    QUnit.test('setup - returns - calling with not matching argument should return the original', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(1);
        }).returns(returnValue);

        // Act
        var result = context.testObject.oneArgumentsFunction(2);

        // Assert
        assert.notStrictEqual(result, returnValue, 'should not return the configured value');
    });

    QUnit.test('setup - returnsInOrder - should not call the original function', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).returnsInOrder([111]);

        context.testObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - returnsInOrder - should not call other original functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).returnsInOrder([111]);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - returnsInOrder - should not call callbacks on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).returnsInOrder([111]);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).callback(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - returnsInOrder - should not call lazyReturns on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).returns([111]);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).lazyReturns(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - returnsInOrder - should return the values', 4, function (assert) {
        // Arrange
        var context = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        context.mole.setup(function (_) {
            return _.returning1Function();
        }).returnsInOrder([returnValue1, returnValue2, returnValue3]);

        // Act
        var result1 = context.testObject.returning1Function();
        var result2 = context.testObject.returning1Function();
        var result3 = context.testObject.returning1Function();
        var result4 = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result1, returnValue1, 'should return the configured value1');
        assert.strictEqual(result2, returnValue2, 'should return the configured value2');
        assert.strictEqual(result3, returnValue3, 'should return the configured value3');
        assert.strictEqual(result4, undefined, 'should return undefined');
    });

    QUnit.test('setup - returnsInOrder - should return the last returns values', 4, function (assert) {
        // Arrange
        var context = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};
        var returnValue5 = {};
        var returnValue6 = {};
        var returnValue7 = {};
        context.mole.setup(function (_) {
            return _.returning1Function();
        }).returns(returnValue1);
        context.mole.setup(function (_) {
            return _.returning1Function();
        }).returnsInOrder([returnValue2, returnValue3, returnValue4]);
        context.mole.setup(function (_) {
            return _.returning1Function();
        }).returnsInOrder([returnValue5, returnValue6, returnValue7]);

        // Act
        var result1 = context.testObject.returning1Function();
        var result2 = context.testObject.returning1Function();
        var result3 = context.testObject.returning1Function();
        var result4 = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result1, returnValue5, 'should return the last returnValue5');
        assert.strictEqual(result2, returnValue6, 'should return the last returnValue6');
        assert.strictEqual(result3, returnValue7, 'should return the last returnValue7');
        assert.strictEqual(result4, undefined, 'should return undefined');
    });

    QUnit.test('setup - returnsInOrder - should not affect verify', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).returnsInOrder([4]);

        // Assert
        assert.ok(context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(0)), 'should not effect verify');
    });

    QUnit.test('setup - returnsInOrder - should return the last returns values for getter', 4, function (assert) {
        // Arrange
        var context = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};
        var returnValue5 = {};
        var returnValue6 = {};
        var returnValue7 = {};
        context.mole.setup(function (_) {
            return _.getter;
        }).returns(returnValue1);
        context.mole.setup(function (_) {
            return _.getter;
        }).returnsInOrder([returnValue2, returnValue3, returnValue4]);
        context.mole.setup(function (_) {
            return _.getter;
        }).returnsInOrder([returnValue5, returnValue6, returnValue7]);

        // Act
        var result1 = context.testObject.getter;
        var result2 = context.testObject.getter;
        var result3 = context.testObject.getter;
        var result4 = context.testObject.getter;

        // Assert
        assert.strictEqual(result1, returnValue5, 'should return the last returnValue5');
        assert.strictEqual(result2, returnValue6, 'should return the last returnValue6');
        assert.strictEqual(result3, returnValue7, 'should return the last returnValue7');
        assert.strictEqual(result4, undefined, 'should return undefined');
    });

    QUnit.test('setup - lazyReturns - should not call returnFunction if function is not called', 0, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturns(function () {
            // Assert
            assert.ok(false, 'should not call returnFunction');
        });
    });

    QUnit.test('setup - lazyReturns - should call returnFunction when function is called', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturns(function () {
            // Assert
            assert.ok(true, 'should call returnFunction');
        });

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - lazyReturns - should not call the original function', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturns(function () {
        });

        context.testObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - lazyReturns - should pass the same parameters', 1, function (assert) {
        // Arrange
        var context = this;

        var arg = 1;

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(function (_arg) {
            // Assert
            assert.strictEqual(_arg, arg, 'should return same argument');
        });

        // Act
        context.testObject.oneArgumentsFunction(arg);
    });

    QUnit.test('setup - lazyReturns - should pass the same parameters 2', 3, function (assert) {
        // Arrange
        var context = this;

        var arg1 = 1;
        var arg2 = 2;
        var arg3 = 3;

        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).lazyReturns(function (_arg1, _arg2, _arg3) {
            // Assert
            assert.strictEqual(_arg1, arg1, 'should return same argument');
            assert.strictEqual(_arg2, arg2, 'should return same argument');
            assert.strictEqual(_arg3, arg3, 'should return same argument');
        });

        // Act
        context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
    });

    QUnit.test('setup - lazyReturns - should not call other original functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturns(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - lazyReturns - should not call callbacks on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturns(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).callback(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - lazyReturns - should not call lazyReturns on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturns(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).lazyReturns(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - lazyReturns - should return the returnFunction return value', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};

        context.mole.setup(function (_) {
            return _.returning1Function();
        }).lazyReturns(function () {
            return returnValue;
        });

        // Act
        var result = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result, returnValue, 'should return returnValue');
    });

    QUnit.test('setup - lazyReturns - should return the last returnFunction return value', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};

        context.mole.setup(function (_) {
            return _.returning1Function();
        }).lazyReturns(function () {
            return returnValue1;
        }).lazyReturns(function () {
            return returnValue2;
        }).lazyReturns(function () {
            return returnValue3;
        }).lazyReturns(function () {
            return returnValue4;
        });

        // Act
        var result = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result, returnValue4, 'should return the last returnValue');
    });

    QUnit.test('setup - lazyReturns - should not affect verify', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturns(function () {
            return 4;
        });

        // Assert
        assert.ok(context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(0)), 'should not effect verify');
    });

    QUnit.test('setup - lazyReturns - should return the last returnFunction return of getter of getter and setter', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};

        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).lazyReturns(function () {
            return returnValue1;
        }).lazyReturns(function () {
            return returnValue2;
        }).lazyReturns(function () {
            return returnValue3;
        }).lazyReturns(function () {
            return returnValue4;
        });

        // Act
        var result = context.testObject.getterAndSetter;

        // Assert
        assert.strictEqual(result, returnValue4, 'should return the last returnValue');
    });

    QUnit.test('setup - lazyReturnsInOrder - should not call returnFunction if function is not called', 0, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturnsInOrder([function () {
                // Assert
                assert.ok(false, 'should not call returnFunction');
            }]);
    });

    QUnit.test('setup - lazyReturnsInOrder - should call returnFunction when function is called', 4, function (assert) {
        // Arrange
        var context = this;

        var functionThatWasCalled = [];
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturnsInOrder([
            function () {
                return functionThatWasCalled.push(1);
            },
            function () {
                return functionThatWasCalled.push(2);
            },
            function () {
                return functionThatWasCalled.push(3);
            }]);

        // Act
        context.testObject.noArgumentsFunction();
        context.testObject.noArgumentsFunction();
        context.testObject.noArgumentsFunction();
        context.testObject.noArgumentsFunction();

        // Assert
        assert.strictEqual(functionThatWasCalled.length, 3, 'there should be only 3 function calls');
        assert.strictEqual(functionThatWasCalled[0], 1, 'should be function number 1');
        assert.strictEqual(functionThatWasCalled[1], 2, 'should be function number 2');
        assert.strictEqual(functionThatWasCalled[2], 3, 'should be function number 3');
    });

    QUnit.test('setup - lazyReturnsInOrder - should not call the original function', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturnsInOrder([function () {
            }]);

        context.testObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - lazyReturnsInOrder - should pass the same parameters', 2, function (assert) {
        // Arrange
        var context = this;

        var arg1 = 1;
        var arg2 = 2;

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturnsInOrder([
            function (_arg1) {
                // Assert
                assert.strictEqual(_arg1, arg1, 'should return same argument');
            }, function (_arg2) {
                // Assert
                assert.strictEqual(_arg2, arg2, 'should return same argument');
            }]);

        // Act
        context.testObject.oneArgumentsFunction(arg1);
        context.testObject.oneArgumentsFunction(arg2);
    });

    QUnit.test('setup - lazyReturnsInOrder - should pass the same parameters 2', 6, function (assert) {
        // Arrange
        var context = this;

        var arg11 = 1;
        var arg12 = 2;
        var arg13 = 3;
        var arg21 = 4;
        var arg22 = 5;
        var arg23 = 6;

        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).lazyReturnsInOrder([
            function (_arg11, _arg12, _arg13) {
                // Assert
                assert.strictEqual(_arg11, arg11, 'should return same argument');
                assert.strictEqual(_arg12, arg12, 'should return same argument');
                assert.strictEqual(_arg13, arg13, 'should return same argument');
            }, function (_arg21, _arg22, _arg23) {
                // Assert
                assert.strictEqual(_arg21, arg21, 'should return same argument');
                assert.strictEqual(_arg22, arg22, 'should return same argument');
                assert.strictEqual(_arg23, arg23, 'should return same argument');
            }]);

        // Act
        context.testObject.manyArgumentsFunction(arg11, arg12, arg13);
        context.testObject.manyArgumentsFunction(arg21, arg22, arg23);
    });

    QUnit.test('setup - lazyReturnsInOrder - should not call other original functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturnsInOrder([function () {
            }]);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - lazyReturnsInOrder - should not call callbacks on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturnsInOrder([function () {
            }]);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).callback(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - lazyReturnsInOrder - should not call lazyReturns on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturnsInOrder([function () {
            }]);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).lazyReturns(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.noArgumentsFunction();
    });

    QUnit.test('setup - lazyReturnsInOrder - should return the returnFunction return values', 4, function (assert) {
        // Arrange
        var context = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};

        context.mole.setup(function (_) {
            return _.returning1Function();
        }).lazyReturnsInOrder([
            function () {
                return returnValue1;
            },
            function () {
                return returnValue2;
            },
            function () {
                return returnValue3;
            }
        ]);

        // Act
        var result1 = context.testObject.returning1Function();
        var result2 = context.testObject.returning1Function();
        var result3 = context.testObject.returning1Function();
        var result4 = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result1, returnValue1, 'should return returnValue1');
        assert.strictEqual(result2, returnValue2, 'should return returnValue2');
        assert.strictEqual(result3, returnValue3, 'should return returnValue3');
        assert.strictEqual(result4, undefined, 'should return undefined');
    });

    QUnit.test('setup - lazyReturnsInOrder - should return the last returnFunction return values', 4, function (assert) {
        // Arrange
        var context = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};
        var returnValue5 = {};
        var returnValue6 = {};
        var returnValue7 = {};

        context.mole.setup(function (_) {
            return _.returning1Function();
        }).lazyReturns(function () {
            return returnValue1;
        }).lazyReturns(function () {
            return returnValue2;
        }).lazyReturnsInOrder([function () {
                return returnValue3;
            }, function () {
                return returnValue4;
            }]).lazyReturnsInOrder([function () {
                return returnValue5;
            }, function () {
                return returnValue6;
            }, function () {
                return returnValue7;
            }]);

        // Act
        var result1 = context.testObject.returning1Function();
        var result2 = context.testObject.returning1Function();
        var result3 = context.testObject.returning1Function();
        var result4 = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result1, returnValue5, 'should return the last returnValue5');
        assert.strictEqual(result2, returnValue6, 'should return the last returnValue6');
        assert.strictEqual(result3, returnValue7, 'should return the last returnValue7');
        assert.strictEqual(result4, undefined, 'should return the last returnValue');
    });

    QUnit.test('setup - lazyReturnsInOrder - should not affect verify', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturnsInOrder([function () {
                return 4;
            }]);

        // Assert
        assert.ok(context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(0)), 'should not effect verify');
    });

    QUnit.test('setup - lazyReturnsInOrder - should return the last returnFunction return values of getter of getter and setter', 4, function (assert) {
        // Arrange
        var context = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};
        var returnValue5 = {};
        var returnValue6 = {};
        var returnValue7 = {};

        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).lazyReturns(function () {
            return returnValue1;
        }).lazyReturns(function () {
            return returnValue2;
        }).lazyReturnsInOrder([function () {
                return returnValue3;
            }, function () {
                return returnValue4;
            }]).lazyReturnsInOrder([function () {
                return returnValue5;
            }, function () {
                return returnValue6;
            }, function () {
                return returnValue7;
            }]);

        // Act
        var result1 = context.testObject.getterAndSetter;
        var result2 = context.testObject.getterAndSetter;
        var result3 = context.testObject.getterAndSetter;
        var result4 = context.testObject.getterAndSetter;

        // Assert
        assert.strictEqual(result1, returnValue5, 'should return the last returnValue5');
        assert.strictEqual(result2, returnValue6, 'should return the last returnValue6');
        assert.strictEqual(result3, returnValue7, 'should return the last returnValue7');
        assert.strictEqual(result4, undefined, 'should return the last returnValue');
    });

    QUnit.test('setup - throws - should not call the original function', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).throws(111);

        context.testObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        try  {
            context.testObject.noArgumentsFunction();
        } catch (e) {
        }
    });

    QUnit.test('setup - throws - should not call other original functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).throws(111);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        try  {
            context.testObject.noArgumentsFunction();
        } catch (e) {
        }
    });

    QUnit.test('setup - throws - should not call callbacks on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).throws(111);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).callback(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        try  {
            context.testObject.noArgumentsFunction();
        } catch (e) {
        }
    });

    QUnit.test('setup - throws - should not call lazyReturns on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).throws(111);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).lazyReturns(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        try  {
            context.testObject.noArgumentsFunction();
        } catch (e) {
        }
    });

    QUnit.test('setup - throws - should throw the error', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError = {};
        context.mole.setup(function (_) {
            return _.returning1Function();
        }).throws(thrownError);

        try  {
            context.testObject.returning1Function();
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the configured error');
        }
    });

    QUnit.test('setup - throws - should throw the last error', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError1 = {};
        var thrownError2 = {};
        var thrownError3 = {};
        var thrownError4 = {};
        context.mole.setup(function (_) {
            return _.returning1Function();
        }).throws(thrownError1).throws(thrownError2).throws(thrownError3).throws(thrownError4);

        try  {
            context.testObject.returning1Function();
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError4, 'should throw the configured error');
        }
    });

    QUnit.test('setup - throws - should throw the last error for getter', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError1 = {};
        var thrownError2 = {};
        var thrownError3 = {};
        var thrownError4 = {};
        context.mole.setup(function (_) {
            return _.getter;
        }).throws(thrownError1).throws(thrownError2).throws(thrownError3).throws(thrownError4);

        try  {
            context.testObject.getter;
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError4, 'should throw the configured error');
        }
    });

    QUnit.test('setup - throws - should throw the last error for setter', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError1 = {};
        var thrownError2 = {};
        var thrownError3 = {};
        var thrownError4 = {};
        context.mole.setup(function (_) {
            return _.setter = 1;
        }).throws(thrownError1).throws(thrownError2).throws(thrownError3).throws(thrownError4);

        try  {
            context.testObject.setter = 1;
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError4, 'should throw the configured error');
        }
    });

    QUnit.test('setup - throws - should throw the last error for getter of getter and setter', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError1 = {};
        var thrownError2 = {};
        var thrownError3 = {};
        var thrownError4 = {};
        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).throws(thrownError1).throws(thrownError2).throws(thrownError3).throws(thrownError4);

        try  {
            context.testObject.getterAndSetter;
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError4, 'should throw the configured error');
        }
    });

    QUnit.test('setup - throws - should throw the last error for setter of getter and setter', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError1 = {};
        var thrownError2 = {};
        var thrownError3 = {};
        var thrownError4 = {};
        context.mole.setup(function (_) {
            return _.getterAndSetter = 1;
        }).throws(thrownError1).throws(thrownError2).throws(thrownError3).throws(thrownError4);

        try  {
            context.testObject.getterAndSetter = 1;
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError4, 'should throw the configured error');
        }
    });

    QUnit.test('setup - throws - should not affect verify', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).throws('error');

        // Assert
        assert.ok(context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(0)), 'should not effect verify');
    });

    QUnit.test('setup - throws - setting getter should not affect setter', 0, function (assert) {
        // Arrange
        var context = this;

        var thrownError1 = {};
        var thrownError2 = {};
        var thrownError3 = {};
        var thrownError4 = {};
        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).throws(thrownError1).throws(thrownError2).throws(thrownError3).throws(thrownError4);

        try  {
            context.testObject.getterAndSetter = 1;
        } catch (e) {
            assert.ok(false, 'should not throw');
        }
    });

    QUnit.test('setup - throws - setting setter should not affect getter', 0, function (assert) {
        // Arrange
        var context = this;

        var thrownError1 = {};
        var thrownError2 = {};
        var thrownError3 = {};
        var thrownError4 = {};
        context.mole.setup(function (_) {
            return _.getterAndSetter = 1;
        }).throws(thrownError1).throws(thrownError2).throws(thrownError3).throws(thrownError4);

        try  {
            context.testObject.getterAndSetter;
        } catch (e) {
            assert.ok(false, 'should not throw');
        }
    });

    QUnit.test('setup - throws - calling setter with not matching argument should not throw', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.setter = 1;
        }).throws({});

        try  {
            context.testObject.setter = 2;
        } catch (e) {
            assert.ok(false, 'should not throw');
        }
    });

    QUnit.test('setup - throws - calling setter of getter and setter with not matching argument should not throw', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.getterAndSetter = 1;
        }).throws({});

        try  {
            context.testObject.getterAndSetter = 2;
        } catch (e) {
            assert.ok(false, 'should not throw');
        }
    });

    QUnit.test('setup - throws - calling function with not matching argument should not throw', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(1);
        }).throws({});

        try  {
            context.testObject.oneArgumentsFunction(2);
        } catch (e) {
            assert.ok(false, 'should not throw');
        }
    });

    QUnit.test('setup - lazyThrows - should not call returnErrorFunction if function is not called', 0, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyThrows(function () {
            // Assert
            assert.ok(false, 'should not call returnFunction');
        });
    });

    QUnit.test('setup - lazyThrows - should call returnErrorFunction when function is called', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyThrows(function () {
            // Assert
            assert.ok(true, 'should call returnFunction');
        });

        try  {
            context.testObject.noArgumentsFunction();
        } catch (e) {
        }
    });

    QUnit.test('setup - lazyThrows - should not call the original function', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyThrows(function () {
        });

        context.testObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        try  {
            context.testObject.noArgumentsFunction();
        } catch (e) {
        }
    });

    QUnit.test('setup - lazyThrows - should pass the same parameters', 1, function (assert) {
        // Arrange
        var context = this;

        var arg = 1;

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyThrows(function (_arg) {
            // Assert
            assert.strictEqual(_arg, arg, 'should return same argument');
        });

        try  {
            context.testObject.oneArgumentsFunction(arg);
        } catch (e) {
        }
    });

    QUnit.test('setup - lazyThrows - should pass the same parameters 2', 3, function (assert) {
        // Arrange
        var context = this;

        var arg1 = 1;
        var arg2 = 2;
        var arg3 = 3;

        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).lazyThrows(function (_arg1, _arg2, _arg3) {
            // Assert
            assert.strictEqual(_arg1, arg1, 'should return same argument');
            assert.strictEqual(_arg2, arg2, 'should return same argument');
            assert.strictEqual(_arg3, arg3, 'should return same argument');
        });

        try  {
            context.testObject.manyArgumentsFunction(arg1, arg2, arg3);
        } catch (e) {
        }
    });

    QUnit.test('setup - lazyThrows - should not call other original functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyThrows(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        try  {
            context.testObject.noArgumentsFunction();
        } catch (e) {
        }
    });

    QUnit.test('setup - lazyThrows - should not call callbacks on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyThrows(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).callback(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        try  {
            context.testObject.noArgumentsFunction();
        } catch (e) {
        }
    });

    QUnit.test('setup - lazyThrows - should not call lazyThrows on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyThrows(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).lazyReturns(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        try  {
            context.testObject.noArgumentsFunction();
        } catch (e) {
        }
    });

    QUnit.test('setup - lazyThrows - should throw the returnErrorFunction error', 1, function (assert) {
        // Arrange
        var context = this;

        var error = {};

        context.mole.setup(function (_) {
            return _.returning1Function();
        }).lazyThrows(function () {
            return error;
        });

        try  {
            context.testObject.returning1Function();
        } catch (actualError) {
            // Assert
            assert.strictEqual(actualError, error, 'should throw the error');
        }
    });

    QUnit.test('setup - lazyThrows - should throw the last returnErrorFunction error', 1, function (assert) {
        // Arrange
        var context = this;

        var error1 = {};
        var error2 = {};
        var error3 = {};
        var error4 = {};

        context.mole.setup(function (_) {
            return _.returning1Function();
        }).lazyThrows(function () {
            return error1;
        }).lazyThrows(function () {
            return error2;
        }).lazyThrows(function () {
            return error3;
        }).lazyThrows(function () {
            return error4;
        });

        try  {
            context.testObject.returning1Function();
        } catch (actualError) {
            // Assert
            assert.strictEqual(actualError, error4, 'should throw the last error');
        }
    });

    QUnit.test('setup - lazyThrows - should not affect verify', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyThrows(function () {
            return 4;
        });

        // Assert
        assert.ok(context.mole.verify(function (_) {
            return _.noArgumentsFunction();
        }, Times.exact(0)), 'should not effect verify');
    });

    QUnit.test('setup - mix - should throw error if configured after return', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setup(function (_) {
            return _.returning1Function();
        }).returns(returnValue).throws(thrownError);

        try  {
            context.testObject.returning1Function();
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the error');
        }
    });

    QUnit.test('setup - mix - should return value if configured after throw', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setup(function (_) {
            return _.returning1Function();
        }).throws(thrownError).returns(returnValue);

        // Act
        var result = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result, returnValue, 'should return the configured value');
    });

    QUnit.test('setup - mix - should call all the callbacks and the lazy returns but return last configured one', 5, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setup(function (_) {
            return _.returning1Function();
        }).throws(thrownError).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 1;
        }).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 2;
        }).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 3;
        }).callback(function () {
            return assert.ok(true, 'should call callback');
        }).returns(returnValue);

        // Act
        var result = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result, returnValue, 'should return the configured value');
    });

    QUnit.test('setup - mix - should call all the callbacks and the lazy returns but return last configured one 2', 5, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setup(function (_) {
            return _.returning1Function();
        }).throws(thrownError).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 1;
        }).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 2;
        }).returns(3).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return returnValue;
        }).callback(function () {
            return assert.ok(true, 'should call callback');
        });

        // Act
        var result = context.testObject.returning1Function();

        // Assert
        assert.strictEqual(result, returnValue, 'should return the configured value');
    });

    QUnit.test('setup - mix - should call all the callbacks and the lazy returns but throw last configured error', 5, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setup(function (_) {
            return _.returning1Function();
        }).throws('asdasd').lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 1;
        }).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 2;
        }).returns(returnValue).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 3;
        }).throws(thrownError).callback(function () {
            return assert.ok(true, 'should call callback');
        });

        try  {
            context.testObject.returning1Function();
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the configured error');
        }
    });

    QUnit.test('setup - mix - should not affect the verify', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        var thrownError = {};

        // Act
        context.mole.setup(function (_) {
            return _.returning1Function();
        }).throws('asdasd').lazyReturns(function () {
            return 1;
        }).lazyReturns(function () {
            return 2;
        }).lazyReturns(function () {
            return 3;
        }).throws(thrownError).returns(returnValue).callback(function () {
        });

        // Assert
        assert.ok(context.mole.verify(function (_) {
            return _.returning1Function();
        }, Times.exact(0)), 'should be called once');
    });

    QUnit.test('setup - mix - should call only the matching set', 3, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(function () {
            assert.ok(false, 'lazyReturns should not be called for any number');
        }).returns('return value').callback(function () {
            assert.ok(false, 'callback should not be called for any number');
        });

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction('aaa');
        }).throws('error').lazyReturns(function () {
            assert.ok(false, 'lazyReturns should not be called aaa');
        }).callback(function () {
            assert.ok(false, 'callback should not be called for aaa');
        });

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction('bbb');
        }).lazyReturns(function () {
            assert.ok(true, 'should be called');
        }).callback(function () {
            assert.ok(true, 'should be called');
        }).returns(returnValue);

        // Act
        var result = context.testObject.oneArgumentsFunction('bbb');

        // Assert
        assert.strictEqual(result, returnValue, 'should return the return value');
    });

    QUnit.test('setup - mix - if both setups match should call both', 4, function (assert) {
        // Arrange
        var context = this;

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(function () {
            assert.ok(true, 'should call');
        }).returns('return value').callback(function () {
            assert.ok(true, 'should call');
        });

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(1);
        }).lazyReturns(function () {
            assert.ok(true, 'should call');
        }).returns('return value').callback(function () {
            assert.ok(true, 'should call');
        });

        // Act
        context.testObject.oneArgumentsFunction(1);
    });

    QUnit.test('setup - mix - if both setups match should return from the last', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(function () {
            return 1;
        }).returns(function () {
            return 2;
        });

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(1);
        }).lazyReturns(function () {
            return 3;
        }).returns(returnValue);

        // Act
        var result = context.testObject.oneArgumentsFunction(1);

        // Assert
        assert.strictEqual(result, returnValue, 'should return the returnValue');
    });

    QUnit.test('setup - mix - if both setups match should return from the last 2', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(1);
        }).lazyReturns(function () {
            return 1;
        }).returns(function () {
            return 2;
        });

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(function () {
            return 3;
        }).returns(returnValue);

        // Act
        var result = context.testObject.oneArgumentsFunction(1);

        // Assert
        assert.strictEqual(result, returnValue, 'should return the returnValue');
    });

    QUnit.test('setup - mix - if both setups match should throw from the last', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError = {};

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(function () {
            return 1;
        }).throws('error').returns(function () {
            return 2;
        });

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(1);
        }).lazyReturns(function () {
            return 3;
        }).throws(thrownError);

        try  {
            context.testObject.oneArgumentsFunction(1);
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the thrownError');
        }
    });

    QUnit.test('setup - mix - if both setups match should throw from the last 2', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError = {};

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(1);
        }).lazyReturns(function () {
            return 1;
        }).throws('error').returns(function () {
            return 2;
        });

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(function () {
            return 3;
        }).throws(thrownError);

        try  {
            context.testObject.oneArgumentsFunction(1);
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the thrownError');
        }
    });

    QUnit.test('setup - mix - setup for one object should not affect other', 5, function (assert) {
        // Arrange
        var context = this;

        var testObject1 = new Tests.TestObject();
        var testObject2 = new Tests.TestObject();

        var mole1 = new Mole(testObject1);
        var mole2 = new Mole(testObject2);

        var arg1 = 10;
        var returnsValue = 1;
        mole1.setup(function (_) {
            return _.getter;
        }).returns(returnsValue);
        mole1.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).callback(function (_arg) {
            // Assert
            assert.strictEqual(_arg, arg1, 'should call with correct argument');
        });

        var arg2 = 20;
        testObject2.onOneArgumentsFunctionCalled = function (_arg) {
            // Assert
            assert.strictEqual(_arg, arg2, 'should call with correct argument');
        };

        testObject1.onGetterCalled = function () {
            // Assert
            assert.ok(false, 'should not be called');
        };

        testObject2.onGetterCalled = function () {
            // Assert
            assert.ok(true, 'should be called');
        };

        var value = {};
        testObject2.getterValue = value;

        // Act
        var result1 = testObject1.getter;
        var result2 = testObject2.getter;
        testObject1.oneArgumentsFunction(arg1);
        testObject2.oneArgumentsFunction(arg2);

        // Assert
        assert.strictEqual(result1, returnsValue, 'should return the correct value');
        assert.strictEqual(result2, value, 'should return the correct value');
    });

    QUnit.test('setupPrivate - callback - should not call callback if function is not called', 0, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME).callback(function () {
            // Assert
            assert.ok(false, 'should not call callback');
        });
    });

    QUnit.test('setupPrivate - callback - should not call callback if getter is not called', 0, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_NAME).callback(function () {
            // Assert
            assert.ok(false, 'should not call callback');
        });
    });

    QUnit.test('setupPrivate - callback - should not call callback if setter is not called', 0, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_SETTER_NAME, 1).callback(function () {
            // Assert
            assert.ok(false, 'should not call callback');
        });
    });

    QUnit.test('setupPrivate - callback - should not call callback if getter of geter&setter is not called', 0, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME).callback(function () {
            // Assert
            assert.ok(false, 'should not call callback');
        });
    });

    QUnit.test('setupPrivate - callback - should not call callback if setter of geter&setter is not called', 0, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).callback(function () {
            // Assert
            assert.ok(false, 'should not call callback');
        });
    });

    QUnit.test('setupPrivate - callback - should call callback when function is called', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, null).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.callPrivateFunction(null);
    });

    QUnit.test('setupPrivate - callback - should call callback when getter is called', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_NAME).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.callPrivateGetter();
    });

    QUnit.test('setupPrivate - callback - should call callback when setter is called', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_SETTER_NAME, 1).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.callPrivateSetter(1);
    });

    QUnit.test('setupPrivate - callback - should not call callback when setter is called with wrong parameter', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_SETTER_NAME, 1).callback(function () {
            // Assert
            assert.ok(false, 'should not call callback');
        });

        // Act
        context.testObject.callPrivateSetter(2);
    });

    QUnit.test('setupPrivate - callback - should call callback when getter of getter&setter is called', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.callPrivateGetterOfGetterAndSetter();
    });

    QUnit.test('setupPrivate - callback - should call callback when setter of getter&setter is called', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.callPrivateSetterOfGetterAndSetter(1);
    });

    QUnit.test('setupPrivate - callback - should not call callback when setter of getter&setter is called with wrong parameter', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).callback(function () {
            // Assert
            assert.ok(false, 'should not call callback');
        });

        // Act
        context.testObject.callPrivateSetterOfGetterAndSetter(2);
    });

    QUnit.test('setupPrivate - callback - should not call the original function', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, null).callback(function () {
        });

        context.testObject.onPrivateFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.callPrivateFunction(null);
    });

    QUnit.test('setupPrivate - callback - should not call the original getter', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_NAME).callback(function () {
        });

        context.testObject.onPrivateGetterCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.callPrivateGetter();
    });

    QUnit.test('setupPrivate - callback - should not call the original setter', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_SETTER_NAME, 1).callback(function () {
        });

        context.testObject.onPrivateSetterCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.callPrivateSetter(1);
    });

    QUnit.test('setupPrivate - callback - should call the original setter if called with other argument', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_SETTER_NAME, 1).callback(function () {
        });

        context.testObject.onPrivateSetterCalled = function () {
            // Assert
            assert.ok(true, 'should call the original setter');
        };

        // Act
        context.testObject.callPrivateSetter(2);
    });

    QUnit.test('setupPrivate - callback - should not call the original getter of getter and setter', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME).callback(function () {
        });

        context.testObject.onPrivateGetterOfGetterAndSetterCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.callPrivateGetterOfGetterAndSetter();
    });

    QUnit.test('setupPrivate - callback - should not call the original setter of getter and setter', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).callback(function () {
        });

        context.testObject.onPrivateSetterOfGetterAndSetterCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.callPrivateSetterOfGetterAndSetter(1);
    });

    QUnit.test('setupPrivate - callback - should call the original setter of getter and setter if called with other argument', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).callback(function () {
        });

        context.testObject.onPrivateSetterOfGetterAndSetterCalled = function () {
            // Assert
            assert.ok(true, 'should call the original setter');
        };

        // Act
        context.testObject.callPrivateSetterOfGetterAndSetter(2);
    });

    QUnit.test('setupPrivate - callback - should pass the same parameters', 1, function (assert) {
        // Arrange
        var context = this;

        var arg = 1;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number)).callback(function (_arg) {
            // Assert
            assert.strictEqual(_arg, arg, 'should return same argument');
        });

        // Act
        context.testObject.callPrivateFunction(arg);
    });

    QUnit.test('setupPrivate - callback - should pass the same parameters 2', 1, function (assert) {
        // Arrange
        var context = this;

        var arg1 = 2;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 2).callback(function (_arg1) {
            // Assert
            assert.strictEqual(_arg1, arg1, 'should return same argument');
        });

        // Act
        context.testObject.callPrivateFunction(arg1);
    });

    QUnit.test('setupPrivate - callback - should pass the same parameters to setter', 1, function (assert) {
        // Arrange
        var context = this;

        var arg1 = 2;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_SETTER_NAME, 2).callback(function (_arg1) {
            // Assert
            assert.strictEqual(_arg1, arg1, 'should return same argument');
        });

        // Act
        context.testObject.callPrivateSetter(arg1);
    });

    QUnit.test('setupPrivate - callback - should pass the same parameters to setter of getter&setter', 1, function (assert) {
        // Arrange
        var context = this;

        var arg1 = 2;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 2).callback(function (_arg1) {
            // Assert
            assert.strictEqual(_arg1, arg1, 'should return same argument');
        });

        // Act
        context.testObject.callPrivateSetterOfGetterAndSetter(arg1);
    });

    QUnit.test('setupPrivate - callback - should not call if not matching', 0, function (assert) {
        // Arrange
        var context = this;

        var arg = 'some text';

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number)).callback(function () {
            // Assert
            assert.ok(false, 'should not be called');
        });

        // Act
        context.testObject.callPrivateFunction(arg);
    });

    QUnit.test('setupPrivate - callback - should not call if not matching 2', 0, function (assert) {
        // Arrange
        var context = this;

        var arg1 = 3;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 2).callback(function () {
            // Assert
            assert.ok(false, 'should not be called');
        });

        // Act
        context.testObject.callPrivateFunction(arg1);
    });

    QUnit.test('setupPrivate - callback - should not call if not matching 3', 0, function (assert) {
        // Arrange
        var context = this;

        var arg1 = 3;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME).callback(function () {
            // Assert
            assert.ok(false, 'should not be called');
        });

        // Act
        context.testObject.callPrivateFunction(undefined);
    });

    QUnit.test('setupPrivate - callback - should not call setter if not matching', 0, function (assert) {
        // Arrange
        var context = this;

        var arg = 'some text';

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_SETTER_NAME, It.isAny(Number)).callback(function () {
            // Assert
            assert.ok(false, 'should not be called');
        });

        // Act
        context.testObject.callPrivateSetter(arg);
    });

    QUnit.test('setupPrivate - callback - should not call setter of getter&setter if not matching', 0, function (assert) {
        // Arrange
        var context = this;

        var arg = 'some text';

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, It.isAny(Number)).callback(function () {
            // Assert
            assert.ok(false, 'should not be called');
        });

        // Act
        context.testObject.callPrivateSetterOfGetterAndSetter(arg);
    });

    QUnit.test('setupPrivate - callback - should not call other original functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, null).callback(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.callPrivateFunction(null);
    });

    QUnit.test('setupPrivate - callback - should not call callbacks on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, null).callback(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).callback(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.callPrivateFunction(null);
    });

    QUnit.test('setupPrivate - callback - should not call lazyReturns on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).callback(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).lazyReturns(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - callback - should not return the callback return value', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).callback(function () {
            return {};
        });

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, undefined, 'should return undefined');
    });

    QUnit.test('setupPrivate - callback - should call all the callbacks when function is called', 4, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - callback - should pass the same parameters to all the callbacks when function is called', 4, function (assert) {
        // Arrange
        var context = this;

        var arg = 12;

        var checkArgument = function (_arg) {
            // Assert
            assert.strictEqual(_arg, arg, 'should pass same argument');
        };

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number)).callback(checkArgument).callback(checkArgument).callback(checkArgument).callback(checkArgument);

        // Act
        context.testObject.callPrivateFunction(arg);
    });

    QUnit.test('setupPrivate - returns - should not call the original function', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).returns(111);

        context.testObject.onPrivateFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - returns - should not call other original functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).returns(111);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - returns - should not call callbacks on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).returns(111);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).callback(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - returns - should not call lazyReturns on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).returns(111);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).lazyReturns(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - returns - should return the value', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).returns(returnValue);

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, returnValue, 'should return the configured value');
    });

    QUnit.test('setupPrivate - returns - should return the last returns value', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).returns(returnValue1);
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).returns(returnValue2);
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).returns(returnValue3);
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).returns(returnValue4);

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, returnValue4, 'should return the last returnValue');
    });

    QUnit.test('setupPrivate - returns - should return the last getter value', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_NAME).returns(returnValue1);
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_NAME).returns(returnValue2);
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_NAME).returns(returnValue3);
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_NAME).returns(returnValue4);

        // Act
        var result = context.testObject.callPrivateGetter();

        // Assert
        assert.strictEqual(result, returnValue4, 'should return the last returnValue');
    });

    QUnit.test('setupPrivate - returns - should return the last getter of getter and setter value', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME).returns(returnValue1);
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME).returns(returnValue2);
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME).returns(returnValue3);
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME).returns(returnValue4);

        // Act
        var result = context.testObject.callPrivateGetterOfGetterAndSetter();

        // Assert
        assert.strictEqual(result, returnValue4, 'should return the last returnValue');
    });

    QUnit.test('setupPrivate - lazyReturns - should not call returnFunction if function is not called', 0, function (assert) {
        // Arrange
        var context = this;

        // Act
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () {
            // Assert
            assert.ok(false, 'should not call returnFunction');
        });
    });

    QUnit.test('setupPrivate - lazyReturns - should call returnFunction when function is called', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () {
            // Assert
            assert.ok(true, 'should call returnFunction');
        });

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - lazyReturns - should not call the original function', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () {
        });

        context.testObject.onPrivateFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - lazyReturns - should pass the same parameters', 1, function (assert) {
        // Arrange
        var context = this;

        var arg = 1;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number)).lazyReturns(function (_arg) {
            // Assert
            assert.strictEqual(_arg, arg, 'should return same argument');
        });

        // Act
        context.testObject.callPrivateFunction(arg);
    });

    QUnit.test('setupPrivate - lazyReturns - should pass the same parameters 2', 1, function (assert) {
        // Arrange
        var context = this;

        var arg1 = 1;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, arg1).lazyReturns(function (_arg1, _arg2, _arg3) {
            // Assert
            assert.strictEqual(_arg1, arg1, 'should return same argument');
        });

        // Act
        context.testObject.callPrivateFunction(arg1);
    });

    QUnit.test('setupPrivate - lazyReturns - should not call other original functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - lazyReturns - should not call callbacks on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).callback(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - lazyReturns - should not call lazyReturns on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () {
        });

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).lazyReturns(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - lazyReturns - should return the returnFunction return value', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () {
            return returnValue;
        });

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, returnValue, 'should return returnValue');
    });

    QUnit.test('setupPrivate - lazyReturns - should return the last returnFunction return value', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue1 = {};
        var returnValue2 = {};
        var returnValue3 = {};
        var returnValue4 = {};

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () {
            return returnValue1;
        }).lazyReturns(function () {
            return returnValue2;
        }).lazyReturns(function () {
            return returnValue3;
        }).lazyReturns(function () {
            return returnValue4;
        });

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, returnValue4, 'should return the last returnValue');
    });

    QUnit.test('setupPrivate - lazyReturns - setup getter should not affect setter', 1, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME).lazyReturns(function () {
            return 1;
        });

        var value = {};

        // Act
        context.testObject.callPrivateSetterOfGetterAndSetter(value);

        // Assert
        assert.strictEqual(context.testObject.privateGetterAndSetterValue, value, 'should set the value');
    });

    QUnit.test('setupPrivate - throws - should not call the original function', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).throws(111);

        context.testObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        try  {
            context.testObject.callPrivateFunction(1);
        } catch (e) {
        }
    });

    QUnit.test('setupPrivate - throws - should not call other original functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).throws(111);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        try  {
            context.testObject.callPrivateFunction(1);
        } catch (e) {
        }
    });

    QUnit.test('setupPrivate - throws - should not call callbacks on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).throws(111);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).callback(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).callback(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        try  {
            context.testObject.callPrivateFunction(1);
        } catch (e) {
        }
    });

    QUnit.test('setupPrivate - throws - should not call lazyReturns on other functions', 0, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).throws(111);

        var shouldNotHappen = function () {
            // Assert
            assert.ok(false, 'should not call the original function');
        };

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(It.isAny(Number));
        }).lazyReturns(shouldNotHappen);
        context.mole.setup(function (_) {
            return _.manyArgumentsFunction(It.isAny(Number), It.isAny(Number), It.isAny(Number));
        }).lazyReturns(shouldNotHappen);

        context.testObject.onNoArgumentsFunctionCalled = shouldNotHappen;
        context.testObject.manyArgumentsFunction = shouldNotHappen;
        context.testObject.oneArgumentsFunction = shouldNotHappen;

        try  {
            context.testObject.callPrivateFunction(1);
        } catch (e) {
        }
    });

    QUnit.test('setupPrivate - throws - should throw the error', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError = {};
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).throws(thrownError);

        try  {
            context.testObject.callPrivateFunction(1);
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the configured error');
        }
    });

    QUnit.test('setupPrivate - throws - should throw the error for getter', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError = {};
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_NAME).throws(thrownError);

        try  {
            context.testObject.callPrivateGetter();
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the configured error');
        }
    });

    QUnit.test('setupPrivate - throws - should throw the error for setter', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError = {};
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_SETTER_NAME, 1).throws(thrownError);

        try  {
            context.testObject.callPrivateSetter(1);
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the configured error');
        }
    });

    QUnit.test('setupPrivate - throws - should not throw the error for setter if arguments dont match', 0, function (assert) {
        // Arrange
        var context = this;

        var thrownError = {};
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_SETTER_NAME, 1).throws(thrownError);

        try  {
            context.testObject.callPrivateSetter(2);
        } catch (error) {
            // Assert
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('setupPrivate - throws - should throw the error for getter of getter&setter', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError = {};
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME).throws(thrownError);

        try  {
            context.testObject.callPrivateGetterOfGetterAndSetter();
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the configured error');
        }
    });

    QUnit.test('setupPrivate - throws - should throw the error for setter of getter&setter', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError = {};
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).throws(thrownError);

        try  {
            context.testObject.callPrivateSetterOfGetterAndSetter(1);
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the configured error');
        }
    });

    QUnit.test('setupPrivate - throws - should not throw the error for setter of getter&setter if arguments dont match', 0, function (assert) {
        // Arrange
        var context = this;

        var thrownError = {};
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).throws(thrownError);

        try  {
            context.testObject.callPrivateSetterOfGetterAndSetter(2);
        } catch (error) {
            // Assert
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('setupPrivate - throws - setup getter should not throw on setter', 0, function (assert) {
        // Arrange
        var context = this;

        var thrownError = {};
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME).throws(thrownError);

        try  {
            context.testObject.callPrivateSetterOfGetterAndSetter(2);
        } catch (error) {
            // Assert
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('setupPrivate - throws - setup setter should not throw on getter', 0, function (assert) {
        // Arrange
        var context = this;

        var thrownError = {};
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).throws(thrownError);

        try  {
            context.testObject.callPrivateGetterOfGetterAndSetter();
        } catch (error) {
            // Assert
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('setupPrivate - throws - should throw the last error', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError1 = {};
        var thrownError2 = {};
        var thrownError3 = {};
        var thrownError4 = {};
        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).throws(thrownError1).throws(thrownError2).throws(thrownError3).throws(thrownError4);

        try  {
            context.testObject.callPrivateFunction(1);
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError4, 'should throw the configured error');
        }
    });

    QUnit.test('setupPrivate - mix - should throw error if configured after return', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).returns(returnValue).throws(thrownError);

        try  {
            context.testObject.callPrivateFunction(1);
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the error');
        }
    });

    QUnit.test('setupPrivate - mix - should return value if configured after throw', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).throws(thrownError).returns(returnValue);

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, returnValue, 'should return the configured value');
    });

    QUnit.test('setupPrivate - mix - should call all the callbacks and the lazy returns but return last configured one', 5, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).throws(thrownError).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 1;
        }).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 2;
        }).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 3;
        }).callback(function () {
            return assert.ok(true, 'should call callback');
        }).returns(returnValue);

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, returnValue, 'should return the configured value');
    });

    QUnit.test('setupPrivate - mix - should call all the callbacks and the lazy returns but return last configured one 2', 5, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).throws(thrownError).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 1;
        }).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 2;
        }).returns(3).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return returnValue;
        }).callback(function () {
            return assert.ok(true, 'should call callback');
        });

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, returnValue, 'should return the configured value');
    });

    QUnit.test('setupPrivate - mix - should call all the callbacks and the lazy returns but throw last configured error', 5, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};
        var thrownError = {};

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).throws('asdasd').lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 1;
        }).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 2;
        }).returns(returnValue).lazyReturns(function () {
            assert.ok(true, 'should call lazyRerturns');
            return 3;
        }).throws(thrownError).callback(function () {
            return assert.ok(true, 'should call callback');
        });

        try  {
            context.testObject.callPrivateFunction(1);
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the configured error');
        }
    });

    QUnit.test('setupPrivate - mix - should call only the matching set', 3, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number)).lazyReturns(function () {
            assert.ok(false, 'lazyReturns should not be called for any number');
        }).returns('return value').callback(function () {
            assert.ok(false, 'callback should not be called for any number');
        });

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 'aaa').throws('error').lazyReturns(function () {
            assert.ok(false, 'lazyReturns should not be called aaa');
        }).callback(function () {
            assert.ok(false, 'callback should not be called for aaa');
        });

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 'bbb').lazyReturns(function () {
            assert.ok(true, 'should be called');
        }).callback(function () {
            assert.ok(true, 'should be called');
        }).returns(returnValue);

        // Act
        var result = context.testObject.callPrivateFunction('bbb');

        // Assert
        assert.strictEqual(result, returnValue, 'should return the return value');
    });

    QUnit.test('setupPrivate - mix - if both setups match should call both', 4, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number)).lazyReturns(function () {
            assert.ok(true, 'should call');
        }).returns('return value').callback(function () {
            assert.ok(true, 'should call');
        });

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () {
            assert.ok(true, 'should call');
        }).returns('return value').callback(function () {
            assert.ok(true, 'should call');
        });

        // Act
        context.testObject.callPrivateFunction(1);
    });

    QUnit.test('setupPrivate - mix - if both setups match should call both for setter', 4, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_SETTER_NAME, It.isAny(Number)).lazyReturns(function () {
            assert.ok(true, 'should call');
        }).returns('return value').callback(function () {
            assert.ok(true, 'should call');
        });

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_SETTER_NAME, 1).lazyReturns(function () {
            assert.ok(true, 'should call');
        }).returns('return value').callback(function () {
            assert.ok(true, 'should call');
        });

        // Act
        context.testObject.callPrivateSetter(1);
    });

    QUnit.test('setupPrivate - mix - if both setups match should call both for setter of getter and setter', 4, function (assert) {
        // Arrange
        var context = this;

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, It.isAny(Number)).lazyReturns(function () {
            assert.ok(true, 'should call');
        }).returns('return value').callback(function () {
            assert.ok(true, 'should call');
        });

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_GETTER_AND_SETTER_NAME, 1).lazyReturns(function () {
            assert.ok(true, 'should call');
        }).returns('return value').callback(function () {
            assert.ok(true, 'should call');
        });

        // Act
        context.testObject.callPrivateSetterOfGetterAndSetter(1);
    });

    QUnit.test('setupPrivate - mix - if both setups match should return from the last', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number)).lazyReturns(function () {
            return 1;
        }).returns(function () {
            return 2;
        });

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () {
            return 3;
        }).returns(returnValue);

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, returnValue, 'should return the returnValue');
    });

    QUnit.test('setupPrivate - mix - if both setups match should return from the last 2', 1, function (assert) {
        // Arrange
        var context = this;

        var returnValue = {};

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () {
            return 1;
        }).returns(function () {
            return 2;
        });

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number)).lazyReturns(function () {
            return 3;
        }).returns(returnValue);

        // Act
        var result = context.testObject.callPrivateFunction(1);

        // Assert
        assert.strictEqual(result, returnValue, 'should return the returnValue');
    });

    QUnit.test('setupPrivate - mix - if both setups match should throw from the last', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError = {};

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number)).lazyReturns(function () {
            return 1;
        }).throws('error').returns(function () {
            return 2;
        });

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () {
            return 3;
        }).throws(thrownError);

        try  {
            context.testObject.callPrivateFunction(1);
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the thrownError');
        }
    });

    QUnit.test('setupPrivate - mix - if both setups match should throw from the last 2', 1, function (assert) {
        // Arrange
        var context = this;

        var thrownError = {};

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, 1).lazyReturns(function () {
            return 1;
        }).throws('error').returns(function () {
            return 2;
        });

        context.mole.setupPrivate(Tests.TestObject.PRIVATE_FUNCTION_NAME, It.isAny(Number)).lazyReturns(function () {
            return 3;
        }).throws(thrownError);

        try  {
            context.testObject.callPrivateFunction(1);
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the thrownError');
        }
    });

    QUnit.test('isStrict - true - no setup should throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        try  {
            // Act
            context.testObject.noArgumentsFunction();
        } catch (error) {
            // Assert
            assert.ok(true, 'should throw error');
        }
    });

    QUnit.test('isStrict - true - no setup for getter should throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        try  {
            // Act
            context.testObject.getter;
        } catch (error) {
            // Assert
            assert.ok(true, 'should throw error');
        }
    });

    QUnit.test('isStrict - true - no setup for setter should throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        try  {
            // Act
            context.testObject.setter = 1;
        } catch (error) {
            // Assert
            assert.ok(true, 'should throw error');
        }
    });

    QUnit.test('isStrict - true - no setup for getter of getter and setter should throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        try  {
            // Act
            context.testObject.getterAndSetter;
        } catch (error) {
            // Assert
            assert.ok(true, 'should throw error');
        }
    });

    QUnit.test('isStrict - true - no setup for setter of getter and setter should throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        try  {
            // Act
            context.testObject.getterAndSetter = 1;
        } catch (error) {
            // Assert
            assert.ok(true, 'should throw error');
        }
    });

    QUnit.test('isStrict - true - has callback setup should call the callback and not throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).callback(function () {
            assert.ok(true, 'should call the setup');
        });

        try  {
            // Act
            context.testObject.noArgumentsFunction();
        } catch (error) {
            // Assert
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('isStrict - true - getter has callback setup should call the callback and not throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        context.mole.setup(function (_) {
            return _.getter;
        }).callback(function () {
            assert.ok(true, 'should call the setup');
        });

        try  {
            // Act
            context.testObject.getter;
        } catch (error) {
            // Assert
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('isStrict - true - setter has callback setup should call the callback and not throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        context.mole.setup(function (_) {
            return _.setter = 1;
        }).callback(function () {
            assert.ok(true, 'should call the setup');
        });

        try  {
            // Act
            context.testObject.setter = 1;
        } catch (error) {
            // Assert
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('isStrict - true - getter of getter&setter has callback setup should call the callback and not throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        context.mole.setup(function (_) {
            return _.getterAndSetter;
        }).callback(function () {
            assert.ok(true, 'should call the setup');
        });

        try  {
            // Act
            context.testObject.getterAndSetter;
        } catch (error) {
            // Assert
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('isStrict - true - setter of getter&setter has callback setup should call the callback and not throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        context.mole.setup(function (_) {
            return _.getterAndSetter = 1;
        }).callback(function () {
            assert.ok(true, 'should call the setup');
        });

        try  {
            // Act
            context.testObject.getterAndSetter = 1;
        } catch (error) {
            // Assert
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('isStrict - true - has callback setup  for other argument should throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        context.mole.setup(function (_) {
            return _.oneArgumentsFunction(1);
        }).callback(function () {
        });

        try  {
            // Act
            context.testObject.oneArgumentsFunction(2);
        } catch (error) {
            // Assert
            assert.ok(true, 'should throw error');
        }
    });

    QUnit.test('isStrict - true - setter has callback setup for other argument should throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        context.mole.setup(function (_) {
            return _.setter = 1;
        }).callback(function () {
        });

        try  {
            // Act
            context.testObject.setter = 2;
        } catch (error) {
            // Assert
            assert.ok(true, 'should throw error');
        }
    });

    QUnit.test('isStrict - true - setter of getter&setter has callback setup for other argument should throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        context.mole.setup(function (_) {
            return _.getterAndSetter = 1;
        }).callback(function () {
        });

        try  {
            // Act
            context.testObject.getterAndSetter = 2;
        } catch (error) {
            // Assert
            assert.ok(true, 'should throw error');
        }
    });

    QUnit.test('isStrict - true - has lazyReturns setup should call the lazyReturns and not throw error', 2, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        var returnValue = {};
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturns(function () {
            assert.ok(true, 'should call the lazyReturns');
            return returnValue;
        });

        try  {
            // Act
            var result = context.testObject.noArgumentsFunction();

            // Assert
            assert.strictEqual(result, returnValue, 'should return the return value');
        } catch (error) {
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('isStrict - true - has returns setup should return the returnValue and not throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        var returnValue = {};
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).returns(returnValue);

        try  {
            // Act
            var result = context.testObject.noArgumentsFunction();

            // Assert
            assert.strictEqual(result, returnValue, 'should return the return value');
        } catch (error) {
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('isStrict - true - has throws setup should throw the thrownError', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = true;

        var thrownError = {};
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).throws(thrownError);

        try  {
            // Act
            context.testObject.noArgumentsFunction();
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the thrown error');
        }
    });

    QUnit.test('isStrict - false - no setup should not throw error', 0, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = false;

        try  {
            // Act
            context.testObject.noArgumentsFunction();
        } catch (error) {
            // Assert
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('isStrict - false - has callbeck setup should call the callback and not throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = false;

        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).callback(function () {
            assert.ok(true, 'should call the setup');
        });

        try  {
            // Act
            context.testObject.noArgumentsFunction();
        } catch (error) {
            // Assert
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('isStrict - false - has lazyReturns setup should call the lazyReturns and not throw error', 2, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = false;

        var returnValue = {};
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).lazyReturns(function () {
            assert.ok(true, 'should call the lazyReturns');
            return returnValue;
        });

        try  {
            // Act
            var result = context.testObject.noArgumentsFunction();

            // Assert
            assert.strictEqual(result, returnValue, 'should return the return value');
        } catch (error) {
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('isStrict - false - has returns setup should return the returnValue and not throw error', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = false;

        var returnValue = {};
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).returns(returnValue);

        try  {
            // Act
            var result = context.testObject.noArgumentsFunction();

            // Assert
            assert.strictEqual(result, returnValue, 'should return the return value');
        } catch (error) {
            assert.ok(false, 'should not throw error');
        }
    });

    QUnit.test('isStrict - false - has throws setup should throw the thrownError', 1, function (assert) {
        // Arrange
        var context = this;
        context.mole.isStrict = false;

        var thrownError = {};
        context.mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).throws(thrownError);

        try  {
            // Act
            context.testObject.noArgumentsFunction();
        } catch (error) {
            // Assert
            assert.strictEqual(error, thrownError, 'should throw the thrown error');
        }
    });

    QUnit.test('staticFunction - Override static function', 1, function (assert) {
        // Arrange
        var context = this;

        var mole = new Mole(Tests.TestObject);

        // Act
        mole.setup(function (_) {
            Tests.TestObject.staticFunction();
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call callback');
        });

        Tests.TestObject.staticFunction();
    });

    QUnit.test('setup - inheritence - callback on sons function should call callback', 1, function (assert) {
        // Arrange
        var context = this;

        var testObjectSon = new Tests.TestObjectSon();
        var mole = new Mole(testObjectSon);

        // Act
        mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).callback(function () {
            // Assert
            assert.ok(true, 'callbeck was called');
        });

        testObjectSon.noArgumentsFunction();
    });

    QUnit.test('dispose - before dispose should not call the original function', 1, function (assert) {
        // Arrange
        var context = this;

        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);

        testObject.onNoArgumentsFunctionCalled = function () {
            assert.ok(false, 'should not call original function');
        };

        mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call the setup');
        });

        // Act
        testObject.noArgumentsFunction();
    });

    QUnit.test('dispose - before dispose should not call the original getter', 1, function (assert) {
        // Arrange
        var context = this;

        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);

        testObject.onGetterCalled = function () {
            assert.ok(false, 'should not call original function');
        };

        mole.setup(function (_) {
            return _.getter;
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call the setup');
        });

        // Act
        testObject.getter;
    });

    QUnit.test('dispose - before dispose should not call the original setter', 1, function (assert) {
        // Arrange
        var context = this;

        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);

        testObject.onSetterCalled = function () {
            assert.ok(false, 'should not call original function');
        };

        mole.setup(function (_) {
            return _.setter = 1;
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call the setup');
        });

        // Act
        testObject.setter = 1;
    });

    QUnit.test('dispose - before dispose should not call the original getter of getter and setter', 1, function (assert) {
        // Arrange
        var context = this;

        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);

        testObject.onGetterOfGetterAndSetterCalled = function () {
            assert.ok(false, 'should not call original function');
        };

        mole.setup(function (_) {
            return _.getterAndSetter;
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call the setup');
        });

        // Act
        testObject.getterAndSetter;
    });

    QUnit.test('dispose - before dispose should not call the original setter of getter and setter', 1, function (assert) {
        // Arrange
        var context = this;

        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);

        testObject.onSetterOfGetterAndSetterCalled = function () {
            assert.ok(false, 'should not call original function');
        };

        mole.setup(function (_) {
            return _.getterAndSetter = 1;
        }).callback(function () {
            // Assert
            assert.ok(true, 'should call the setup');
        });

        // Act
        testObject.getterAndSetter = 1;
    });

    QUnit.test('dispose - should call the original function', 1, function (assert) {
        // Arrange
        var context = this;

        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);

        testObject.onNoArgumentsFunctionCalled = function () {
            // Assert
            assert.ok(true, 'should call original function');
        };

        mole.setup(function (_) {
            return _.noArgumentsFunction();
        }).callback(function () {
            assert.ok(false, 'should not call the setup');
        });

        // Act
        mole.dispose();
        testObject.noArgumentsFunction();
    });

    QUnit.test('dispose - should call the original getter', 1, function (assert) {
        // Arrange
        var context = this;

        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);

        testObject.onGetterCalled = function () {
            // Assert
            assert.ok(true, 'should call original function');
        };

        mole.setup(function (_) {
            return _.getter;
        }).callback(function () {
            assert.ok(false, 'should not call the setup');
        });

        // Act
        mole.dispose();
        testObject.getter;
    });

    QUnit.test('dispose - should call the original setter', 1, function (assert) {
        // Arrange
        var context = this;

        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);

        testObject.onSetterCalled = function () {
            // Assert
            assert.ok(true, 'should call original function');
        };

        mole.setup(function (_) {
            return _.setter = 1;
        }).callback(function () {
            assert.ok(false, 'should not call the setup');
        });

        // Act
        mole.dispose();
        testObject.setter = 1;
    });

    QUnit.test('dispose - should call the original getter of getter and setter', 1, function (assert) {
        // Arrange
        var context = this;

        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);

        testObject.onGetterOfGetterAndSetterCalled = function () {
            // Assert
            assert.ok(true, 'should call original function');
        };

        mole.setup(function (_) {
            return _.getterAndSetter;
        }).callback(function () {
            assert.ok(false, 'should not call the setup');
        });

        // Act
        mole.dispose();
        testObject.getterAndSetter;
    });

    QUnit.test('dispose - should call the original setter of getter and setter', 1, function (assert) {
        // Arrange
        var context = this;

        var testObject = new Tests.TestObject();
        var mole = new Mole(testObject);

        testObject.onSetterOfGetterAndSetterCalled = function () {
            // Assert
            assert.ok(true, 'should call original function');
        };

        mole.setup(function (_) {
            return _.getterAndSetter = 1;
        }).callback(function () {
            assert.ok(false, 'should not call the setup');
        });

        // Act
        mole.dispose();
        testObject.getterAndSetter = 1;
    });

    QUnit.test('findMoleByObject - if null should return null', 1, function (assert) {
        // Act
        var result = Mole.findMoleByObject(null);

        // Assert
        assert.strictEqual(result, null, 'should return null');
    });

    QUnit.test('findMoleByObject - if undefined should return null', 1, function (assert) {
        // Act
        var result = Mole.findMoleByObject(undefined);

        // Assert
        assert.strictEqual(result, null, 'should return null');
    });

    QUnit.test('findMoleByObject - object without mole should return null', 1, function (assert) {
        // Act
        var result = Mole.findMoleByObject({});

        // Assert
        assert.strictEqual(result, null, 'should return null');
    });

    QUnit.test('findMoleByObject - object with mole should return the mole', 1, function (assert) {
        // Arrange
        var context = this;

        // Act
        var result = Mole.findMoleByObject(context.testObject);

        // Assert
        assert.strictEqual(result, context.mole, 'should return correct mole');
    });

    QUnit.test('findMoleByObject - objects with moles should return correct moles', 3, function (assert) {
        // Arrange
        var context = this;

        var obj1 = {};
        var obj2 = {};

        var mole1 = new Mole(obj1);
        var mole2 = new Mole(obj2);

        // Act
        var result1 = Mole.findMoleByObject(obj1);
        var result2 = Mole.findMoleByObject(obj2);
        var result3 = Mole.findMoleByObject(context.testObject);

        // Assert
        assert.strictEqual(result1, mole1, 'should return correct mole');
        assert.strictEqual(result2, mole2, 'should return correct mole');
        assert.strictEqual(result3, context.mole, 'should return correct mole');
    });

    QUnit.test('findMoleByObject - after dispose on mole should not return the mole for the object', 4, function (assert) {
        // Arrange
        var context = this;

        var obj1 = {};
        var obj2 = {};
        var obj3 = {};

        var mole1 = new Mole(obj1);
        var mole2 = new Mole(obj2);

        // Act
        mole2.dispose();
        var mole3 = new Mole(obj3);
        var result1 = Mole.findMoleByObject(obj1);
        var result2 = Mole.findMoleByObject(obj2);
        var result3 = Mole.findMoleByObject(context.testObject);
        var result4 = Mole.findMoleByObject(obj3);

        // Assert
        assert.strictEqual(result1, mole1, 'should return correct mole');
        assert.strictEqual(result2, null, 'should return null after dispose');
        assert.strictEqual(result3, context.mole, 'should return correct mole');
        assert.strictEqual(result4, mole3, 'should return correct mole');
    });

    QUnit.test('moleReturnValue - should be false', 1, function (assert) {
        // Attange
        var context = this;

        // Assert
        assert.strictEqual(context.mole.moleReturnValue, false, 'moleReturnValue should be false');
    });

    QUnit.test('moleReturnValue - should not create mole of the return value by default', 1, function (assert) {
        // Attange
        var context = this;

        // Act
        var result = context.testObject.complexReturnFunction();
        var mole = Mole.findMoleByObject(result);

        // Assert
        assert.strictEqual(mole, null, 'should not create mole for return value');
    });

    QUnit.test('moleReturnValue - set to false should not create mole of the return value', 2, function (assert) {
        // Attange
        var context = this;
        context.mole.moleReturnValue = false;

        // Act
        var result = context.testObject.complexReturnFunction();
        var mole = Mole.findMoleByObject(result);

        // Assert
        assert.strictEqual(context.mole.moleReturnValue, false, 'moleReturnValue should be false');
        assert.strictEqual(mole, null, 'should not create mole for return value');
    });

    QUnit.test('moleReturnValue - set to true should create mole for the return value', 2, function (assert) {
        // Attange
        var context = this;
        context.mole.moleReturnValue = true;

        // Act
        var result = context.testObject.complexReturnFunction();
        var mole = Mole.findMoleByObject(result);

        // Assert
        assert.strictEqual(context.mole.moleReturnValue, true, 'moleReturnValue should be true');
        assert.notStrictEqual(mole, null, 'should create mole for return value');
    });

    QUnit.test('moleReturnValue - set to true should create new mole for the return value', 2, function (assert) {
        // Attange
        var context = this;
        context.mole.moleReturnValue = true;

        var returnValue = context.testObject.complexReturnFunction();
        var mole = Mole.findMoleByObject(returnValue);
        mole.setup(function (_) {
            return _.returning1Function();
        }).returns(2);

        // Act
        var result1 = context.testObject.returning1Function();
        var result2 = returnValue.returning1Function();

        // Assert
        assert.strictEqual(result1, 1, 'should return the original value');
        assert.strictEqual(result2, 2, 'should reutrn the setup value');
    });

    QUnit.test('moleReturnValue - set to true should create mole for the return value return value', 2, function (assert) {
        // Attange
        var context = this;
        context.mole.moleReturnValue = true;

        // Act
        var result = context.testObject.complexReturnFunction().complexReturnFunction();
        var mole = Mole.findMoleByObject(result);

        // Assert
        assert.strictEqual(context.mole.moleReturnValue, true, 'moleReturnValue should be true');
        assert.notStrictEqual(mole, null, 'should create mole for return value');
    });

    QUnit.test('moleReturnValue - set to true should create new mole for the return value return value', 2, function (assert) {
        // Attange
        var context = this;
        context.mole.moleReturnValue = true;

        var returnValue = context.testObject.complexReturnFunction().complexReturnFunction();
        var mole = Mole.findMoleByObject(returnValue);
        mole.setup(function (_) {
            return _.returning1Function();
        }).returns(2);

        // Act
        var result1 = context.testObject.returning1Function();
        var result2 = returnValue.returning1Function();

        // Assert
        assert.strictEqual(result1, 1, 'should return the original value');
        assert.strictEqual(result2, 2, 'should reutrn the setup value');
    });

    QUnit.test('moleReturnValue - getter - set to false should not create mole of the return value', 2, function (assert) {
        // Attange
        var context = this;
        context.mole.moleReturnValue = false;

        // Act
        var result = context.testObject.complexGetterFunction;
        var mole = Mole.findMoleByObject(result);

        // Assert
        assert.strictEqual(context.mole.moleReturnValue, false, 'moleReturnValue should be false');
        assert.strictEqual(mole, null, 'should not create mole for return value');
    });

    QUnit.test('moleReturnValue - getter - set to true should create mole for the return value', 2, function (assert) {
        // Attange
        var context = this;
        context.mole.moleReturnValue = true;

        // Act
        var result = context.testObject.complexGetterFunction;
        var mole = Mole.findMoleByObject(result);

        // Assert
        assert.strictEqual(context.mole.moleReturnValue, true, 'moleReturnValue should be true');
        assert.notStrictEqual(mole, null, 'should create mole for return value');
    });

    QUnit.test('moleReturnValue - getter - set to true should create new mole for the return value', 2, function (assert) {
        // Attange
        var context = this;
        context.mole.moleReturnValue = true;

        var returnValue = context.testObject.complexGetterFunction;
        var mole = Mole.findMoleByObject(returnValue);
        mole.setup(function (_) {
            return _.returning1Function();
        }).returns(2);

        // Act
        var result1 = context.testObject.returning1Function();
        var result2 = returnValue.returning1Function();

        // Assert
        assert.strictEqual(result1, 1, 'should return the original value');
        assert.strictEqual(result2, 2, 'should reutrn the setup value');
    });

    QUnit.test('moleReturnValue - getter - set to true should create mole for the return value return value', 2, function (assert) {
        // Attange
        var context = this;
        context.mole.moleReturnValue = true;

        // Act
        var result = context.testObject.complexGetterFunction.complexGetterFunction;
        var mole = Mole.findMoleByObject(result);

        // Assert
        assert.strictEqual(context.mole.moleReturnValue, true, 'moleReturnValue should be true');
        assert.notStrictEqual(mole, null, 'should create mole for return value');
    });

    QUnit.test('moleReturnValue - getter - set to true should create new mole for the return value return value', 2, function (assert) {
        // Attange
        var context = this;
        context.mole.moleReturnValue = true;

        var returnValue = context.testObject.complexGetterFunction.complexGetterFunction;
        var mole = Mole.findMoleByObject(returnValue);
        mole.setup(function (_) {
            return _.returning1Function();
        }).returns(2);

        // Act
        var result1 = context.testObject.returning1Function();
        var result2 = returnValue.returning1Function();

        // Assert
        assert.strictEqual(result1, 1, 'should return the original value');
        assert.strictEqual(result2, 2, 'should reutrn the setup value');
    });
})(Tests || (Tests = {}));
'use strict';
var Tests;
(function (Tests) {
    var Times = moqJS.Times;

    var TimesLyfecycleObject = (function () {
        function TimesLyfecycleObject() {
            this.beforeEach = function () {
                var context = this;
            };
            this.afterEach = function () {
            };
        }
        return TimesLyfecycleObject;
    })();

    QUnit.module('Times', new TimesLyfecycleObject());

    QUnit.test('lessThan - on smaller should return true', 1, function (assert) {
        // Arrange
        var times = Times.lessThan(4);

        // Act
        var result = times.match(1);

        assert.strictEqual(result, true, 'lessThan should return true when the actual is smaller');
    });

    QUnit.test('lessThan - on bigger should return false', 1, function (assert) {
        // Arrange
        var times = Times.lessThan(4);

        // Act
        var result = times.match(5);

        assert.strictEqual(result, false, 'lessThan should return false when the actual is bigger');
    });

    QUnit.test('lessThan - on same should return false', 1, function (assert) {
        // Arrange
        var times = Times.lessThan(4);

        // Act
        var result = times.match(4);

        assert.strictEqual(result, false, 'lessThan should return false when the actual is same');
    });

    QUnit.test('atMost - on smaller should return true', 1, function (assert) {
        // Arrange
        var times = Times.atMost(4);

        // Act
        var result = times.match(1);

        assert.strictEqual(result, true, 'atMost should return true when the actual is smaller');
    });

    QUnit.test('atMost - on bigger should return false', 1, function (assert) {
        // Arrange
        var times = Times.atMost(4);

        // Act
        var result = times.match(5);

        assert.strictEqual(result, false, 'atMost should return false when the actual is bigger');
    });

    QUnit.test('atMost - on same should return true', 1, function (assert) {
        // Arrange
        var times = Times.atMost(4);

        // Act
        var result = times.match(4);

        assert.strictEqual(result, true, 'atMost should return true when the actual is same');
    });

    QUnit.test('exact - on smaller should return false', 1, function (assert) {
        // Arrange
        var times = Times.exact(4);

        // Act
        var result = times.match(1);

        assert.strictEqual(result, false, 'exact should return false when the actual is smaller');
    });

    QUnit.test('exact - on bigger should return false', 1, function (assert) {
        // Arrange
        var times = Times.exact(4);

        // Act
        var result = times.match(5);

        assert.strictEqual(result, false, 'exact should return false when the actual is bigger');
    });

    QUnit.test('exact - on same should return true', 1, function (assert) {
        // Arrange
        var times = Times.exact(4);

        // Act
        var result = times.match(4);

        assert.strictEqual(result, true, 'exact should return true when the actual is same');
    });

    QUnit.test('atLeast - on smaller should return false', 1, function (assert) {
        // Arrange
        var times = Times.atLeast(4);

        // Act
        var result = times.match(1);

        assert.strictEqual(result, false, 'atLeast should return false when the actual is smaller');
    });

    QUnit.test('atLeast - on bigger should return true', 1, function (assert) {
        // Arrange
        var times = Times.atLeast(4);

        // Act
        var result = times.match(5);

        assert.strictEqual(result, true, 'atLeast should return true when the actual is bigger');
    });

    QUnit.test('atLeast - on same should return false', 1, function (assert) {
        // Arrange
        var times = Times.atLeast(4);

        // Act
        var result = times.match(4);

        assert.strictEqual(result, true, 'atLeast should return true when the actual is same');
    });

    QUnit.test('moreThan - on smaller should return false', 1, function (assert) {
        // Arrange
        var times = Times.moreThan(4);

        // Act
        var result = times.match(1);

        assert.strictEqual(result, false, 'moreThan should return false when the actual is smaller');
    });

    QUnit.test('moreThan - on bigger should return true', 1, function (assert) {
        // Arrange
        var times = Times.moreThan(4);

        // Act
        var result = times.match(5);

        assert.strictEqual(result, true, 'moreThan should return true when the actual is bigger');
    });

    QUnit.test('moreThan - on same should return false', 1, function (assert) {
        // Arrange
        var times = Times.moreThan(4);

        // Act
        var result = times.match(4);

        assert.strictEqual(result, false, 'moreThan should return false when the actual is same');
    });

    QUnit.test('between - on smaller should return false', 1, function (assert) {
        // Arrange
        var times = Times.between(4, 7);

        // Act
        var result = times.match(1);

        assert.strictEqual(result, false, 'between should return false when the actual is smaller');
    });

    QUnit.test('between - on bigger should return false', 1, function (assert) {
        // Arrange
        var times = Times.between(4, 7);

        // Act
        var result = times.match(8);

        assert.strictEqual(result, false, 'between should return false when the actual is bigger');
    });

    QUnit.test('between - when between should return true', 1, function (assert) {
        // Arrange
        var times = Times.between(4, 7);

        // Act
        var result = times.match(5);

        assert.strictEqual(result, true, 'between should return true when the actual is between');
    });

    QUnit.test('between - when between on lower should return true', 1, function (assert) {
        // Arrange
        var times = Times.between(4, 7);

        // Act
        var result = times.match(4);

        assert.strictEqual(result, true, 'between should return true when the actual is between on lower');
    });

    QUnit.test('between - when between on higher should return true', 1, function (assert) {
        // Arrange
        var times = Times.between(4, 7);

        // Act
        var result = times.match(7);

        assert.strictEqual(result, true, 'between should return true when the actual is between on higher');
    });
})(Tests || (Tests = {}));
//# sourceMappingURL=MoqJS.js.map
