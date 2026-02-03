import { ArmSuppressionListClient } from '../src/lib/armSuppressionListClient';

describe('ArmSuppressionListClient', () => {
  it('calls createOrUpdate when adding with reason as notes', async () => {
    const ops = {
      createOrUpdate: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
      list: jest.fn().mockResolvedValue([] as any)
    };

    const client = new ArmSuppressionListClient(ops as any, {
      resourceGroupName: 'rg',
      emailServiceName: 'svc',
      domainResourceName: 'domain',
      suppressionListName: 'list'
    });

    await client.add('user@example.com', 'bounced');

    expect(ops.createOrUpdate).toHaveBeenCalledWith(
      'rg',
      'svc',
      'domain',
      'list',
      expect.any(String),
      { email: 'user@example.com', notes: 'bounced' }
    );
  });
});
