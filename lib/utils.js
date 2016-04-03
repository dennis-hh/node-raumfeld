var Q = require('q');

function deferredAction(client, serviceId, actionName, params, callback) {
    var deferred = Q.defer();
    var foo = client.callAction(serviceId, actionName, params, function (err, result) {
        if (err) deferred.reject(err);

         try {
            var res = callback(result);
            deferred.resolve(res);
        } catch(e) {
            deferred.reject(e);
        }
    });

    return deferred.promise;
}
module.exports.deferredAction = deferredAction;
