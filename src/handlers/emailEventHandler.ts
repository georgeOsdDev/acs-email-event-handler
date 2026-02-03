import { decideSuppressionAction } from '../lib/decision';
import { parseEmailDeliveryEvent } from '../lib/eventParser';
import { SuppressionListService } from '../lib/suppressionList';

export interface EmailEventHandlerResult {
  processed: number;
}

export async function processEmailEvents(
  events: Array<{ eventType: string; data: Record<string, unknown> }>,
  suppression: Pick<SuppressionListService, 'apply'>
): Promise<EmailEventHandlerResult> {
  let processed = 0;

  for (const event of events) {
    const parsed = parseEmailDeliveryEvent(event as any);
    const decision = decideSuppressionAction({
      status: parsed.status,
      recipient: parsed.recipient
    });

    await suppression.apply({
      action: decision.action,
      email: parsed.recipient,
      reason: decision.reason
    });

    processed += 1;
  }

  return { processed };
}
