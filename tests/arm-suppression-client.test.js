"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const armSuppressionListClient_1 = require("../src/lib/armSuppressionListClient");
describe('ArmSuppressionListClient', () => {
    it('calls createOrUpdate when adding', async () => {
        const ops = {
            createOrUpdate: jest.fn().mockResolvedValue(undefined),
            delete: jest.fn().mockResolvedValue(undefined),
            list: jest.fn().mockResolvedValue([])
        };
        const client = new armSuppressionListClient_1.ArmSuppressionListClient(ops, {
            resourceGroupName: 'rg',
            emailServiceName: 'svc',
            domainResourceName: 'domain',
            suppressionListName: 'list'
        });
        await client.add('user@example.com', 'bounced');
        expect(ops.createOrUpdate).toHaveBeenCalledWith('rg', 'svc', 'domain', 'list', expect.any(String), { email: 'user@example.com' });
    });
});
