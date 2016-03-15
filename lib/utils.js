var Q = require('q');

function deferredAction(client, serviceId, actionName, params, callback) {
    var deferred = Q.defer();
    var foo = client.callAction(serviceId, actionName, params, function (err, result) {
        if (err) deferred.reject(err);

        var res = callback(result);
        deferred.resolve(res);
    });

    return deferred.promise;
}
module.exports.deferredAction = deferredAction;