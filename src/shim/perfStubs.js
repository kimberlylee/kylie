/*jslint sub: true*/

/**
 * @define {!string}
 * @private
 */
var ROOT_NAMESPACE = "Kylie";
    
(function(window){
    "use strict";
    
    /**
     * @type {IPerfStubs}
     */
    window["Perf"] = window["Kylie"] = /** @type {!Object} */ ({
        /**
         * @param {?string} measureName Not used.
         * @param {!string} id This is the id associated with the mark that uses the same id.
         * @param {!Object=} logLevel The level at which this mark should be logged at.
         * @deprecated Use endMark instead
         * @expose
         */
        measure: function(measureName, id, logLevel) {},
        /**
         * @param {!string} id The id used to identify the mark.
         * @param {!Object=} logLevel The level at which this mark should
         * be logged at.
         * @return {!IPerf}
         * @expose
         */
        mark: function(id, logLevel) { return window["Perf"]; },
        /**
         * @param {!string} id This is the id associated with the mark that uses
         * the same id.
         * @param {!Object=} logLevel The level at which this mark should
         * be logged at.
         * @return {!IPerf}
         * @expose
         */
        endMark: function(id, logLevel) { return window["Perf"]; },
        /**
         * @param {!string} label
         * @param {!number} elapsedMillis
         * @expose
         */
        stat: function(label, elapsedMillis) {},
        /**
         * Whether the full Jiffy framework is loaded, as opposed to just the stubs.
         * @type {boolean}
         * @const
         */
        enabled: false
    });
})(this);
