"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emailEventHandler_1 = require("../src/handlers/emailEventHandler");
const makeEvent = (status) => ({
    eventType: 'Microsoft.Communication.EmailDeliveryReportReceived',
    data: {
        recipient: 'user@example.com',
        status,
        messageId: 'msg-123',
        operationId: 'op-456'
    }
});
describe('processEmailEvents', () => {
    it('adds to suppression list on Bounced', async () => {
        const suppression = {
            apply: jest.fn().mockResolvedValue(undefined)
        };
        const result = await (0, emailEventHandler_1.processEmailEvents)([makeEvent('Bounced')], suppression);
        expect(suppression.apply).toHaveBeenCalledWith({
            action: 'add',
            email: 'user@example.com',
            reason: 'bounced'
        });
        expect(result.processed).toBe(1);
    });
});
