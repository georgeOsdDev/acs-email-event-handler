export interface EmailDeliveryEventInput {
  eventType: string;
  data: {
    recipient?: string;
    status?: string;
    messageId?: string;
    operationId?: string;
    deliveryAttemptId?: string;
    [key: string]: unknown;
  };
}

export interface EmailDeliveryParsed {
  recipient: string;
  status: string;
  messageId?: string;
  operationId?: string;
  deliveryAttemptId?: string;
}

export function parseEmailDeliveryEvent(
  event: EmailDeliveryEventInput
): EmailDeliveryParsed {
  if (event.eventType !== 'Microsoft.Communication.EmailDeliveryReportReceived') {
    throw new Error('Unsupported event type');
  }

  const recipient = event.data.recipient;
  const status = event.data.status;

  if (!recipient || !status) {
    throw new Error('Missing required event data');
  }

  return {
    recipient,
    status,
    messageId: event.data.messageId,
    operationId: event.data.operationId,
    deliveryAttemptId: event.data.deliveryAttemptId
  };
}
