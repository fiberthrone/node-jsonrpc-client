'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var errorCodes = {
  '-32700': 'JSON-RPC server reported a parse error in JSON request',
  '-32600': 'JSON-RPC server reported an invalid request',
  '-32601': 'Method not found',
  '-32602': 'Invalid parameters',
  '-32603': 'Internal error'
};

// http://jsonrpc.org/spec.html

var JsonrpcClient = function () {
  function JsonrpcClient(endpoint, options) {
    _classCallCheck(this, JsonrpcClient);

    this.endpoint = endpoint;
    this.options = options;
  }

  _createClass(JsonrpcClient, [{
    key: 'call',
    value: function call(method, params, callback) {
      var jsonParams = {
        jsonrpc: '2.0',
        id: new Date().getTime(),
        method: method,
        params: params
      };

      var requestString = JSON.stringify(jsonParams);

      fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: requestString
      }).then(function (response) {
        return response.json();
      }).then(function (decodedResponse) {
        // json-rpc errors
        if (decodedResponse.error) {
          var description = errorCodes[decodedResponse.error.code] || 'Unknown error';
          var errorMessage = description + ' ' + decodedResponse.error.message;
          callback(errorMessage, decodedResponse.error.data);
          return;
        }

        callback(null, decodedResponse.result);
      }, function (error) {
        callback(error);
      });
    }
  }]);

  return JsonrpcClient;
}();

var create = exports.create = function create(endpoint, options, _fetch) {
  return new JsonrpcClient(endpoint, options, _fetch);
};

exports.default = { create: create };