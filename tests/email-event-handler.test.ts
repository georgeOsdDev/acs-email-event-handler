import { processEmailEvents } from '../src/handlers/emailEventHandler';

const makeEvent = (status: string) => ({
  eventType: 'Microsoft.Communication.EmailDeliveryReportReceived',
  data: {
    recipient: 'user@example.com',
    status,
    messageId: 'msg-123',
    operationId: 'op-456'
  }
});

describe('processEmailEvents', () => {
  it('adds to suppression list on Bounced', async () => {
    const suppression = {
      apply: jest.fn().mockResolvedValue(undefined)
    };

    const result = await processEmailEvents([makeEvent('Bounced')], suppression as any);

    expect(suppression.apply).toHaveBeenCalledWith({
      action: 'add',
      email: 'user@example.com',
      reason: 'bounced'
    });
    expect(result.processed).toBe(1);
  });
});
