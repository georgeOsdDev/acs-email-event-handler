import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { handleGetSuppression } from '../handlers/getSuppression';
import { createSuppressionListClient } from '../lib/acsManagementFactory';
import { getConfig } from '../lib/config';
import { SuppressionListService } from '../lib/suppressionList';

export async function getSuppressionHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const email = request.query.get('email');
  if (!email) {
    return { status: 400, jsonBody: { error: 'Missing email query parameter' } };
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

  const result = await handleGetSuppression(email, suppressionService);
  context.log('Suppression query result', result);

  return { status: 200, jsonBody: result };
}

app.http('getSuppression', {
  methods: ['GET'],
  authLevel: 'function',
  route: 'suppression',
  handler: getSuppressionHandler
});
