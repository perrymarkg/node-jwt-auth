const controller = require('./users.controller');
const idb = require('../config/in-memory-db');
const User = require('../models/user.model');
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

    it("Should save a user", async() => {

        req.body.username = "Perry";
        req.body.email = "perry@mail.com";
        req.body.password = "somestrongpassword";

        controller.saveUser(req, res, next);
        
        res.on('end', d => {
            expect(res.statusCode).toEqual(200);
            expect(res._getData() instanceof User).toBe(true);
        })
    });


});