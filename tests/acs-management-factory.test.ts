import { createSuppressionListClient } from '../src/lib/acsManagementFactory';

describe('createSuppressionListClient', () => {
  it('throws when required identifiers are missing', async () => {
    await expect(
      createSuppressionListClient({
        resourceGroupName: '',
        emailServiceName: '',
        domainResourceName: '',
        suppressionListName: ''
      })
    ).rejects.toThrow('Missing suppression list configuration');
  });
});
