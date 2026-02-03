import { decideSuppressionAction } from '../src/lib/decision';

describe('decideSuppressionAction', () => {
  it('adds for Bounced', () => {
    const result = decideSuppressionAction({ status: 'Bounced', recipient: 'a@example.com' });
    expect(result.action).toBe('add');
  });

  it('does nothing for Delivered', () => {
    const result = decideSuppressionAction({ status: 'Delivered', recipient: 'a@example.com' });
    expect(result.action).toBe('none');
  });
});
