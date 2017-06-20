const errorCodes = {
  '-32700': 'JSON-RPC server reported a parse error in JSON request',
  '-32600': 'JSON-RPC server reported an invalid request',
  '-32601': 'Method not found',
  '-32602': 'Invalid parameters',
  '-32603': 'Internal error',
};

// http://jsonrpc.org/spec.html
class JsonrpcClient {
  constructor(endpoint, options) {
    this.endpoint = endpoint;
    this.options = options;
  }

  call(method, params, callback) {
    const jsonParams = {
      jsonrpc: '2.0',
      id: (new Date()).getTime(),
      method,
      params,
    };

    const requestString = JSON.stringify(jsonParams);

    fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: requestString,
    }).then(response => response.json()).then(decodedResponse => {
        // json-rpc errors
        if (decodedResponse.error) {
          const description = errorCodes[decodedResponse.error.code] || 'Unknown error';
          const errorMessage = `${description} ${decodedResponse.error.message}`;
          callback(errorMessage, decodedResponse.error.data);
          return
        }

        callback(null, decodedResponse.result)
      },
      (error) => { callback(error); },
    );
  }
}

export const create = function(endpoint, options, _fetch) {
  return new JsonrpcClient(endpoint, options, _fetch);
};

export default { create };
