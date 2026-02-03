import { handleUpdateSuppression } from '../src/handlers/updateSuppression';

describe('handleUpdateSuppression', () => {
  it('applies add action', async () => {
    const service = {
      apply: jest.fn().mockResolvedValue(undefined)
    };

    const result = await handleUpdateSuppression(
      { email: 'user@example.com', action: 'add', reason: 'bounced' },
      service as any
    );

    expect(service.apply).toHaveBeenCalledWith({
      action: 'add',
      email: 'user@example.com',
      reason: 'bounced'
    });
    expect(result.status).toBe('updated');
  });
});
