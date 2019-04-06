const handler = require('./error.controller');
const httpMocks = require('node-mocks-http');
const boom = require('boom');

let req = httpMocks.createRequest();
let res = httpMocks.createResponse({
    eventEmitter: require('events').EventEmitter
});
let next = function(){}

describe("Error handler tests", () => {

    it("Should handle error", () => {
        const error = boom.unauthorized('Unathaurized');
        handler.error(error, req, res, next);
        expect(res.statusCode).toBe(401);
        expect(res._getData()).toEqual(JSON.stringify(error.output.payload));
    })

});