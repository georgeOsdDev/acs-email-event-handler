export interface SendTestRequest {
  to: string;
  subject: string;
  plainText: string;
}

export interface SendTestResponse {
  messageId: string;
  status: string;
}

export interface EmailSenderClient {
  beginSend(message: {
    senderAddress: string;
    content: { subject: string; plainText: string };
    recipients: { to: Array<{ address: string }> };
  }): Promise<{ pollUntilDone(): Promise<{ id: string; status: string }> }>;
}

export async function handleSendTestEmail(
  request: SendTestRequest,
  emailClient: EmailSenderClient,
  senderAddress: string
): Promise<SendTestResponse> {
  const poller = await emailClient.beginSend({
    senderAddress,
    content: {
      subject: request.subject,
      plainText: request.plainText
    },
    recipients: {
      to: [{ address: request.to }]
    }
  });

  const result = await poller.pollUntilDone();

  return {
    messageId: result.id,
    status: result.status
  };
}
