'use strict';

var q = require('q');

module.exports = function promisify(fn, context) {
    return function() {
        var deferred = q.defer();
        var args = Array.prototype.slice.call(arguments);

        args.push(function(err, result) {
            if (err !== null) {
                return deferred.reject();
            }

            return deferred.resolve(result);
        });

        fn.apply(context || {}, args);

        return deferred.promise;
    };
};
