import { CommunicationServiceManagementClient } from '@azure/arm-communication';
import { DefaultAzureCredential } from '@azure/identity';
import { ArmSuppressionListClient } from './armSuppressionListClient';
import { SuppressionListClient } from './suppressionList';

export interface SuppressionListConfig {
  subscriptionId?: string;
  resourceGroupName?: string;
  emailServiceName?: string;
  domainResourceName?: string;
  suppressionListName?: string;
  suppressionListLevel?: 'user' | 'domain';
  acsEmailFrom?: string;
  logger?: { log(...args: any[]): void };
}

export async function createSuppressionListClient(
  config: SuppressionListConfig
): Promise<SuppressionListClient> {
  const {
    subscriptionId,
    resourceGroupName,
    emailServiceName,
    domainResourceName,
    suppressionListName,
    suppressionListLevel = 'domain',
    acsEmailFrom,
    logger
  } = config;

  if (
    !subscriptionId ||
    !resourceGroupName ||
    !emailServiceName ||
    !domainResourceName ||
    !suppressionListName
  ) {
    throw new Error('Missing suppression list configuration');
  }

  // Determine sender username based on level
  let listName = '';
  if (suppressionListLevel === 'user' && acsEmailFrom) {
    listName = acsEmailFrom.split('@')[0];
  }
  // For 'domain' level, listName remains empty string

  const credential = new DefaultAzureCredential();
  const client = new CommunicationServiceManagementClient(
    credential,
    subscriptionId
  );

  // Ensure suppression list exists, create if not
  try {
    await client.suppressionLists.createOrUpdate(
      resourceGroupName,
      emailServiceName,
      domainResourceName,
      suppressionListName,
      { listName }
    );
  } catch (error) {
    // Log but don't fail on creation error - list might already exist
    console.warn('Suppression list creation/update warning:', error);
  }

  return new ArmSuppressionListClient(
    client.suppressionListAddresses as any,
    {
      resourceGroupName,
      emailServiceName,
      domainResourceName,
      suppressionListName
    },
    logger
  );
}
