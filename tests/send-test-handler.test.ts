import { handleSendTestEmail } from '../src/handlers/sendTestEmail';

describe('handleSendTestEmail', () => {
  it('sends email and returns messageId', async () => {
    const poller = {
      pollUntilDone: jest.fn().mockResolvedValue({ id: 'msg-1', status: 'Queued' })
    };
    const emailClient = {
      beginSend: jest.fn().mockResolvedValue(poller)
    };

    const response = await handleSendTestEmail(
      { to: 'user@example.com', subject: 'Hi', plainText: 'Hello' },
      emailClient as any,
      'sender@example.com'
    );

    expect(emailClient.beginSend).toHaveBeenCalled();
    expect(response.messageId).toBe('msg-1');
  });
});
