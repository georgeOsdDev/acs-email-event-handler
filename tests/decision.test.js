"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const decision_1 = require("../src/lib/decision");
describe('decideSuppressionAction', () => {
    it('adds for Bounced', () => {
        const result = (0, decision_1.decideSuppressionAction)({ status: 'Bounced', recipient: 'a@example.com' });
        expect(result.action).toBe('add');
    });
    it('does nothing for Delivered', () => {
        const result = (0, decision_1.decideSuppressionAction)({ status: 'Delivered', recipient: 'a@example.com' });
        expect(result.action).toBe('none');
    });
});
