const controller = require('./users.controller');
const idb = require('../config/in-memory-db');
const httpMocks = require('node-mocks-http');
const eventEmitter = require('events').EventEmitter;
const UserService = require('../services/user.service');

let req, res;

let next = function(){}

describe("Auth Route Test", () => {

    beforeAll(async (done) => {
        await idb.init();
        done();
    });

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse({
            eventEmitter: eventEmitter
        });
        
    })

    afterEach(async() => {
        await idb.dropAll();
    })


    it("Should send 200", () => {
        controller.index(req, res);
        
        expect(res.statusCode).toBe(200);
        expect(res._getData()).toBe('Welcome');
    });

    it("Should handle validation error", async() => {
        let next = jasmine.createSpy('spy');
        
        spyOn(controller, '_getValidationResult')
            .and
            .callFake(() => {
                return {
                    isEmpty: () => false,
                    array: () => ['error 1', 'error 2']
                }
            });

        req.body.username = "Perry";
        req.body.email = "perry@mail.com";
        req.body.password = "";
        
        controller.validationHandler(req, res, next);

        expect(controller._getValidationResult).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
        expect(next.calls.argsFor(0)[0].isBoom).toBe(true);

        controller._getValidationResult.and.returnValue({
            isEmpty: () => true
        })
    
        controller.validationHandler(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(next.calls.argsFor(1).length).toBe(0);
       
    });

    it("Should save user successfully", done => {
        
        let next = jasmine.createSpy('spy');
        // Spy on the `UserService.saveUser` method called inside controller
        // `UserService` class should be required inside on the spec file
        // in order for jasmine to spy on the method
        spyOn(UserService, 'saveUser').and.callFake(() => {
            return Promise.resolve('Resolved');
        });

        req.body.email = "perry@mail.com";
        req.body.password = "";

        controller.saveUser(req, res, next);

        // Wait for the `end` event of res object to fire
        // we are dealing with async call
        res.on('end', () => {
            expect(UserService.saveUser).toHaveBeenCalled();
            expect(res._getData()).toBe('Resolved');
            expect(res.statusCode).toBe(200);
            expect(next).not.toHaveBeenCalled();
            // Call done function
            // in case `end` event did not fire
            // error will be thrown
            done(); 
        });
    });

    it("Should handle saveUser rejection", (done) => {
        let emitter = new eventEmitter();
        let next = jasmine.createSpy('spy');

        // Fire a custom event when our spy is called
        // since we are dealing with async code
        next.and.callFake(function() {
            emitter.emit('ended');
        })
        
        spyOn(UserService, 'saveUser').and.callFake(() => {
            return Promise.reject('Error');
        });

        controller.saveUser(req, res, next);

        // Only run test when custom event is fired.
        emitter.on('ended', () => {
            expect(UserService.saveUser).toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
            // Call done function
            // in case `ended` event did not fire
            // error will be thrown
            done();
        });

        
    });
});