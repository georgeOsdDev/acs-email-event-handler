import { parseEmailDeliveryEvent } from '../src/lib/eventParser';

describe('parseEmailDeliveryEvent', () => {
  it('parses recipient and status', () => {
    const event = {
      eventType: 'Microsoft.Communication.EmailDeliveryReportReceived',
      data: {
        recipient: 'user@example.com',
        status: 'Bounced',
        messageId: 'msg-123',
        operationId: 'op-456'
      }
    };

    const result = parseEmailDeliveryEvent(event);
    expect(result.recipient).toBe('user@example.com');
    expect(result.status).toBe('Bounced');
    expect(result.messageId).toBe('msg-123');
    expect(result.operationId).toBe('op-456');
  });
});
