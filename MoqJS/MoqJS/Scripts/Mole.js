'use strict';
var moqJS;
(function (moqJS) {
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
//# sourceMappingURL=Mole.js.map
