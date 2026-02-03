"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../src/lib/config");
describe('getConfig', () => {
    const original = process.env;
    beforeEach(() => {
        process.env = { ...original };
    });
    afterEach(() => {
        process.env = original;
    });
    it('throws when required settings are missing', () => {
        delete process.env.ACS_CONNECTION_STRING;
        delete process.env.ACS_EMAIL_FROM;
        expect(() => (0, config_1.getConfig)()).toThrow('Missing required configuration');
    });
});
