const UserService = require('../services/user.service');
const UserModel = require('../models/user.model');
const idb = require('../config/in-memory-db');

describe("User Service Tests", () => {

    let User;

    beforeAll(async (done) => {
        await idb.init();
        done();
    });

    afterAll(() => {
        idb.disconnect();
    });

    beforeEach(async() => {
        User = await UserService
            .saveUser('perry@mail.com', 'dummy', 'samplepassword')
            .then(result => result)
            .catch(error => error);
        
    });

    afterEach(async() => {
        await idb.dropAll();
    })

    it("Should create a user", async() => {
        expect(User instanceof UserModel).toBe(true)
    });

    it("Should handleMongoError", async() => {

        let e = {
            name: "MongoError",
            code: 11000
        }

        let result = UserService.handleMongoError(e);

        expect(result.output.payload.message).toBe('Username/Email already exists!');
    });

    it("Should return a user model", async() => {
        
        const result = await UserService
        .findUserBy('dummy')
        .then(result => result)
        .catch(error => error);
        
        expect(result instanceof UserModel).toBe(true)
        expect(result.username).toBe('dummy');
        expect(result.password).not.toEqual('samplepassword')
    });

    it("Should validate a password", async() => {
        
        const result = await UserService
            .validatePassword(User, 'samplepassword')
            .then(result => result)
            .catch(error => error)
        
        expect(result instanceof UserModel).toBe(true)
        expect(result.username).toBe('dummy');
    });

    it("Should not validate an invalid password", async() => {

        let result = await UserService
            .validatePassword(User, 'samplepasswords')
            .catch(error => error)
            
        expect(result instanceof UserModel).toBe(false)
        expect(result.output.statusCode).toBe(401);
        expect(result.output.payload.message).toEqual('Invalid Password');

        result = await UserService
            .validatePassword(false, false)
            .catch(error => error)

        expect(result.output.payload.message).toEqual('User not found');

        result = await UserService
            .validatePassword(User, false)
            .catch(error => error)
        
        expect(result.output.payload.message).toEqual('Invalid password');

    });

    it("Should validate by username and password", async() => {
        
        let result = await UserService
            .validateUser('dummy', 'samplepassword')
            .then(result => result)
            .catch(error => error);

        expect(result instanceof UserModel).toBe(true)
    
    });
});