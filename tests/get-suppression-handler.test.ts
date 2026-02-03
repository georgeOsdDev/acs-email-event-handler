import { handleGetSuppression } from '../src/handlers/getSuppression';

describe('handleGetSuppression', () => {
  it('returns suppression state', async () => {
    const service = {
      isSuppressed: jest.fn().mockResolvedValue(true)
    };

    const result = await handleGetSuppression('user@example.com', service as any);

    expect(result.isSuppressed).toBe(true);
  });
});
