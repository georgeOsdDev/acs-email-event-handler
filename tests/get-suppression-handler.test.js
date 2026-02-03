"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getSuppression_1 = require("../src/handlers/getSuppression");
describe('handleGetSuppression', () => {
    it('returns suppression state', async () => {
        const service = {
            isSuppressed: jest.fn().mockResolvedValue(true)
        };
        const result = await (0, getSuppression_1.handleGetSuppression)('user@example.com', service);
        expect(result.isSuppressed).toBe(true);
    });
});
