export interface AppConfig {
  acsConnectionString: string;
  acsEmailFrom: string;
  subscriptionId?: string;
  resourceGroupName?: string;
  emailServiceName?: string;
  domainResourceName?: string;
  suppressionListName?: string;
  suppressionListLevel: 'user' | 'domain';
}

export function getConfig(): AppConfig {
  const acsConnectionString = process.env.ACS_CONNECTION_STRING;
  const acsEmailFrom = process.env.ACS_EMAIL_FROM;
  const suppressionListLevel = (process.env.ACS_SUPPRESSION_LIST_LEVEL || 'domain') as 'user' | 'domain';

  if (!acsConnectionString || !acsEmailFrom) {
    throw new Error('Missing required configuration');
  }

  return {
    acsConnectionString,
    acsEmailFrom,
    subscriptionId: process.env.AZURE_SUBSCRIPTION_ID,
    resourceGroupName: process.env.ACS_RESOURCE_GROUP,
    emailServiceName: process.env.ACS_EMAIL_SERVICE_NAME,
    domainResourceName: process.env.ACS_DOMAIN_RESOURCE_NAME,
    suppressionListName: process.env.ACS_SUPPRESSION_LIST_NAME,
    suppressionListLevel
  };
}
