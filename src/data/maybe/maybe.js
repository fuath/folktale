//----------------------------------------------------------------------
//
// This source file is part of the Folktale project.
//
// Copyright (C) 2015-2016 Quildreen Motta.
// Licensed under the MIT licence.
//
// See LICENCE for licence information.
// See CONTRIBUTORS for the list of contributors to the project.
//
//----------------------------------------------------------------------

const assertType = require('folktale/helpers/assertType');
const assertFunction = require('folktale/helpers/assertFunction');
const { data, show, setoid, serialize } = require('folktale/core/adt');
const provideAliases = require('folktale/helpers/provide-fantasy-land-aliases');


/*~
 * ---
 * category: Representing Failures
 * authors:
 *   - "@boris-marinov"
 *   - Quildreen Motta
 */
const Maybe = data('folktale:Data.Maybe', {
  /*~
   * ---
   * category: Constructing
   * type: |
   *   forall a: () => Maybe a
   */
  Nothing() {
  },

  /*~
   * ---
   * category: Constructing
   * type: |
   *   forall a: (a) => Maybe a
   */
  Just(value) {
    return { value };
  }
}).derive(setoid, show, serialize);


const { Nothing, Just } = Maybe;
const assertMaybe = assertType(Maybe);


// -- Functor ----------------------------------------------------------
/*~
 * ---
 * category: Transforming Maybe values
 * type: |
 *   forall a, b: (Maybe a).((a) => b) => Maybe b
 */
Nothing.prototype.map = function(transformation) {
  assertFunction('Maybe.Nothing#map', transformation);
  return this;
};

/*~
 * ---
 * category: Transforming Maybe values
 * type: |
 *   forall a, b: (Maybe a).((a) => b) => Maybe b
 */
Just.prototype.map = function(transformation) {
  assertFunction('Maybe.Nothing#map',  transformation);
  return Just(transformation(this.value));
};


// -- Apply ------------------------------------------------------------
/*~
 * ---
 * category: Transforming Maybe values
 * type: |
 *   forall a, b: (Maybe (a) => b).(Maybe a) => Maybe b
 */
Nothing.prototype.apply = function(aMaybe) {
  assertMaybe('Maybe.Nothing#apply', aMaybe);
  return this;
};

/*~
 * ---
 * category: Transforming Maybe values
 * type: |
 *   forall a, b: (Maybe (a) => b).(Maybe a) => Maybe b
 */
Just.prototype.apply = function(aMaybe) {
  assertMaybe('Maybe.Just#apply', aMaybe);
  return aMaybe.map(this.value);
};

// -- Applicative ------------------------------------------------------
/*~
 * ---
 * category: Constructing
 * type: |
 *   forall a: (a) => Maybe a
 */
Maybe.of = function(value) {
  return Just(value);
};


// -- Chain ------------------------------------------------------------
/*~
 * ---
 * category: Transforming Maybes
 * type: |
 *   forall a: (Maybe a).((a) => Maybe b) => Maybe b
 */
Nothing.prototype.chain = function(transformation) {
  assertFunction('Maybe.Nothing#chain', transformation);
  return this;
};

/*~
 * ---
 * category: Transforming Maybes
 * type: |
 *   forall a: (Maybe a).((a) => Maybe b) => Maybe b
 */
Just.prototype.chain = function(transformation) {
  assertFunction('Maybe.Just#chain', transformation);
  return transformation(this.value);
};

// -- Extracting values and recovering ---------------------------------

// NOTE:
// `get` is similar to Comonad's `extract`. The reason we don't implement
// Comonad here is that `get` is partial, and not defined for Nothing
// values.

Nothing.prototype.get = function() {
  throw new TypeError(`Can't extract the value of a Nothing.

Since Nothing holds no values, it's not possible to extract one from them.
You might consider switching from Maybe#get to Maybe#getOrElse, or some other method
that is not partial.
  `);
};

Just.prototype.get = function() {
  return this.value;
};



Nothing.prototype.getOrElse = function(default_) {
  return default_;
};

Just.prototype.getOrElse = function(_default_) {
  return this.value;
};



Nothing.prototype.orElse = function(handler) {
  return handler();
};

Just.prototype.orElse = function() {
  return this;
};


// -- Conversions -------------------------------------------------
Maybe.toEither = function(...args) {
  return require('folktale/data/conversions/maybe-to-either')(this, ...args);
};

Maybe.toValidation = function(...args) {
  return require('folktale/data/conversions/maybe-to-validation')(this, ...args);
};


// -- Exports ----------------------------------------------------------
provideAliases(Just.prototype);
provideAliases(Nothing.prototype);
provideAliases(Maybe);

module.exports = Maybe;
