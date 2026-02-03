import { app, InvocationContext } from '@azure/functions';
import { processEmailEvents } from '../handlers/emailEventHandler';
import { createSuppressionListClient } from '../lib/acsManagementFactory';
import { getConfig } from '../lib/config';
import { SuppressionListService } from '../lib/suppressionList';

export async function emailEventsHandler(
  event: any,
  context: InvocationContext
): Promise<unknown> {
  context.log('Received event payload:', JSON.stringify(event, null, 2));

  const events = Array.isArray(event) ? event : [event];

  const validationEvent = events.find(
    (item) => item.eventType === 'Microsoft.EventGrid.SubscriptionValidationEvent'
  );

  if (validationEvent) {
    context.log('Handling validation event');
    const validationCode = validationEvent.data?.validationCode;
    return { validationResponse: validationCode };
  }

  context.log(`Processing ${events.length} event(s)`);

  try {
    const config = getConfig();

    context.log('Configuration:', {
      subscriptionId: config.subscriptionId,
      resourceGroupName: config.resourceGroupName,
      emailServiceName: config.emailServiceName,
      domainResourceName: config.domainResourceName,
      suppressionListName: config.suppressionListName,
      suppressionListLevel: config.suppressionListLevel
    });

    const suppressionClient = await createSuppressionListClient({
      subscriptionId: config.subscriptionId,
      resourceGroupName: config.resourceGroupName,
      emailServiceName: config.emailServiceName,
      domainResourceName: config.domainResourceName,
      suppressionListName: config.suppressionListName,
      suppressionListLevel: config.suppressionListLevel,
      acsEmailFrom: config.acsEmailFrom,
      logger: context
    });

    const suppressionService = new SuppressionListService(suppressionClient);
    const result = await processEmailEvents(events, suppressionService);

    context.log('Processed email events', result);
    return { status: 'ok', ...result };
  } catch (error) {
    context.error('Error processing email events:', error);
    throw error;
  }
}

app.eventGrid('emailEvents', {
  handler: emailEventsHandler
});
