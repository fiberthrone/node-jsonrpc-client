import fetchMock from 'fetch-mock';
import jsonrpc from '../src/index';
import { expect } from 'chai';

const endpoint = 'http://example.com';

describe('It works', () => {
  it('Creates good request', function(done) {
    fetchMock.postOnce(endpoint, '{"result": {"good": "great"} }');
    jsonrpc.create(endpoint).call(
      'goodRequest',
      { foo: true },
      function(error, response) {
        const request = JSON.parse(fetchMock.lastOptions().body);
        expect(request).to.deep.include({
          jsonrpc: '2.0',
          method: 'goodRequest',
          params: { foo: true },
        });
        expect(request).to.have.property('id');
        expect(error).to.be.null;
        done();
      });
  });

  it('Handles good response', function(done) {
    fetchMock.postOnce(endpoint, '{"result": {"good": "great"} }');
    jsonrpc.create(endpoint).call(
      'goodResponse',
      { foo: true },
      function(error, response) {
        expect(response).to.deep.equal({
          good: 'great'
        });
        done();
      });
  });

  it('Ignores HTTP status', function(done) {
    fetchMock.postOnce(endpoint, {
      status: 404,
      body: '{"result": {"good": "great"} }',
    });

    jsonrpc.create(endpoint).call(
      'someRequest',
      { foo: true },
      function(error, response) {
        expect(response).to.deep.equal(response, {
          good: 'great'
        });
        done();
      });
  });

  it('Handles errors from spec', function(done) {
    fetchMock.postOnce(endpoint, {
      status: 500,
      body: '{"error": {"code": -32601, "message":"Server generated error"} }',
    });
    jsonrpc.create(endpoint).call(
      'nonexistantMethod',
      { foo: true },
      function(error, response) {
        expect(error).to.be.not.null;
        expect(error).to.match(/Method not found/);
        expect(error).to.match(/Server generated error/);
        done();
      });
  });

  it('Handles application errors', function(done) {
    fetchMock.postOnce(endpoint, {
      status: 500,
      body: '{"error": {"code": 1234, "message":"Server generated error", "data": 5678} }',
    });
    jsonrpc.create(endpoint).call(
      'badRemote',
      { foo: true },
      function(error, response) {
        expect(error).to.be.not.null;
        expect(error).to.match(/Server generated error/);
        expect(response).to.equal(5678);
        done();
      });
  });

  it('Handles bad JSON', function(done) {
    fetchMock.postOnce(endpoint, '{"result": 123klsf]]]');
    jsonrpc.create(endpoint).call(
      'badRemote',
      { foo: true },
      function(error, response) {
        expect(error).to.be.not.null;
        expect(error).to.match(/JSON/);
        done();
      });
  });
});
