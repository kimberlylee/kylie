/** This file is used for the closure compiler in advanced mode to define custom data types and allows for better minification and type checking */

/** @typedef {{name: !string, value: !number}} */
window.typePerfLogLevel;

/** @typedef {{measure: !string, mark: !string, et: !number, rt: !number}} */
window.typejsonMeasure;

/**
 * The interface used to stub out some of the IPerf functions. Used when Kylie
 * is not enabled.
 *
 * @interface
 */
function IPerfStubs() {}
/**
 * @param {!string} id The id used to identify the mark.
 * @param {window.typePerfLogLevel=} logLevel The level at which this mark should
 * be logged at.
 * @return {!IPerf}
 */
IPerfStubs.prototype.mark;
/**
 * @param {!string} id This is the id associated with the mark that uses
 * the same id.
 * @param {window.typePerfLogLevel=} logLevel The level at which this mark should
 * be logged at.
 * @return {!IPerf}
 */
IPerfStubs.prototype.endMark;
/**
 * Add a performance measurement from the server.
 * @param {!string} label
 * @param {!number} elapsedMillis
 */
IPerfStubs.prototype.stat;
/**
 * @param {?string} measureName Not used.
 * @param {!string} id This is the id associated with the mark that uses the same id.
 * @param {window.typePerfLogLevel=} logLevel The level at which this mark should be logged at.
 * @deprecated Use endMark instead
 */
IPerfStubs.prototype.measure;

/**
 * The interface used with the Perf object.
 *
 * @interface
 * @extends IPerfStubs
 */
function IPerf() {}

/**
 * @param {!string} id The id used to identify the mark.
 * @param {window.typePerfLogLevel=} logLevel The level at which this mark should
 * be logged at.
 * @return {!IPerf}
 * @override
 */
IPerf.prototype.mark;
/**
 * @param {!string} id This is the id associated with the mark that uses
 * the same id.
 * @param {window.typePerfLogLevel=} logLevel The level at which this mark should
 * be logged at.
 * @return {!IPerf}
 * @override
 */
IPerf.prototype.endMark;
/**
 * @param {!string} timer_name The name of the timer to set.
 * @param {!number} timer_delta The delta of timestamps to set.
 * @param {string|window.typePerfLogLevel=} logLevel The level at which this mark should be logged at. Defaults to PerfLogLevel.INTERNAL if left blank
 * @return {!IPerf}
 */
IPerf.prototype.setTimer;
/**
 * Serializes a measure object to JSON.
 * @param {!window.typejsonMeasure} measure The measure to serialize.
 * @return {!string} JSON-serialized version of the supplied measure.
 */
IPerf.prototype.measureToJson;
/**
 * Serializes timers to JSON.
 * @param {boolean=} includeMarks
 * @return {!string} JSON-serialized version of timers.
 */
IPerf.prototype.toJson;
/**
 * Get a JSON-serialized version of all existing timers and stats in POST friendly format.
 * @return {!string} POST-friendly timers and stats.
 */
IPerf.prototype.toPostVar;
/**
 * @return {!Array.<!window.typejsonMeasure>} all existing measures.
 */
IPerf.prototype.getMeasures;
/**
 * Returns the beaconData to piggyback on the next XHR call
 * 
 * @return {!string} beacon data.
 */
IPerf.prototype.getBeaconData;
/**
 * Sets the beaconData to piggyback on the next XHR call
 * 
 * @param {!string} _beaconData
 */
IPerf.prototype.setBeaconData;
/**
 * Clears beacon data.
 * 
 * @type {function()}
 */
IPerf.prototype.clearBeaconData;
/**
 * @param {!string} tName The id used to identify the transaction.
 * @return {!IPerf} for chaining methods
 * @override
 */
IPerf.prototype.startTransaction;
/**
 * @param {!string} tName The id used to identify the transaction.
 * @return {!IPerf} for chaining methods
 * @override
 */
IPerf.prototype.endTransaction;
/**
 * @param {!string} oldName The id used to identify the old transaction name.
 * @param {!string} newName The id used to identify the new transaction name.
 * @return {!IPerf}
 * @override
 */
IPerf.prototype.updateTransaction;
/**
 * Add a performance measurement from the server.
 * @param {!string} label
 * @param {!number} elapsedMillis
 * @return {!IPerf}
 * @override
 */
IPerf.prototype.stat;
/**
 * Get the stored server side performance measures.
 * 
 * @param {!string} label
 * @return {!string|number}
 */
IPerf.prototype.getStat;
/**
 * Removes stats.
 * 
 * @type {function()}
 */
IPerf.prototype.removeStats;
/**
 * @param {?string} measureName Not used.
 * @param {!string} id This is the id associated with the mark that uses the same id.
 * @param {window.typePerfLogLevel=} logLevel The level at which this mark should be logged at.
 * @return {!IPerf}
 * @deprecated Use endMark instead
 * @override
 */
IPerf.prototype.measure;
