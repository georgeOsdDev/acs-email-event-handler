import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { EmailClient } from '@azure/communication-email';
import { handleSendTestEmail } from '../handlers/sendTestEmail';
import { getConfig } from '../lib/config';

export async function sendTestEmailHandler(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const body = (await request.json()) as {
    to?: string;
    subject?: string;
    plainText?: string;
  };

  if (!body?.to || !body.subject || !body.plainText) {
    return { status: 400, jsonBody: { error: 'Invalid request body' } };
  }

  const config = getConfig();
  const emailClient = new EmailClient(config.acsConnectionString);

  const result = await handleSendTestEmail(
    { to: body.to, subject: body.subject, plainText: body.plainText },
    emailClient as any,
    config.acsEmailFrom
  );

  context.log('Send test email result', result);

  return { status: 202, jsonBody: result };
}

app.http('sendTestEmail', {
  methods: ['POST'],
  authLevel: 'function',
  route: 'send-test',
  handler: sendTestEmailHandler
});
