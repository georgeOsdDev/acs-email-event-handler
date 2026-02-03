import { randomUUID } from 'crypto';

export interface SuppressionListAddressOperations {
  createOrUpdate(
    resourceGroupName: string,
    emailServiceName: string,
    domainResourceName: string,
    suppressionListName: string,
    suppressionListAddressId: string,
    parameters: { email: string; notes?: string }
  ): Promise<void>;
  delete(
    resourceGroupName: string,
    emailServiceName: string,
    domainResourceName: string,
    suppressionListName: string,
    suppressionListAddressId: string
  ): Promise<void>;
  list(
    resourceGroupName: string,
    emailServiceName: string,
    domainResourceName: string,
    suppressionListName: string
  ): AsyncIterable<{ id?: string; name?: string; email?: string }> | Promise<Array<{ id?: string; name?: string; email?: string }>>;
}

export interface SuppressionListIdentifiers {
  resourceGroupName: string;
  emailServiceName: string;
  domainResourceName: string;
  suppressionListName: string;
}

export interface Logger {
  log(...args: any[]): void;
}

export class ArmSuppressionListClient {
  constructor(
    private readonly ops: SuppressionListAddressOperations,
    private readonly ids: SuppressionListIdentifiers,
    private readonly logger?: Logger
  ) {}

  async add(email: string, reason: string): Promise<void> {
    const addressId = randomUUID();
    await this.ops.createOrUpdate(
      this.ids.resourceGroupName,
      this.ids.emailServiceName,
      this.ids.domainResourceName,
      this.ids.suppressionListName,
      addressId,
      { email, notes: reason }
    );
  }

  async remove(email: string): Promise<void> {
    const list = await this.listAddresses();
    const match = list.find((item) => item.email === email);

    if (!match) {
      return;
    }

    const addressId = match.name || match.id || '';
    if (!addressId) {
      return;
    }

    await this.ops.delete(
      this.ids.resourceGroupName,
      this.ids.emailServiceName,
      this.ids.domainResourceName,
      this.ids.suppressionListName,
      addressId
    );
  }

  async isSuppressed(email: string): Promise<boolean> {
    // this.logger?.log(`[isSuppressed] Checking suppression status for: ${email}`);
    // this.logger?.log(`[isSuppressed] Using suppression list: ${this.ids.suppressionListName} in domain: ${this.ids.domainResourceName}`);

    const list = await this.listAddresses();
    // this.logger?.log(`[isSuppressed] Retrieved ${list.length} addresses from suppression list`);
    // this.logger?.log(`[isSuppressed] Raw list data:`, JSON.stringify(list, null, 2));
    // this.logger?.log(`[isSuppressed] Suppressed emails:`, list.map(item => item.email).filter(Boolean));

    const isSuppressed = list.some((item) => item.email === email);
    // this.logger?.log(`[isSuppressed] Result for ${email}: ${isSuppressed}`);

    return isSuppressed;
  }

  private async listAddresses(): Promise<Array<{ id?: string; name?: string; email?: string }>> {
    const result = await this.ops.list(
      this.ids.resourceGroupName,
      this.ids.emailServiceName,
      this.ids.domainResourceName,
      this.ids.suppressionListName
    );

    if (Symbol.asyncIterator in Object(result)) {
      const items: Array<{ id?: string; name?: string; email?: string }> = [];
      for await (const item of result as AsyncIterable<{ id?: string; name?: string; email?: string }>) {
        items.push(item);
      }
      return items;
    }

    return result as Array<{ id?: string; name?: string; email?: string }>;
  }
}
