JSON-RPC Client for Node.js
===========================

A dead-simple JSON-RPC client for Node.js, uses `fetch` for making http requests. Generally adheres to the incomplete [JSON-RPC 2.0 spec][spec] -- earlier specs didn't support named parameters. Released under the MIT license.

Why this package?
-----------------

* Supports both HTTP and HTTPS
* The other JSON-RPC implementations are primarily servers -- this is a simple client

Usage (Javascript)
------------------

    jsonrpc = require('jsonrpc-client');

    client = jsonrpc.create('https://myapp.com/api');

    client.call(
        'myRemoteMethod',
        { someParam: 'someValue' },
        function(error, response) {
           if (error === null) {
               console.log(response.someResponseParam)
           }
        }
    );

Development
-----------
**To run tests:**

    npm install
    npm run tests

Todo
----
 * Support HTTP authentication
 * Consider a streaming JSON parser like [benejson](https://github.com/codehero/benejson)

[spec]: http://jsonrpc.org/spec.html