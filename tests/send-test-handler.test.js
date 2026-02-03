"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendTestEmail_1 = require("../src/handlers/sendTestEmail");
describe('handleSendTestEmail', () => {
    it('sends email and returns messageId', async () => {
        const emailClient = {
            send: jest.fn().mockResolvedValue({ messageId: 'msg-1', status: 'Queued' })
        };
        const response = await (0, sendTestEmail_1.handleSendTestEmail)({ to: 'user@example.com', subject: 'Hi', plainText: 'Hello' }, emailClient, 'sender@example.com');
        expect(emailClient.send).toHaveBeenCalled();
        expect(response.messageId).toBe('msg-1');
    });
});
