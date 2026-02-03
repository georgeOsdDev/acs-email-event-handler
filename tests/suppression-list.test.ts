import { SuppressionListService } from '../src/lib/suppressionList';

describe('SuppressionListService', () => {
  it('adds to suppression list', async () => {
    const client = {
      add: jest.fn().mockResolvedValue(undefined),
      remove: jest.fn().mockResolvedValue(undefined),
      isSuppressed: jest.fn().mockResolvedValue(false)
    };

    const service = new SuppressionListService(client);
    await service.apply({ action: 'add', email: 'user@example.com', reason: 'bounced' });

    expect(client.add).toHaveBeenCalledWith('user@example.com', 'bounced');
  });
});
