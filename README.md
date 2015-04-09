MoqJS
===

A javascript library inspired by the Moq library for .Net

```javascript
  // Create some object instance
  var dog = new Dog();
  
  // Create a mole for the object
  var mole = new Mole(dog);

  // Setup behavior
  mole.setup(_dog => _dog.eat('meat')).returns('Yum yum yum');

  // Invoke
  var result = dog.eat('meat');

  // Verify the given method was indeed called with the expected value exactly once
  var isVerified = mole.verify(_dog => _dog.eat('meat'), Times.exact(1));
```

Checkout the [Quickstart](https://github.com/slavik57/moqjs/wiki/Quickstart) for more examples!

## Why?

The library was created mainly for developers who are used to the .Net library Moq or as a basic mocking library.

MoqJS is designed to be very similar to the Moq library.

## Who?

MoqJS was developed by a single person (Me).

## Features at a glance
MoqJS offers the following features:
  * Strong-typed: was developed in TypeScript.
  * Unsurpassed VS intellisense integration: everything supports full VS intellisense, from setting expectations, to specifying method call arguments, return values, etc.
  * Use setup/setupPrivate/verify/verifyPrivate to change and check the moles behavior.
  * VERY low learning curve as a consequence of the previous three points.
  * Control over mock behavior with a simple callBase/isStrict properties
  * Find moles by instance of the moled object.
