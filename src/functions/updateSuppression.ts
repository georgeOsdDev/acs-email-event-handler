import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { handleUpdateSuppression } from '../handlers/updateSuppression';
import { createSuppressionListClient } from '../lib/acsManagementFactory';
import { getConfig } from '../lib/config';
import { SuppressionListService } from '../lib/suppressionList';

export async function updateSuppressionHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const body = (await request.json()) as {
    email?: string;
    action?: 'add' | 'remove';
    reason?: string;
  };

  if (!body?.email || !body.action) {
    return { status: 400, jsonBody: { error: 'Invalid request body' } };
  }

  const config = getConfig();

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

  const result = await handleUpdateSuppression(
    { email: body.email, action: body.action, reason: body.reason },
    suppressionService
  );

  context.log('Suppression update result', result);

  return { status: 200, jsonBody: result };
}

app.http('updateSuppression', {
  methods: ['POST'],
  authLevel: 'function',
  route: 'suppression',
  handler: updateSuppressionHandler
});
