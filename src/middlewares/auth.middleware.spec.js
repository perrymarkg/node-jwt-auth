const {auth} = require('./auth.middleware');
let eventEmitter = require('events').EventEmitter;
const httpMocks = require('node-mocks-http');

let req, res, customEvent, next;

describe("Auth Middleware tests", () => {

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse({
            eventEmitter: eventEmitter
        }); 

        customEvent = new eventEmitter();
        next = jasmine.createSpy('spy');

        jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
    })


    it("Should have errors on username", (done) => {
        // Get the username validation
        const middleware = auth[0];
        
        next.and.callFake((e) => {
            customEvent.emit('errorCall');
        })

        /**
         * express-vaidator `check` function returns pre-processed middleware
         * based on the supplied arguments
         * see: https://github.com/express-validator/express-validator/blob/master/check/check.js
         * hence we just need to pass `req` `res` and `next` to
         */
        const expectedContext = ['username'];
        expect(middleware._context.fields).toEqual(expectedContext);
        middleware(req, res, next)

        let expectedError = [{
            location: 'body',
            param: 'username',
            value: undefined,
            msg: 'Invalid value'
        }]

        customEvent.on('errorCall', () => {
            expect(req._validationErrors).toEqual(expectedError);
            expect(next).toHaveBeenCalled();
            done();
        });

        done();
    });

    it("Should have errors on firstname", (done) => {
        // Get the username validation
        const middleware = auth[1];
        
        next.and.callFake((e) => {
            customEvent.emit('errorCall');
        })

        /**
         * express-vaidator `check` function returns pre-processed middleware
         * based on the supplied arguments
         * see: https://github.com/express-validator/express-validator/blob/master/check/check.js
         * hence we just need to pass `req` `res` and `next` to
         */
        const expectedContext = ['password'];
        expect(middleware._context.fields).toEqual(expectedContext);
        middleware(req, res, next)

        let expectedError = [{
            location: 'body',
            param: 'password',
            value: undefined,
            msg: 'Must be 5 characters long'
        }]

        customEvent.on('errorCall', () => {
            expect(req._validationErrors).toEqual(expectedError);
            expect(next).toHaveBeenCalled();
            done();
        });
        done();
    });

});