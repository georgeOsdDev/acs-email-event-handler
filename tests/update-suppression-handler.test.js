"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const updateSuppression_1 = require("../src/handlers/updateSuppression");
describe('handleUpdateSuppression', () => {
    it('applies add action', async () => {
        const service = {
            apply: jest.fn().mockResolvedValue(undefined)
        };
        const result = await (0, updateSuppression_1.handleUpdateSuppression)({ email: 'user@example.com', action: 'add', reason: 'bounced' }, service);
        expect(service.apply).toHaveBeenCalledWith({
            action: 'add',
            email: 'user@example.com',
            reason: 'bounced'
        });
        expect(result.status).toBe('updated');
    });
});
