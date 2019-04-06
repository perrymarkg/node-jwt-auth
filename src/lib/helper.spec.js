const helper = require('./helper');

describe("Helper Tests", () => {

    it("Should throw an error", async() => {
        let newPassword = await helper.encryptPassword()
            .then(encrypted => encrypted)
            .catch(error => error);
        expect(newPassword instanceof Error).toBe(true);
    });

    it("Should return salt", async() => {
        let password = 'longestpassword';
        let newPassword = await helper.encryptPassword(password)
            .then(salt => salt)
            .catch(error => error);
        
        expect(newPassword instanceof Error).toBe(false);
        expect(newPassword).not.toEqual(password);
    });

});