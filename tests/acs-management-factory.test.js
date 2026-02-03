"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const acsManagementFactory_1 = require("../src/lib/acsManagementFactory");
describe('createSuppressionListClient', () => {
    it('throws when required identifiers are missing', () => {
        expect(() => (0, acsManagementFactory_1.createSuppressionListClient)({
            resourceGroupName: '',
            emailServiceName: '',
            domainResourceName: '',
            suppressionListName: ''
        })).toThrow('Missing suppression list configuration');
    });
});
